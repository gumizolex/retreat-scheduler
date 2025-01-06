import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePrograms = () => {
  return useQuery({
    queryKey: ['programs'],
    queryFn: async () => {
      console.info('Fetching programs...');
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
      
      console.info('Programs fetched:', data);
      return data;
    },
    gcTime: 1000 * 60 * 5, // Cache for 5 minutes
    staleTime: 1000 * 60 * 1, // Consider data stale after 1 minute
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};