import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Bike, Horse, Mountain, Wine } from "lucide-react";

const programs = [
  {
    id: 1,
    title: "Bike Tours",
    description: "Cycle along picturesque routes offering breathtaking views and a touch of adventure in the great outdoors.",
    price: 12000,
    duration: "3 óra",
    location: "Abod környéke",
    image: "/placeholder.svg",
  },
  {
    id: 2,
    title: "Horse-Riding",
    description: "Enjoy tranquil horseback rides through the scenic countryside of Transylvania, perfect for relaxation.",
    price: 15000,
    duration: "2 óra",
    location: "Abod Lovasközpont",
    image: "/placeholder.svg",
  },
  {
    id: 3,
    title: "Wildlife Walks",
    description: "Explore and discover local wildlife on guided walks through the natural beauty surrounding our village.",
    price: 12000,
    duration: "3 óra",
    location: "Abod környéke",
    image: "/placeholder.svg",
  },
  {
    id: 4,
    title: "Skiing",
    description: "Experience the thrill of skiing on nearby slopes, suitable for both beginners and your young ones during the winter.",
    price: 18000,
    duration: "4 óra",
    location: "Abod Sípálya",
    image: "/placeholder.svg",
  },
  {
    id: 5,
    title: "Bread-Baking",
    description: "Engage in traditional bread-baking, learning age-old techniques from local experts in a home setting.",
    price: 8000,
    duration: "3 óra",
    location: "Abod Pékség",
    image: "/placeholder.svg",
  },
  {
    id: 6,
    title: "Wine Tasting",
    description: "Delight in a selection of fine regional wines, carefully chosen to represent the best of Transylvania's vineyards.",
    price: 15000,
    duration: "2 óra",
    location: "Abod Borpince",
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