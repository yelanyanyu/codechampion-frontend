<script setup lang="ts">
import { routes } from "@/router/routes";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { hasAccess } from "@/access/roleAccess";
import { PageAccess, UserRole } from "@/access/types";

// const visibleRules = routes.filter((item, index) => {
//   return item.meta?.isHide !== true;
// });
const store = useStore();

// const visibleRules = routes.filter((item, index) => {
//   if (item.meta?.isHide) {
//     return false;
//   }
//   if (!hasAccess(store.state.user.user, item.meta?.access as PageAccess)) {
//     return false;
//   }
//   return true;
// });
const visibleRules = computed(() => {
  return routes.filter((item, index) => {
    if (item.meta?.isHide) {
      return false;
    }
    if (!hasAccess(store.state.user.user, item.meta?.access as PageAccess)) {
      return false;
    }
    return true;
  });
});

console.log("visible: ", visibleRules);

const router = useRouter();
const doMenuClick = (key: string) => {
  router.push(key);
};

const selectedKeys = ref([["/"]]);
router.afterEach((to, from, failure) => {
  selectedKeys.value = [to.path];
});

setTimeout(() => {
  store.dispatch("user/getLoginUser");
}, 3000);
</script>

<template>
  <div id="globalHeader">
    <a-row align="center">
      <a-col flex="auto">
        <a-menu
          mode="horizontal"
          :selected-keys="selectedKeys"
          :default-selected-keys="[1]"
          @menu-item-click="doMenuClick"
        >
          <a-menu-item
            key="0"
            :style="{ padding: 0, marginRight: '38px' }"
            disabled
          >
            <div
              :style="{
                width: '80px',
                height: '30px',
                borderRadius: '2px',
                background: 'var(--color-fill-3)',
                cursor: 'text',
              }"
            />
          </a-menu-item>
          <a-menu-item :key="item.path" v-for="item in visibleRules">
            {{ item.name }}
          </a-menu-item>
        </a-menu>
      </a-col>
      <a-col flex="100px">
        <div>
          {{ store.state.user?.loginUser.userName ?? "未登录" }}
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<style scoped></style>
