import { AdminDashboard } from "@/components/AdminDashboard";

const Admin = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-accent py-6">
        <div className="container mx-auto">
          <h1 className="text-2xl font-display text-accent-foreground">
            Abod Retreat Admin
          </h1>
        </div>
      </header>
      <main>
        <AdminDashboard />
      </main>
    </div>
  );
}

export default Admin;