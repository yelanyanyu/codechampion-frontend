import { Module, StoreOptions } from "vuex";
import { UserControllerService } from "../../generated";
import { UserRole } from "@/access/types";

interface UserState {
  loginUser: {
    userName: string;
  } | null;
}

export default {
  namespaced: true,
  state: {
    loginUser: {
      userName: "未登录",
    },
  },
  mutations: {
    updateUser(state, user) {
      // 所以，只有登录了的用户才会拥有 userRole，而游客是不会有的。
      state.loginUser = { userName: user.userName, userRole: user.userRole };
    },
  },
  actions: {
    async getLoginUser({ commit, state }, payload) {
      // TODO: Implement API call to fetch user from backend
      const res = await UserControllerService.getLoginUserUsingGet();
      console.log("login user: ", res.data);
      if (res.code === 0) {
        commit("updateUser", res.data);
      } else {
        commit("updateUser", {
          ...state.loginUser,
          role: UserRole.GUEST,
        });
      }
    },
  },
} as StoreOptions<any>;
