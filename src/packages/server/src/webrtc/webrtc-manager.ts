import config from '../config';
import ClientMessenger from './client-messenger';
import MediaSoupWorkers from './media-soup-workers';
import { InitializeConnectionRequest } from './request-types';
import Room from './room';

export default class WebRtcManager {
   private rooms = new Map<string, Promise<Room>>();
   private userToRoom = new Map<string, string>();

   constructor(private workers: MediaSoupWorkers, private signal: ClientMessenger) {}

   async createRoom(name: string): Promise<Room> {
      const assignedWorker = this.workers.getNextWorker();
      const mediasoupRouter = await assignedWorker.createRouter(config.router);

      return new Room(
         name,
         mediasoupRouter,
         this.signal,
         config.webRtcTransport.options,
         config.webRtcTransport.maxIncomingBitrate,
      );
   }

   async getRoomOfUser(userId: string): Promise<Room | null> {
      const roomId = this.userToRoom.get(userId);
      if (!roomId) return null;

      const room = this.rooms.get(roomId);
      if (!room) return null;

      return await room;
   }

   async joinRoom(roomId: string, req: InitializeConnectionRequest): Promise<void> {
      let room = this.rooms.get(roomId);
      if (!room) {
         room = this.createRoom(roomId);
         this.rooms.set(roomId, room);
      }

      const resolved = await room;
      resolved.addUser(req);
      this.userToRoom.set(req.connectionId, roomId);
   }

   async leaveRoom(userId: string): Promise<void> {
      const roomId = this.userToRoom.get(userId);
      if (!roomId) return;

      const room = this.rooms.get(roomId);
      if (!room) return;

      const resolved = await room;
      if (!this.rooms.has(roomId)) return;

      resolved.removeUser(userId);
      if (!resolved.hasUsers) {
         this.rooms.delete(roomId);
         resolved.close();
      }

      this.userToRoom.delete(userId);
   }
}
