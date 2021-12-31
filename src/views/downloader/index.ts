import IDownloader from "./interface";

export default class Downloader implements IDownloader {
  // eslint-disable-next-line class-methods-use-this
  public async download(file: File): Promise<void> {
    const tag = document.querySelector("#downloader") as HTMLAnchorElement | undefined;
    if (!tag) {
      return;
    }
    const url = URL.createObjectURL(file);

    tag.download = file.name;
    tag.href = url;
    tag.click();

    URL.revokeObjectURL(url);
  }
}
