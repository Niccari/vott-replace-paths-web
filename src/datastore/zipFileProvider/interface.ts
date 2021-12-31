interface IZipFileProvider {
  compress(files: File[], filename: string): Promise<File>;
  uncompress(file: File): Promise<File[]>;
}

export default IZipFileProvider;
