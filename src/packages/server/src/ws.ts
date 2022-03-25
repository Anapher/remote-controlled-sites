import { REQUEST_ALL_SCREENS } from "./shared/ws-server-messages";
import { Express } from "express";
import http from "http";
import { Server } from "socket.io";
import { ADMIN_PASSWORD } from "./config";

const ADMIN_ROOM_NAME = "admin";

export default function configureWebSockets(app: Express) {
  const server = http.createServer(app);

  const io = new Server(server);

  io.use((socket, next) => {
    console.log("client connecting");

    const token = socket.handshake.auth.token as string;
    if (token) {
      if (token === ADMIN_PASSWORD) {
        socket.data.admin = true;
        socket.join(ADMIN_ROOM_NAME);
        console.log("Password accepted, admin login");
      } else {
        console.log(
          `Invalid password (given: ${token}, actual: ${ADMIN_PASSWORD})`
        );

        next(new Error("The password is wrong"));
        return;
      }
    }
    next();
  });

  io.on("connection", (socket) => {
    console.log("a user connected");

    if (socket.data.admin) {
      io.on(REQUEST_ALL_SCREENS, (callback) => {
        return [];
      });
    }
  });

  return server;
}
