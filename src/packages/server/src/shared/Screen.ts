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

export type ScreenDto = z.infer<typeof ScreenSchema>;

export type ScreenInfo = ScreenDto & {
   content: ScreenContent | null;
};

export type ScreenContent = ScreenWebsiteContent | ScreenshareContent;

export type ScreenWebsiteContent = {
   type: 'url';
   url: string;
};

export type ScreenshareContent = {
   type: 'screenshare';
};

export type ScreenControlledVideo = {
   type: 'controlled-video';
   url: string;
   paused: boolean;
   startTime: string;
   startPosition: number;
};
