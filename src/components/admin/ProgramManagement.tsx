import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProgramForm } from "./ProgramForm";
import { usePrograms } from "@/hooks/usePrograms";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProgramListItem } from "./program-management/ProgramListItem";

export function ProgramManagement() {
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: programs, isLoading } = usePrograms();
  const { toast } = useToast();

  const handleSuccess = () => {
    setIsDialogOpen(false);
    setSelectedProgram(null);
  };

  const handleEditClick = (program: any) => {
    console.log('Selected program for editing:', program);
    setSelectedProgram(program);
    setIsDialogOpen(true);
  };

  const handleDelete = async (programId: number) => {
    try {
      console.log('Deleting program:', programId);
      
      const { error: translationsError } = await supabase
        .from('program_translations')
        .delete()
        .eq('program_id', programId);

      if (translationsError) {
        console.error('Error deleting translations:', translationsError);
        throw translationsError;
      }

      const { error: programError } = await supabase
        .from('programs')
        .delete()
        .eq('id', programId);

      if (programError) {
        console.error('Error deleting program:', programError);
        throw programError;
      }

      toast({
        title: "Siker!",
        description: "A program sikeresen törölve.",
      });
    } catch (error: any) {
      console.error('Error in delete operation:', error);
      toast({
        variant: "destructive",
        title: "Hiba!",
        description: error.message || "Nem sikerült törölni a programot",
      });
    }
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
          <ProgramListItem
            key={program.id}
            program={program}
            onEdit={handleEditClick}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}