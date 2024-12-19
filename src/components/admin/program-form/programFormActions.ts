import { supabase } from "@/integrations/supabase/client";
import { FormValues } from "./types";
import { Program } from "@/types/program";

export async function updateExistingProgram(values: FormValues, programId: number) {
  console.log('Updating existing program with ID:', programId);
  
  const { data: updatedProgram, error: programError } = await supabase
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
    throw programError;
  }

  if (!updatedProgram) {
    throw new Error('Program not found or could not be updated');
  }

  console.log('Successfully updated program:', updatedProgram);
  return updatedProgram;
}

export async function updateProgramTranslation(
  programId: number,
  lang: string,
  title: string,
  description: string,
  isNew: boolean
) {
  if (isNew) {
    const { data: newTranslation, error: translationError } = await supabase
      .from('program_translations')
      .insert({
        program_id: programId,
        language: lang,
        title,
        description,
      })
      .select()
      .maybeSingle();

    if (translationError) {
      console.error(`Error creating ${lang} translation:`, translationError);
      throw translationError;
    }

    if (!newTranslation) {
      throw new Error(`Could not create translation for language ${lang}`);
    }

    console.log(`Successfully created ${lang} translation:`, newTranslation);
    return newTranslation;
  } else {
    const { data: updatedTranslation, error: translationError } = await supabase
      .from('program_translations')
      .update({ title, description })
      .eq('program_id', programId)
      .eq('language', lang)
      .select()
      .maybeSingle();

    if (translationError) {
      console.error(`Error updating ${lang} translation:`, translationError);
      throw translationError;
    }

    if (!updatedTranslation) {
      throw new Error(`Translation for language ${lang} not found or could not be updated`);
    }

    console.log(`Successfully updated ${lang} translation:`, updatedTranslation);
    return updatedTranslation;
  }
}

export async function createNewProgram(values: FormValues) {
  console.log('Creating new program');
  
  const { data: newProgram, error: programError } = await supabase
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
    throw programError;
  }

  if (!newProgram) {
    throw new Error('Could not create new program');
  }

  console.log('Created new program:', newProgram);

  const translations = ['hu', 'en', 'ro'].map(lang => ({
    program_id: newProgram.id,
    language: lang,
    title: String(values[`${lang}_title` as keyof FormValues]),
    description: String(values[`${lang}_description` as keyof FormValues]),
  }));

  const { data: newTranslations, error: translationsError } = await supabase
    .from('program_translations')
    .insert(translations)
    .select();

  if (translationsError) {
    console.error('Error creating translations:', translationsError);
    throw translationsError;
  }

  if (!newTranslations || newTranslations.length === 0) {
    throw new Error('Could not create translations');
  }

  console.log('Successfully created translations:', newTranslations);
  return { program: newProgram, translations: newTranslations };
}