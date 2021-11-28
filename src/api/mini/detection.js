import request from '@/utils/request'

/**
 * @method getDetectionList 获取检测列表
 * @param {number} data.pageNum 当前页 
 * @param {number} data.pageSize 每页条数 
 * @param {string} data.searchValue 用户昵称/手机号 
 * @param {string} data.beginTime 检测日期开始时间
 * @param {string} data.endTime 检测日期结束时间
 * @param {number} data.status 报告状态
 */
export function getDetectionList(data) {
    return request({
        url: `/detect/list`,
        method: 'get',
        params: data
    }).then(res => {
        return {
            rows: res.rows,
            total: res.total
        };
    })
};

/**
 * @method auditDetection 审核通过/不通过
 * @param {number} data.id 当前页 
 * @param {number} data.type 审核状态 
 * @param {string} data.reason 审核不通过原因
 */
export function auditDetection(data) {
    return request({
        url: `/detect/audit`,
        method: 'put',
        params: data
    }).then(res => {
        return res.msg;
    })
};

/**
 * @method auditDetection 获取检测报告详情
 * @param {number} reportId 检测报告id
 * @param {number} data.lang 检测报告语言类型
 */
export function detectionReportDetail(reportId, data) {
    return request({
        url: `/detect/${reportId}`,
        method: 'get',
        params: data
    }).then(res => {
        return res.data;
    })
};

/**
 * @method modifyDetectItem 修改检测结果解读
 * @param {number} data.detectId 检测报告id
 * @param {number} data.itemId 检测项id
 * @param {string} data.description 解读
 * @param {string} data.dietDesc 戒食
 * @param {string} data.eatDesc 多吃
 */
export function modifyDetectItem(data) {
    return request({
        url: `/detect`,
        method: 'put',
        data: data
    }).then(res => {
        return res.data;
    })
};

/**
 * @method createDetectReport 生成检测报告
 * @param {number} data.id 检测报告id
 * @param {number} data.reportLang 检测报告语言版本
 * @param {string} data.code 报告编号
 * @param {string} data.result 检测结果
 * @param {string} data.food 主粮简评
 * @param {string} data.health 健康总评
 * @param {string} data.dietary 饮食建议
 * @param {array} data.productIds 推荐商品id列表
 * @param {string} data.reportImg 检测报告图片
 */
export function createDetectReport(data) {
    return request({
        url: `/detect`,
        method: 'post',
        data: data
    }).then(res => {
        return res.data;
    })
};

/**
 * @method getProductsList 获取推荐商品
 * @param {number} data.pageNum 页码
 * @param {number} data.pageSize 每页条数
 */
export function getProductsList(data) {
    return request({
        url: `/detect/productList`,
        method: 'get',
        params: data
    }).then(res => {
        return {
            rows: res.rows,
            total: res.total
        };
    })
};

