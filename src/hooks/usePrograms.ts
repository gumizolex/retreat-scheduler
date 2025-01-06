import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Program } from "@/types/program";

export const usePrograms = () => {
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

      console.log('Programs fetched:', data);
      return data as Program[];
    }
  });
};