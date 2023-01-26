import { z } from 'zod';

const emptyStringToUndefined = z.literal('').transform(() => undefined);

export const ScreenSchema = z.object({
   name: z
      .string()
      .min(3)
      .max(12)
      .regex(/^[a-z0-9-]+$/, 'Zeichenfolge darf nur -, a-z und 0-9 beinhalten'),
   defaultContent: z.string().url().optional().or(emptyStringToUndefined),
});

export const ScreenControlledVideoSchema = z.object({
   type: z.literal('controlled-video'),
   url: z.string().url().min(1),
   paused: z.boolean(),
   startPosition: z.number().int(),
});

export const ScreenWebsiteContentSchema = z.object({
   type: z.literal('url'),
   url: z.string().url().min(1),
});

export const ScreenShareContentSchema = z.object({
   type: z.literal('screenshare'),
});

export const ScreenContentSchema = z.discriminatedUnion('type', [
   ScreenControlledVideoSchema,
   ScreenWebsiteContentSchema,
   ScreenShareContentSchema,
]);

export type ScreenDto = z.infer<typeof ScreenSchema>;

export type ScreenInfo = ScreenDto & {
   content: ScreenContent | null;
};

export type ScreenContent = z.infer<typeof ScreenContentSchema>;

export type ScreenWebsiteContent = z.infer<typeof ScreenWebsiteContentSchema>;

export type ScreenshareContent = z.infer<typeof ScreenShareContentSchema>;

export type ScreenControlledVideo = z.infer<typeof ScreenControlledVideoSchema>;
