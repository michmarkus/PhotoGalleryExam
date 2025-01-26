import { ref, onMounted, watch } from "vue";
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from "@capacitor/camera";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Preferences } from "@capacitor/preferences";
import { Geolocation, Position } from "@capacitor/geolocation";
import { UserPhoto, IUserPhoto } from "@/models/UserPhoto";
import { WeatherApi, ICurrentWeatherData } from "@/services/WeatherApi";
import { isPlatform } from "@ionic/vue";

const photos = ref<UserPhoto[]>([]);
const PHOTO_STORAGE = "photos";

export const usePhotoGallery = () => {
  const takePhoto = async () => {
    // Start looking for the user's location
    const positionPromise = Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
    });

    // Take a photo
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 100,
    });

    const position = await positionPromise;
    const weather = await fetchWeather(position);
    const fileName = getFormatedDate() + "." + photo.format;
    const savedFileImage = await savePicture(photo, fileName, weather);

    photos.value = [savedFileImage, ...photos.value];
  };

  const savePicture = async (
    photo: Photo,
    fileName: string,
    weather?: ICurrentWeatherData,
  ): Promise<UserPhoto> => {
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: photo.base64String!,
      directory: Directory.Data,
    });

    if (isPlatform("hybrid")) {
      return UserPhoto.fromFilePath(savedFile.uri, undefined, weather);
    } else {
      return UserPhoto.fromFilePath(savedFile.uri, photo.base64String, weather);
    }
  };

  const cachePhotos = () => {
    Preferences.set({
      key: PHOTO_STORAGE,
      value: JSON.stringify(
        photos.value.map((p) => p.JSON),
      ),
    });
  };

  const loadSaved = async () => {
    const photoList = await Preferences.get({ key: PHOTO_STORAGE });
    const photosInPreferences = photoList.value
      ? (JSON.parse(photoList.value) as IUserPhoto[])
      : [];

    // Create UserPhoto objects from the list of photo data and save to photos array
    photos.value = photosInPreferences.map(
      (p) => UserPhoto.parse(p) as UserPhoto,
    );

    // Load image data for each photo
    await Promise.all(
      photos.value.map(async (p) => {
        await p.loadImageData();
      }),
    );
  };

  const deletePhoto = async (photo: UserPhoto) => {
    // Remove this photo from the Photos reference data array
    photos.value = photos.value.filter((p) => p.filePath !== photo.filePath);

    // delete photo file from filesystem
    await Filesystem.deleteFile({
      path: photo.filePath,
    });
  };

  const renamePhoto = async (photo: UserPhoto, newFileName: string) => {
    if (photo.fileName !== newFileName) {
      const photoStored = photos.value.find(
        (p) => p.filePath === photo.filePath,
      );
      if (!photoStored) {
        console.error("Photo not found in photos array");
        return;
      }

      photoStored.fileName = newFileName;
      cachePhotos();

      await Filesystem.rename({
        from: photo.fileName,
        to: photoStored.fileName,
        directory: Directory.Data,
      });
    }
  };

  const getFormatedDate = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Měsíc je 0-indexovaný
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}${month}${day}_${hours}${minutes}${seconds}`;
  };

  const fetchWeather = async (location: Position) : Promise<ICurrentWeatherData> => {
    const wApi = new WeatherApi();
    return await wApi.currentWeather(`${location.coords.latitude},${location.coords.longitude}`);
  };

  watch(photos, cachePhotos);
  onMounted(loadSaved);
  onMounted(() => {
    // Ask for localication permission on hybrid platforms
    if (isPlatform("hybrid")){
      Geolocation.requestPermissions();
    }
  });

  return {
    photos,
    takePhoto,
    deletePhoto,
    renamePhoto,
  };
};
