import { Program, Language, Translations } from "@/types/program";

export const translations: Record<Language, Translations> = {
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

export const programs: Program[] = [
  {
    id: 1,
    price: 12000,
    duration: "3 óra",
    location: "Abod környéke",
    image: "/placeholder.svg",
    created_at: new Date().toISOString(),
    program_translations: [
      {
        language: "hu",
        title: "Kerékpártúrák",
        description: "Tekerjen festői útvonalakon, lélegzetelállító kilátással és kalandokkal a szabadban.",
      },
      {
        language: "en",
        title: "Bike Tours",
        description: "Cycle along picturesque routes offering breathtaking views and a touch of adventure in the great outdoors.",
      },
      {
        language: "ro",
        title: "Tururi cu Bicicleta",
        description: "Pedalați pe trasee pitorești care oferă priveliști spectaculoase și aventură în aer liber.",
      }
    ]
  },
  {
    id: 2,
    price: 15000,
    duration: "2 óra",
    location: "Abod Lovasközpont",
    image: "/placeholder.svg",
    created_at: new Date().toISOString(),
    program_translations: [
      {
        language: "hu",
        title: "Lovaglás",
        description: "Élvezze a nyugodt lovaglást Erdély festői vidékén, tökéletes kikapcsolódás.",
      },
      {
        language: "en",
        title: "Horse Riding",
        description: "Enjoy tranquil horseback rides through the scenic countryside of Transylvania, perfect for relaxation.",
      },
      {
        language: "ro",
        title: "Călărie",
        description: "Bucurați-vă de plimbări liniștite călare prin peisajul pitoresc al Transilvaniei, perfect pentru relaxare.",
      }
    ]
  },
  {
    id: 3,
    price: 12000,
    duration: "3 óra",
    location: "Abod környéke",
    image: "/placeholder.svg",
    created_at: new Date().toISOString(),
    program_translations: [
      {
        language: "hu",
        title: "Vadvilág Séták",
        description: "Fedezze fel a helyi élővilágot vezetett sétákon keresztül a falunkat körülvevő természeti szépségben.",
      },
      {
        language: "en",
        title: "Wildlife Walks",
        description: "Explore and discover local wildlife on guided walks through the natural beauty surrounding our village.",
      },
      {
        language: "ro",
        title: "Plimbări în Sălbăticie",
        description: "Explorați și descoperiți fauna locală în plimbări ghidate prin frumusețea naturală din jurul satului nostru.",
      }
    ]
  },
  {
    id: 4,
    price: 18000,
    duration: "4 óra",
    location: "Abod Sípálya",
    image: "/placeholder.svg",
    created_at: new Date().toISOString(),
    program_translations: [
      {
        language: "hu",
        title: "Síelés",
        description: "Tapasztalja meg a síelés izgalmát a közeli lejtőkön, amely kezdők és gyermekek számára is alkalmas télen.",
      },
      {
        language: "en",
        title: "Skiing",
        description: "Experience the thrill of skiing on nearby slopes, suitable for both beginners and your young ones during the winter.",
      },
      {
        language: "ro",
        title: "Schi",
        description: "Experimentați emoția schiului pe pârtiile din apropiere, potrivite atât pentru începători, cât și pentru copii în timpul iernii.",
      }
    ]
  },
  {
    id: 5,
    price: 8000,
    duration: "3 óra",
    location: "Abod Pékség",
    image: "/placeholder.svg",
    created_at: new Date().toISOString(),
    program_translations: [
      {
        language: "hu",
        title: "Kenyérsütés",
        description: "Vegyen részt hagyományos kenyérsütésben, tanuljon ősi technikákat helyi szakértőktől otthonias környezetben.",
      },
      {
        language: "en",
        title: "Bread Baking",
        description: "Engage in traditional bread-baking, learning age-old techniques from local experts in a home setting.",
      },
      {
        language: "ro",
        title: "Copt Pâine",
        description: "Participați la coacerea tradițională a pâinii, învățând tehnici străvechi de la experți locali într-un cadru familial.",
      }
    ]
  },
  {
    id: 6,
    price: 15000,
    duration: "2 óra",
    location: "Abod Borpince",
    image: "/placeholder.svg",
    created_at: new Date().toISOString(),
    program_translations: [
      {
        language: "hu",
        title: "Borkóstoló",
        description: "Élvezze a válogatott helyi borokat, amelyeket gondosan választottunk ki Erdély legjobb borvidékeiről.",
      },
      {
        language: "en",
        title: "Wine Tasting",
        description: "Delight in a selection of fine regional wines, carefully chosen to represent the best of Transylvania's vineyards.",
      },
      {
        language: "ro",
        title: "Degustare de Vinuri",
        description: "Savurați o selecție de vinuri regionale fine, alese cu grijă pentru a reprezenta cele mai bune vinuri din Transilvania.",
      }
    ]
  },
];