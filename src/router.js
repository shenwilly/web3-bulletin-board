import Vue from "vue";
import Router from "vue-router";

import HomePage from "@/pages/Home"
import ReportsPage from "@/pages/Reports"
import MyPostsPage from "@/pages/MyPosts"

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: "",
      name: "index",
      component: HomePage,
    },
    {
      path: "/reports",
      name: "reports",
      component: ReportsPage,
    },
    {
      path: "/my_posts",
      name: "myPosts",
      component: MyPostsPage,
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
});

export default router;
