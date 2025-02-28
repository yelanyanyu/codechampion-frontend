import { Module } from "vuex";
import { UserControllerService } from "../../generated";
import { UserRole } from "@/access/types";

interface UserState {
  user: {
    username: string;
    role: UserRole;
  } | null;
}

const user: Module<UserState, any> = {
  namespaced: true,
  state: {
    user: {
      username: "未登录",
      role: UserRole.GUEST,
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
    async getLoginUser({ commit, state }, payload) {
      // TODO: Implement API call to fetch user from backend
      const res = await UserControllerService.getLoginUserUsingGet();
      if (res.code === 0) {
        commit("updateUser", res.data);
      } else {
        commit("updateUser", {
          ...state.user,
          role: UserRole.GUEST,
        });
      }
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
