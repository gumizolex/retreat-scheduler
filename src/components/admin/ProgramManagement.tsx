import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProgramForm } from "./ProgramForm";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BookingsDialog } from "./BookingsDialog";

export function ProgramManagement() {
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBookingsDialogOpen, setIsBookingsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: programs, isLoading } = useQuery({
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

  const handleSuccess = () => {
    setIsDialogOpen(false);
    setSelectedProgram(null);
    queryClient.invalidateQueries({ queryKey: ['programs'] });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Programok kezelése</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedProgram(null)}>
              Új program
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedProgram ? "Program szerkesztése" : "Új program létrehozása"}
              </DialogTitle>
            </DialogHeader>
            <ProgramForm
              initialData={selectedProgram}
              onSuccess={handleSuccess}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {programs?.map((program: any) => (
          <div
            key={program.id}
            className="p-4 border rounded-lg bg-white shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">
                  {program.program_translations.find((t: any) => t.language === "hu")?.title}
                </h3>
                <p className="text-sm text-gray-600">
                  Ár: {program.price} RON | Időtartam: {program.duration} | Helyszín: {program.location}
                </p>
              </div>
              <div className="space-x-2">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedProgram(program)}
                    >
                      Szerkesztés
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Program szerkesztése</DialogTitle>
                    </DialogHeader>
                    <ProgramForm
                      initialData={program}
                      onSuccess={handleSuccess}
                    />
                  </DialogContent>
                </Dialog>
                <Dialog open={isBookingsDialogOpen} onOpenChange={setIsBookingsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="secondary">Foglalások</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Foglalások</DialogTitle>
                    </DialogHeader>
                    <BookingsDialog programId={program.id} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}