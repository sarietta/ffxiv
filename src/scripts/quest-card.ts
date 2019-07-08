import Vue from "vue"

const templateString = require("html-loader!../html/quest-card.html")

interface DataInterface {
  checked: boolean
}

export const QuestCard = Vue.extend({
  name: "quest-card",
  props: ["quest"],
  template: templateString,

  data(): DataInterface {
    return {
      checked: false
    }
  },

  methods: {
  },
})
