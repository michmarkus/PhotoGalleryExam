<template>
    <ion-page>
      <ion-header :translucent="true">
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button defaultHref="/gallery"></ion-back-button>
          </ion-buttons>
          <ion-title>Detaily obrázku</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content :fullscreen="true">
        <ion-header collapse="condense">
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-back-button defaultHref="/gallery"></ion-back-button>
            </ion-buttons>
            <ion-title size="large">Detaily obrázku</ion-title>
          </ion-toolbar>
        </ion-header>

      <ion-img :src="photo?.webviewPath" class="ion-margin"/>
      <ion-card>
        <ion-card-header>
          <h1>
            <ion-input v-model="photoName" :disabled="!editName">
              <ion-icon v-if="!editName" slot="end" :icon="pencilOutline" @click="editName = true"></ion-icon>
              <ion-icon v-else slot="end" :icon="saveOutline" @click="saveName"></ion-icon>
            </ion-input>
          </h1>
        </ion-card-header>
        <ion-card-content>
          <div v-if="photo">
            <h1>Poloha pořízení</h1>
            <strong>Souřadnice: </strong> {{ (photo as UserPhoto).location?.lat + ', ' + (photo as UserPhoto).location?.lon }}<br>
            <strong>Lokalita: </strong> {{ (photo as UserPhoto).location?.name }}<br>
            <strong>Region: </strong> {{ (photo as UserPhoto).location?.region }}<br>
            <strong>Stát: </strong> {{ (photo as UserPhoto).location?.country }}<br>
            <br>
            <h1>Počasí při pořízení</h1>
            <strong>Teplota: </strong> {{ (photo as UserPhoto).weather?.temp_c + " °C" }}<br>
            <strong>Vlhkost: </strong> {{ (photo as UserPhoto).weather?.humidity + " %" }}<br>
            <strong>Vítr: </strong> {{ (photo as UserPhoto).weather?.wind_kph + " km/h" }}<br>
            <strong>Nárazy větru: </strong> {{ (photo as UserPhoto).weather?.gust_kph + " km/h" }}<br>
            <strong>Viditelnost: </strong> {{ (photo as UserPhoto).weather?.vis_km + " km" }}<br>
          </div>
          <div v-else>
            <p>Načítám data...</p>
          </div>
        </ion-card-content>
      </ion-card>

      <ion-alert
        trigger="present-delete-alert"
        header="Smazat obrázek"
        message="Opravdu chcte smazat tento obrázek?"
        :buttons="alertButtons"
      ></ion-alert>
  
      </ion-content>
      <ion-footer>
        <ion-toolbar>
          <ion-buttons slot="primary">
            <ion-button id="present-delete-alert">
              <ion-icon slot="icon-only" :icon="trashOutline"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-footer>
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
      IonFooter,
      IonAlert,
      IonButton,
    } from '@ionic/vue';
    import { pencilOutline, saveOutline, trashOutline } from 'ionicons/icons';
    import { onMounted, ref } from 'vue';

    import { usePhotoGallery } from '@/composables/usePhotoGallery';
    import { UserPhoto } from '@/models/UserPhoto';
    const { renamePhoto, deletePhoto } = usePhotoGallery();

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
        photo.value = UserPhoto.parseString(photoFromState);
        photoName.value = photo.value?.fileName || '';
      } else {
        console.warn('No photo found in history state. Redirecting back to gallery.');
        window.history.back();
      }
    });

    const alertButtons = [
      {
        text: 'Ne',
        role: 'cancel',
      },
      {
        text: 'Ano',
        handler: () => {
          deletePhoto(photo.value! as UserPhoto);
          window.history.back();
        },
        role: 'destructive',
      },
    ];
  </script>
  
  <style scoped>

  </style>
  