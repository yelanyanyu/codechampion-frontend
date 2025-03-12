<script setup lang="ts">
import { onMounted, ref, watchEffect, h } from "vue";
import { Question, QuestionControllerService } from "../../../generated";
import { Message } from "@arco-design/web-vue";
import { useRouter } from "vue-router";

const router = useRouter();
const dataList = ref([]);
const total = ref(0);
const loading = ref(false);
const searchParams = ref({
  pageSize: 10,
  current: 1,
  title: "",
  tags: [],
});

const loadData = async () => {
  loading.value = true;
  try {
    const res = await QuestionControllerService.listQuestionByPageUsingPost(
      searchParams.value
    );
    if (res.code === 0) {
      dataList.value = res.data.records;
      total.value = res.data.total;
    } else {
      Message.error("加载失败" + res.msg);
    }
  } catch (error) {
    Message.error("加载错误: " + error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadData();
});

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    width: 80,
    ellipsis: true,
  },
  {
    title: "标题",
    dataIndex: "title",
    width: 200,
  },
  {
    title: "标签",
    dataIndex: "tags",
    slotName: "tags",
  },
  {
    title: "提交/通过",
    width: 120,
    render: ({ record }: { record: Question }) => {
      return h("div", {}, [
        h("div", {}, `${record.submitNum || 0} 次提交`),
        h("div", {}, `${record.acceptedNum || 0} 次通过`),
      ]);
    },
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    width: 180,
  },
  {
    title: "操作",
    slotName: "optional",
    width: 160,
    fixed: "right",
  },
];

const doUpdate = (question: Question) => {
  router.push({
    path: "/update/question",
    query: {
      id: question.id,
    },
  });
};

const doDelete = async (question: Question) => {
  loading.value = true;
  try {
    const res = await QuestionControllerService.deleteQuestionUsingPost({
      id: question.id,
    });
    if (res.code === 0) {
      Message.success("删除成功");
      await loadData();
    } else {
      Message.error("删除失败" + res.msg);
    }
  } catch (error) {
    Message.error("删除错误: " + error);
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  searchParams.value.current = 1;
  loadData();
};

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

const onPageSizeChange = (pageSize: number) => {
  searchParams.value = {
    ...searchParams.value,
    pageSize: pageSize,
  };
};

watchEffect(() => {
  loadData();
});

const createNewQuestion = () => {
  router.push("/add/question");
};
</script>

<template>
  <div id="manageQuestionView">
    <div class="page-header">
      <div class="header-content">
        <h2>题目管理</h2>
        <p class="subtitle">管理和编辑您的编程题目</p>
      </div>
      <div class="header-actions">
        <a-button type="primary" @click="createNewQuestion">
          <template #icon>
            <icon-plus />
          </template>
          创建题目
        </a-button>
      </div>
    </div>

    <div class="content-card">
      <!-- Search and Filters -->
      <div class="search-bar">
        <a-form :model="searchParams" layout="inline">
          <a-form-item field="title" label="名称" style="min-width: 240px">
            <a-input
              v-model="searchParams.title"
              placeholder="请输入名称"
              allow-clear
            />
          </a-form-item>
          <a-form-item field="tags" label="标签" style="min-width: 240px">
            <a-input-tag
              v-model="searchParams.tags"
              placeholder="请输入标签"
              allow-clear
            />
          </a-form-item>
          <a-form-item>
            <a-button @click="handleSearch" type="primary">提交</a-button>
          </a-form-item>
          <a-form-item>
            <a-select
              v-model="searchParams.pageSize"
              :style="{ width: '120px' }"
              @change="onPageSizeChange"
            >
              <a-option :value="5">5 条/页</a-option>
              <a-option :value="10">10 条/页</a-option>
              <a-option :value="20">20 条/页</a-option>
            </a-select>
            <a-button @click="loadData">
              <template #icon>
                <icon-refresh />
              </template>
              刷新
            </a-button>
          </a-form-item>
        </a-form>
      </div>

      <!-- Table -->
      <a-table
        :loading="loading"
        :columns="columns"
        :data="dataList"
        :pagination="{
          pageSize: searchParams.pageSize,
          current: searchParams.current,
          showTotal: true,
          total: total,
          showPageSize: true,
        }"
        @page-change="onPageChange"
        @page-size-change="onPageSizeChange"
        stripe
        border="cell"
        :scroll="{ x: '100%' }"
      >
        <template #empty>
          <div class="empty-state">
            <icon-inbox :size="64" />
            <p>暂无题目数据</p>
            <a-button type="outline" @click="createNewQuestion">
              创建第一个题目
            </a-button>
          </div>
        </template>
        <template #optional="{ record }">
          <a-space>
            <a-button type="text" status="success" @click="doUpdate(record)">
              <template #icon>
                <icon-edit />
              </template>
              修改
            </a-button>
            <a-popconfirm
              content="确定要删除这个题目吗？此操作不可恢复。"
              @ok="doDelete(record)"
            >
              <a-button type="text" status="danger">
                <template #icon>
                  <icon-delete />
                </template>
                删除
              </a-button>
            </a-popconfirm>
          </a-space>
        </template>
        <template #tags="{ record }">
          <a-space wrap>
            <a-tag
              v-for="(tag, index) of JSON.parse(record.tags)"
              :key="index"
              >{{ tag }}</a-tag
            >
          </a-space></template
        >
      </a-table>
    </div>
  </div>
</template>

<style scoped>
#manageQuestionView {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-content h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-1);
}

.subtitle {
  margin: 4px 0 0;
  color: var(--color-text-3);
  font-size: 14px;
}

.content-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 24px;
}

.search-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
  color: var(--color-text-3);
}

.empty-state p {
  margin: 16px 0;
}

:deep(.arco-table-th) {
  background-color: var(--color-fill-2) !important;
  font-weight: 600;
}

:deep(.arco-pagination) {
  margin-top: 16px;
  justify-content: flex-end;
}

@media screen and (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .header-actions {
    margin-top: 16px;
  }

  .search-bar {
    flex-direction: column;
    gap: 16px;
  }

  #manageQuestionView {
    padding: 16px;
  }

  .content-card {
    padding: 16px;
  }
}
</style>
