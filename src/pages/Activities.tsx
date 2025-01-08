import { ProgramList } from "@/components/ProgramList";
import { motion } from "framer-motion";

const Activities = () => {
  console.log('Activities page rendering');
  return (
    <div className="min-h-screen bg-background">
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-primary/90 py-16 md:py-24 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('/lovable-uploads/2d6426e9-465a-4ee5-a26b-9d0b14d941bd.png')] bg-cover bg-center opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
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
      </motion.section>
      <ProgramList />
    </div>
  );
};

export default Activities;