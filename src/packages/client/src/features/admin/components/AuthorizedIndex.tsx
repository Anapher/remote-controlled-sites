import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Socket } from "socket.io-client";
import { sendRequestScreens } from "../../../app/useAdminWs";
import { selectScreens } from "../slice";

type Props = {
  socket: Socket;
};

export default function AuthorizedIndex({ socket }: Props) {
  const screens = useSelector(selectScreens);

  useEffect(() => {
    sendRequestScreens(socket);
  }, [socket]);

  return <div>AuthorizedIndex</div>;
}
