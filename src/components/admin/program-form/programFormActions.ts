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
  const translations = languages.map(lang => ({
    program_id: program.id,
    language: lang,
    title: String(values[`${lang}_title` as keyof FormValues]),
    description: String(values[`${lang}_description` as keyof FormValues]),
  }));

  const { error: translationError } = await supabase
    .from('program_translations')
    .insert(translations);

  if (translationError) {
    console.error('Error creating translations:', translationError);
    throw new Error('Failed to create translations');
  }

  return program;
}

export async function updateExistingProgram(values: FormValues, programId: number) {
  console.log('Updating program with values:', values);
  
  // First check if the program exists
  const { data: existingProgram, error: checkError } = await supabase
    .from('programs')
    .select()
    .eq('id', programId)
    .maybeSingle();

  if (checkError) {
    console.error('Error checking program:', checkError);
    throw new Error('Failed to check program existence');
  }

  if (!existingProgram) {
    console.error('No program found with id:', programId);
    throw new Error('Program not found');
  }

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
    console.error('No program data returned after update');
    throw new Error('Program update failed - no data returned');
  }

  return program;
}

export async function updateProgramTranslation(
  programId: number,
  language: string,
  title: string | number,
  description: string | number,
  isNew: boolean
) {
  console.log('Updating translation:', { programId, language, title, description, isNew });

  const translationData = {
    program_id: programId,
    language,
    title: String(title),
    description: String(description),
  };

  if (isNew) {
    const { error } = await supabase
      .from('program_translations')
      .insert([translationData]);

    if (error) {
      console.error('Error creating translation:', error);
      throw new Error(`Failed to create ${language} translation`);
    }
  } else {
    const { error } = await supabase
      .from('program_translations')
      .update({ title: String(title), description: String(description) })
      .eq('program_id', programId)
      .eq('language', language);

    if (error) {
      console.error('Error updating translation:', error);
      throw new Error(`Failed to update ${language} translation`);
    }
  }
}