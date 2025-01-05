import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export const usePrograms = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log('Setting up real-time subscription for programs');
    
    const channel = supabase
      .channel('program-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'programs'
        },
        (payload) => {
          console.log('Programs table changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['programs'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'program_translations'
        },
        (payload) => {
          console.log('Program translations changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['programs'] });
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['programs'],
    queryFn: async () => {
      console.log('Starting to fetch programs...');
      
      try {
        const { data, error } = await supabase
          .from('programs')
          .select(`
            *,
            program_translations (
              language,
              title,
              description
            )
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching programs:', error);
          throw error;
        }

        if (!data || data.length === 0) {
          console.log('No programs found in database');
          return [];
        }

        console.log('Successfully fetched programs:', data);
        return data;
      } catch (error) {
        console.error('Failed to fetch programs:', error);
        throw error;
      }
    },
    retry: 2,
    staleTime: 1000 * 60, // 1 minute
  });
};