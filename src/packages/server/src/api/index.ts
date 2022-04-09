import { Express } from 'express';
import WebRtcManager from '../webrtc/webrtc-manager';
import configureAuth from './auth-controller';
import configureWebRtc from './webrtc-controller';
import configureScreen from './screen-controller';

/**
 * configure api endpoints on the express server
 * @param app a reference to the express server
 */
export function configureApi(app: Express, manager: WebRtcManager) {
   configureAuth(app);
   configureWebRtc(app, manager);
   configureScreen(app);
}
