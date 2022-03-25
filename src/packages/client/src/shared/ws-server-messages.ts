import { ScreenDto } from "./Screen";

export const REQUEST_ALL_SCREENS = "GET_SCREENS";

export const RESPONSE_ALL_SCREENS = "RETURN_SCREENS";

export type ScreensResponse = {
  screens: ScreenDto[];
};
