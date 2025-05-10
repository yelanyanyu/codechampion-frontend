import { RouteRecordRaw } from "vue-router";
import ExampleView from "@/views/ExampleView.vue";
import NoAuthView from "@/views/NoAuthView.vue";
import AdminView from "@/views/AdminView.vue";
import HideView from "@/views/HideView.vue";
import { PageAccess } from "@/access/types";
import UserLayout from "@/layouts/UserLayout.vue";
import UserLoginView from "@/views/UserLoginView.vue";
import UserRegisterView from "@/views/UserRegisterView.vue";
import AddQuestionView from "@/views/question/AddQuestionView.vue";
import ManageQuestionView from "@/views/question/ManageQuestionView.vue";
import QuestionsView from "@/views/question/QuestionsView.vue";
import ViewQuestionsView from "@/views/question/ViewQuestionsView.vue";
import QuestionSubmitView from "@/views/question/QuestionSubmitView.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/user",
    name: "用户",
    component: UserLayout,
    meta: {
      isHide: true,
    },
    children: [
      {
        path: "/user/login",
        name: "用户登录",
        component: UserLoginView,
        meta: {
          access: PageAccess.GUEST,
        },
      },
      {
        path: "/user/register",
        name: "用户注册",
        component: UserRegisterView,
        meta: {
          access: PageAccess.GUEST,
        },
      },
    ],
  },
  {
    path: "/question_submit",
    name: "查看提交信息",
    component: QuestionSubmitView,
  },
  {
    path: "/add/question",
    name: "添加题目",
    component: AddQuestionView,
    meta: {
      access: PageAccess.USER,
      isHide: true,
    },
  },
  {
    path: "/manage/question",
    name: "管理题目",
    component: ManageQuestionView,
    meta: {
      access: PageAccess.USER,
      // isHide: true,
    },
  },
  {
    path: "/update/question",
    name: "修改题目",
    component: AddQuestionView,
    meta: {
      isHide: true,
      access: PageAccess.USER,
    },
  },
  {
    path: "/",
    name: "浏览题目",
    component: QuestionsView,
  },
  {
    path: "/view/question/:id",
    name: "在线做题",
    props: true,
    component: ViewQuestionsView,
    meta: {
      access: PageAccess.USER,
      isHide: true,
    },
  },
  // {
  //   path: "/about",
  //   name: "关于我的",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  // },
  {
    path: "/noAuth",
    name: "没有权限",
    component: NoAuthView,
    meta: {
      isHide: true,
    },
  },
  // {
  //   path: "/admin",
  //   name: "管理员",
  //   component: AdminView,
  //   meta: {
  //     access: PageAccess.ADMIN,
  //   },
  // },
  // {
  //   path: "/hide",
  //   name: "隐藏页面",
  //   component: HideView,
  //   meta: {
  //     isHide: true,
  //   },
  // },
];
