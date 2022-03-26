import {
  REQUEST_ALL_SCREENS,
  REQUEST_DEL_SCREEN,
  REQUEST_PUT_SCREEN,
  RESPONSE_ALL_SCREENS,
  ScreensResponse,
} from "./shared/ws-server-messages";
import { Express } from "express";
import http from "http";
import { Server } from "socket.io";
import { ADMIN_PASSWORD } from "./config";
import { deleteScreen, getAllScreens, setScreen } from "./database";
import { ScreenDto, ScreenInfo, ScreenSchema } from "./shared/Screen";
import { getScreenContent } from "./screen-content-manager";

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
    io.emit(RESPONSE_ALL_SCREENS, response);
  };

  io.on("connection", (socket) => {
    console.log("a user connected");

    if (socket.data.admin) {
      console.log("listen for admin events");

      socket.on(REQUEST_ALL_SCREENS, async () => {
        socket.emit(RESPONSE_ALL_SCREENS, await getScreenResponse());
      });

      socket.on(REQUEST_PUT_SCREEN, async (screenDto: ScreenDto) => {
        console.log("put screen", screenDto);

        const result = ScreenSchema.parse(screenDto);
        await setScreen(result);
        updateScreens();
      });

      socket.on(REQUEST_DEL_SCREEN, async (name: string) => {
        const result = ScreenSchema.parse({ name });
        await deleteScreen(result.name);
        updateScreens();
      });
    }
  });

  return server;
}
