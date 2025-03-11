import { PageAccess } from "@/access/types";
import router from "@/router";
import store from "@/store";
import { hasAccess } from "@/access/roleAccess";

router.beforeEach(async (to, from, next) => {
  /*
   获取页面权限, 这句话的作用是获取页面权限，并将其转换为 AccessType 类型,
   也就是说 to.meta.access 的值只能是 'canAdmin' 或 'canRead' 或 'canWrite'
  */
  const pageAccess = to.meta?.access as PageAccess;
  let loginUser = store.state.user.loginUser;
  // 如果页面需要权限，并且当前用户没有权限，则跳转到无权限页面
  /*
    有两种情况，登录或者不登陆，所以先判断用户是否登录：
    1. 未登录或者没有具体角色（没有角色的都是非法登录的情况），无权限，尝试获取当前登录用户，同时保持用户的自动登录状态。
    2. 若已经登录，就尝试判断当前用户是否有权限访问当前页面。
   */
  if (!loginUser || !loginUser.userRole) {
    /*
     尝试自动登录，可能成功，也可能失败。
     这里必须重新更新 loginUser，
     因为刷新后之后更新 store 中的 loginUser 而不会更新这个函数中作为变量的loginUser
    */
    await store.dispatch("user/getLoginUser");
    loginUser = store.state.user.loginUser;
  }
  // 如果当前页面不需要登录，那么可以直接next
  if (pageAccess != PageAccess.GUEST) {
    // 如果自动登录失败，那么就需要用户手动登录，重定向到登录页面
    if (!loginUser || !loginUser.userRole) {
      next(`/user/login?redirect=${to.fullPath}`);
      return;
    }
    // 如果用户已经自动登录，并且没有权限，那么就跳转到没有权限的页面
    if (!hasAccess(loginUser, pageAccess)) {
      next("/noAuth");
      return;
    }
  }
  next();
});
