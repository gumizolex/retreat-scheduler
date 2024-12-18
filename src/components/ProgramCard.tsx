import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";
import { Program, TranslatedProgram, Currency } from "@/types/program";
import { formatCurrency } from "@/utils/currency";

interface ProgramCardProps {
  program: Program;
  translatedProgram: TranslatedProgram;
  timesAvailableText: string;
  bookButtonText: string;
  onBook: (programId: number) => void;
  currency: Currency;
}

export function ProgramCard({
  program,
  translatedProgram,
  timesAvailableText,
  bookButtonText,
  onBook,
  currency
}: ProgramCardProps) {
  return (
    <Card className="program-card">
      <CardHeader className="p-0">
        <img
          src={program.image}
          alt={translatedProgram.title}
          className="w-full h-48 object-cover"
        />
      </CardHeader>
      <CardContent className="p-6">
        <CardTitle className="text-xl mb-2">{translatedProgram.title}</CardTitle>
        <CardDescription className="mb-4">{translatedProgram.description}</CardDescription>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{program.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{program.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{timesAvailableText}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0 flex justify-between items-center">
        <span className="text-lg font-semibold">
          {formatCurrency(program.price, currency)}/fő
        </span>
        <Button 
          variant="default"
          onClick={() => onBook(program.id)}
        >
          {bookButtonText}
        </Button>
      </CardFooter>
    </Card>
  );
}