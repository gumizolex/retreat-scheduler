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
      .subscribe();

    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['programs'],
    queryFn: async () => {
      console.log('Starting to fetch programs...');
      
      const { data: programsData, error: programsError } = await supabase
        .from('programs')
        .select(`
          id,
          price,
          duration,
          location,
          image,
          created_at,
          program_translations (
            id,
            language,
            title,
            description
          )
        `)
        .order('created_at', { ascending: false });

      if (programsError) {
        console.error('Error fetching programs:', programsError);
        throw programsError;
      }

      console.log('Programs data received:', programsData);
      return programsData || [];
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};