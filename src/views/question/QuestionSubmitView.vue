<template>
  <div id="questionSubmitView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="questionId" label="题号" style="min-width: 240px">
        <a-input
          v-model="searchParams.questionId"
          placeholder="请输入题号"
          allow-clear
        />
      </a-form-item>
      <a-form-item field="language" label="编程语言" style="min-width: 240px">
        <a-select
          :style="{ width: '320px' }"
          placeholder="请选择编程语言"
          v-model="searchParams.language"
          allow-clear
        >
          <a-option>java</a-option>
          <a-option>cpp</a-option>
          <a-option>go</a-option>
          <a-option>html</a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="userId" label="提交者ID" style="min-width: 240px">
        <a-input
          v-model="searchParams.userId"
          placeholder="请输入用户名"
          allow-clear
        />
      </a-form-item>
      <a-form-item>
        <a-button @click="doSubmit()" type="primary">搜索</a-button>
      </a-form-item>
    </a-form>
    <a-divider :size="0"></a-divider>
    <a-table
      :columns="columns"
      :data="dataList"
      :pagination="{
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        showTotal: true,
        total,
      }"
      @page-change="onPageChange"
    >
      <template #judgeInfo="{ record }">
        <div v-if="record.judgeInfo" class="judge-info-card">
          <div class="judge-main-info">
            <a-tag
              :color="getJudgeResultColor(parseJudgeInfo(record.judgeInfo))"
              size="medium"
            >
              {{ formatJudgeResult(parseJudgeInfo(record.judgeInfo)) }}
            </a-tag>

            <a-button
              type="text"
              size="mini"
              @click="toggleJudgeDetail(record.id)"
            >
              {{
                expandedJudgeDetails.includes(record.id)
                  ? "收起详情"
                  : "查看详情"
              }}
              <template #icon>
                <icon-down v-if="!expandedJudgeDetails.includes(record.id)" />
                <icon-up v-else />
              </template>
            </a-button>
          </div>

          <div
            v-show="expandedJudgeDetails.includes(record.id)"
            class="judge-detail-info"
          >
            <a-descriptions
              :column="1"
              size="small"
              layout="inline-horizontal"
              :label-style="{ fontWeight: 'bold', minWidth: '80px' }"
              bordered
            >
              <a-descriptions-item
                v-for="(value, key) in getDetailedJudgeInfo(
                  parseJudgeInfo(record.judgeInfo)
                )"
                :key="key"
                :label="formatLabel(String(key))"
              >
                {{ value }}
              </a-descriptions-item>
            </a-descriptions>
          </div>
        </div>
        <a-empty v-else description="无判题信息" />
      </template>

      <template #status="{ record }">
        <a-tag :color="getStatusColor(record.status)" size="medium">
          {{ getStatusText(record.status) }}
        </a-tag>
      </template>

      <template #questionId="{ record }">
        <a-link @click="toQuestionPage({ id: record.questionId })">
          {{ record.questionId }}
        </a-link>
      </template>

      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
      </template>

      <template #userId="{ record }">
        <a-tooltip position="top">
          <template #content>ID: {{ record.userId }} (点击复制)</template>
          <div v-if="record.userId">
            <template v-if="record.userAccount">
              <a-link @click="copyToClipboard(record.userId)">
                {{ record.userAccount }}
              </a-link>
            </template>
            <template v-else-if="userMap[record.userId]">
              <a-link @click="copyToClipboard(record.userId)">
                {{ userMap[record.userId] }}
              </a-link>
            </template>
            <template v-else>
              <a-space>
                <a-spin v-if="loadingUserInfo" :size="14" />
                <a-link
                  @click="copyToClipboard(record.userId)"
                  style="cursor: pointer"
                >
                  {{
                    record.userName ||
                    record.createdBy ||
                    `用户${record.userId.toString().substring(0, 6)}...`
                  }}
                </a-link>
              </a-space>
            </template>
          </div>
          <div v-else>-</div>
        </a-tooltip>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  Question,
  QuestionControllerService,
  QuestionSubmitQueryRequest,
  UserControllerService,
} from "../../../generated";
import { Message } from "@arco-design/web-vue";
import { useRouter } from "vue-router";
import moment from "moment";

const router = useRouter();
const dataList = ref([]);
const total = ref(0);
const searchParams = ref<QuestionSubmitQueryRequest & { userAccount?: string }>(
  {
    questionId: undefined,
    language: undefined,
    userId: undefined,
    userAccount: undefined,
    pageSize: 10,
    current: 1,
  }
);

// 添加用户信息缓存
const userMap = ref<Record<string, string>>({});
const loadingUserInfo = ref(false);

// 添加控制展开/折叠状态的变量
const expandedJudgeDetails = ref<(string | number)[]>([]);

// 加载用户信息
const loadUserInfo = async (userId: string | number) => {
  if (!userId || userMap.value[userId]) return;

  loadingUserInfo.value = true;
  try {
    // 使用正确的API获取用户信息
    const res = await UserControllerService.getUserByIdUsingGet(userId as any);

    // 增加调试信息
    console.log("获取用户信息响应:", res);

    if (res.code === 0 && res.data) {
      // 确保正确获取userAccount，根据实际API结构调整
      if (res.data.userAccount) {
        userMap.value[userId] = res.data.userAccount;
      } else if (res.data.userName) {
        // 尝试其他可能的字段名
        userMap.value[userId] = res.data.userName;
      } else {
        // 使用userProfile.userAccount 或其他嵌套字段
        userMap.value[userId] =
          res.data?.userProfile?.userAccount || `用户${userId}`;
      }
    } else {
      // 尝试使用备用接口 - 如果有的话
      try {
        const userRes = await UserControllerService.getLoginUserUsingGet();
        if (userRes.code === 0 && userRes.data && userRes.data.id == userId) {
          userMap.value[userId] =
            userRes.data.userAccount ||
            userRes.data.userName ||
            `用户${userId}`;
        } else {
          userMap.value[userId] = `用户${userId}`;
        }
      } catch {
        userMap.value[userId] = `用户${userId}`;
      }
    }
  } catch (error) {
    console.error("获取用户信息失败:", error);
    userMap.value[userId] = `用户${userId}`;
  } finally {
    loadingUserInfo.value = false;
  }
};

const loadData = async () => {
  // 构建搜索参数
  const params = {
    ...searchParams.value,
    sortField: "createTime",
    sortOrder: "descend",
  };

  // 发送请求
  const res = await QuestionControllerService.listQuestionSubmitByPageUsingPost(
    params
  );

  if (res.code === 0) {
    console.log("提交记录数据:", res.data.records);

    // 检查提交记录中是否已包含用户账号信息
    dataList.value = res.data.records.map((record: any) => {
      // 如果记录中已有userAccount，直接使用
      if (record.userAccount) {
        userMap.value[record.userId] = record.userAccount;
      }
      return record;
    });

    total.value = res.data.total;

    // 单独处理没有用户信息的记录
    setTimeout(() => {
      const userIds = dataList.value
        .filter(
          (item: any) => item && item.userId && !userMap.value[item.userId]
        )
        .map((item: any) => item.userId);

      // 对于新的用户ID，批量加载用户信息
      if (userIds.length > 0) {
        console.log("需要加载用户信息的ID:", userIds);
        userIds.forEach((id: any) => {
          if (id) loadUserInfo(id);
        });
      }
    }, 0);
  } else {
    Message.error("加载失败" + res.message);
  }
};

onMounted(() => {
  loadData();
});

// 修复判题信息解析函数
const parseJudgeInfo = (judgeInfo: any) => {
  // 如果已经是对象，直接返回
  if (judgeInfo && typeof judgeInfo === "object") {
    return judgeInfo;
  }

  // 如果是字符串，尝试解析
  if (judgeInfo && typeof judgeInfo === "string") {
    try {
      return JSON.parse(judgeInfo);
    } catch (error) {
      console.error("解析判题信息失败:", error);
      return { message: String(judgeInfo) }; // 不能解析就作为普通文本显示
    }
  }

  // 处理空值情况
  if (judgeInfo === null || judgeInfo === undefined) {
    return { message: "暂无判题信息" };
  }

  // 其他情况
  return { message: String(judgeInfo) };
};

// 格式化标签名
const formatLabel = (key: string) => {
  const labelMap: Record<string, string> = {
    message: "信息",
    memory: "内存",
    time: "耗时",
    // 添加更多映射
  };
  return labelMap[key] || key;
};

// 获取状态对应的颜色
const getStatusColor = (status: number) => {
  const statusColorMap: Record<number, string> = {
    0: "orange", // 等待中
    1: "blue", // 判题中
    2: "green", // 成功
    3: "red", // 失败
  };
  return statusColorMap[status] || "gray";
};

// 获取状态文本
const getStatusText = (status: number) => {
  const statusTextMap: Record<number, string> = {
    0: "等待中",
    1: "判题中",
    2: "成功",
    3: "失败",
  };
  return statusTextMap[status] || "未知状态";
};

// 切换展开/折叠状态的函数
const toggleJudgeDetail = (id: string | number) => {
  const index = expandedJudgeDetails.value.indexOf(id);
  if (index === -1) {
    expandedJudgeDetails.value.push(id);
  } else {
    expandedJudgeDetails.value.splice(index, 1);
  }
};

// 获取判题结果的主要状态
const formatJudgeResult = (judgeInfo: any) => {
  if (!judgeInfo) return "未知";

  // 优先使用状态字段
  if (judgeInfo.status) return judgeInfo.status;

  // 其次使用消息字段
  if (judgeInfo.message) {
    // 如果message包含常见判题结果，直接返回
    const commonResults = [
      "Accepted",
      "Wrong Answer",
      "Time Limit Exceeded",
      "Memory Limit Exceeded",
      "Runtime Error",
      "Compile Error",
    ];
    for (const result of commonResults) {
      if (judgeInfo.message.includes(result)) {
        return result;
      }
    }
    return judgeInfo.message;
  }

  // 如果有结果字段
  if (judgeInfo.result) return judgeInfo.result;

  // 如果上述都没有，显示第一个非对象类型的字段
  for (const key in judgeInfo) {
    if (typeof judgeInfo[key] !== "object" && judgeInfo[key] !== null) {
      return `${key}: ${judgeInfo[key]}`;
    }
  }

  return "未知状态";
};

// 获取判题结果的颜色
const getJudgeResultColor = (judgeInfo: any) => {
  if (!judgeInfo) return "gray";

  const result = formatJudgeResult(judgeInfo).toLowerCase();

  if (result.includes("accepted")) return "green";
  if (result.includes("wrong answer")) return "red";
  if (result.includes("time limit")) return "orange";
  if (result.includes("memory limit")) return "purple";
  if (result.includes("runtime error")) return "red";
  if (result.includes("compile error")) return "pink";

  return "blue";
};

// 获取详细判题信息（排除主要状态信息）
const getDetailedJudgeInfo = (judgeInfo: any) => {
  if (!judgeInfo || typeof judgeInfo !== "object") return {};

  // 复制一个对象，避免修改原对象
  const detailedInfo = { ...judgeInfo };

  // 移除已在主要信息中显示的字段
  const mainFields = ["status", "message", "result"];
  mainFields.forEach((field) => {
    delete detailedInfo[field];
  });

  return detailedInfo;
};

const columns = [
  {
    title: "提交号",
    dataIndex: "id",
  },
  {
    title: "编程语言",
    dataIndex: "language",
  },
  {
    title: "判题状态",
    dataIndex: "status",
    slotName: "status",
    fixed: "left" as const,
    width: 120,
  },
  {
    title: "判题信息",
    slotName: "judgeInfo",
  },
  {
    title: "题目",
    dataIndex: "questionId",
    slotName: "questionId",
  },
  {
    title: "提交者",
    dataIndex: "userId",
    slotName: "userId",
  },
  {
    title: "创建时间",
    slotName: "createTime",
  },
];

watchEffect(() => {
  loadData();
});

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

// 跳转到做题页面
const toQuestionPage = (question: Question) => {
  router.push({
    path: `/view/question/${question.id}`,
  });
};

const doSubmit = () => {
  // 重置搜索页号
  searchParams.value.current = 1;
  loadData();
};

// 添加复制到剪贴板功能
const copyToClipboard = async (userId: string | number) => {
  try {
    await navigator.clipboard.writeText(userId.toString());
    Message.success({
      content: `已复制用户ID: ${userId}`,
      duration: 2000,
    });
  } catch (err) {
    console.error("复制到剪贴板失败:", err);
    Message.error({
      content: "复制失败，请手动复制",
      duration: 2000,
    });
  }
};
</script>

<style scoped>
#questionSubmitView {
  max-width: 1280px;
  margin: 0 auto;
  padding: 16px;
}

.judge-main-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.judge-detail-info {
  margin-top: 8px;
  border-top: 1px dashed #e5e6eb;
  padding-top: 8px;
}

.judge-info-card {
  background-color: #f5f7fa;
  border-radius: 4px;
  padding: 12px;
  border: 1px solid #e5e6eb;
}

:deep(.arco-descriptions-body) {
  width: 100%;
}

:deep(.arco-descriptions-item-label) {
  color: #86909c;
}

:deep(.arco-tag.arco-tag-size-medium) {
  font-size: 14px;
  padding: 4px 10px;
  font-weight: bold;
}
</style>
