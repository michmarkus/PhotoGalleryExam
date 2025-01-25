import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import HomePage from "../views/HomePage.vue";
import Gallery from "../views/Gallery.vue";
import PhotoDetails from "@/views/PhotoDetails.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/gallery",
  },
  {
    path: "/gallery",
    name: "Gallery",
    component: Gallery,
  },
  {
    path: "/home",
    name: "home",
    component: HomePage,
  },
  {
    path: "/gallery/photoDetails",
    name: "photoDetails",
    component: PhotoDetails,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
