// src/access/types.ts

// Define page access levels
export enum PageAccess {
  ADMIN = "canAdmin",
  USER = "canRead",
  GUEST = "canWrite",
}

// 定义权限枚举
export enum UserRole {
  GUEST = "guest",
  USER = "user",
  ADMIN = "admin",
}
