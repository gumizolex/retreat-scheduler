import { format } from "date-fns";
import { Language } from "@/types/program";

interface BookingSummaryDetailsProps {
  formData: {
    name: string;
    email: string;
    date: Date;
    time: string;
    numberOfPeople: number;
  };
  programTitle: string;
  language: Language;
  t: any;
}

export function BookingSummaryDetails({
  formData,
  programTitle,
  t,
}: BookingSummaryDetailsProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium text-accent mb-2">{t.program}</h3>
        <p className="text-gray-600">{programTitle}</p>
      </div>
      <div>
        <h3 className="font-medium text-accent mb-2">{t.bookingDetails}</h3>
        <div className="space-y-2 text-gray-600">
          <p>{formData.name}</p>
          <p>{formData.email}</p>
          <p>
            {format(formData.date, "yyyy.MM.dd")} {formData.time}
          </p>
          <p>
            {formData.numberOfPeople} {t.numberOfPeople}
          </p>
        </div>
      </div>
    </div>
  );
}