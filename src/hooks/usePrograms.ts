import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Program } from "@/types/program";

export const usePrograms = () => {
  return useQuery({
    queryKey: ['programs'],
    queryFn: async (): Promise<Program[]> => {
      console.info('Starting to fetch programs...');
      
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
      
      if (!data) {
        console.info('No programs found in the database');
        return [];
      }
      
      console.info('Programs fetched successfully:', data);
      console.info('Number of programs:', data.length);
      if (data.length > 0) {
        console.info('First program:', data[0]);
      }
      
      return data;
    },
    gcTime: 1000 * 60 * 5, // Cache for 5 minutes
    staleTime: 1000 * 60 * 1, // Consider data stale after 1 minute
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    retry: 2,
    meta: {
      errorMessage: "Failed to fetch programs"
    }
  });
};