<script setup lang="ts">
import BasicLayout from "@/layouts/BasicLayout.vue";
import { useStore } from "vuex";
import { UserRoles } from "@/store/user";
import { useRouter } from "vue-router";
import { PageAccess } from "@/access/types";
import { hasAccess } from "@/access/roleAccess";
import { onMounted } from "vue";

// 全局初始化函数，有全局单次调用的代码，都可以写到这里。
const doInit = () => {
  console.log("hello oj");
};

onMounted(() => {
  doInit();
});

const store = useStore();
const router = useRouter();

router.beforeEach((to, from, next) => {
  /*
   获取页面权限, 这句话的作用是获取页面权限，并将其转换为 AccessType 类型,
   也就是说 to.meta.access 的值只能是 'canAdmin' 或 'canRead' 或 'canWrite'
  */
  const pageAccess = to.meta.access as PageAccess;
  // 如果页面需要权限，并且当前用户没有权限，则跳转到无权限页面
  if (pageAccess && !hasAccess(store.state.user.user, pageAccess)) {
    next("/noAuth");
    return;
  }
  next();
});
</script>
<template>
  <div id="app">
    <BasicLayout />
  </div>
</template>

<style></style>
