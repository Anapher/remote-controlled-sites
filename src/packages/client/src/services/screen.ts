import axios from 'axios';
import { ScreenInfo } from '../shared/Screen';

export async function fetchScreen(token: string, screenName: string): Promise<ScreenInfo> {
   const result = await axios.get(`/api/screen/${screenName}`, { headers: { Authorization: 'Bearer ' + token } });
   return result.data;
}
