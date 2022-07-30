import { ErrorCode, VottConversionError } from "../../models/error";
import { VottAsset } from "../../models/vottAsset";
import { VottModel, VottProject } from "../../models/vottProject";
import IVottFileProvider from "./interface";

export default class VottFileProvider implements IVottFileProvider {
  public async loads(files: File[]): Promise<VottModel> {
    // ignore hidden files
    const vottFiles = files.filter((file) => !file.name.startsWith("__") && !file.name.startsWith("."));
    const projectFile = VottFileProvider.findProjectFile(vottFiles);
    const assetFiles = VottFileProvider.findAssetFiles(vottFiles);

    const project = await this.loadProject(projectFile);
    const assets = await this.loadAssets(assetFiles);
    return { project, assets };
  }

  private static createNewFile(content: object, filename: string): File {
    return new File([JSON.stringify(content, null, "    ")], filename);
  }

  // eslint-disable-next-line class-methods-use-this
  public toFiles(vottModel: VottModel): File[] {
    const { project, assets } = vottModel;
    const projectFile = VottFileProvider.createNewFile(project, `${project.name}.vott`);
    const assetsFiles = assets.map((asset) => {
      const { id } = asset.asset;
      return VottFileProvider.createNewFile(asset, `${id}-asset.json`);
    });
    return assetsFiles.concat([projectFile]);
  }

  private static findProjectFile(files: File[]): File {
    const projectFile = files.find((f) => f.name.endsWith(".vott"));
    if (!projectFile) {
      throw new VottConversionError(ErrorCode.ProjectNotFound);
    }
    return projectFile;
  }

  private static findAssetFiles(files: File[]): File[] {
    return files.filter((f) => !f.name.endsWith(".vott"));
  }

  private async loadProject(file: File): Promise<VottProject> {
    return this.loadFile<VottProject>(file);
  }

  private async loadAssets(files: File[]): Promise<VottAsset[]> {
    return Promise.all(files.map(async (file) => this.loadFile<VottAsset>(file)));
  }

  // eslint-disable-next-line class-methods-use-this
  private async loadFile<T>(file: File): Promise<T> {
    const data = await file.text().catch(() => Promise.reject(new VottConversionError(ErrorCode.InvalidFileIncluded)));
    try {
      return JSON.parse(data) as T;
    } catch (e) {
      return Promise.reject(new VottConversionError(ErrorCode.JSONFormatError));
    }
  }
}
