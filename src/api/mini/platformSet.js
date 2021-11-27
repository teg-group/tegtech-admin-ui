import request from "@/utils/request";

// 积分设置-获取积分
export function getIntegral(query) {
  return request({
    url: "/integral",
    method: "get",
    params: query
  });
}

// 积分设置-保存更改
export function saveIntegral(data) {
  return request({
    url: "/integral",
    method: "put",
    data: data
  });
}

// 获取运费设置状态
export function getFreightStatus(query) {
  return request({
    url: "/freight/status",
    method: "put",
    params: query
  });
}

// 开启/关闭运费设置
export function changeFreightStatus(data) {
  return request({
    url: "/freight/status",
    method: "put",
    data: data
  });
}

// 分页查询运费信息列表
export function getFreight(data) {
  return request({
    url: "/freight/list",
    method: "get",
    data: data
  });
}

// 获取运费详细信息
export function getFreightDetail(id) {
  return request({
    url: `/freight/${id}`,
    method: "get"
  });
}

// 新增运费信息
export function addFreight(data) {
  return request({
    url: `/freight`,
    method: "post",
    data: data
  });
}

// 修改运费信息
export function editFreight(data) {
  return request({
    url: "/freight",
    method: "put",
    data: data
  });
}

// 删除运费信息
export function delFreight(id) {
  return request({
    url: `/freight/${id}`,
    method: "delete"
  });
}

// 获取中国省份信息列表
export function getProvins(query) {
  return request({
    url: `/freight/provins`,
    method: "get",
    params: query
  });
}
