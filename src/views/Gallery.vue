<template>
    <ion-page>
      <ion-header :translucent="true">
        <ion-toolbar>
          <ion-title>Gallery</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content :fullscreen="true">
        <ion-header collapse="condense">
          <ion-toolbar>
            <ion-title size="large">Gallery</ion-title>
          </ion-toolbar>
        </ion-header>
  
        <ion-grid>
          <ion-row>
            <ion-col size="6" :key="photo.filepath" v-for="photo in photos">
              <ion-img :src="photo.webviewPath" @click="goToPhotoDetail(photo)"></ion-img>
            </ion-col>
          </ion-row>
        </ion-grid>

        <ion-fab vertical="bottom" horizontal="center" slot="fixed">
            <ion-fab-button @click="takePhoto()">
            <ion-icon :icon="camera"></ion-icon>
            </ion-fab-button>
        </ion-fab>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
    import { camera, trash, close } from 'ionicons/icons';
    import {
      actionSheetController,
      IonPage,
      IonHeader,
      IonFab,
      IonFabButton,
      IonIcon,
      IonToolbar,
      IonTitle,
      IonContent,
      IonGrid,
      IonRow,
      IonCol,
      IonImg,
    } from '@ionic/vue';
    import { useRouter } from 'vue-router';

    import { usePhotoGallery, iUserPhoto } from '@/composables/usePhotoGallery';

    const { photos, takePhoto, deletePhoto } = usePhotoGallery();
  
    const router = useRouter();

    const showActionSheet = async (photo: iUserPhoto) => {
      const actionSheet = await actionSheetController.create({
        header: 'Photos',
        buttons: [
          {
            text: 'Delete',
            role: 'destructive',
            icon: trash,
            handler: () => {
              deletePhoto(photo);
            },
          },
          {
            text: 'Cancel',
            icon: close,
            role: 'cancel',
            handler: () => {
              // Nothing to do, action sheet is automatically closed
            },
          },
        ],
      });
      await actionSheet.present();
    };

    const goToPhotoDetail = async (photo: iUserPhoto) => {
      router.push({
        name: 'photoDetails',
        state: { photo: JSON.stringify(photo) },
      });
    };
  </script>
  
  <style scoped>
  </style>
  