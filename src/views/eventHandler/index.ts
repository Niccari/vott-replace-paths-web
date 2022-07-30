import { parseUrlToSetting, VottProjectSetting } from "../../models/vottSetting";
import { IStore } from "../../stores/interface";
import { IEventHandler } from "./interface";

class EventHandler implements IEventHandler {
  private store: IStore;

  public constructor(store: IStore) {
    this.store = store;

    this.addFileSubmitEvent();

    this.findElement<HTMLInputElement>("securityToken")?.addEventListener("input", this.onFormValueChanged);
    this.findElement<HTMLInputElement>("sourceConnection")?.addEventListener("input", this.onFormValueChanged);
    this.findElement<HTMLInputElement>("targetConnection")?.addEventListener("input", this.onFormValueChanged);
    this.findElement<HTMLInputElement>("submit")?.addEventListener("click", this.onSubmit);
  }

  // eslint-disable-next-line class-methods-use-this
  private findElement = <T extends HTMLElement>(id: string): T | null => document.querySelector(`#${id}`) as T | null;

  private addFileSubmitEvent() {
    const tag = this.findElement<HTMLElement>("inputZip");
    if (!tag) {
      return;
    }

    const retrieveFile = (e: Event): void => {
      const files = (e.target as HTMLInputElement | null)?.files;
      if (!files) {
        return;
      }
      this.store.updateVottFile(files[0]);
    };
    tag.addEventListener("change", retrieveFile);
    tag.addEventListener("dragstart", retrieveFile);
  }

  private readSettings = (): VottProjectSetting => {
    const securityToken = this.findElement<HTMLInputElement>("securityToken")?.value ?? "";
    const sourceConnectionPath = this.findElement<HTMLInputElement>("sourceConnection")?.value ?? "";
    const targetConnectionPath = this.findElement<HTMLInputElement>("targetConnection")?.value ?? "";

    const sourceConnection = parseUrlToSetting(sourceConnectionPath);
    const targetConnection = parseUrlToSetting(targetConnectionPath);
    return {
      securityToken,
      sourceConnection,
      targetConnection,
    };
  };

  private onFormValueChanged = () => {
    const setting = this.readSettings();
    this.store.updateVottProjectSetting(setting);
  };

  private onSubmit = () => {
    this.store.runConvertAsync();
  };
}

export default EventHandler;
