import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  count: 0,
  loggedIn: false,
  snackbarMessage: 'Welcome to Industrial Training Portal!',
  snackbarVisible: false,
  user: JSON.parse(localStorage.getItem('user')),
}

const mutations = {
  INCREMENT (state) {
    state.count++
  },
  DECREMENT (state) {
    state.count--
  },
  LOGIN (state) {
    state.loggedIn = true;
  },
  LOGOUT (state) {
    state.loggedIn = false;
  },
  CHANGE_MESSAGE (state, msg) {
    state.snackbarMessage = msg;
    state.snackbarVisible = true;
  },
  CHANGE_USER (state, _user) {
    state.user = _user;
  },
  HIDE_MESSAGE (state) {
    state.snackbarVisible = false;
  },
}

var __timeout = null;

const actions = {
  incrementAsync ({ commit }) {
    setTimeout(() => {
      commit('INCREMENT')
    }, 200)
  },
  showMessage ({ commit }, msg) {
    commit('CHANGE_MESSAGE', msg)
    clearTimeout(__timeout);
    __timeout = setTimeout(() => {
      commit('HIDE_MESSAGE')
    }, 5000)
  }
}

const store = new Vuex.Store({
  state,
  mutations,
  actions
})

export default store
