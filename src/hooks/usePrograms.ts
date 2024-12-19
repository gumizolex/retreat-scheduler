import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export const usePrograms = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('program-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'programs'
        },
        () => {
          console.log('Programs table changed, invalidating query...');
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
        () => {
          console.log('Program translations changed, invalidating query...');
          queryClient.invalidateQueries({ queryKey: ['programs'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['programs'],
    queryFn: async () => {
      console.log('Fetching programs...');
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
      
      console.log('Fetched programs:', data);
      return data || [];
    },
  });
};