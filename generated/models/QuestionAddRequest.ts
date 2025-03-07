/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JudgeCase } from './JudgeCase';
import type { JudgeConfig } from './JudgeConfig';
export type QuestionAddRequest = {
    answer?: string;
    content?: string;
    createTime?: string;
    favourNum?: number;
    id?: number;
    isDelete?: number;
    judgeCase?: Array<JudgeCase>;
    judgeConfig?: JudgeConfig;
    tags?: Array<string>;
    thumbNum?: number;
    title?: string;
    updateTime?: string;
    userId?: number;
};

