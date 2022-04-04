import { SctpCapabilities, RtpCapabilities } from "mediasoup/node/lib/types";

export type InitializeConnectionRequest = {
  connectionId: string;
  sctpCapabilities: SctpCapabilities;
  rtpCapabilities: RtpCapabilities;
};
