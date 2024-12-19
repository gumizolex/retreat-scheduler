import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ProgramForm } from "./ProgramForm";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BookingsDialog } from "./BookingsDialog";
import { useToast } from "@/components/ui/use-toast";
import { Trash2 } from "lucide-react";

export function ProgramManagement() {
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isBookingsDialogOpen, setIsBookingsDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

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

  const handleEditClick = (program: any) => {
    console.log('Selected program for editing:', program);
    setSelectedProgram(program);
    setIsDialogOpen(true);
  };

  const handleDelete = async (programId: number) => {
    try {
      console.log('Deleting program:', programId);
      
      // First delete related translations
      const { error: translationsError } = await supabase
        .from('program_translations')
        .delete()
        .eq('program_id', programId);

      if (translationsError) {
        console.error('Error deleting translations:', translationsError);
        throw translationsError;
      }

      // Then delete the program
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

      queryClient.invalidateQueries({ queryKey: ['programs'] });
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
                <Button
                  variant="outline"
                  onClick={() => handleEditClick(program)}
                >
                  Szerkesztés
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Biztosan törölni szeretnéd ezt a programot?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Ez a művelet nem vonható vissza. A program és minden kapcsolódó adat véglegesen törlődik.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Mégsem</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(program.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Törlés
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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