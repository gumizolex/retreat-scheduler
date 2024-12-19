import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProgramForm } from "./ProgramForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Program, Language } from "@/types/program";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, Plus } from "lucide-react";

export function ProgramManagement() {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: programs, refetch } = useQuery({
    queryKey: ['admin-programs'],
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
        `);
      
      if (error) throw error;
      
      // Cast the response to ensure language is of type Language
      return data?.map(program => ({
        ...program,
        program_translations: program.program_translations.map(translation => ({
          ...translation,
          language: translation.language as Language
        }))
      })) as Program[];
    },
  });

  const handleEditProgram = (program: Program) => {
    setSelectedProgram(program);
    setIsDialogOpen(true);
  };

  const handleAddNewProgram = () => {
    setSelectedProgram(null);
    setIsDialogOpen(true);
  };

  const handleFormClose = () => {
    setIsDialogOpen(false);
    setSelectedProgram(null);
    refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Programok kezelése</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNewProgram}>
              <Plus className="w-4 h-4 mr-2" />
              Új program
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedProgram ? 'Program szerkesztése' : 'Új program létrehozása'}
              </DialogTitle>
            </DialogHeader>
            <ProgramForm
              program={selectedProgram}
              onClose={handleFormClose}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {programs?.map((program) => (
          <Card key={program.id} className="relative">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-medium">
                {program.program_translations?.find(t => t.language === 'hu')?.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Ár:</strong> {program.price.toLocaleString()} Ft</p>
                <p><strong>Időtartam:</strong> {program.duration}</p>
                <p><strong>Helyszín:</strong> {program.location}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => handleEditProgram(program)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Szerkesztés
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}