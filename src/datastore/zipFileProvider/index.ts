import { unzip, zip } from "fflate";
import IZipFileProvider from "./interface";

export default class ZipFileProvider implements IZipFileProvider {
  // eslint-disable-next-line class-methods-use-this
  public async compress(files: File[], filename: string): Promise<File> {
    try {
      const fileContents: Record<string, Uint8Array> = {};
      const promises = files.map(async (f) => {
        const arrayBuffer = await f.arrayBuffer();
        fileContents[f.name] = new Uint8Array(arrayBuffer);
      });
      await Promise.all(promises);
      const zippedContent: Uint8Array = await new Promise((resolve, reject) => {
        zip(fileContents, { level: 9 }, (err, data) => {
          if (err) {
            reject(err);
          }
          resolve(data);
        });
      });
      return new File([zippedContent], filename);
    } catch (err) {
      return Promise.reject(new Error(`compress failed: ${err}`));
    }
  }

  // eslint-disable-next-line class-methods-use-this
  public async uncompress(file: File): Promise<File[]> {
    try {
      const buffer = await file.arrayBuffer();
      return await new Promise((resolve, reject) => {
        unzip(new Uint8Array(buffer), {}, (err, unzipped) => {
          if (err) {
            reject(err);
          }
          const promises = Object.entries(unzipped).map(async ([filename, data]) => new File([data], filename));
          resolve(Promise.all(promises));
        });
      });
    } catch (err) {
      return Promise.reject(new Error(`uncompress failed: ${err}`));
    }
  }
}
