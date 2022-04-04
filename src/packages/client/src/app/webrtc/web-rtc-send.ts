import debug from "debug";
import { Socket } from "socket.io-client";
import { RestClientWebRtc } from "./types";
import { WebRtcConnection } from "./WebRtcConnection";

const log = debug("webrtc:createConnectionSend");

export default async function connectWebRtc(
  rest: RestClientWebRtc,
  socket: Socket
): Promise<WebRtcConnection> {
  const connection = new WebRtcConnection(socket, rest);

  const device = connection.device;

  const rtpResult = await rest.getRouterCapabilities();
  if (!rtpResult?.success)
    throw new Error("Router capabilities could not be retrived from server.");
  log("Received router capabilities %O", rtpResult);

  await device.load({ routerRtpCapabilities: rtpResult.response });

  const result = await rest.initializeConnection({
    sctpCapabilities: device.sctpCapabilities,
    rtpCapabilities: device.rtpCapabilities,
  });

  if (!result.success) {
    throw new Error("Initialize connection failed, empty result.");
  }

  log("Initialized device");

  return connection;
}
