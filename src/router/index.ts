import { createRouter, createWebHistory } from "vue-router";
import Main from "../components/main/Main.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Main,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
