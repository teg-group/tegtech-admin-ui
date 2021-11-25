import request from '@/utils/request'

// 商品列表
export function getProductList(data) {
  return request({
    url: `/product/list`,
    method: 'get',
    params: data
  }).then(res => {
      return {
          rows: res.rows,
          total: res.total
      }
  })
}

// 上下架
export function productState(data) {
    return request({
      url: `/product/status/${data.id}`,
      method: 'put',
    }).then(res => {
    })
}


export function getProductManageList(data) {
    return request({
      url: `/productManage/list`,
      method: 'get',
      params: data
    }).then(res => {
        return {
            rows: res.rows,
            total: res.total
        }
    })
  }