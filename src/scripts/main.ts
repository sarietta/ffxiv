// Absolute imports
import Buefy from "buefy"
import Vue from "vue"
import VueRouter from "vue-router"

import '@fortawesome/fontawesome-free-webfonts/scss/fontawesome.scss'
import '@fortawesome/fontawesome-free-webfonts/scss/fa-solid.scss'

import "buefy/dist/buefy.css"
import "../styles/main.scss"

import { LandingPage } from "./landing-page"

// PLUGINS
Vue.use(VueRouter)
Vue.use(Buefy, { defaultIconPack: "fas" })

const routes = [
  {
    path: "/landing",
    name: "landing",
    component: LandingPage
  },

  {
    path: "*",
    name: "landing",
    component: LandingPage
  },
]

// 3. Create the router instance and pass the `routes` option
// You can pass in additional options here, but let's
// keep it simple for now.
const router = new VueRouter({
  routes: routes,

  // This makes sure that when we navigate to a new "page" we scroll
  // to the top.
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
})


// 4. Create and mount the root instance.
// Make sure to inject the router with the router option to make the
// whole app router-aware.
new Vue({
  router,
  data: () => {
    return {
      // appState: app.appState
    }
  }
}).$mount("#app-wrapper")


// THIS MUST GO AT THE END
if (router.currentRoute.path === '/') {
  router.replace('/landing')
}
