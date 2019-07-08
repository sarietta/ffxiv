import Vue from "vue"
import { QuestPath } from "./questpath"

const templateString = require("html-loader!../html/landing-page.html")

interface DataInterface {
}

export const LandingPage = Vue.extend({
  name: "landing-page",
  props: [],
  template: templateString,
  components: {
    "questpath": QuestPath,
  },

  data(): DataInterface {
    return {
    }
  },

  methods: {
  },

  computed: {
  },
})
