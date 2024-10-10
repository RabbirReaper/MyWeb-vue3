import {createRouter,createRouterMatcher, createWebHistory} from "vue-router"
import Home from "../components/Home.vue"
import AboutMe from "../components/AboutMe.vue"
import Notes from "../components/Notes.vue"
import Game from "../components/Game.vue"
import Tool from "../components/Tool.vue"
import anonymousSystem from "../components/anonymousSystem.vue"
import NotFound from "../components/NotFound.vue"
import accountingTool from "../components/accounting/index.vue"
import accountingTool_show from "../components/accounting/show.vue"
import accountingTool_create from "../components/accounting/create.vue"
import accountingTool_createCategory from "../components/accounting/createCategory.vue"



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
      path:"/Tool/accounting",
      name:"Accounting_tools",
      component: accountingTool,
      children: [
        {
          path: 'show',
          name: 'Accounting_tools_show',
          component: accountingTool_show
        },
        {
          path: 'create',
          name: 'Accounting_tools_create',
          component: accountingTool_create
        },
        {
          path: 'createCategory',
          name: 'Accounting_tools_createCategory',
          component: accountingTool_createCategory
        },
      ]
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