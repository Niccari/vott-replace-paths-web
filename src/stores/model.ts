import { ErrorCode } from "../models/error";
import { VottProjectSetting } from "../models/vottSetting";

export const LoadingState = {
  Init: 1,
  Loading: 2,
  Error: 3,
  Success: 4,
} as const;
export type LoadingState = typeof LoadingState[keyof typeof LoadingState];

export interface State {
  loading: LoadingState;
  setting: VottProjectSetting;
  vottFile?: File;
  errorCode?: ErrorCode;
}

export const initialState: State = {
  loading: LoadingState.Init,
  setting: {
    securityToken: "",
    sourceConnection: {},
    targetConnection: {},
  },
};
