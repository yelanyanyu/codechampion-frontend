<template>
  <div id="viewQuestionView" class="view-question-container">
    <a-row :gutter="[24, 24]">
      <a-col :md="10" :xs="24">
        <a-tabs default-active-key="question" class="question-tabs">
          <a-tab-pane key="question" title="题目">
            <a-card
              v-if="question"
              class="question-card"
              :bordered="false"
              :header-style="{ background: '#f5f7fa', padding: '16px 20px' }"
            >
              <template #title>
                <div class="card-title-container">
                  <span class="question-title">{{ question.title }}</span>
                  <a-space wrap>
                    <a-tag
                      v-for="(tag, index) of question.tags"
                      :key="index"
                      color="#165dff"
                      bordered
                      >{{ tag }}
                    </a-tag>
                  </a-space>
                </div>
              </template>
              <div class="judge-conditions">
                <a-descriptions
                  title="判题条件"
                  :column="{ xs: 1, md: 3, lg: 3 }"
                  size="small"
                  :label-style="{ fontWeight: 'bold' }"
                  :content-style="{ textAlign: 'center' }"
                  bordered
                >
                  <a-descriptions-item label="时间限制">
                    <a-tag color="blue"
                      >{{ question.judgeConfig.timeLimit ?? 0 }} ms</a-tag
                    >
                  </a-descriptions-item>
                  <a-descriptions-item label="内存限制">
                    <a-tag color="orange"
                      >{{ question.judgeConfig.memoryLimit ?? 0 }} MB</a-tag
                    >
                  </a-descriptions-item>
                  <a-descriptions-item label="堆栈限制">
                    <a-tag color="purple"
                      >{{ question.judgeConfig.stackLimit ?? 0 }} MB</a-tag
                    >
                  </a-descriptions-item>
                </a-descriptions>
              </div>

              <div class="md-viewer-container">
                <a-scrollbar
                  style="height: calc(100vh - 300px); overflow: auto"
                >
                  <MdViewer :value="question.content || ''"></MdViewer>
                </a-scrollbar>
              </div>
            </a-card>
          </a-tab-pane>
          <a-tab-pane key="comment" title="评论" disabled> 评论区</a-tab-pane>
          <a-tab-pane key="answer" title="答案"> 暂时无法查看答案</a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :md="14" :xs="24">
        <a-card class="code-editor-card" :bordered="false">
          <template #title>
            <div class="editor-header">
              <span>代码编辑器</span>
              <a-select v-model="form.language" style="width: 120px">
                <a-option value="java">Java</a-option>
                <a-option value="cpp">C++</a-option>
                <a-option value="python">Python</a-option>
              </a-select>
            </div>
          </template>
          <CodeEditor
            :value="form.code"
            :handleChange="(v) => (form.code = v)"
          ></CodeEditor>
          <a-button
            type="primary"
            size="large"
            :style="{ width: '200px' }"
            @click="doSubmit"
            status="success"
          >
            <template #icon>
              <icon-send />
            </template>
            提交代码
          </a-button>
          <template #footer>
            <div class="submit-container"></div>
          </template>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, withDefaults, defineProps } from "vue";
import {
  QuestionControllerService,
  QuestionSubmitAddRequest,
  QuestionVO,
} from "../../../generated";
import { Message } from "@arco-design/web-vue";
import { useRouter } from "vue-router";
import CodeEditor from "@/components/CodeEditor.vue";
import MdViewer from "@/components/MdViewer.vue";

const router = useRouter();
const question = ref<QuestionVO>();
const form = ref<QuestionSubmitAddRequest>({
  language: "java",
  code: "",
});

interface Props {
  id: string;
}

const doSubmit = async () => {
  // 确保设置了questionId
  form.value.questionId = props.id as any;
  // console.log("submit: ", form.value);
  const res = await QuestionControllerService.doQuestionSubmitUsingPost(
    form.value
  );
  if (res.code === 0) {
    Message.success("提交成功");
  } else {
    Message.error("提交失败" + (res.message ? `: ${res.message}` : ""));
  }
};
const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});
const loadData = async () => {
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id as any
  );
  if (res.code === 0) {
    question.value = res.data;
  } else {
    Message.error("加载失败" + res.message);
  }
};
onMounted(() => {
  loadData();
});
</script>
<style scoped>
.view-question-container {
  padding: 16px;
}

.question-tabs {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.question-card {
  margin-bottom: 16px;
}

.judge-conditions {
  margin-bottom: 16px;
}

.card-title-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.question-title {
  font-weight: bold;
  font-size: 16px;
  margin-right: 12px;
}

.md-viewer-container {
  margin-top: 16px;
  border: 1px solid #e5e6eb;
  border-radius: 4px;
  background-color: #fff;
}

.code-editor-card {
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.code-editor-card :deep(.arco-card-body) {
  flex: 1;
  overflow: hidden;
  padding: 0;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 16px;
}

.submit-container {
  display: flex;
  justify-content: center;
  padding: 16px;
  background: #fff;
  border-top: 1px solid var(--color-border);
}

/* 确保CodeEditor组件不会覆盖提交按钮 */
:deep(.CodeMirror) {
  height: calc(100% - 120px) !important;
}
</style>
