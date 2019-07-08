import Vue from "vue"
import { Quest } from "./quest"
import { QuestCard } from "./quest-card"
import { XIVDB } from "./xivdb"
import * as firebase from 'firebase'
require('promise.prototype.finally').shim()

import QuestPathStore from "./account"

const debounce = require("lodash.debounce")

const templateString = require("html-loader!../html/questpath.html")

interface DataInterface {
  selectedStartQuest?: Quest
  selectedEndQuest?: Quest

  isLoading: boolean
  isSaving: boolean

  startingQuestCandidates: Quest[]
  endingQuestCandidates: Quest[]

  questPath: Quest[]

  user?: firebase.User
  savedQuestPaths: Quest[][]
}

export const QuestPath = Vue.extend({
  name: "questpath",
  props: [],
  components: {
    "quest-card": QuestCard,
  },
  template: templateString,

  data(): DataInterface {
    return {
      selectedStartQuest: undefined,
      selectedEndQuest: undefined,

      isLoading: false,
      isSaving: false,

      startingQuestCandidates: [],
      endingQuestCandidates: [],

      questPath: [],

      user: undefined,
      savedQuestPaths: []
    }
  },

  beforeMount: function() {
    const self = this
    firebase.auth().onAuthStateChanged(user => {
      self.user = user!
      self.loadSavedPaths()
    })
  },

  methods: {
    logout: function() {
      firebase.auth().signOut()
      this.user = undefined
      this.savedQuestPaths = []
    },

    signInWithGoogle: function() {
      const self = this
      const provider = new firebase.auth.GoogleAuthProvider()
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => firebase.auth().signInWithPopup(provider))
        .catch(err => console.log(err))
    },

    selectSavedQuestPath: function(index: number) {
      this.questPath = this.savedQuestPaths[index]
    },

    loadSavedPaths: function() {
      const self = this
      if (!self.user) {
        return
      }

      self.savedQuestPaths.splice(0, self.savedQuestPaths.length)
      QuestPathStore.doc(self.user!.uid).collection("questpaths").get().then((result: any) => {
        result.docs.forEach((doc: firebase.firestore.QueryDocumentSnapshot) => {
          const data = doc.data()
          const quests: Quest[] = []
          data.path.forEach((entry: any) => {
            const quest = new Quest(entry)
            quests.push(quest)
          })

          self.savedQuestPaths.push(quests)
        })
      })
    },

    searchQuestByName: debounce(function(query: any, target: Quest[]) {
      XIVDB.search(query, ["Quest"])
        .then((payload: any) => {
          target.splice(0, target.length)
          payload.Results.map((result: any) => {
            const quest = new Quest({ id: result.ID, name: result.Name, iconUrl: result.Icon })
            target.push(quest)
          })
        })
    }, 500),

    getIconFullUrl: function(iconUrl: string): string {
      return `${XIVDB.baseUrl}/${iconUrl}`
    },

    computeQuestPath: function() {
      if (!this.selectedStartQuest || !this.selectedEndQuest) {
        return
      }

      const self = this
      const previousKey = "PreviousQuest0TargetID"

      function query(id: number) {
        XIVDB.getQuest(id)
          .then((payload: any) => {
            const quest = new Quest({
              id: payload.ID,
              name: payload.Name,
              iconUrl: payload.Icon,
              startLocation: payload.ToDoMainLocation0.Map.PlaceName.Name,
            })
            self.questPath.unshift(quest)

            if (quest.id != self.selectedStartQuest!.id) {
              query(payload[previousKey])
            } else {
              self.isLoading = false
            }
          })
      }

      self.questPath.splice(0, self.questPath.length)
      self.isLoading = true
      query(self.selectedEndQuest!.id)
    },

    save: function() {
      const self = this
      self.isSaving = true
      QuestPathStore.doc(self.user!.uid).collection("questpaths").add({
        path: this.questPath.map(quest => quest.toObject()),
        email: self.user!.email,
        name: self.user!.displayName,
      }).then(() => this.$toast.open({
        message: `Saved to your Google account.`,
        type: 'is-success',
        queue: false,
      }))
        .catch(err => this.$toast.open({
          message: `Error saving path: ${err}`,
          type: 'is-danger',
          queue: false,
        }))
        .finally(() => (self.isSaving = false) && self.loadSavedPaths())
    }
  },

  watch: {
    selectedStartQuest: function() {
      this.computeQuestPath()
    },
    selectedEndQuest: function() {
      this.computeQuestPath()
    },
  },
})
