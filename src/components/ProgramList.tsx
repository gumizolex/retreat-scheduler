import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Bike, Compass, Mountain, Wine } from "lucide-react";
import { useState } from "react";
import { BookingForm } from "./BookingForm";

interface ProgramListProps {
  onLanguageChange?: (language: string) => void;
}

const translations = {
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

const programs = [
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

export function ProgramList({ onLanguageChange }: ProgramListProps) {
  const [language, setLanguage] = useState("hu");
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null);

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    onLanguageChange?.(newLanguage);
  };

  return (
    <div className="container mx-auto py-12">
      <div className="flex justify-end mb-4 gap-2">
        <Button
          variant={language === "hu" ? "default" : "outline"}
          onClick={() => handleLanguageChange("hu")}
        >
          Magyar
        </Button>
        <Button
          variant={language === "en" ? "default" : "outline"}
          onClick={() => handleLanguageChange("en")}
        >
          English
        </Button>
        <Button
          variant={language === "ro" ? "default" : "outline"}
          onClick={() => handleLanguageChange("ro")}
        >
          Română
        </Button>
      </div>
      <h1 className="text-4xl font-display font-bold text-accent mb-8 text-center">
        {translations[language].pageTitle}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {programs.map((program) => {
          const translatedProgram = translations[language].programs.find(
            (p) => p.id === program.id
          );
          return (
            <Card key={program.id} className="program-card">
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
                    <span>{translations[language].timesAvailable}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex justify-between items-center">
                <span className="text-lg font-semibold">
                  {program.price.toLocaleString()} Ft/fő
                </span>
                <Button 
                  variant="default"
                  onClick={() => setSelectedProgram(program.id)}
                >
                  {translations[language].bookButton}
                </Button>
              </CardFooter>
            </Card>
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
        />
      )}
    </div>
  );
}
