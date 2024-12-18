import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin } from "lucide-react";

const programs = [
  {
    id: 1,
    title: "Lovaglás",
    description: "Fedezze fel Abod gyönyörű tájait lóháton képzett oktatóinkkal.",
    price: 15000,
    duration: "2 óra",
    location: "Abod Lovasközpont",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    title: "Parajdi sóbánya látogatás",
    description: "Látogasson el Európa egyik legnagyobb sóbányájába szakértő vezetéssel.",
    price: 12000,
    duration: "4 óra",
    location: "Parajd",
    image: "/placeholder.svg",
  },
  {
    id: 3,
    title: "Kenyérsütés",
    description: "Tanuljon hagyományos erdélyi kenyérsütést helyi mesterektől.",
    price: 8000,
    duration: "3 óra",
    location: "Abod Pékség",
    image: "/placeholder.svg",
  },
];

export function ProgramList() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="text-4xl font-display font-bold text-accent mb-8 text-center">
        Programok és Élmények
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {programs.map((program) => (
          <Card key={program.id} className="program-card">
            <CardHeader className="p-0">
              <img
                src={program.image}
                alt={program.title}
                className="w-full h-48 object-cover"
              />
            </CardHeader>
            <CardContent className="p-6">
              <CardTitle className="text-xl mb-2">{program.title}</CardTitle>
              <CardDescription className="mb-4">{program.description}</CardDescription>
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
                  <span>Időpontok elérhetőek</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0 flex justify-between items-center">
              <span className="text-lg font-semibold">
                {program.price.toLocaleString()} Ft
              </span>
              <Button variant="default">
                Foglalás
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}