import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Program } from "@/types/program";
import { Button } from "@/components/ui/button";
import { ProgramForm } from "./ProgramForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProgramManagementProps {
  onSuccess?: () => void;
}

export function ProgramManagement({ onSuccess }: ProgramManagementProps) {
  const [isNewProgramDialogOpen, setIsNewProgramDialogOpen] = useState(false);
  const [programToEdit, setProgramToEdit] = useState<Program | null>(null);
  const [programToDelete, setProgramToDelete] = useState<Program | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: programs, isLoading } = useQuery({
    queryKey: ['programs'],
    queryFn: async () => {
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

      if (error) throw error;
      return data as Program[];
    },
  });

  const handleDeleteProgram = async () => {
    if (!programToDelete) return;

    try {
      const { error } = await supabase
        .from('programs')
        .delete()
        .eq('id', programToDelete.id);

      if (error) throw error;

      toast({
        title: "Siker!",
        description: "A program sikeresen törölve.",
      });

      queryClient.invalidateQueries({ queryKey: ['programs'] });
      setProgramToDelete(null);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error('Error deleting program:', error);
      toast({
        variant: "destructive",
        title: "Hiba!",
        description: "A program törlése sikertelen.",
      });
    }
  };

  if (isLoading) {
    return <div>Betöltés...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isNewProgramDialogOpen} onOpenChange={setIsNewProgramDialogOpen}>
          <DialogTrigger asChild>
            <Button>Új program</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Új program létrehozása</DialogTitle>
            </DialogHeader>
            <ProgramForm onSuccess={() => {
              setIsNewProgramDialogOpen(false);
              if (onSuccess) onSuccess();
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {programs?.map((program) => {
          const huTitle = program.program_translations.find(t => t.language === "hu")?.title || 
                         program.program_translations[0]?.title || 
                         "Program nem található";
          
          return (
            <Card key={program.id} className="flex flex-col">
              <CardHeader className="flex-grow-0">
                <div className="aspect-video relative rounded-md overflow-hidden bg-muted">
                  <img
                    src={program.image}
                    alt={huTitle}
                    className="object-cover w-full h-full"
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between gap-4">
                <div>
                  <h3 className="font-medium text-lg mb-2">{huTitle}</h3>
                  <div className="text-sm text-muted-foreground">
                    <p>{program.duration}</p>
                    <p>{program.location}</p>
                    <p className="font-medium text-primary">{program.price} RON</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap sm:flex-nowrap mt-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="flex-1 gap-2"
                        onClick={() => setProgramToEdit(program)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="hidden sm:inline">Szerkesztés</span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Program szerkesztése</DialogTitle>
                      </DialogHeader>
                      <ProgramForm 
                        initialData={program}
                        onSuccess={() => {
                          setProgramToEdit(null);
                          if (onSuccess) onSuccess();
                        }}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="destructive"
                    className="flex-1 gap-2"
                    onClick={() => setProgramToDelete(program)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Törlés</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AlertDialog open={!!programToDelete} onOpenChange={(open) => !open && setProgramToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Biztosan törölni szeretné ezt a programot?</AlertDialogTitle>
            <AlertDialogDescription>
              Ez a művelet nem vonható vissza. A program és minden kapcsolódó adat véglegesen törlődik.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Mégsem</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProgram}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Törlés
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}