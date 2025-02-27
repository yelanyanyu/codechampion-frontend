import { Module } from "vuex";
// 定义权限枚举
export const UserRoles = {
  GUEST: "guest",
  USER: "user",
  ADMIN: "admin",
};

interface UserState {
  user: {
    username: string;
    role: string;
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
    fetchUser({ commit }) {
      // TODO: Implement API call to fetch user from backend
      const fetchedUser = { username: "yelanyanyu", role: UserRoles.GUEST }; // Example role
      commit("setUser", fetchedUser);
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
