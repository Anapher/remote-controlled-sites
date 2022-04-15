import { RtpCapabilities } from 'mediasoup-client/lib/types';
import { SuccessOrError } from '../../shared/communication-types';
import {
   ConnectTransportRequest,
   CreateTransportRequest,
   CreateTransportResponse,
   InitializeConnectionRequest,
   TransportProduceRequest,
   TransportProduceResponse,
} from '../../shared/webrtc-types';

export type RestClientWebRtc = {
   getRouterCapabilities(): Promise<SuccessOrError<RtpCapabilities>>;

   initializeConnection(request: InitializeConnectionRequest): Promise<SuccessOrError>;

   createTransport(request: CreateTransportRequest): Promise<SuccessOrError<CreateTransportResponse>>;

   connectTransport(request: ConnectTransportRequest): Promise<SuccessOrError>;

   transportProduce(request: TransportProduceRequest): Promise<SuccessOrError<TransportProduceResponse>>;
};
