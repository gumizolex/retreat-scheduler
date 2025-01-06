import { ProgramList } from "@/components/ProgramList";
import { Language } from "@/types/program";

const Activities = () => {
  const handleLanguageChange = (language: Language) => {
    console.log('Language changed to:', language);
  };

  return <ProgramList onLanguageChange={handleLanguageChange} />;
};

export default Activities;