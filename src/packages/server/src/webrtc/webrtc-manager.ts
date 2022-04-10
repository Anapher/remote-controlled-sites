import config from '../config';
import { InitializeConnectionRequest } from '../shared/webrtc-types';
import ClientMessenger from './client-messenger';
import MediaSoupWorkers from './media-soup-workers';
import Room from './room';

/**
 * Manage webrtc rooms
 */
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

   /**
    * Get the room of a user
    * @param userId the user id
    * @returns return the room or null if the user does not currently belong to a room
    */
   async getRoomOfUser(userId: string): Promise<Room | null> {
      const roomId = this.userToRoom.get(userId);
      if (!roomId) return null;

      const room = this.rooms.get(roomId);
      if (!room) return null;

      return await room;
   }

   /**
    * Join user to a room, creating it if the room does not exist
    */
   async joinRoom(roomId: string, userId: string): Promise<void> {
      const existingRoom = this.userToRoom.get(userId);
      if (existingRoom) {
         // remove user from current room
         const room = await this.rooms.get(existingRoom);
         if (room) {
            await room.removeUser(userId);
         }

         this.userToRoom.delete(userId);
      }

      let room = this.rooms.get(roomId);
      if (!room) {
         room = this.createRoom(roomId);
         this.rooms.set(roomId, room);
      }

      const resolved = await room;
      resolved.addUser(userId);
      this.userToRoom.set(userId, roomId);
   }

   /**
    * Remove a user from a room, deleting the room if it's empty
    * @param userId user id
    */
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
