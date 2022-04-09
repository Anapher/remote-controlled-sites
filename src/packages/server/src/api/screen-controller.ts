import { Express } from 'express';
import { authenticateToken } from '../auth';
import { getScreenInfo } from '../screen-content-manager';
import { ScreenSchema } from '../shared/Screen';

export default function configureApi(app: Express) {
   app.get('/api/screen/:name', authenticateToken, async (req, resp) => {
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
}
