<script setup lang="ts"></script>

<template>
  <div id="userLayout">
    <a-layout-header class="header">
      <!--<GlobalHeader />-->
      用户布局
    </a-layout-header>
    <a-layout-content class="content">
      <router-view />
    </a-layout-content>
    <a-layout-footer class="footer">
      <a-space direction="vertical" :size="4" align="center">
        <a-space :size="16">
          <a-link href="https://blog.yelanyanyu.com">Blog</a-link>
          <a-link>Privacy</a-link>
          <a-link>Terms</a-link>
          <a-link>Help</a-link>
        </a-space>
        <a-typography-text type="secondary">
          Copyright © 2024 yelanyanyu. All rights reserved.
        </a-typography-text>
      </a-space>
    </a-layout-footer>
  </div>
</template>

<style scoped>
#userLayout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  height: 64px;
  line-height: 64px;
  background: linear-gradient(to right, #ffffff, #f8f9fa);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 0 24px;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 1000;
}

.menu-demo {
  height: 100%;
}

:deep(.arco-menu) {
  background: transparent;
  border-bottom: none;
}

#userLayout .content {
  flex: 1;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4edf9 100%);
  padding: 24px;
  margin-top: 64px;
  min-height: calc(100vh - 128px);
}

.footer {
  height: 64px;
  line-height: 64px;
  text-align: center;
  background: linear-gradient(to right, #ffffff, #f8f9fa);
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  padding: 0 24px;
}

@media screen and (max-width: 768px) {
  .header {
    height: 56px;
    line-height: 56px;
    padding: 0 16px;
  }

  #userLayout .content {
    margin-top: 56px;
    padding: 16px;
    min-height: calc(100vh - 112px);
  }

  .footer {
    height: 56px;
    line-height: 56px;
    padding: 0 16px;
  }
}
</style>
