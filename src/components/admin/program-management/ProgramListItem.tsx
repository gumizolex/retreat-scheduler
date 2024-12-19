import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";

interface ProgramListItemProps {
  program: any;
  onEdit: (program: any) => void;
  onDelete: (programId: number) => void;
}

export function ProgramListItem({ program, onEdit, onDelete }: ProgramListItemProps) {
  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
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
            onClick={() => onEdit(program)}
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
                  onClick={() => onDelete(program.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Törlés
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}