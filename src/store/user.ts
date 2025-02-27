import { Module } from "vuex";
// 定义权限枚举
export enum UserRoles {
  GUEST = "guest",
  USER = "user",
  ADMIN = "admin",
}

interface UserState {
  user: {
    username: string;
    role: UserRoles;
  } | null;
}

const user: Module<UserState, any> = {
  namespaced: true,
  state: {
    user: {
      username: "未登录",
      role: UserRoles.GUEST,
    },
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    updateUser(state, user) {
      state.user = { ...state.user, ...user };
    },
  },
  actions: {
    fetchUser({ commit }, payload) {
      // TODO: Implement API call to fetch user from backend
      console.log("payload: ", payload);
      commit("setUser", payload);
    },
  },
  getters: {
    isLoggedIn(state) {
      return !!state.user;
    },
    getUser(state) {
      return state.user;
    },
  },
};

export default user;
