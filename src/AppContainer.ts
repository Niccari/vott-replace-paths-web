/* eslint-disable no-new */
import Downloader from "./views/downloader";
import VottFileProvider from "./datastore/vottFileProvider";
import ZipFileProvider from "./datastore/zipFileProvider";
import VottProvider from "./repository/vott";
import VottUseCase from "./usecases";
import Store from "./stores";
import EventHandler from "./views/eventHandler";
import Presentation from "./views/presentation";

class Container {
  public constructor() {
    // modules
    const zipFileProvider = new ZipFileProvider();
    const vottFileProvider = new VottFileProvider();
    const downloader = new Downloader();

    const vottProvider = new VottProvider(zipFileProvider, vottFileProvider, downloader);
    const vottUseCase = new VottUseCase(vottProvider);
    const store = new Store(vottUseCase);
    new EventHandler(store);
    new Presentation().listenStoreUpdate(store);
  }
}

export default Container;
