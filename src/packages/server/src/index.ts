import express from 'express';
import { configureApi } from './api';
import MediaSoupWorkers from './webrtc/media-soup-workers';
import configureWebSockets from './websockets';
import config from './config';
import WebRtcManager from './webrtc/webrtc-manager';
import { Server } from 'socket.io';
import http from 'http';
import SocketIoClientMessenger from './websockets/socketio-client-messenger';
import { getScreenInfo, setScreenContent } from './screen-content-manager';
import { SCREEN_UPDATED } from './shared/ws-server-messages';
import path from 'path';

main();

async function main() {
   const workers = new MediaSoupWorkers();
   await workers.run(config.mediasoup.numWorkers, config.mediasoup.workerSettings);

   const app = express();
   app.use(express.json());
   app.use(express.static('client'));

   const server = http.createServer(app);
   const io = new Server(server);

   const updateRoomScreenShare = async (name: string, sharing: boolean) => {
      console.log('update screen share', name, sharing);

      if (sharing) {
         setScreenContent(name, { type: 'screenshare' });
      } else {
         setScreenContent(name, undefined);
      }

      io.emit(SCREEN_UPDATED, await getScreenInfo(name));
   };

   const manager = new WebRtcManager(workers, new SocketIoClientMessenger(io), updateRoomScreenShare);

   configureApi(app, io, manager);
   configureWebSockets(io, manager);

   app.get('*', function (request, response) {
      response.sendFile(path.resolve(__dirname, '..', 'client', 'index.html'));
   });

   server.listen(config.http.port, () =>
      console.log(`Server is running on port: http://localhost:${config.http.port}`),
   );
}
