import { Express } from 'express';
import { generateAccessToken } from '../auth';
import config from '../config';
import { randomUUID } from 'crypto';

/**
 * configure api methods used for authentication.
 * Everyone has to authenticate to receive a user id, so the server can track the users and remove them
 * if they disconnect. Also, as http and websockets are used simultaneously, we need to track individual users
 * @param app a reference to the express server
 */
export default function configureApi(app: Express) {
   // configure the admin auth method where we check the password and add admin=true to the jwt if successful
   app.post('/api/auth/admin', (res, resp) => {
      const password = res.body.password as string;
      if (password === config.api.password) {
         resp.json({
            token: generateAccessToken({ id: getUserId(), admin: true }),
         });
      } else {
         resp.sendStatus(401);
      }
   });

   // anyone can normally authenticate and be assigned a user id
   app.post('/api/auth', (_, resp) => {
      resp.json({ token: generateAccessToken({ id: getUserId() }) });
   });

   app.get('/api/auth/time', (_, resp) => {
      resp.json({ time: new Date().getTime() });
   });
}

/**
 * Get a new unique user id
 * @returns a unique id for a user
 */
function getUserId() {
   return randomUUID();
}
