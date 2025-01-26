import { Capacitor } from "@capacitor/core";
import { Filesystem } from "@capacitor/filesystem";
import { isPlatform } from "@ionic/vue";

export class UserPhoto {
  private _fileName: string = "";
  private _fileExt: string = "";
  fileDir: string;
  private _imageData?: string;

  get fileName(): string {
    return this._fileName + "." + this._fileExt;
  }

  set fileName(value: string) {
    const nameParts = value.split(".");
    this._fileExt = nameParts.pop() || "jpeg";
    this._fileName = nameParts.join(".");
  }

  get fileExt(): string {
    return this._fileExt;
  }

  get filePath(): string {
    return this.fileDir + "/" + this.fileName;
  }

  get webviewPath(): string {
    if (isPlatform("hybrid")) {
      return Capacitor.convertFileSrc(this.filePath);
    } else if (this._imageData) {
      return `data:image/${this.fileExt};base64,${this._imageData}`;
    } else {
      return "";
    }
  }

  constructor(fileName: string, fileDir: string, imageData?: string) {
    this.fileName = fileName;
    this.fileDir = fileDir;
    this._imageData = imageData;
  }

  static fromFilePath(filepath: string, imageData?: string): UserPhoto {
    const pathParts = filepath.split("/");
    const fileName = pathParts.pop() || "";
    const fileDir = pathParts.join("/");
    return new UserPhoto(fileName, fileDir, imageData);
  }

  async loadImageData(): Promise<void> {
    if (!isPlatform("hybrid")) {
      const file = await Filesystem.readFile({
        path: this.filePath,
      });
      this._imageData = file.data as string;
    }
  }

  stringify(): string {
    return JSON.stringify({
      fileName: this.fileName,
      fileDir: this.fileDir,
      _imageData: this._imageData,
    });
  }

  static parse(data: string): UserPhoto {
    const jsonData = JSON.parse(data) as IUserPhoto;
    return new UserPhoto(
      jsonData.fileName,
      jsonData.fileDir,
      jsonData._imageData,
    );
  }
}

export interface IUserPhoto {
  fileName: string;
  fileDir: string;
  _imageData?: string;
}
