import * as z from "zod";

export const formSchema = z.object({
  price: z.coerce.number().min(0, "Az árnak pozitív számnak kell lennie"),
  duration: z.string().min(1, "Az időtartam megadása kötelező"),
  location: z.string().min(1, "A helyszín megadása kötelező"),
  image: z.string().optional(),
  hu_title: z.string().min(1, "A magyar cím megadása kötelező"),
  hu_description: z.string().min(1, "A magyar leírás megadása kötelező"),
  en_title: z.string().min(1, "Az angol cím megadása kötelező"),
  en_description: z.string().min(1, "Az angol leírás megadása kötelező"),
  ro_title: z.string().min(1, "A román cím megadása kötelező"),
  ro_description: z.string().min(1, "A román leírás megadása kötelező"),
});

export type FormValues = z.infer<typeof formSchema>;