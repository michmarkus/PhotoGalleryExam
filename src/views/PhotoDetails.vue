<template>
    <ion-page>
      <ion-header :translucent="true">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button defaultHref="/gallery"></ion-back-button>
          </ion-buttons>
          <ion-title>Photo details</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content :fullscreen="true">
        <ion-header collapse="condense">
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button defaultHref="/gallery"></ion-back-button>
            </ion-buttons>
            <ion-title size="large">Photo details</ion-title>
          </ion-toolbar>
        </ion-header>

      <ion-img :src="photo?.webviewPath" class="ion-margin"/>
      <ion-card>
        <ion-card-header>
          <h2>
            <ion-input v-model="photoName" :disabled="!editName">
              <ion-icon v-if="!editName" slot="end" :icon="pencilOutline" @click="editName = true"></ion-icon>
              <ion-icon v-else slot="end" :icon="saveOutline" @click="saveName"></ion-icon>
            </ion-input>
          </h2>
        </ion-card-header>
        <ion-card-content>
          
        </ion-card-content>
      </ion-card>
  
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
    import {
      IonPage,
      IonHeader,
      IonToolbar,
      IonTitle,
      IonContent,
      IonImg,
      IonIcon,
      IonButtons,
      IonBackButton,
      IonCard,
      IonCardHeader,
      IonCardContent,
      IonInput,
    } from '@ionic/vue';
    import { pencilOutline, saveOutline } from 'ionicons/icons';
    import { onMounted, ref } from 'vue';

    import { usePhotoGallery } from '@/composables/usePhotoGallery';
    import { UserPhoto } from '@/models/UserPhoto';
    const { renamePhoto } = usePhotoGallery();

    const photo = ref<UserPhoto | null>(null);
    const photoFromState: string | null = window.history.state?.photo || null;

    const photoName = ref<string>(photo.value?.fileName || '');
    const editName = ref<boolean>(false);

    const saveName = () => {
      renamePhoto(photo.value! as UserPhoto, photoName.value);
      editName.value = false;
    };

    onMounted(() => {
      if (photoFromState) {
        photo.value = UserPhoto.parse(photoFromState);
        photoName.value = photo.value?.fileName || '';
        console.log('Photo loaded from history state: ', photo.value);
      } else {
        console.warn('No photo found in history state. Redirecting back to gallery.');
        window.history.back();
      }
    });
  </script>
  
  <style scoped>

  </style>
  