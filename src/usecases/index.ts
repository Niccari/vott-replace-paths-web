import IVottProvider from "../repository/vott/interface";
import IVottUseCase from "./interface";
import { VottProjectSetting } from "../models/vottSetting";

export default class VottUseCase implements IVottUseCase {
  private vottProvider: IVottProvider;

  public constructor(vottProvider: IVottProvider) {
    this.vottProvider = vottProvider;
  }

  public async migrateProject(file: File, setting: VottProjectSetting): Promise<void> {
    try {
      const vottModel = await this.vottProvider.loadAsync(file);
      const convertedVottModel = await this.vottProvider.convertAsync(vottModel, setting);
      return await this.vottProvider.saveAsync(convertedVottModel);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
