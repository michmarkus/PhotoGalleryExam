<template>
    <ion-page>
      <ion-header :translucent="true">
        <ion-toolbar>
          <ion-title>Title</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content :fullscreen="true">
        <ion-header collapse="condense">
          <ion-toolbar>
            <ion-title size="large">Title</ion-title>
          </ion-toolbar>
        </ion-header>
  
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
    } from '@ionic/vue';
  </script>
  
  <style scoped>
  </style>
  