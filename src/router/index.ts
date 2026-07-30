import {
  createRouter,
  createWebHashHistory,
  type RouteLocationNormalized,
} from "vue-router";
import Main from "../components/main/Main.vue";
import Page from "../components/page/Page.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: Main,
  },
  {
    path: "/:id(\\d+)",
    name: "page",
    component: Page,
    props: (route: RouteLocationNormalized) => ({
      id: Number(route.params.id),
    }),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
