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

export function BookingSummaryDetails({ formData, programTitle, t }: BookingSummaryDetailsProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg text-accent">{t.bookingDetails}</h3>
      <div className="space-y-2 text-sm">
        <p>
          <span className="text-gray-500">{t.program}:</span>{" "}
          <span className="font-medium text-accent">{programTitle}</span>
        </p>
        <p>
          <span className="text-gray-500">{t.name}:</span>{" "}
          <span className="font-medium text-accent">{formData.name}</span>
        </p>
        <p>
          <span className="text-gray-500">{t.email}:</span>{" "}
          <span className="font-medium text-accent">{formData.email}</span>
        </p>
        <p>
          <span className="text-gray-500">{t.date}:</span>{" "}
          <span className="font-medium text-accent">
            {format(formData.date, "yyyy. MM. dd.")}
          </span>
        </p>
        <p>
          <span className="text-gray-500">{t.time}:</span>{" "}
          <span className="font-medium text-accent">{formData.time}</span>
        </p>
        <p>
          <span className="text-gray-500">{t.numberOfPeople}:</span>{" "}
          <span className="font-medium text-accent">{formData.numberOfPeople}</span>
        </p>
      </div>
    </div>
  );
}