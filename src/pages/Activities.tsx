import { ProgramList } from "@/components/ProgramList";

const Activities = () => {
  console.log('Activities page rendering');
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-primary py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <img 
              src="/abod-logo-white.png" 
              alt="Abod Retreat" 
              className="h-16 md:h-20 mx-auto mb-6"
            />
            <h2 className="text-white text-xl md:text-2xl font-light mb-4">
              Fedezze fel programjainkat és élje át a nyugalom pillanatait
            </h2>
          </div>
        </div>
      </section>
      <ProgramList />
    </div>
  );
};

export default Activities;