import { FormValues } from "./types";
import { supabase } from "@/integrations/supabase/client";

export const createNewProgram = async (values: FormValues) => {
  try {
    console.log('Creating new program with values:', values);
    
    const { data: program, error: programError } = await supabase
      .from('programs')
      .insert([
        {
          price: values.price,
          duration: values.duration,
          location: values.location,
        }
      ])
      .select()
      .maybeSingle();

    if (programError) {
      console.error('Error creating program:', programError);
      throw new Error('Failed to create program');
    }

    if (!program) {
      throw new Error('Program was not created');
    }

    const translations = [
      {
        program_id: program.id,
        language: 'hu',
        title: values.hu_title,
        description: values.hu_description,
      },
      {
        program_id: program.id,
        language: 'en',
        title: values.en_title,
        description: values.en_description,
      },
      {
        program_id: program.id,
        language: 'ro',
        title: values.ro_title,
        description: values.ro_description,
      },
    ];

    const { error: translationsError } = await supabase
      .from('program_translations')
      .insert(translations);

    if (translationsError) {
      console.error('Error creating translations:', translationsError);
      // Ha a fordítások létrehozása sikertelen, töröljük a programot is
      await supabase.from('programs').delete().eq('id', program.id);
      throw new Error('Failed to create program translations');
    }

    return program;
  } catch (error: any) {
    console.error('Error in createNewProgram:', error);
    throw error;
  }
};

export const updateExistingProgram = async (values: FormValues, programId: number) => {
  try {
    console.log('Updating program with values:', values);
    
    // Először frissítjük a program alapadatait
    const { error: programError } = await supabase
      .from('programs')
      .update({
        price: values.price,
        duration: values.duration,
        location: values.location,
      })
      .eq('id', programId);

    if (programError) {
      console.error('Error updating program:', programError);
      throw new Error('Failed to update program');
    }

    // Frissítjük a fordításokat nyelvenként
    const languages = ['hu', 'en', 'ro'] as const;
    for (const lang of languages) {
      const titleKey = `${lang}_title` as keyof FormValues;
      const descriptionKey = `${lang}_description` as keyof FormValues;
      
      const { error: translationError } = await supabase
        .from('program_translations')
        .update({
          title: String(values[titleKey]),
          description: String(values[descriptionKey]),
        })
        .eq('program_id', programId)
        .eq('language', lang);

      if (translationError) {
        console.error(`Error updating ${lang} translation:`, translationError);
        throw new Error(`Failed to update ${lang} translation`);
      }
    }

    // Lekérjük a frissített programot az összes fordítással együtt
    const { data: updatedProgram, error: fetchError } = await supabase
      .from('programs')
      .select(`
        *,
        program_translations (
          language,
          title,
          description
        )
      `)
      .eq('id', programId)
      .maybeSingle();

    if (fetchError || !updatedProgram) {
      console.error('Error fetching updated program:', fetchError);
      throw new Error('Failed to fetch updated program');
    }

    return updatedProgram;
  } catch (error: any) {
    console.error('Error in updateExistingProgram:', error);
    throw error;
  }
};

export const updateProgramTranslation = async (
  programId: number,
  language: string,
  title: string,
  description: string,
  isNew: boolean
) => {
  try {
    console.log('Updating translation:', { programId, language, title, description, isNew });
    
    if (isNew) {
      const { error } = await supabase
        .from('program_translations')
        .insert([
          {
            program_id: programId,
            language,
            title,
            description,
          },
        ]);

      if (error) {
        console.error('Error inserting translation:', error);
        throw error;
      }
    } else {
      const { error } = await supabase
        .from('program_translations')
        .update({
          title,
          description,
        })
        .eq('program_id', programId)
        .eq('language', language);

      if (error) {
        console.error('Error updating translation:', error);
        throw error;
      }
    }
  } catch (error: any) {
    console.error('Error updating translation:', error);
    throw error;
  }
};