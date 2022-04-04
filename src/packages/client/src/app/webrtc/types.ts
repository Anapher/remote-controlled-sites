export type RestClientWebRtc = {
   getRouterCapabilities(): Promise<SuccessOrError<RtpCapabilities>>;

   initializeConnection(request: InitializeConnectionRequest): Promise<SuccessOrError>;

   createTransport(request: CreateTransportRequest): Promise<SuccessOrError<CreateTransportResponse>>;

   connectTransport(request: ConnectTransportRequest): Promise<SuccessOrError>;

   transportProduce(request: TransportProduceRequest): Promise<SuccessOrError<TransportProduceResponse>>;

   changeStream(request: ChangeStreamRequest): Promise<SuccessOrError>;

   setConsumerLayers(request: SetPreferredLayersRequest): Promise<SuccessOrError>;
};
