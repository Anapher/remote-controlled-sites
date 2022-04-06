import { ScreenContent, ScreenDto } from './shared/Screen';

const screenContent = new Map<string, ScreenContent>();

/**
 * Get the content of a screen, keeping in memory data
 * @param screen the screen reference
 * @returns the content that should currently be displayed on the screen
 */
export function getScreenContent(screen: ScreenDto): ScreenContent | null {
   const currentContent = screenContent.get(screen.name);
   if (currentContent) return currentContent;

   if (screen.defaultContent) return { type: 'url', url: screen.defaultContent };

   return null;
}
