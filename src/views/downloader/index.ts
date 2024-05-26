import IDownloader from "./interface";

export default class Downloader implements IDownloader {
  // eslint-disable-next-line class-methods-use-this
  public async download(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      const tag = document.querySelector("#downloader") as HTMLAnchorElement | undefined;
      if (!tag) {
        reject(new Error("downloader element not found."));
        return;
      }
      const url = URL.createObjectURL(file);

      tag.download = file.name;
      tag.href = url;
      tag.click();

      URL.revokeObjectURL(url);
      resolve();
    });
  }
}
