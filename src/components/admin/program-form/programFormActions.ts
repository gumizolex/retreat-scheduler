import { FormValues } from "./types";
import { supabase } from "@/integrations/supabase/client";

export const createNewProgram = async (values: FormValues) => {
  try {
    console.log('Creating new program with values:', values);
    
    const { data: program, error: programError } = await supabase
      .from('programs')
      .insert([
        {
          price: Number(values.price),
          duration: values.duration,
          location: values.location,
        }
      ])
      .select()
      .maybeSingle();

    if (programError || !program) {
      console.error('Error creating program:', programError);
      throw new Error('Failed to create program');
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
    console.log('Program ID:', programId);
    
    // First check if the program exists with its translations
    const { data: existingProgram, error: checkError } = await supabase
      .from('programs')
      .select(`
        *,
        program_translations (
          id,
          language,
          title,
          description
        )
      `)
      .eq('id', programId)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking program existence:', checkError);
      throw new Error('Failed to check program existence');
    }

    if (!existingProgram) {
      console.error('No program found with ID:', programId);
      throw new Error('Program not found');
    }

    // Update the program's basic data
    const { data: updatedProgram, error: programError } = await supabase
      .from('programs')
      .update({
        price: Number(values.price),
        duration: values.duration,
        location: values.location,
      })
      .eq('id', programId)
      .select()
      .maybeSingle();

    if (programError) {
      console.error('Error updating program:', programError);
      throw new Error('Failed to update program');
    }

    if (!updatedProgram) {
      console.error('No program found after update with ID:', programId);
      throw new Error('Program not found after update');
    }

    console.log('Program update response:', updatedProgram);

    // Update translations for each language
    const languages = ['hu', 'en', 'ro'] as const;
    for (const lang of languages) {
      const existingTranslation = existingProgram.program_translations.find(t => t.language === lang);
      
      const translationData = {
        title: values[`${lang}_title` as keyof FormValues],
        description: values[`${lang}_description` as keyof FormValues],
      };

      if (existingTranslation) {
        // Update existing translation
        const { error: translationError } = await supabase
          .from('program_translations')
          .update(translationData)
          .eq('program_id', programId)
          .eq('language', lang);

        if (translationError) {
          console.error(`Error updating ${lang} translation:`, translationError);
          throw new Error(`Failed to update ${lang} translation`);
        }
      } else {
        // Create new translation if it doesn't exist
        const { error: translationError } = await supabase
          .from('program_translations')
          .insert([{
            program_id: programId,
            language: lang,
            ...translationData,
          }]);

        if (translationError) {
          console.error(`Error creating ${lang} translation:`, translationError);
          throw new Error(`Failed to create ${lang} translation`);
        }
      }
    }

    return updatedProgram;
  } catch (error: any) {
    console.error('Error in updateExistingProgram:', error);
    throw error;
  }
};