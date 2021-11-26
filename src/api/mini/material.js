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

// 商品管理列表
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

  // 批量修改库存
  export function batchUpdateStock(data) {
    return request({
      url: `/productManage/batchUpdateStock`,
      method: 'put',
      data: data
    }).then(res => {
    })
}
// 修改单个库存

export function updateStock(data) {
  return request({
    url: `/productManage/updateStock`,
    method: 'put',
    data: data
  }).then(res => {
  })
}