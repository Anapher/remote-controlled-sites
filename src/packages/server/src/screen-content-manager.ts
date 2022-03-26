import { ScreenContent, ScreenDto } from "./shared/Screen";

const screenContent = new Map<string, ScreenContent>();

export function getScreenContent(screen: ScreenDto): ScreenContent | null {
  const currentContent = screenContent.get(screen.name);
  if (currentContent) return currentContent;

  if (screen.defaultContent) return { type: "url", url: screen.defaultContent };

  return null;
}
