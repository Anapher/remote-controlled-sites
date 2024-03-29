import level from 'level';
import { ScreenDto } from './shared/Screen';
import Logger from './utils/logger';

const db = level('db');
const logger = new Logger('database');

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

export async function getScreen(name: string): Promise<ScreenDto | null> {
   try {
      const json = await db.get(name);
      if (!json) return null;

      return JSON.parse(json as string);
   } catch (error) {
      logger.warn(error);
      return null;
   }
}
