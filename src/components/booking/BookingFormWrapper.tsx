import { useState } from "react";
import { CalendarDays, FileText, User } from "lucide-react";
import { BookingForm } from "./BookingForm";
import { BookingProgressSteps } from "./BookingProgressSteps";
import { Currency, Language } from "@/types/program";

interface BookingFormWrapperProps {
  programTitle: string;
  pricePerPerson: number;
  currency: Currency;
  language: Language;
  onClose: () => void;
}

export function BookingFormWrapper({
  programTitle,
  pricePerPerson,
  currency,
  language,
  onClose
}: BookingFormWrapperProps) {
  const [step, setStep] = useState(0);
  const t = translations[language];

  const steps = [
    { icon: CalendarDays, title: t.steps.selectDate },
    { icon: FileText, title: t.steps.details },
    { icon: User, title: t.steps.summary }
  ];

  return (
    <>
      <div className="border-b w-full">
        <BookingProgressSteps steps={steps} currentStep={step} />
      </div>

      <div className="p-3 sm:p-4 w-full">
        <BookingForm
          step={step}
          setStep={setStep}
          programTitle={programTitle}
          pricePerPerson={pricePerPerson}
          currency={currency}
          language={language}
          onClose={onClose}
          t={t}
        />
      </div>
    </>
  );
}

const translations = {
  hu: {
    steps: {
      selectDate: "Időpont választása",
      details: "Személyes adatok",
      summary: "Összegzés"
    },
    booking: "foglalás",
    name: "Név",
    namePlaceholder: "Az Ön neve",
    nameError: "A név legalább 2 karakter hosszú kell legyen",
    email: "E-mail cím",
    emailPlaceholder: "Az Ön e-mail címe",
    emailError: "Kérjük adjon meg egy érvényes e-mail címet",
    phone: "Telefonszám",
    phonePlaceholder: "Telefonszám",
    phoneError: "Érvényes telefonszámot adjon meg",
    bookingNumber: "Abod Retreat foglalási szám (opcionális)",
    bookingNumberPlaceholder: "Foglalási szám",
    numberOfPeople: "Létszám",
    date: "Dátum",
    dateError: "Kérjük válasszon dátumot",
    perPerson: "/fő",
    total: "Összesen",
    submit: "Foglalás véglegesítése",
    time: "Időpont",
    selectTime: "Válasszon időpontot",
    next: "Következő",
    back: "Vissza",
    program: "Program",
    bookingDetails: "Foglalás részletei"
  },
  en: {
    steps: {
      selectDate: "Select Date",
      details: "Personal Details",
      summary: "Summary"
    },
    booking: "booking",
    name: "Name",
    namePlaceholder: "Your name",
    nameError: "Name must be at least 2 characters long",
    email: "Email address",
    emailPlaceholder: "Your email address",
    emailError: "Please provide a valid email address",
    phone: "Phone number",
    phonePlaceholder: "Phone number",
    phoneError: "Please provide a valid phone number",
    bookingNumber: "Abod Retreat booking number (optional)",
    bookingNumberPlaceholder: "Booking number",
    numberOfPeople: "Number of people",
    date: "Date",
    dateError: "Please select a date",
    perPerson: "/person",
    total: "Total",
    submit: "Confirm Booking",
    time: "Time",
    selectTime: "Select time",
    next: "Next",
    back: "Back",
    program: "Program",
    bookingDetails: "Booking Details"
  },
  ro: {
    steps: {
      selectDate: "Selectează data",
      details: "Date personale",
      summary: "Sumar"
    },
    booking: "rezervare",
    name: "Nume",
    namePlaceholder: "Numele dumneavoastră",
    nameError: "Numele trebuie să aibă cel puțin 2 caractere",
    email: "Adresă de email",
    emailPlaceholder: "Adresa dvs. de email",
    emailError: "Vă rugăm să furnizați o adresă de email validă",
    phone: "Număr de telefon",
    phonePlaceholder: "Număr de telefon",
    phoneError: "Vă rugăm să furnizați un număr de telefon valid",
    bookingNumber: "Număr de rezervare Abod Retreat (opțional)",
    bookingNumberPlaceholder: "Număr de rezervare",
    numberOfPeople: "Număr de persoane",
    date: "Data",
    dateError: "Vă rugăm să selectați o dată",
    perPerson: "/persoană",
    total: "Total",
    submit: "Confirmă Rezervarea",
    time: "Ora",
    selectTime: "Selectați ora",
    next: "Următorul",
    back: "Înapoi",
    program: "Program",
    bookingDetails: "Detalii Rezervare"
  }
};
