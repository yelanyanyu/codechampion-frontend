<template>
  <div id="addQuestionView">
    <div class="container">
      <div class="header">
        <h2>创建题目</h2>
        <p class="subtitle">创建一个新的编程题目</p>
      </div>

      <a-form :model="form" layout="vertical" @submit="handleSubmit">
        <!-- 基本信息部分 -->
        <div class="section">
          <div class="section-title">基本信息</div>
          <a-form-item field="title" label="题目标题" tooltip="请输入标题">
            <a-input
              v-model="form.title"
              placeholder="请输入题目标题"
              allow-clear
            />
          </a-form-item>

          <a-form-item field="content" label="题目描述">
            <MdEditor :value="form.content" :handle-change="onContentChange" />
          </a-form-item>

          <a-form-item field="answer" label="题解">
            <MdEditor :value="form.answer" :handle-change="onAnswerChange" />
          </a-form-item>

          <a-form-item field="tags" label="标签">
            <a-input-tag
              v-model="form.tags"
              placeholder="输入标签后按 Enter 确认"
              allow-clear
            />
          </a-form-item>
        </div>

        <!-- 判题配置部分 -->
        <div class="section">
          <div class="section-title">判题配置</div>
          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-item field="judgeConfig.timeLimit" label="时间限制 (ms)">
                <a-input-number
                  v-model="form.judgeConfig.timeLimit"
                  placeholder="请输入时间限制"
                  mode="button"
                  size="large"
                  min="0"
                  :step="100"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item
                field="judgeConfig.memoryLimit"
                label="内存限制 (MB)"
              >
                <a-input-number
                  v-model="form.judgeConfig.memoryLimit"
                  placeholder="请输入内存限制"
                  mode="button"
                  size="large"
                  min="0"
                  :step="128"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item field="judgeConfig.stackLimit" label="堆栈限制 (MB)">
                <a-input-number
                  v-model="form.judgeConfig.stackLimit"
                  placeholder="请输入堆栈限制"
                  mode="button"
                  size="large"
                  min="0"
                  :step="128"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </div>

        <!-- 测试用例配置部分 -->
        <div class="section">
          <div class="section-title">
            <span>测试用例</span>
            <a-button
              type="outline"
              status="success"
              size="small"
              @click="handleAdd"
            >
              <template #icon>
                <icon-plus />
              </template>
              添加测试用例
            </a-button>
          </div>

          <div class="test-cases">
            <a-collapse :default-active-key="['0']">
              <a-collapse-item
                v-for="(judgeCaseItem, index) of form.judgeCase"
                :key="index"
                :header="`测试用例 ${index + 1}`"
              >
                <a-space direction="vertical" fill>
                  <a-form-item :label="`输入样例`">
                    <a-textarea
                      v-model="judgeCaseItem.input"
                      :auto-size="{ minRows: 2, maxRows: 5 }"
                      placeholder="请输入测试输入样例"
                    />
                  </a-form-item>
                  <a-form-item :label="`输出样例`">
                    <a-textarea
                      v-model="judgeCaseItem.output"
                      :auto-size="{ minRows: 2, maxRows: 5 }"
                      placeholder="请输入测试输出样例"
                    />
                  </a-form-item>
                  <div class="test-case-actions">
                    <a-button
                      @click="handleDelete(index)"
                      status="danger"
                      size="small"
                    >
                      <template #icon>
                        <icon-delete />
                      </template>
                      删除用例
                    </a-button>
                  </div>
                </a-space>
              </a-collapse-item>
            </a-collapse>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div class="submit-section">
          <a-space>
            <a-button type="secondary" size="large">预览</a-button>
            <a-button type="primary" size="large" @click="handleSubmit">
              提交题目
            </a-button>
          </a-space>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import MdEditor from "@/components/MdEditor.vue";
import {
  QuestionAddRequest,
  QuestionControllerService,
} from "../../../generated";
import { Message } from "@arco-design/web-vue";

const form = reactive<QuestionAddRequest>({
  answer: "暴力破解",
  content: "题目内容",
  judgeCase: [
    {
      input: "1 2",
      output: "3 4",
    },
  ],
  judgeConfig: {
    memoryLimit: 1024,
    stackLimit: 1024,
    timeLimit: 1000,
  },
  tags: ["栈", "简单"],
  title: "A + B",
});

const onContentChange = (value: string) => {
  form.content = value;
};

const onAnswerChange = (value: string) => {
  form.answer = value;
};

const handleSubmit = async () => {
  const res = await QuestionControllerService.addQuestionUsingPost(form);
  if (res.code === 0) {
    Message.success("创建成功");
  } else {
    Message.error("创建失败" + res.msg);
  }
};

const handleDelete = (index: number) => {
  if (form.judgeCase && form.judgeCase.length > 0) {
    form.judgeCase.splice(index, 1);
  }
};

const handleAdd = () => {
  if (form.judgeCase) {
    form.judgeCase.push({
      input: "",
      output: "",
    });
  }
};
</script>

<style scoped>
#addQuestionView {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 32px;
}

.header {
  margin-bottom: 32px;
}

.header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-1);
}

.subtitle {
  margin: 8px 0 0;
  color: var(--color-text-3);
}

.section {
  margin-bottom: 40px;
  padding: 24px;
  background: var(--color-fill-2);
  border-radius: 8px;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  font-size: 18px;
  font-weight: 500;
  color: var(--color-text-1);
}

.test-cases {
  margin-top: 16px;
}

.test-case-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
}

.submit-section {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

:deep(.arco-form-item-label-col) {
  font-weight: 500;
}

:deep(.arco-collapse-item) {
  margin-bottom: 16px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
}

:deep(.arco-input-number) {
  width: 100%;
}
</style>
