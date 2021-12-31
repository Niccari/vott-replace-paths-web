import { IStore } from "../../stores/interface";

interface IPresentation {
  listenStoreUpdate: (store: IStore) => void;
}

export default IPresentation;
