import request from '@/utils/request'

/**
 * 查询检测参数列表
 */
export function getParamsSettingList() {
    return request({
        url: `/detectParam/list`,
        method: 'get'
    }).then(res => {
        return res.data
    })
}

/**
 * 查询检测参数列表
 * @param id 检测项id
 * @param description 指标解读
 * @param dietDesc 戒食说明
 * @param eatDesc 多吃说明
 */
export function modifyParamsSetting(data) {
    return request({
        url: `/detectParam`,
        method: 'put',
        data: data
    }).then(res => {})
}