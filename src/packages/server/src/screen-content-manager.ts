import { getScreen } from './database';
import { ScreenContent, ScreenDto, ScreenInfo } from './shared/Screen';

const screenContent = new Map<string, ScreenContent>();

export function setScreenContent(name: string, content?: ScreenContent) {
   if (content) screenContent.set(name, content);
   else screenContent.delete(name);
}

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

export async function getScreenInfo(name: string): Promise<ScreenInfo | null> {
   const screen = await getScreen(name);
   if (!screen) {
      return null;
   }

   return {
      ...screen,
      content: getScreenContent(screen),
   };
}
