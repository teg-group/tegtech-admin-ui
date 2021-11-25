import request from '@/utils/request'

// 查询登录日志列表
export function list(query) {
  return request({
    url: '/monitor/loginlog/list',
    method: 'get',
    params: query
  })
}

// 删除登录日志
export function delLoginLog(id) {
  return request({
    url: '/monitor/loginlog/' + id,
    method: 'delete'
  })
}

// 清空登录日志
export function cleanLoginLog() {
  return request({
    url: '/monitor/loginlog/clean',
    method: 'delete'
  })
}

// 导出登录日志
export function exportLoginLog(query) {
  return request({
    url: '/monitor/loginlog/export',
    method: 'get',
    responseType: 'blob',
    params: query
  })
}