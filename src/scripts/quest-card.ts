import Vue from "vue"
import { Quest } from "./quest";

const templateString = require("html-loader!../html/quest-card.html")

interface DataInterface {
}

export const QuestCard = Vue.extend({
  name: "quest-card",
  props: {
    value: Quest,
  },

  template: templateString,

  data: function(): DataInterface {
    return {
    }
  },

  methods: {
    toggleCompleted: function(value: boolean) {
      this.value.completed = value
      this.$emit("input", this.value)
    },
  },
})
