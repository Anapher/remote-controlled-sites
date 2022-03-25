import { ScreenDto } from "./Screen";

export const REQUEST_ALL_SCREENS = "GET_SCREENS";
export const REQUEST_PUT_SCREEN = "PUT_SCREEN";
export const REQUEST_DEL_SCREEN = "DEL_SCREEN";

export const RESPONSE_ALL_SCREENS = "RETURN_SCREENS";

export type ScreensResponse = {
  screens: ScreenDto[];
};
