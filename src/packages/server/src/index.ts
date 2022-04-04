import express from 'express';
import { configureApi } from './api';
import MediaSoupWorkers from './webrtc/media-soup-workers';
import configureWebSockets from './websockets';
import config from './config';
import WebRtcManager from './webrtc/webrtc-manager';
import { Server } from 'socket.io';
import http from 'http';
import SocketIoClientMessenger from './websockets/socketio-client-messenger';

main();

async function main() {
   const workers = new MediaSoupWorkers();
   await workers.run(config.mediasoup.numWorkers, config.mediasoup.workerSettings);

   const app = express();
   app.use(express.json());

   const server = http.createServer(app);
   const io = new Server(server);

   const manager = new WebRtcManager(workers, new SocketIoClientMessenger(io));

   configureApi(app, manager);
   configureWebSockets(io, manager);

   server.listen(config.http.port, () =>
      console.log(`Server is running on port: http://localhost:${config.http.port}`),
   );
}
