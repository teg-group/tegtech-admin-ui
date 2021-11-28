import request from "@/utils/request";

// 获取banner列表
export function getBannerList(query) {
  return request({
    url: "/banner/list",
    method: "get",
    params: query
  });
}

// 获取banner详细信息
export function getBannerDetail(id) {
  return request({
    url: `/banner/${id}`,
    method: "get"
  });
}

// 新增banner
export function addBanner(data) {
  return request({
    url: `/banner`,
    method: "post",
    data: data
  });
}

// 修改banner
export function editBanner(data) {
  return request({
    url: "/banner",
    method: "put",
    data: data
  });
}

// 删除banner
export function delBanner(id) {
  return request({
    url: `/banner/${id}`,
    method: "delete"
  });
}

// 开启/关闭banner
export function changeBanner(id, data) {
  return request({
    url: `/banner/${id}`,
    method: "put",
    data: data
  });
}
