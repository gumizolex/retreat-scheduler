import { supabase } from "@/integrations/supabase/client";
import { FormValues } from "./types";

export async function createNewProgram(values: FormValues) {
  console.log('Creating new program with values:', values);
  
  const { data: program, error: programError } = await supabase
    .from('programs')
    .insert({
      price: values.price,
      duration: values.duration,
      location: values.location,
    })
    .select()
    .maybeSingle();

  if (programError) {
    console.error('Error creating program:', programError);
    throw new Error('Failed to create program');
  }

  if (!program) {
    console.error('No program data returned after creation');
    throw new Error('Program creation failed - no data returned');
  }

  const languages = ['hu', 'en', 'ro'] as const;
  for (const lang of languages) {
    const { error: translationError } = await supabase
      .from('program_translations')
      .insert({
        program_id: program.id,
        language: lang,
        title: values[`${lang}_title` as keyof FormValues],
        description: values[`${lang}_description` as keyof FormValues],
      });

    if (translationError) {
      console.error(`Error creating ${lang} translation:`, translationError);
      throw new Error(`Failed to create ${lang} translation`);
    }
  }

  return program;
}

export async function updateExistingProgram(values: FormValues, programId: number) {
  console.log('Updating program with values:', values);
  
  const { data: program, error: programError } = await supabase
    .from('programs')
    .update({
      price: values.price,
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

  if (!program) {
    console.error('No program found with id:', programId);
    throw new Error('Program not found');
  }

  return program;
}

export async function updateProgramTranslation(
  programId: number,
  language: string,
  title: string,
  description: string,
  isNew: boolean
) {
  console.log('Updating translation:', { programId, language, title, description, isNew });

  if (isNew) {
    const { error } = await supabase
      .from('program_translations')
      .insert({
        program_id: programId,
        language,
        title,
        description,
      });

    if (error) {
      console.error('Error creating translation:', error);
      throw new Error(`Failed to create ${language} translation`);
    }
  } else {
    const { error } = await supabase
      .from('program_translations')
      .update({ title, description })
      .eq('program_id', programId)
      .eq('language', language);

    if (error) {
      console.error('Error updating translation:', error);
      throw new Error(`Failed to update ${language} translation`);
    }
  }
}