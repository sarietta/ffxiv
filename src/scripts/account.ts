import Vue from 'vue'
import * as firebase from 'firebase'
import { firestorePlugin } from 'vuefire'

Vue.use(firestorePlugin)

const firebaseConfig = {
  apiKey: "AIzaSyDVa5zNAegj4LGnFwAHtJ4t_jo-LEEyHcs",
  authDomain: "ffxiv-ffd86.firebaseapp.com",
  databaseURL: "https://ffxiv-ffd86.firebaseio.com",
  projectId: "ffxiv-ffd86",
  storageBucket: "ffxiv-ffd86.appspot.com",
  messagingSenderId: "734842341164",
  appId: "1:734842341164:web:606c345e84cd1fe3"
}

// Get a Firestore instance
const db = firebase
  .initializeApp(firebaseConfig)
  .firestore()

const QuestPathStore = db.collection('questpaths')
export default QuestPathStore
