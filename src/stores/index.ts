import { ErrorCode, VottConversionError } from "../models/error";
import { VottProjectSetting } from "../models/vottSetting";
import IVottUseCase from "../usecases/interface";
import { IStore } from "./interface";
import { initialState, LoadingState, State } from "./model";

class Store implements IStore {
  private state: State;
  private usecase: IVottUseCase;
  private onUpdated?: (state: State) => void;

  public constructor(usecase: IVottUseCase) {
    this.state = initialState;
    this.usecase = usecase;
  }

  public currentState = (): State => this.state;

  private dispatchUpdate() {
    if (this.onUpdated) {
      this.onUpdated(this.state);
    }
  }

  public updateLoading = (loading: LoadingState, errorCode?: ErrorCode) => {
    this.state.loading = loading;
    if (errorCode) {
      this.state.errorCode = errorCode;
    }
    this.dispatchUpdate();
  };

  public updateVottProjectSetting = (setting: VottProjectSetting) => {
    this.state.setting = setting;
    this.dispatchUpdate();
  };

  public updateVottFile = (file: File) => {
    this.state.vottFile = file;
    this.dispatchUpdate();
  };

  public runConvertAsync = async (): Promise<void> => {
    const { setting, vottFile } = this.state;
    if (!vottFile) {
      this.updateLoading(LoadingState.Error);
      return;
    }

    this.updateLoading(LoadingState.Loading);
    try {
      const { securityToken, sourceConnection, targetConnection } = setting;
      if (!sourceConnection || !targetConnection) {
        return;
      }
      const inputSetting = {
        securityToken,
        sourceConnection,
        targetConnection,
      };
      await this.usecase.migrateProject(vottFile, inputSetting);
      this.updateLoading(LoadingState.Success);
    } catch (e) {
      if (e instanceof VottConversionError) {
        this.updateLoading(LoadingState.Error, e.errorCode);
      } else {
        this.updateLoading(LoadingState.Error);
      }
    }
  };

  public addOnUpdated = (handler?: (state: State) => void) => {
    this.onUpdated = handler;
  };
}

export default Store;
