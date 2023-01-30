# Remote Controlled Sites

## About the project
We were interested about how to make online learning more enjoyable and interactive for students. During our search, we discovered the [Vircadia](https://vircadia.com/) project, an open source metaverse that allows to have more natural conversations and hold presentations. Vircadia provides a simple web entity object that is basically a browser for the user. For our use case, we needed screen share capabilities that are easy to use, which resulted in this project. A user can "create" websites (called screens) that load an iframe by default and the user can easily start screensharing to replace any of these websites with his screen. It was important that no interaction by a user inside the game is required.

## Getting Started
### Running on localhost with Docker Compose
1. Clone the repo
   ```sh
   git clone https://github.com/Anapher/remote-controlled-sites.git
   ```
   
2. Got to src directory
   ```sh
   cd src/
   ```

3. Start docker-compose
   ```sh
   docker-compose up --build
   ```

Default password is `test` for the admin panel, just go to `http://localhost:4000`

### Notes for production environments
- Change the password and token secret in `packages/server/config.ts`
- Use `docker-compose.prod.yml` which has as `network_mode` [host](https://docs.docker.com/network/host/) configured as Docker has problems exporting large port ranges, which are needed for mediasoup
- Configure in `.env` the startup parameters, especially the `ANNOUNCED_IP` as the ip address of the server (not the domain name, it must be an ip address!)
- Forward the port for the frontend and especially forward the mediasoup ports for tcp and udp

## Infrastructure and Design
To transmit a video from and to other browsers without the use of plugins, the [WebRTC](https://webrtc.org/) standard can be used. Unfortunately, this standard only allows peer-to-peer connections, which is not feasible for a bigger amount of users (many websites cite 6 users as maximum), as the participant providing the video stream has to transmit it to everyone himself. In order to skip this limitation, an SFU can be used, which acts as a central server that distributes the streams. For this tool, [Mediasoup](https://mediasoup.org/) was selected as the SFU.

As Mediasoup provides JavaScript bindings, the development backend is coded in TypeScript with an express.js server. Socket.io is used as a WebSocket wrapper to push events to the clients (for example when screen share started). Another problem that had to be solved is that WebRTC does not notice if connections drop, potentially leading to memory leaks. This was solved by assigning user ids by providing [JWTs](https://jwt.io/) that are required for socket and http connections. This way, for every request, the server can identify the user. As socket.io does notice when connections drop (by a heartbeat mechanism), the server requires the user to first connect the websocket before a webrtc connection can be established. If the socket connections drops, the user is automatically removed from webrtc.

For the frontend, React together with TypeScript and [MUI](https://mui.com/) as design framework were selected, as they provide a convenient way to create a user friendly application.

## Mediasoup
I want to add a few words about mediasoup. Usually the documentation is of course the best way to understand a library, but mediasoup can be quite confusing and it took me some time to understand it. So here is a short overview:

The smallest unit is a stream, which can be a single audio (e. g. microphone) or video (e. g. webcam or screen). To send a stream, the sender has to create a producer for that stream. On the server site, after the producer is initialized, consumers can be created for other clients to receive the stream.

To create consumers or producers, you need a transport which is suitable, meaning for producing a send transport is required and for consuming a receive transport is needed. The mediasoup-mixer class written by me is taking care of consuming producers, basically you just add receive transports and producers and the consumers are automatically created for every transport.

To initialize transports, you need a router on the server site. Only transports connected to the same router can consume each other.

To create a router, you need a worker, which is basically a wrapper for a mediasoup process. We take the naive approach to create as many workers as we have cores to balance to load. Routers can also be connected to each other (to balance to load of one room between multiple cores), but that was not implemented here.
