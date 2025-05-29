<script setup lang="ts">
import { reactive, ref } from "vue";
import { UserControllerService, UserRegisterRequest } from "../../generated";
import { useRouter } from "vue-router";
import { Message } from "@arco-design/web-vue";

// 注册表单数据
const form = reactive({
  userAccount: "",
  userPassword: "",
  checkPassword: "",
} as UserRegisterRequest);

// 表单校验
const formRef = ref(null);
const formRules = {
  userAccount: [
    { required: true, message: "请输入用户名" },
    { minLength: 4, message: "用户名不能少于4个字符" },
  ],
  userPassword: [
    { required: true, message: "请输入密码" },
    { minLength: 8, message: "密码不能少于8个字符" },
  ],
  checkPassword: [
    { required: true, message: "请确认密码" },
    {
      validator: (value: string, callback: (error?: string) => void) => {
        if (value !== form.userPassword) {
          callback("两次输入的密码不一致");
        } else {
          callback();
        }
      },
    },
  ],
};

const router = useRouter();

// 提交注册
const handleSubmit = async () => {
  // 验证表单 - 修复这里的验证方法
  if (!formRef.value) return;

  try {
    // 使用Promise方式调用validate
    await formRef.value.validate();

    // 如果验证通过，调用注册API
    const res = await UserControllerService.userRegisterUsingPost(form);
    if (res.code === 0) {
      Message.success("注册成功，请登录");
      await router.push("/user/login");
    } else {
      Message.error("注册失败: " + res.message);
    }
  } catch (errors) {
    // 验证失败，errors包含了错误信息
    console.error("表单验证失败:", errors);
  }
};

// 返回登录页
const goToLogin = () => {
  router.push("/user/login");
};
</script>

<template>
  <div class="register-container">
    <div class="register-box">
      <!-- Logo -->
      <div class="logo-container">
        <img src="@/assets/logo.png" alt="Logo" class="logo" />
        <h2>CodeChampion 在线评测系统</h2>
      </div>

      <!-- Register Form -->
      <div class="form-container">
        <a-form
          ref="formRef"
          :model="form"
          :rules="formRules"
          class="register-form"
          @submit="handleSubmit"
        >
          <!-- Username Input -->
          <a-form-item field="userAccount" label="用户名">
            <a-input
              v-model="form.userAccount"
              placeholder="请输入用户名"
              allow-clear
            />
          </a-form-item>

          <!-- Password Input -->
          <a-form-item field="userPassword" label="密码">
            <a-input-password
              v-model="form.userPassword"
              placeholder="请输入密码"
              allow-clear
            />
          </a-form-item>

          <!-- Confirm Password Input -->
          <a-form-item
            field="checkPassword"
            label="确认密码"
            class="password-confirm-item"
          >
            <a-input-password
              v-model="form.checkPassword"
              placeholder="请再次输入密码"
              allow-clear
            />
          </a-form-item>

          <!-- Register Button -->
          <a-button
            type="primary"
            long
            class="register-button"
            html-type="submit"
          >
            注册
          </a-button>
        </a-form>
      </div>

      <!-- Login Link -->
      <div class="login-link">
        <p>
          已有账号？
          <a-link @click="goToLogin">立即登录</a-link>
        </p>
      </div>

      <!-- Terms -->
      <div class="terms">
        <p>
          注册即表示同意
          <a-link>《用户协议》</a-link>
          和
          <a-link>《隐私政策》</a-link>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.register-box {
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

.register-form {
  width: 100%;
}

.register-button {
  margin-top: 24px;
}

.login-link {
  margin-top: 24px;
  text-align: center;
}

.terms {
  margin-top: 24px;
  text-align: center;
  color: #86909c;
  font-size: 12px;
}

/* 添加以下样式确保"确认密码"标签显示在同一行 */
:deep(.arco-form-item-label) {
  white-space: nowrap;
  min-width: 80px;
}

/* 也可以专门为确认密码添加特定样式 */
.password-confirm-item :deep(.arco-form-item-label) {
  white-space: nowrap;
  min-width: 80px;
}

/* 优化整体表单布局 */
.register-form :deep(.arco-form-item) {
  margin-bottom: 24px;
}
</style>
