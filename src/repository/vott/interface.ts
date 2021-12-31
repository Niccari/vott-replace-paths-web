import { VottModel } from "../../models/vottProject";
import { VottProjectSetting } from "../../models/vottSetting";

interface IVottProvider {
  loadAsync(zipFile: File): Promise<VottModel>;
  convertAsync(vottModel: VottModel, setting: VottProjectSetting): Promise<VottModel>;
  saveAsync(vottModel: VottModel): Promise<void>;
}

export default IVottProvider;
