import {createRouter,createRouterMatcher, createWebHashHistory} from "vue-router";

import Home from "../components/Home.vue";
import AboutMe from "../components/AboutMe.vue";

const router = createRouter({
  history:createWebHashHistory(import.meta.env.BASE_URL),
  routes:[
    {
      path:"/",
      name:"Home",
      component: Home 
    },
    {
      path:"/about",
      name:"aboutme",
      component: AboutMe
    }
  ]
})

export default router