import axios from 'axios';

export async function authAsUser(): Promise<string> {
   const response = await axios.post('/api/auth');
   return response.data.token;
}

export async function authAsAdmin(password: string): Promise<string> {
   const response = await axios.post('/api/auth/admin', { password });
   return response.data.token;
}
export async function getServerTime(): Promise<number> {
   const response = await axios.get('/api/auth/time');
   return response.data.time;
}
