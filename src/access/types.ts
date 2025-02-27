// src/access/types.ts

// Define page access levels
export enum PageAccess {
  ADMIN = "canAdmin",
  USER = "canRead",
  GUEST = "canWrite",
}
