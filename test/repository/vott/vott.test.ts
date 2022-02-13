import VottFileProvider from "../../../src/datastore/vottFileProvider";
import ZipFileProvider from "../../../src/datastore/zipFileProvider";
import { VottAsset } from "../../../src/models/vottAsset";
import { VottProviderType, VottProject, VottModel } from "../../../src/models/vottProject";
import { VottProjectSetting } from "../../../src/models/vottSetting";
import VottProvider from "../../../src/repository/vott";
import Downloader from "../../../src/views/downloader";

const zipFileProvider = new ZipFileProvider();
const vottFileProvider = new VottFileProvider();
const downloader = new Downloader();
const vottProvider = new VottProvider(zipFileProvider, vottFileProvider, downloader);

const templateLocalAssets: VottAsset[] = [
  {
    asset: {
      id: "7d47a78c6d040926f5e0fd6d3efaadff",
      type: 2,
      name: "test.mp4",
      path: "/origin/to/test.mp4",
    },
  },
  {
    asset: {
      id: "ba1a3dc605065fa25d10129c53d01135",
      type: 3,
      name: "test.mp4#t=0.1234567",
      path: "/origin/to/test.mp4#t=0.1234567",
      timestamp: 0.1234567,
      parent: {
        id: "7d47a78c6d040926f5e0fd6d3efaadff",
        type: 2,
        name: "test.mp4",
        path: "/origin/to/test.mp4",
      },
    },
  },
];

const templateAzureAssets: VottAsset[] = [
  {
    asset: {
      id: "d97d3fb5a2264eb0b47965bbddab7ecd",
      type: 2,
      name: "test.mp4",
      path: "https://hoge.blob.core.windows.net/fuga/test.mp4?piyo=111",
    },
  },
  {
    asset: {
      id: "52d893840cc8b82aa7709160b9f4e8d3",
      type: 3,
      name: "test.mp4#t=0.1234567",
      path: "https://hoge.blob.core.windows.net/fuga/test.mp4?piyo=111#t=0.1234567",
      timestamp: 0.1234567,
      parent: {
        id: "d97d3fb5a2264eb0b47965bbddab7ecd",
        type: 2,
        name: "test.mp4",
        path: "https://hoge.blob.core.windows.net/fuga/test.mp4?piyo=111",
      },
    },
  },
];

const templateProject: VottProject = {
  sourceConnection: {
    providerType: VottProviderType.Local,
    providerOptions: { encrypted: "" },
  },
  targetConnection: {
    providerType: VottProviderType.Local,
    providerOptions: { encrypted: "" },
  },
  lastVisitedAssetId: "",
  name: "",
  assets: {},
};

describe("vottProvider test", () => {
  test("local to local test", () => {
    const model: VottModel = {
      assets: templateLocalAssets,
      project: templateProject,
    };
    const config: VottProjectSetting = {
      securityToken: "",
      sourceConnection: {
        localFileSetting: {
          folderPath: "/test/test2",
        },
      },
      targetConnection: {
        localFileSetting: {
          folderPath: "",
        },
      },
    };
    const result = vottProvider.mappingNewAssets(model, config);

    const parentAsset = result["7d47a78c6d040926f5e0fd6d3efaadff"].asset;
    expect(parentAsset.id).toBe("30e59ae67dd6f97016565cdba37a40d4");
    expect(parentAsset.name).toBe("test.mp4");
    expect(parentAsset.path).toBe("file:/test/test2/test.mp4");
    expect(parentAsset.type).toBe(2);

    const videoAsset = result.ba1a3dc605065fa25d10129c53d01135.asset;
    expect(videoAsset.id).toBe("e9acd933014931e8a1e0bc8aa2079540");
    expect(videoAsset.name).toBe("test.mp4#t=0.1234567");
    expect(videoAsset.path).toBe("file:/test/test2/test.mp4#t=0.1234567");
    expect(videoAsset.type).toBe(3);
    expect(videoAsset.timestamp).toBe(0.1234567);

    expect(videoAsset.parent).toStrictEqual(parentAsset);
  });

  test("local to azure test", () => {
    const model: VottModel = {
      assets: templateLocalAssets,
      project: templateProject,
    };
    const config: VottProjectSetting = {
      securityToken: "",
      sourceConnection: {
        azureBlobSetting: {
          accountName: "hoge",
          containerName: "fuga",
          sas: "?piyo=111",
        },
      },
      targetConnection: {
        localFileSetting: {
          folderPath: "",
        },
      },
    };
    const result = vottProvider.mappingNewAssets(model, config);

    const parentAsset = result["7d47a78c6d040926f5e0fd6d3efaadff"].asset;
    expect(parentAsset.id).toBe("d97d3fb5a2264eb0b47965bbddab7ecd");
    expect(parentAsset.name).toBe("test.mp4");
    expect(parentAsset.path).toBe("https://hoge.blob.core.windows.net/fuga/test.mp4?piyo=111");
    expect(parentAsset.type).toBe(2);

    const videoAsset = result.ba1a3dc605065fa25d10129c53d01135.asset;
    expect(videoAsset.id).toBe("52d893840cc8b82aa7709160b9f4e8d3");
    expect(videoAsset.name).toBe("test.mp4?piyo=111#t=0.1234567");
    expect(videoAsset.path).toBe("https://hoge.blob.core.windows.net/fuga/test.mp4?piyo=111#t=0.1234567");
    expect(videoAsset.type).toBe(3);
    expect(videoAsset.timestamp).toBe(0.1234567);

    expect(videoAsset.parent).toStrictEqual(parentAsset);
  });

  test("azure to local test", () => {
    const model: VottModel = {
      assets: templateAzureAssets,
      project: templateProject,
    };
    const config: VottProjectSetting = {
      securityToken: "",
      sourceConnection: {
        localFileSetting: {
          folderPath: "/test/test2",
        },
      },
      targetConnection: {
        localFileSetting: {
          folderPath: "",
        },
      },
    };
    const result = vottProvider.mappingNewAssets(model, config);

    const parentAsset = result.d97d3fb5a2264eb0b47965bbddab7ecd.asset;
    expect(parentAsset.id).toBe("30e59ae67dd6f97016565cdba37a40d4");
    expect(parentAsset.name).toBe("test.mp4");
    expect(parentAsset.path).toBe("file:/test/test2/test.mp4");
    expect(parentAsset.type).toBe(2);

    const videoAsset = result["52d893840cc8b82aa7709160b9f4e8d3"].asset;
    expect(videoAsset.id).toBe("e9acd933014931e8a1e0bc8aa2079540");
    expect(videoAsset.name).toBe("test.mp4#t=0.1234567");
    expect(videoAsset.path).toBe("file:/test/test2/test.mp4#t=0.1234567");
    expect(videoAsset.type).toBe(3);
    expect(videoAsset.timestamp).toBe(0.1234567);

    expect(videoAsset.parent).toStrictEqual(parentAsset);
  });

  test("azure to azure test", () => {
    const model: VottModel = {
      assets: templateAzureAssets,
      project: templateProject,
    };
    const config: VottProjectSetting = {
      securityToken: "",
      sourceConnection: {
        azureBlobSetting: {
          accountName: "foo",
          containerName: "baz",
          sas: "?bar=aaa",
        },
      },
      targetConnection: {
        localFileSetting: {
          folderPath: "",
        },
      },
    };
    const result = vottProvider.mappingNewAssets(model, config);

    const parentAsset = result.d97d3fb5a2264eb0b47965bbddab7ecd.asset;
    expect(parentAsset.id).toBe("ed0ff938dd6428651ad4f4cffa032a3a");
    expect(parentAsset.name).toBe("test.mp4");
    expect(parentAsset.path).toBe("https://foo.blob.core.windows.net/baz/test.mp4?bar=aaa");
    expect(parentAsset.type).toBe(2);

    const videoAsset = result["52d893840cc8b82aa7709160b9f4e8d3"].asset;
    expect(videoAsset.id).toBe("1dad366f2ec274ee93645d2a416ec735");
    expect(videoAsset.name).toBe("test.mp4?bar=aaa#t=0.1234567");
    expect(videoAsset.path).toBe("https://foo.blob.core.windows.net/baz/test.mp4?bar=aaa#t=0.1234567");
    expect(videoAsset.type).toBe(3);
    expect(videoAsset.timestamp).toBe(0.1234567);

    expect(videoAsset.parent).toStrictEqual(parentAsset);
  });
});
