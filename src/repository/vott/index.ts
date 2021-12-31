import * as md5 from "md5";
import IDownloader from "../../views/downloader/interface";
import IVottFileProvider from "../../datastore/vottFileProvider/interface";
import IZipFileProvider from "../../datastore/zipFileProvider/interface";
import { VottModel, VottProviderType } from "../../models/vottProject";
import { IVottProvider, VottAssetMapper } from "./interface";
import { VottProjectSetting, VottConnectionSetting, VottConnectionSettingItem } from "../../models/vottSetting";
import { encryptObject } from "../../libs/crypto";
import { VottAssetItem, VottAssetType } from "../../models/vottAsset";
import { ErrorCode, VottConversionError } from "../../models/error";

export default class VottProvider implements IVottProvider {
  private zipFileProvider: IZipFileProvider;
  private vottFileProvider: IVottFileProvider;
  private downloader: IDownloader;

  public constructor(zipFileProvider: IZipFileProvider, vottFileProvider: IVottFileProvider, downloader: IDownloader) {
    this.zipFileProvider = zipFileProvider;
    this.vottFileProvider = vottFileProvider;
    this.downloader = downloader;
  }

  private createNewAssetItem(
    srcTarget: VottAssetItem,
    newDirName: string,
    pathDelimiter: string,
    azureSas?: string
  ): VottAssetItem {
    const { type, name, timestamp, parent } = srcTarget;
    const baseName = name.split("?")[0].split("#")[0];

    const newParent = parent ? this.createNewAssetItem(parent, newDirName, pathDelimiter, azureSas) : undefined;
    if (type === VottAssetType.Image || type === VottAssetType.Video) {
      const path = azureSas ? `${baseName}${azureSas}` : baseName;
      const newPath = `${newDirName}${pathDelimiter}${path}`;
      const result: VottAssetItem = {
        ...srcTarget,
        id: md5(newPath),
        name,
        path: newPath,
      };
      if (newParent) {
        result.parent = newParent;
      }
      return result;
    }
    if (type === VottAssetType.VideoFrame) {
      const newBaseName = azureSas ? `${baseName}${azureSas}` : baseName;
      const newName = `${newBaseName}#t=${timestamp}`;
      const newPath = `${newDirName}${pathDelimiter}${newName}`;
      const result: VottAssetItem = {
        ...srcTarget,
        id: md5(newPath),
        name: newName,
        path: newPath,
      };
      if (newParent) {
        result.parent = newParent;
      }
      return result;
    }
    throw new VottConversionError(ErrorCode.InvalidAssetType);
  }

  public mappingNewAssets(vottModel: VottModel, setting: VottProjectSetting): VottAssetMapper {
    const mapper: VottAssetMapper = {};
    const { sourceConnection } = setting;
    const newDirPath = (() => {
      if (sourceConnection.azureBlobSetting) {
        const { accountName, containerName } = sourceConnection.azureBlobSetting;
        return `https://${accountName}.blob.core.windows.net/${containerName}`;
      }
      if (sourceConnection.localFileSetting) {
        return `file:${sourceConnection.localFileSetting.folderPath}`;
      }
      throw new VottConversionError(ErrorCode.InvalidFileProvider);
    })();
    const isWindowsFileSystem = /^[A-Z]:(¥[^¥ ]*[^¥])+$/g.test(sourceConnection.localFileSetting?.folderPath ?? "");
    const pathDelimiter = isWindowsFileSystem ? "¥" : "/";
    vottModel.assets.forEach((assetParent) => {
      const { asset } = assetParent;
      mapper[asset.id] = {
        ...assetParent,
        asset: this.createNewAssetItem(asset, newDirPath, pathDelimiter, sourceConnection.azureBlobSetting?.sas),
      };
    });
    return mapper;
  }

  private static createConnection(connection: VottConnectionSetting): VottConnectionSettingItem {
    if (connection.localFileSetting) {
      return connection.localFileSetting;
    }
    if (connection.azureBlobSetting) {
      return connection.azureBlobSetting;
    }
    throw new VottConversionError(ErrorCode.InvalidFileProvider);
  }

  private static toFileProvider(connection: VottConnectionSetting): VottProviderType {
    return connection.azureBlobSetting ? "azureBlobStorage" : "localFileSystemProxy";
  }

  // eslint-disable-next-line class-methods-use-this
  public updateProject(vottModel: VottModel, mapper: VottAssetMapper, setting: VottProjectSetting): VottModel {
    const { project } = vottModel;
    project.assets = {};
    Object.values(mapper).forEach((v) => {
      project.assets[v.asset.id] = v.asset;
    });
    project.lastVisitedAssetId = mapper[project.lastVisitedAssetId].asset.id;

    const { securityToken, sourceConnection, targetConnection } = setting;

    const source = VottProvider.createConnection(sourceConnection);
    const target = VottProvider.createConnection(targetConnection);
    const sourceConnectionEncrypted = encryptObject(source, securityToken);
    const targetConnectionEncrypted = encryptObject(target, securityToken);

    project.sourceConnection = {
      providerType: VottProvider.toFileProvider(sourceConnection),
      providerOptions: {
        encrypted: sourceConnectionEncrypted,
      },
    };
    project.targetConnection = {
      providerType: VottProvider.toFileProvider(targetConnection),
      providerOptions: {
        encrypted: targetConnectionEncrypted,
      },
    };
    return {
      project,
      assets: Object.values(mapper),
    };
  }

  public async saveAsync(vottModel: VottModel): Promise<void> {
    const files = this.vottFileProvider.toFiles(vottModel);
    const file = await this.zipFileProvider.compress(files, "vott_migrated.zip").catch(() => {
      return Promise.reject(new VottConversionError(ErrorCode.CompressionFailed));
    });
    return this.downloader.download(file);
  }

  public async loadAsync(zipFile: File): Promise<VottModel> {
    const files = await this.zipFileProvider.uncompress(zipFile).catch(() => {
      return Promise.reject(new VottConversionError(ErrorCode.InvalidZipFile));
    });
    return this.vottFileProvider.loads(files);
  }
}
