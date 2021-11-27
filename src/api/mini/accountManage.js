import request from '@/utils/request'

// 账号管理
export function queryAccountManage(data) {
  return request({
    url: `/user/list`,
    method: 'get',
    params: data
  }).then(res => {
      return {
          rows: res.rows,
          total: res.total
      }
  })
}

// 宠物列表
export function queryPetList(data) {
  return request({
    url: `/pet/list`,
    method: 'get',
    params: data
  }).then(res => {
      return {
          rows: res.rows,
          total: res.total
      }
  })
}

// 领卡资料
export function queryUrinalysis(data) {
  return request({
    url: `/order/urinalysis/list`,
    method: 'get',
    params: data
  }).then(res => {
      return {
          rows: res.rows,
          total: res.total
      }
  })
}

//修改物流信息
export function modifyOrder(data) {
  return request({
    url: `/order`,
    method: 'put',
    params: data
  }).then(res => {
      return {
          rows: res.code,
          msg: res.msg
      }
  })
}

//订单管理
export function queryOrderList(data) {
  return request({
    url: `/order/product/list`,
    method: 'get',
    params: data
  }).then(res => {
      return {
          rows: res.rows,
          total: res.total
      }
  })
}


