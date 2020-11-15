import Vue from "vue";
import Router from "vue-router";
// import store from "@/store/index";

import HomePage from "@/pages/Home"
import ReportsPage from "@/pages/Reports"
import MyPostsPage from "@/pages/MyPosts"


Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    // {
    //   path: "/",
    //   component: MainLayout,
    //   children: [
    //     {
    //       path: "",
    //       name: "index",
    //       redirect: "videos",
    //       // component: VideoPage,
    //     },
    //     {
    //       path: "videos/",
    //       name: "videos",
    //       component: VideoPage,
    //     },

    //     {
    //       path: "videos/:videoId",
    //       name: "video-detail",
    //       component: VideoDetailPage,
    //     },
    //   ]
    // },

    {
      path: "",
      name: "index",
      component: HomePage,
    },
    {
      path: "reports/",
      name: "reports",
      component: ReportsPage,
    },
    {
      path: "my_posts/",
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

// router.beforeEach((to, from, next) => {
    
// })

export default router;
