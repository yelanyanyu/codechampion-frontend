import { createStore } from "vuex";
import user from "./user"; // Import the user module

export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    user, // Register the user module
  },
});
