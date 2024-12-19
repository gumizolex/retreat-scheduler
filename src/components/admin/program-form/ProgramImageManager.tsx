import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";
import { Program } from "@/types/program";
import { useQueryClient } from "@tanstack/react-query";

interface ProgramImageManagerProps {
  program: Program;
}

export function ProgramImageManager({ program }: ProgramImageManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Hiba!",
        description: "Csak képfájlokat lehet feltölteni.",
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Hiba!",
        description: "A fájl mérete nem lehet nagyobb 5MB-nál.",
      });
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('program-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('program-images')
        .getPublicUrl(filePath);

      // Update program with new image URL
      const { error: updateError } = await supabase
        .from('programs')
        .update({ image: publicUrl })
        .eq('id', program.id);

      if (updateError) {
        throw updateError;
      }

      await queryClient.invalidateQueries({ queryKey: ['programs'] });

      toast({
        title: "Siker!",
        description: "A kép sikeresen feltöltve.",
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        variant: "destructive",
        title: "Hiba!",
        description: "A kép feltöltése sikertelen.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
        <img
          src={program.image}
          alt="Program előnézet"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex items-center justify-center w-full">
        <label htmlFor={`image-upload-${program.id}`} className="w-full">
          <Button
            variant="outline"
            className="w-full"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Feltöltés...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Kép módosítása
              </>
            )}
          </Button>
          <input
            id={`image-upload-${program.id}`}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}