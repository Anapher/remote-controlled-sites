import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  REQUEST_ALL_SCREENS,
  RESPONSE_ALL_SCREENS,
  ScreensResponse,
} from "../shared/ws-server-messages";
import { io, Socket } from "socket.io-client";
import { setScreens } from "../features/admin/slice";

export default function useAdminWs(password: string | null): {
  socket: Socket | null;
  connected: boolean;
  connectionError: boolean;
} {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<boolean>(false);

  useEffect(() => {
    if (!password) return;

    console.log("try to connect admin socket");

    const sock = io({ auth: { token: password } });

    const allScreensHandler = (data: ScreensResponse) => {
      dispatch(setScreens(data.screens));
    };

    const connectedHandler = () => {
      setConnected(true);
    };

    const disconnectedHandler = () => {
      setConnected(false);
    };

    const connectionErrorHandler = () => {
      setConnectionError(true);
      setConnected(false);
    };

    sock.on(RESPONSE_ALL_SCREENS, allScreensHandler);

    sock.io.on("open", connectedHandler);
    sock.io.on("close", disconnectedHandler);
    sock.io.on("close", connectionErrorHandler);

    setSocket(sock);
    setConnected(false);
    setConnectionError(false);

    return () => {
      sock.disconnect();
      sock.off(RESPONSE_ALL_SCREENS, allScreensHandler);
      sock.io.off("open", connectedHandler);
      sock.io.off("close", disconnectedHandler);
      sock.io.off("close", connectionErrorHandler);
    };
  }, [password, dispatch]);

  return { socket, connected, connectionError };
}

export function sendRequestScreens(socket: Socket) {
  socket.emit(REQUEST_ALL_SCREENS);
}
