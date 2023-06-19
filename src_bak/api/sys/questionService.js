import request from 'http-request';
import { ELASTICSEARCH_PATH as prefix, CONFIG_SERVICE } from 'config';

/* ======================= 问答 ==================== */
// 获取问答列表
export function getQuestionList(params) {
  return request.post(`${prefix}/questionsManage/list`, params);
}
// 添加问答
export function addQuestion(params) {
  return request.post(`${prefix}/questionsManage/add`, params);
}
// 编辑问答
export function updateQuestion(params) {
  return request.post(`${prefix}/questionsManage/update`, params);
}
// 删除问答
export function deleteQuestion(params) {
  return request.post(`${prefix}/questionsManage/delete`, params);
}
// 获取问题类型列表
export function getQuestionTypeList(params) {
  return request.post(`${prefix}/questionType/list`, params);
}
// 获取应用和菜单列表
export function getApplicationAndMenuList(params) {
  return request.post(`${prefix}/applicationMenu/getAppNameAndMenu`, params);
}
// 文件上传
export function updateFileManage(params) {
  return request.post(`${CONFIG_SERVICE}/search/uploadFile`, params, {
    isUseToken: false,
    isPublicAgent: false,
  });
}
// 文件删除
export function deleteFileManage(params) {
  return request.post(`${prefix}/fileManage/delete`, params);
}
// 获取文件私有地址
export function getFileManageUrl(params) {
  return request.post(`${prefix}/fileManage/getPrivateUrl`, params);
}
// 获取更新记录列表
export function getHistoricalList(params) {
  return request.post(`${prefix}/questionsManage/historicalList`, params);
}
// 获取问题编码
export function getAcquireCode(params) {
  return request.post(`${prefix}/questionsManage/acquireCode`, params);
}
// 通过菜单路径查询是否有问答
export function findByMenuUrl(params) {
  return request.post(`${CONFIG_SERVICE}/search/findByMenuUrl`, params, {
    isPublicAgent: false,
  });
}
// 查询是否有问答的操作记录
export function operationRecordAdd(params) {
  return request.post(`${CONFIG_SERVICE}/search/operationRecordAdd`, params, {
    isPublicAgent: false,
  });
}