import { VottAsset, VottAssetItem } from "./vottAsset";

export const VottProviderType = {
  Local: "localFileSystemProxy",
  Azure: "azureBlobStorage",
} as const;
export type VottProviderType = (typeof VottProviderType)[keyof typeof VottProviderType];

export interface VottConnection {
  providerType: VottProviderType;
  providerOptions: {
    encrypted: string;
  };
}

export type VottAssetIdHash = { [id: string]: VottAssetItem };

// *-asset.json's asset is equivalent to *.vott's assets values.
// The latter is not needed to proceed.
export type VottProject = {
  name: string;
  sourceConnection: VottConnection;
  targetConnection: VottConnection;
  lastVisitedAssetId: string;
  assets: VottAssetIdHash;
};

export type VottModel = {
  project: VottProject;
  assets: VottAsset[];
};
