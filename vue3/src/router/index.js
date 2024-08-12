import {createRouter,createRouterMatcher, createWebHistory} from "vue-router";
import Home from "../components/Home.vue";
import AboutMe from "../components/AboutMe.vue";
import Notes from "../components/Notes.vue";


const router = createRouter({
  history:createWebHistory (import.meta.env.BASE_URL),
  routes:[
    {
      path:"/",
      name:"Home",
      component: Home 
    },
    {
      path:"/aboutme",
      name:"aboutme",
      component: AboutMe
    },
    {
      path:"/notes/:id",
      name:"note",
      component: Notes
    }
  ]
})

export default router