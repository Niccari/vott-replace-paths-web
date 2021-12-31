import JSZip = require("jszip");
import IZipFileProvider from "./interface";

export default class ZipFileProvider implements IZipFileProvider {
  // eslint-disable-next-line class-methods-use-this
  public async compress(files: File[], filename: string): Promise<File> {
    try {
      const jsZip = new JSZip();
      files.forEach((f) => {
        jsZip.file(f.name, f);
      });
      const zip = await jsZip.generateAsync({ type: "blob" });
      return new File([zip], filename);
    } catch {
      return Promise.reject(new Error("compress failed"));
    }
  }

  // eslint-disable-next-line class-methods-use-this
  public async uncompress(file: File): Promise<File[]> {
    try {
      const jsZip = await JSZip.loadAsync(file);
      const promises = Object.values(jsZip.files).map(async (f) => {
        const blob = await f.async("blob");
        return new File([blob], f.name);
      });
      return Promise.all(promises);
    } catch {
      return Promise.reject(new Error("uncompress failed"));
    }
  }
}
