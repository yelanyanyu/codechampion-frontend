<script setup lang="ts">
import { reactive, ref } from "vue";
import { UserControllerService, UserLoginRequest } from "../../generated";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { Message } from "@arco-design/web-vue";

const form = reactive({
  userAccount: "",
  userPassword: "",
  // TODO: remember me
  // rememberMe: false,
} as UserLoginRequest);

const store = useStore();
const router = useRouter();

const handleSubmit = async () => {
  const res = await UserControllerService.userLoginUsingPost(form);
  if (res.code === 0) {
    await store.dispatch("user/getLoginUser");
    await router.push({
      path: "/",
      replace: true,
    });
  } else {
    Message.error("登陆失败: " + res.message);
  }
};

// 添加跳转到注册页面的函数
const goToRegister = () => {
  router.push({
    path: "/user/register",
    replace: true, // 使用replace而不是push
  });
};
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <!-- Logo -->
      <div class="logo-container">
        <img src="@/assets/logo.png" alt="Logo" class="logo" />
        <h2>在线判题系统</h2>
      </div>

      <!-- Login Form -->
      <div class="form-container">
        <a-form :model="form" class="login-form" @submit="handleSubmit">
          <!-- Username Input -->
          <div class="form-input">
            <a-form-item label="用户名">
              <a-input
                v-model="form.userAccount"
                placeholder="请输入用户名"
                allow-clear
              >
              </a-input>
            </a-form-item>

            <!-- Password Input -->
            <a-form-item label="密码">
              <a-input-password
                v-model="form.userPassword"
                placeholder="请输入密码"
                allow-clear
              >
              </a-input-password>
            </a-form-item>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="login-options">
            <a-checkbox v-model="form.rememberMe">记住我</a-checkbox>
            <a-link>忘记密码？</a-link>
          </div>

          <!-- Login Button -->
          <a-button type="primary" long class="login-button" html-type="submit">
            登录
          </a-button>
        </a-form>
      </div>

      <!-- Third-party Login -->
      <div class="third-party-login">
        <p class="divider">其他登录方式</p>
        <div class="login-icons">
          <a-space :size="24">
            <a-button shape="circle">
              <template #icon><icon-github /></template>
            </a-button>
            <a-button shape="circle">
              <template #icon><icon-google /></template>
            </a-button>
          </a-space>
        </div>
      </div>

      <!-- Register Link -->
      <div class="register-link">
        <p>
          还没有账号？
          <a-link @click="goToRegister">立即注册</a-link>
        </p>
      </div>

      <!-- Terms -->
      <div class="terms">
        <p>
          登录即表示同意
          <a-link>《用户协议》</a-link>
          和
          <a-link>《隐私政策》</a-link>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.login-box {
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  width: 400px;
}

.logo-container {
  text-align: center;
  margin-bottom: 32px;
}

.logo {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
}

.form-container {
  margin-bottom: 32px;
}

.login-form {
  width: 100%;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.login-button {
  margin-top: 8px;
}

.third-party-login {
  margin-top: 32px;
  text-align: center;
}

.divider {
  color: #86909c;
  margin-bottom: 16px;
  position: relative;
}

.divider::before,
.divider::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 96px;
  height: 1px;
  background: #e5e6eb;
}

.divider::before {
  left: 24px;
}

.divider::after {
  right: 24px;
}

.login-icons {
  margin-top: 24px;
}

.register-link {
  margin-top: 24px;
  text-align: center;
}

.terms {
  margin-top: 24px;
  text-align: center;
  color: #86909c;
  font-size: 12px;
}

.form-input {
  align-items: center;
}
</style>
