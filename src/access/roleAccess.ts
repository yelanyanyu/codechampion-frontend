import { PageAccess, UserRole } from "@/access/types";

// 检查用户是否有特定权限, 会自动获取当前用户角色，并检查权限
export const hasAccess = (loginUser: any, pageAccess = PageAccess.GUEST) => {
  const userAccess = loginUser?.userRole ?? UserRole.GUEST;
  console.log("loginUser in hasAccess(): ", loginUser);
  if (pageAccess === PageAccess.USER && userAccess === UserRole.GUEST) {
    return false;
  }
  if (pageAccess === PageAccess.ADMIN && userAccess !== UserRole.ADMIN) {
    return false;
  }
  return true;
};
