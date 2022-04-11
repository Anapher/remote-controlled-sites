import axios, { Axios } from 'axios';
import { RtpCapabilities } from 'mediasoup-client/lib/RtpParameters';
import { SuccessOrError } from '../shared/communication-types';
import {
   InitializeConnectionRequest,
   CreateTransportRequest,
   CreateTransportResponse,
   ConnectTransportRequest,
   TransportProduceRequest,
   TransportProduceResponse,
   ChangeStreamRequest,
   SetPreferredLayersRequest,
} from '../shared/webrtc-types';
import { RestClientWebRtc } from '../app/webrtc/types';
export default class TokenRestClient implements RestClientWebRtc {
   private ax: Axios;

   constructor(token: string) {
      this.ax = axios.create({ headers: { Authorization: 'Bearer ' + token } });
   }

   async getRouterCapabilities(): Promise<SuccessOrError<RtpCapabilities>> {
      const response = await this.ax.get('/api/webrtc/router-capabilities');
      return { success: true, response: response.data };
   }

   async initializeConnection(request: InitializeConnectionRequest): Promise<SuccessOrError<never>> {
      const response = await this.ax.post('/api/webrtc/initialize-connection', request);
      return response.data;
   }
   async createTransport(request: CreateTransportRequest): Promise<SuccessOrError<CreateTransportResponse>> {
      const response = await this.ax.post('/api/webrtc/create-transport', request);
      return response.data;
   }
   async connectTransport(request: ConnectTransportRequest): Promise<SuccessOrError<never>> {
      const response = await this.ax.post('/api/webrtc/connect-transport', request);
      return response.data;
   }
   async transportProduce(request: TransportProduceRequest): Promise<SuccessOrError<TransportProduceResponse>> {
      const response = await this.ax.post('/api/webrtc/transport-produce', request);
      return response.data;
   }
   changeStream(request: ChangeStreamRequest): Promise<SuccessOrError<never>> {
      throw new Error('Method not implemented.');
   }
   setConsumerLayers(request: SetPreferredLayersRequest): Promise<SuccessOrError<never>> {
      throw new Error('Method not implemented.');
   }
}
