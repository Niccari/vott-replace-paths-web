import { VottAsset } from "../../models/vottAsset";
import { VottModel } from "../../models/vottProject";
import { VottProjectSetting } from "../../models/vottSetting";

export type VottAssetMapper = { [id: string]: VottAsset };

export interface IVottProvider {
  loadAsync(zipFile: File): Promise<VottModel>;
  mappingNewAssets(vottModel: VottModel, setting: VottProjectSetting): VottAssetMapper;
  updateProject(vottModel: VottModel, mapper: VottAssetMapper, setting: VottProjectSetting): VottModel;
  saveAsync(vottModel: VottModel): Promise<void>;
}
