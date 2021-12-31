import { VottModel } from "../../models/vottProject";

interface IVottFileProvider {
  loads(files: File[]): Promise<VottModel>;
  toFiles(model: VottModel): File[];
}

export default IVottFileProvider;
