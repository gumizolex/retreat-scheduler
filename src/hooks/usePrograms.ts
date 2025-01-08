import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Program } from "@/types/program";
import { toast } from "@/components/ui/use-toast";

export const usePrograms = () => {
  return useQuery({
    queryKey: ['programs'],
    queryFn: async () => {
      console.log('Fetching programs...');
      try {
        const { data: programs, error } = await supabase
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
          toast({
            title: "Error loading programs",
            description: error.message,
            variant: "destructive",
          });
          throw error;
        }

        console.log('Fetched programs:', programs);
        return programs as Program[];
      } catch (error: any) {
        console.error('Error in queryFn:', error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};