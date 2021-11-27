import request from '@/utils/request'

// 上传秘钥
export function getOssSts(data) {
    return request({
      url: `/sts`,
      method: 'get',
      params: data
    }).then(res => {
        console.log(res)
        const data = res.data
        return {
            region: data.region,
            accessKeyId: data.AccessKeyId,
            accessKeySecret: data.AccessKeySecret,
            stsToken: data.region,
            bucket: data.bucket,
            stsToken: data.SecurityToken,
        }
    })
}

// 宠物品种列表
export function getBreedList(data) {
  return request({
    url: `/product/breedList`,
    method: 'get',
    params: data
  }).then(res => {
     return res.data
  })
}