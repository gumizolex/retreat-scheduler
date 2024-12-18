import { ProgramList } from "@/components/ProgramList";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-display font-bold mb-4">
            Abod Retreat
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            Fedezze fel egyedülálló programjainkat és élményeinket Erdély szívében
          </p>
        </div>
      </header>
      <main>
        <ProgramList />
      </main>
      <footer className="bg-accent text-accent-foreground py-8 mt-16">
        <div className="container mx-auto text-center">
          <p>© 2024 Abod Retreat. Minden jog fenntartva.</p>
        </div>
      </footer>
    </div>
  );
}

export default Index;