import { ICurrentWeatherData, ILocation, IWeatherData } from "@/services/WeatherApi";
import { Capacitor } from "@capacitor/core";
import { Filesystem } from "@capacitor/filesystem";
import { isPlatform } from "@ionic/vue";

export class UserPhoto {
  private _fileName: string = "";
  private _fileExt: string = "";
  fileDir: string;
  private _imageData?: string;
  private _weather?: ICurrentWeatherData

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

  get weather(): IWeatherData | undefined {
    return this._weather?.current;
  }

  get location(): ILocation | undefined {
    return this._weather?.location;
  }

  constructor(fileName: string, fileDir: string, imageData?: string, weather?: ICurrentWeatherData) {
    this.fileName = fileName;
    this.fileDir = fileDir;
    this._imageData = imageData;
    this._weather = weather;
  }

  static fromFilePath(filepath: string, imageData?: string, weather?: ICurrentWeatherData): UserPhoto {
    const pathParts = filepath.split("/");
    const fileName = pathParts.pop() || "";
    const fileDir = pathParts.join("/");
    return new UserPhoto(fileName, fileDir, imageData, weather);
  }

  async loadImageData(): Promise<void> {
    if (!isPlatform("hybrid")) {
      const file = await Filesystem.readFile({
        path: this.filePath,
      });
      this._imageData = file.data as string;
    }
  }

  get JSON(): IUserPhoto {
    return {
      fileName: this.fileName,
      fileDir: this.fileDir,
      _imageData: this._imageData,
      _weather: this._weather,
    }
  }

  static parse(data: IUserPhoto): UserPhoto {
    return new UserPhoto(
      data.fileName,
      data.fileDir,
      data._imageData,
      data._weather,
    );
  }

  static parseString(data: string): UserPhoto {
    const jsonData = JSON.parse(data) as IUserPhoto;
    return this.parse(jsonData);
  }
}

export interface IUserPhoto {
  fileName: string;
  fileDir: string;
  _imageData?: string;
  _weather?: ICurrentWeatherData;
}
