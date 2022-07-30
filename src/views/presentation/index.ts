import { ErrorCode } from "../../models/error";
import { VottConnectionSetting } from "../../models/vottSetting";
import { IStore } from "../../stores/interface";
import { LoadingState, State } from "../../stores/model";
import IPresentation from "./interface";

class Presentation implements IPresentation {
  // eslint-disable-next-line class-methods-use-this
  private findElement = <T extends HTMLElement>(id: string): T | null => document.querySelector(`#${id}`) as T | null;

  private toggleSubmitButtonState = (state: State) => {
    const { vottFile, setting } = state;
    const submitButton = this.findElement<HTMLInputElement>("submit");
    if (!submitButton) {
      return;
    }
    const { targetConnection, sourceConnection, securityToken } = setting;
    const isSourceValid = sourceConnection.azureBlobSetting || sourceConnection.localFileSetting;
    const isTargetValid = targetConnection.azureBlobSetting || targetConnection.localFileSetting;
    const submitable = isSourceValid && isTargetValid && securityToken.length > 0 && vottFile !== undefined;

    submitButton.disabled = !submitable;
  };

  // eslint-disable-next-line class-methods-use-this
  private toErrorMessage = (errorCode?: ErrorCode): string => {
    if (!errorCode) {
      return "";
    }
    switch (errorCode) {
      case ErrorCode.InvalidZipFile:
        return "zipファイルでないか、不正なzipファイルです";
      case ErrorCode.InvalidFileIncluded:
        return "*.vott, *-asset.json以外のファイルを削除してください";
      case ErrorCode.JSONFormatError:
        return "*.vottか*-asset.jsonファイルのフォーマットが不正です";
      case ErrorCode.InvalidFileProvider:
        return "ファイルプロバイダはローカルファイルシステムかAzure Blob Storageのみ対応しています";
      case ErrorCode.InvalidAssetType:
        return "未定義のアセット種別があります";
      case ErrorCode.ProjectNotFound:
        return "プロジェクトファイルがありません";
      case ErrorCode.CompressionFailed:
        return "変換結果ファイルの圧縮ができませんでした";
      default:
        return "不明なエラーです";
    }
  };

  private showConnectionFileProvider = (elementId: string, connection: VottConnectionSetting) => {
    const textArea = this.findElement<HTMLSpanElement>(elementId);
    if (!textArea) {
      return;
    }
    if (connection.azureBlobSetting) {
      textArea.innerText = "Azure Blob Storage";
      return;
    }
    if (connection.localFileSetting) {
      textArea.innerText = "ローカルファイルシステム";
      return;
    }
    textArea.innerText = "";
  };

  private showLoadingState = (state: State) => {
    const { loading, errorCode } = state;
    const loadingStateElement = this.findElement<HTMLSpanElement>("loadingState");
    if (!loadingStateElement) {
      return;
    }
    switch (loading) {
      case LoadingState.Init:
        loadingStateElement.innerText = "";
        break;
      case LoadingState.Loading:
        loadingStateElement.innerText = "⏳";
        break;
      case LoadingState.Success:
        loadingStateElement.innerText = "✅";
        break;
      case LoadingState.Error:
        loadingStateElement.innerText = `❌ ${this.toErrorMessage(errorCode)}`;
        break;
      default:
        loadingStateElement.innerText = "❓";
        break;
    }
  };

  private onStoreUpdated = (state: State) => {
    this.toggleSubmitButtonState(state);
    this.showConnectionFileProvider("targetConnectionFileProvider", state.setting.targetConnection);
    this.showConnectionFileProvider("sourceConnectionFileProvider", state.setting.sourceConnection);
    this.showLoadingState(state);
  };

  public listenStoreUpdate(store: IStore) {
    store.addOnUpdated(this.onStoreUpdated);
  }
}

export default Presentation;
