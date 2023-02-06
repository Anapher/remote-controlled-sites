import axios from 'axios';
import { ScreenContent, ScreenDto, ScreenInfo } from '../shared/Screen';
import { ScreensResponse } from '../shared/ws-server-messages';

export async function fetchScreen({ screenName }: { screenName: string }): Promise<ScreenInfo> {
   const result = await axios.get(`/api/screen/${screenName}`);
   return result.data;
}

export async function fetchAllScreens(): Promise<ScreensResponse> {
   const result = await axios.get(`/api/screen`);
   return result.data;
}

export async function setScreenContent({
   token,
   screenName,
   content,
}: {
   token: string;
   screenName: string;
   content: ScreenContent;
}): Promise<ScreenInfo> {
   const result = await axios.post(`/api/screen/${screenName}/content`, content, {
      headers: { Authorization: 'Bearer ' + token },
   });
   return result.data;
}

export async function createScreen({ token, dto }: { token: string; dto: ScreenDto }): Promise<ScreenInfo> {
   const result = await axios.put(`/api/screen/${dto.name}`, dto, {
      headers: { Authorization: 'Bearer ' + token },
   });
   return result.data;
}

export async function deleteScreen({ token, screenName }: { token: string; screenName: string }): Promise<ScreenInfo> {
   const result = await axios.delete(`/api/screen/${screenName}`, {
      headers: { Authorization: 'Bearer ' + token },
   });
   return result.data;
}
