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
        title: String(values.hu_title),
        description: String(values.hu_description),
      },
      {
        program_id: program.id,
        language: 'en',
        title: String(values.en_title),
        description: String(values.en_description),
      },
      {
        program_id: program.id,
        language: 'ro',
        title: String(values.ro_title),
        description: String(values.ro_description),
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
    
    // First, update the program with the new values
    const { error: programError } = await supabase
      .from('programs')
      .update({
        price: Number(values.price),
        duration: values.duration,
        location: values.location,
      })
      .eq('id', programId);

    if (programError) {
      console.error('Error updating program:', programError);
      throw new Error('Failed to update program');
    }

    // Update translations
    const languages = ['hu', 'en', 'ro'] as const;
    
    for (const lang of languages) {
      const translationData = {
        program_id: programId,
        language: lang,
        title: String(values[`${lang}_title` as keyof FormValues]),
        description: String(values[`${lang}_description` as keyof FormValues]),
      };

      // First try to update existing translation
      const { error: updateError } = await supabase
        .from('program_translations')
        .update({
          title: translationData.title,
          description: translationData.description,
        })
        .eq('program_id', programId)
        .eq('language', lang);

      if (updateError) {
        // If update fails, try to insert new translation
        const { error: insertError } = await supabase
          .from('program_translations')
          .insert([translationData]);

        if (insertError) {
          console.error(`Error handling ${lang} translation:`, insertError);
          throw new Error(`Failed to handle ${lang} translation`);
        }
      }
    }

    // Fetch and return the updated program with its translations
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
      .single();

    if (fetchError || !updatedProgram) {
      console.error('Error fetching updated program:', fetchError);
      throw new Error('Failed to fetch updated program');
    }

    console.log('Successfully updated program:', updatedProgram);
    return updatedProgram;
  } catch (error: any) {
    console.error('Error in updateExistingProgram:', error);
    throw error;
  }
};