export const ErrorCode = {
  Success: 0,
  InvalidZipFile: 1,
  InvalidFileIncluded: 2,
  JSONFormatError: 3,
  ProjectNotFound: 4,
  InvalidFileProvider: 5,
  InvalidAssetType: 6,
  CompressionFailed: 7,
} as const;
export type ErrorCode = typeof ErrorCode[keyof typeof ErrorCode];

export class VottConversionError extends Error {
  public errorCode: ErrorCode;

  public constructor(errorCode: ErrorCode, e?: string) {
    super(e);
    this.errorCode = errorCode;
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
