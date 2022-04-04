/**
 * The admin room name where all admins are added to automatically.
 * If a message needs to be sent to all admins, just send it to this
 * group
 */
export const ADMIN_ROOM_NAME = 'admin';

/**
 * Get the room name of a client in order to send it a message
 * @param id the client id
 */
export const ConnectionRoomName = (id: string) => `client::${id}`;
