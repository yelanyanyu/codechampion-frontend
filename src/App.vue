<script setup lang="ts">
import BasicLayout from "@/layouts/BasicLayout.vue";
import { useStore } from "vuex";
import { UserRoles } from "@/store/user";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

router.beforeEach((to, from, next) => {
  console.log(store.state.user?.user?.role);
  if (
    to.meta.access === "canAdmin" &&
    store.state.user?.user?.role !== UserRoles.ADMIN
  ) {
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
