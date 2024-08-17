import {createRouter,createRouterMatcher, createWebHistory} from "vue-router";
import Home from "../components/Home.vue";
import AboutMe from "../components/AboutMe.vue";
import Notes from "../components/Notes.vue";
import Game from "../components/Game.vue";
import Tool from "../components/Tool.vue";
import anonymousSystem from "../components/anonymousSystem.vue";
import NotFound from "../components/NotFound.vue";

const router = createRouter({
  history:createWebHistory (import.meta.env.BASE_URL),
  routes:[
    {
      path:"/",
      name:"Home",
      component: Home 
    },
    {
      path:"/home",
      redirect:"/"
    },
    {
      path:"/aboutme",
      name:"aboutme",
      component: AboutMe
    },
    {
      path:"/Game",
      name:"Game",
      component: Game
    },
    {
      path:"/Tool",
      name:"Tool",
      component: Tool
    },
    {
      path:"/anonymousSystem",
      name:"anonymousSystem",
      component: anonymousSystem
    },
    {
      path:"/notes/:id",
      name:"note",
      component: Notes
    },
    {
      path:"/:path(.*)*",
      name:"NotFound",
      component:NotFound
    }
  ]
})

export default router