import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProgramForm } from "./ProgramForm";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Program } from "@/types/program";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Image } from "lucide-react";
import { ProgramImageManager } from "./program-form/ProgramImageManager";
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

export function ProgramManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<Program | null>(null);
  const [programToEditImage, setProgramToEditImage] = useState<Program | null>(null);
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

  const handleSuccess = () => {
    setIsDialogOpen(false);
  };

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
    } catch (error: any) {
      console.error('Error deleting program:', error);
      toast({
        variant: "destructive",
        title: "Hiba!",
        description: "A program törlése sikertelen.",
      });
    } finally {
      setProgramToDelete(null);
    }
  };

  if (isLoading) {
    return <div>Betöltés...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Programok kezelése</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              Új program
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Új program létrehozása
              </DialogTitle>
            </DialogHeader>
            <ProgramForm
              onSuccess={handleSuccess}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {programs?.map((program) => {
          const huTitle = program.program_translations.find(t => t.language === "hu")?.title || 
                         program.program_translations[0]?.title || 
                         "Program nem található";
          
          return (
            <div 
              key={program.id}
              className="bg-card rounded-lg p-4 shadow-sm border space-y-4"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-medium truncate flex-1">{huTitle}</h3>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary hover:text-primary/90"
                    onClick={() => setProgramToEditImage(program)}
                  >
                    <Image className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive/90"
                    onClick={() => setProgramToDelete(program)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {program.duration} • {program.price.toLocaleString()} Ft
              </div>
            </div>
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

      <Dialog open={!!programToEditImage} onOpenChange={(open) => !open && setProgramToEditImage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Kép módosítása</DialogTitle>
          </DialogHeader>
          {programToEditImage && (
            <ProgramImageManager program={programToEditImage} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}