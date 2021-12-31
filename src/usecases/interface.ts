import { VottProjectSetting } from "../models/vottSetting";

interface IVottUseCase {
  migrateProject(file: File, setting: VottProjectSetting): Promise<void>;
}

export default IVottUseCase;
