import React, { useEffect, useState } from "react";
import useAdminWs from "../../../app/useAdminWs";
import ErrorScreen from "../../../components/ErrorScreen";
import Loading from "../../../components/Loading";
import AuthorizedIndex from "./AuthorizedIndex";

export default function AdminIndex() {
  const [password, setPassword] = useState<string | null>(null);
  const { socket, connected, connectionError } = useAdminWs(password);

  useEffect(() => {
    const pw = prompt("Bitte geben Sie das Passwort ein");
    setPassword(pw);
  }, []);

  if (connectionError)
    return <ErrorScreen message="Ein Verbindungsfehler ist aufgetreten" />;

  if (!connected || !socket) return <Loading message="Verbinde..." />;

  return <AuthorizedIndex socket={socket} />;
}
