import { ErrorCode } from "../models/error";
import { VottProjectSetting } from "../models/vottSetting";
import { LoadingState, State } from "./model";

export interface IStore {
  currentState: () => State;

  updateLoading: (loading: LoadingState, errorCode?: ErrorCode) => void;
  updateVottProjectSetting: (setting: VottProjectSetting) => void;
  updateVottFile: (file: File) => void;

  runConvertAsync: () => Promise<void>;

  addOnUpdated: (handler?: (state: State) => void) => void;
}
