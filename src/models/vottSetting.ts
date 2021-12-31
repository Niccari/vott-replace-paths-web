export interface VottLocalFileSetting {
  folderPath: string;
}

export interface VottAzureBlobSetting {
  accountName: string;
  containerName: string;
  sas: string;
}

export type VottConnectionSettingItem = VottLocalFileSetting | VottAzureBlobSetting;

export interface VottConnectionSetting {
  localFileSetting?: VottLocalFileSetting;
  azureBlobSetting?: VottAzureBlobSetting;
}

export interface VottProjectSetting {
  securityToken: string;
  sourceConnection: VottConnectionSetting;
  targetConnection: VottConnectionSetting;
}

export const parseUrlToSetting = (url: string): VottConnectionSetting => {
  if (/^https:\/\/[a-z0-9-]{3,64}.blob.core.windows.net\/[a-z0-9-]{3,64}\?.+$/g.test(url)) {
    try {
      const accountName = url.split("/")[2].split(".")[0];
      const containerName = url.split("/")[3].split("?")[0];
      const sas = `?${url.split("/")[3].split("?")[1]}`;
      return {
        azureBlobSetting: {
          accountName,
          containerName,
          sas,
        },
      };
    } catch (e) {
      return {};
    }
  }
  const isLinuxFileSystem = /^(\/[^/ ]*[^/])+$/g.test(url);
  const isWindowsFileSystem = /^[A-Z]:(¥[^¥ ]*[^¥])+$/g.test(url);
  if (isLinuxFileSystem || isWindowsFileSystem) {
    return {
      localFileSetting: {
        folderPath: url,
      },
    };
  }
  return {};
};
