import level from 'level';
import { ScreenDto } from './shared/Screen';

const db = level('db');

export async function getAllScreens(): Promise<ScreenDto[]> {
   const result = [];

   for await (const [, value] of db.iterator() as any) {
      result.push(JSON.parse(value));
   }

   return result;
}

export async function setScreen(screen: ScreenDto): Promise<void> {
   await db.put(screen.name, JSON.stringify(screen));
}

export async function deleteScreen(name: string): Promise<void> {
   await db.del(name);
}

export async function getScreen(name: string): Promise<ScreenDto> {
   return db.get(name);
}
