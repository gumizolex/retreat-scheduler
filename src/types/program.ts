export interface Program {
  id: number;
  price: number;
  duration: string;
  location: string;
  image: string;
  program_translations?: ProgramTranslation[];
}

export interface TranslatedProgram {
  id: number;
  title: string;
  description: string;
}

export interface ProgramTranslation {
  id?: number;
  program_id?: number;
  language: Language;
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