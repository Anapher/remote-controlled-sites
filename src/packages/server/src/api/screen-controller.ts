import { Express } from 'express';
import { Server } from 'socket.io';
import { authenticateToken } from '../auth';
import { deleteScreen, getAllScreens, getScreen, setScreen } from '../database';
import { getScreenContent, getScreenInfo, setScreenContent } from '../screen-content-manager';
import { ScreenContent, ScreenContentSchema, ScreenInfo, ScreenSchema } from '../shared/Screen';
import { RESPONSE_ALL_SCREENS, ScreensResponse, SCREEN_UPDATED } from '../shared/ws-server-messages';
import { ADMIN_ROOM_NAME } from '../websockets/consts';

export default function configureApi(app: Express, io: Server) {
   const getScreenResponse = async () => {
      const screens = await getAllScreens();
      const screensWithContent = screens.map<ScreenInfo>((x) => ({
         ...x,
         content: getScreenContent(x),
      }));
      const response: ScreensResponse = { screens: screensWithContent };
      return response;
   };

   const updateScreens = async () => {
      const response = await getScreenResponse();
      io.to(ADMIN_ROOM_NAME).emit(RESPONSE_ALL_SCREENS, response);
   };

   app.get('/api/screen/:name', async (req, resp) => {
      const name = req.params.name;
      try {
         ScreenSchema.parse({ name });
      } catch (error) {
         resp.sendStatus(401);
         return;
      }

      const screen = await getScreenInfo(name);
      if (!screen) {
         resp.sendStatus(404);
         return;
      }

      resp.json(screen);
   });

   app.get('/api/screen/', async (_, resp) => {
      const response = await getScreenResponse();
      resp.json(response);
   });

   app.put('/api/screen/:name', authenticateToken, async (req, resp) => {
      const name = req.params.name;
      try {
         ScreenSchema.parse({ name });
      } catch (error) {
         resp.sendStatus(401);
         return;
      }

      const result = ScreenSchema.parse(req.body);

      await setScreen(result);
      updateScreens();

      io.emit(SCREEN_UPDATED, await getScreenInfo(result.name));

      resp.sendStatus(200);
   });

   app.delete('/api/screen/:name', authenticateToken, async (req, resp) => {
      const name = req.params.name;
      try {
         ScreenSchema.parse({ name });
      } catch (error) {
         resp.sendStatus(401);
         return;
      }

      await deleteScreen(name);
      updateScreens();

      resp.sendStatus(200);
   });

   app.post('/api/screen/:name/content', async (req, resp) => {
      const name = req.params.name;
      try {
         ScreenSchema.parse({ name });
      } catch (error) {
         resp.sendStatus(401);
         return;
      }

      let result: ScreenContent;
      try {
         result = ScreenContentSchema.parse(req.body.content);
      } catch (error) {
         console.error('[change screen content] Validation failed', error);
         resp.sendStatus(400);
         return;
      }

      const screen = await getScreen(name);
      if (!screen) {
         resp.sendStatus(404);
         return;
      }

      setScreenContent(name, result);

      updateScreens();
      io.emit(SCREEN_UPDATED, await getScreenInfo(name));

      resp.sendStatus(200);
   });
}
