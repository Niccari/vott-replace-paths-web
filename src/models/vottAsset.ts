export const VottAssetType = {
  Image: 1,
  Video: 2,
  VideoFrame: 3,
} as const;
export type VottAssetType = (typeof VottAssetType)[keyof typeof VottAssetType];

export type VottAssetItem = {
  id: string;
  type: VottAssetType;
  path: string;
  name: string;
  timestamp?: number;
  parent?: VottAssetItem;
};

export type VottAsset = {
  asset: VottAssetItem;
};
