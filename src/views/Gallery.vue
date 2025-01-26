<template>
    <ion-page>
      <ion-header :translucent="true">
        <ion-toolbar>
          <ion-title>Galerie</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content :fullscreen="true">
        <ion-header collapse="condense">
          <ion-toolbar>
            <ion-title size="large">Galerie</ion-title>
          </ion-toolbar>
        </ion-header>
  
        <ion-grid>
          <ion-row>
            <ion-col size="6" :key="photo.filePath" v-for="photo in photos">
              <ion-img :src="photo.webviewPath" @click="goToPhotoDetail(photo as UserPhoto)"></ion-img>
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
    import { camera } from 'ionicons/icons';
    import {
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

    import { usePhotoGallery } from '@/composables/usePhotoGallery';
    import { UserPhoto } from '@/models/UserPhoto';

    const { photos, takePhoto } = usePhotoGallery();
  
    const router = useRouter();

    const goToPhotoDetail = (photo: UserPhoto) => {
      router.push({
        name: 'photoDetails',
        state: { photo: JSON.stringify(photo.JSON) },
      });
    };
  </script>
  
  <style scoped>
  </style>
  