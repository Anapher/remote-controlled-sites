import { z } from 'zod';

const emptyStringToUndefined = z.literal('').transform(() => undefined);

export const ScreenSchema = z.object({
   name: z
      .string()
      .min(3)
      .max(12)
      .regex(/^[a-z0-9-]+$/, 'Zeichenfolge darf nur -, a-z und 0-9 beinhalten'),
   defaultContent: z.string().url().optional().or(emptyStringToUndefined),
   onlyScreenShareAllowed: z.boolean().optional(),
   allowedVideoHostNames: z.string().optional(),
});

export const ScreenControlledVideoSchemaUrl = z.string().url().min(1);

export const validateUrlAgainstHostnames = (s: string, hostnamesString?: string) => {
   if (!hostnamesString) return true;

   const hostnames = hostnamesString
      .split('\n')
      .map((x) => x.trim())
      .filter((x) => x);
   try {
      const url = new URL(s);
      return hostnames.includes(url.hostname);
   } catch (error) {
      return false;
   }
};

export const ScreenControlledVideoSchema = z.object({
   type: z.literal('controlled-video'),
   url: ScreenControlledVideoSchemaUrl,
   paused: z.boolean(),
   startPosition: z
      .number()
      .int()
      .transform((val) => val || new Date().getTime()),
   controlToken: z.string().optional(),
});

export const ScreenWebsiteContentSchema = z.object({
   type: z.literal('url'),
   url: z.string().url().min(1),
});

export const ScreenShareContentSchema = z.object({
   type: z.literal('screenshare'),
});

export const ScreenContentSchema = z
   .discriminatedUnion('type', [ScreenControlledVideoSchema, ScreenWebsiteContentSchema, ScreenShareContentSchema])
   .nullable();

export type ScreenDto = z.infer<typeof ScreenSchema>;

export type ScreenInfo = ScreenDto & {
   content: ScreenContent | null;
};

export type ScreenContent = z.infer<typeof ScreenContentSchema>;

export type ScreenWebsiteContent = z.infer<typeof ScreenWebsiteContentSchema>;

export type ScreenshareContent = z.infer<typeof ScreenShareContentSchema>;

export type ScreenControlledVideo = z.infer<typeof ScreenControlledVideoSchema>;
