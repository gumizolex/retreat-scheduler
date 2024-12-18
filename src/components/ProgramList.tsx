import { useState } from "react";
import { BookingForm } from "./BookingForm";
import { LanguageSelector } from "./LanguageSelector";
import { ProgramCard } from "./ProgramCard";
import { Button } from "./ui/button";
import { Language, Currency, Program, Translations } from "@/types/program";
import { CurrencySelector } from "./CurrencySelector";

const translations: Record<Language, Translations> = {
  en: {
    pageTitle: "Programs and Experiences",
    bookButton: "Book Now",
    timesAvailable: "Times Available",
    programs: [
      {
        id: 1,
        title: "Bike Tours",
        description: "Cycle along picturesque routes offering breathtaking views and a touch of adventure in the great outdoors.",
      },
      {
        id: 2,
        title: "Horse Riding",
        description: "Enjoy tranquil horseback rides through the scenic countryside of Transylvania, perfect for relaxation.",
      },
      {
        id: 3,
        title: "Wildlife Walks",
        description: "Explore and discover local wildlife on guided walks through the natural beauty surrounding our village.",
      },
      {
        id: 4,
        title: "Skiing",
        description: "Experience the thrill of skiing on nearby slopes, suitable for both beginners and your young ones during the winter.",
      },
      {
        id: 5,
        title: "Bread Baking",
        description: "Engage in traditional bread-baking, learning age-old techniques from local experts in a home setting.",
      },
      {
        id: 6,
        title: "Wine Tasting",
        description: "Delight in a selection of fine regional wines, carefully chosen to represent the best of Transylvania's vineyards.",
      },
    ],
  },
  hu: {
    pageTitle: "Programok és Élmények",
    bookButton: "Foglalás",
    timesAvailable: "Elérhető időpontok",
    programs: [
      {
        id: 1,
        title: "Kerékpártúrák",
        description: "Tekerjen festői útvonalakon, lélegzetelállító kilátással és kalandokkal a szabadban.",
      },
      {
        id: 2,
        title: "Lovaglás",
        description: "Élvezze a nyugodt lovaglást Erdély festői vidékén, tökéletes kikapcsolódás.",
      },
      {
        id: 3,
        title: "Vadvilág Séták",
        description: "Fedezze fel a helyi élővilágot vezetett sétákon keresztül a falunkat körülvevő természeti szépségben.",
      },
      {
        id: 4,
        title: "Síelés",
        description: "Tapasztalja meg a síelés izgalmát a közeli lejtőkön, amely kezdők és gyermekek számára is alkalmas télen.",
      },
      {
        id: 5,
        title: "Kenyérsütés",
        description: "Vegyen részt hagyományos kenyérsütésben, tanuljon ősi technikákat helyi szakértőktől otthonias környezetben.",
      },
      {
        id: 6,
        title: "Borkóstoló",
        description: "Élvezze a válogatott helyi borokat, amelyeket gondosan választottunk ki Erdély legjobb borvidékeiről.",
      },
    ],
  },
  ro: {
    pageTitle: "Programe și Experiențe",
    bookButton: "Rezervare",
    timesAvailable: "Ore disponibile",
    programs: [
      {
        id: 1,
        title: "Tururi cu Bicicleta",
        description: "Pedalați pe trasee pitorești care oferă priveliști spectaculoase și aventură în aer liber.",
      },
      {
        id: 2,
        title: "Călărie",
        description: "Bucurați-vă de plimbări liniștite călare prin peisajul pitoresc al Transilvaniei, perfect pentru relaxare.",
      },
      {
        id: 3,
        title: "Plimbări în Sălbăticie",
        description: "Explorați și descoperiți fauna locală în plimbări ghidate prin frumusețea naturală din jurul satului nostru.",
      },
      {
        id: 4,
        title: "Schi",
        description: "Experimentați emoția schiului pe pârtiile din apropiere, potrivite atât pentru începători, cât și pentru copii în timpul iernii.",
      },
      {
        id: 5,
        title: "Copt Pâine",
        description: "Participați la coacerea tradițională a pâinii, învățând tehnici străvechi de la experți locali într-un cadru familial.",
      },
      {
        id: 6,
        title: "Degustare de Vinuri",
        description: "Savurați o selecție de vinuri regionale fine, alese cu grijă pentru a reprezenta cele mai bune vinuri din Transilvania.",
      },
    ],
  },
};

const programs: Program[] = [
  {
    id: 1,
    price: 12000,
    duration: "3 óra",
    location: "Abod környéke",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    price: 15000,
    duration: "2 óra",
    location: "Abod Lovasközpont",
    image: "/placeholder.svg",
  },
  {
    id: 3,
    price: 12000,
    duration: "3 óra",
    location: "Abod környéke",
    image: "/placeholder.svg",
  },
  {
    id: 4,
    price: 18000,
    duration: "4 óra",
    location: "Abod Sípálya",
    image: "/placeholder.svg",
  },
  {
    id: 5,
    price: 8000,
    duration: "3 óra",
    location: "Abod Pékség",
    image: "/placeholder.svg",
  },
  {
    id: 6,
    price: 15000,
    duration: "2 óra",
    location: "Abod Borpince",
    image: "/placeholder.svg",
  },
];

export function ProgramList({ onLanguageChange }: { onLanguageChange?: (lang: Language) => void }) {
  const [language, setLanguage] = useState<Language>("hu");
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null);
  const [currency, setCurrency] = useState<Currency>("HUF");

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    onLanguageChange?.(newLanguage);
  };

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
        <CurrencySelector 
          selectedCurrency={currency} 
          onCurrencyChange={setCurrency} 
        />
        <LanguageSelector 
          currentLanguage={language}
          onLanguageChange={handleLanguageChange}
        />
      </div>

      <h1 className="text-4xl font-display font-bold text-accent mb-12 text-center">
        {translations[language].pageTitle}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {programs.map((program) => {
          const translatedProgram = translations[language].programs.find(
            (p) => p.id === program.id
          )!;
          return (
            <ProgramCard
              key={program.id}
              program={program}
              translatedProgram={translatedProgram}
              timesAvailableText={translations[language].timesAvailable}
              bookButtonText={translations[language].bookButton}
              onBook={setSelectedProgram}
              currency={currency}
            />
          );
        })}
      </div>

      {selectedProgram && (
        <BookingForm
          isOpen={selectedProgram !== null}
          onClose={() => setSelectedProgram(null)}
          programTitle={
            translations[language].programs.find(
              (p) => p.id === selectedProgram
            )?.title || ""
          }
          pricePerPerson={
            programs.find((p) => p.id === selectedProgram)?.price || 0
          }
          currency={currency}
        />
      )}
    </div>
  );
}
