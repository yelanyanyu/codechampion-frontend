import { UserRoles } from "@/store/user";
import { PageAccess } from "@/access/types";

// 检查用户是否有特定权限, 会自动获取当前用户角色，并检查权限
export const hasAccess = (loginUser: any, pageAccess = PageAccess.GUEST) => {
  const userAccess = loginUser?.role ?? UserRoles.GUEST;
  if (pageAccess === PageAccess.GUEST) {
    return true;
  }
  if (pageAccess === PageAccess.USER && userAccess === UserRoles.GUEST) {
    return false;
  }
  if (pageAccess === PageAccess.ADMIN && userAccess !== UserRoles.ADMIN) {
    return false;
  }
  return true;
};
