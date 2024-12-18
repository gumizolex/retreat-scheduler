export interface Program {
  id: number;
  price: number;
  duration: string;
  location: string;
  image: string;
}

export interface TranslatedProgram {
  id: number;
  title: string;
  description: string;
}

export type Language = "hu" | "en" | "ro";
export type Currency = "HUF" | "RON" | "EUR";

export interface Translations {
  pageTitle: string;
  bookButton: string;
  timesAvailable: string;
  programs: TranslatedProgram[];
}