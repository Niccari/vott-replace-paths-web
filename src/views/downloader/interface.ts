interface IDownloader {
  download(file: File): Promise<void>;
}

export default IDownloader;
