import level from "level";
import { ScreenDto } from "./shared/Screen";

// 1) Create our database, supply location and options.
//    This will create or open the underlying store.
const db = level("db");

export async function getAllScreens(): Promise<ScreenDto[]> {
  const result = [];

  for await (const [, value] of db.iterator() as any) {
    result.push(JSON.parse(value));
  }

  return result;
}

export async function setScreen(screen: ScreenDto): Promise<void> {
  db.put(screen.name, JSON.stringify(screen));
}

export async function deleteScreen(name: string): Promise<void> {
  db.del(name);
}
