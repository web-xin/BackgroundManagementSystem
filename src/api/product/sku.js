import request from '@/utils/request'

//sku列表的接口
///admin/product/list/{page}/{limit}
export const reqskuList = (page,limit) => request({url:`/admin/product/list/${page}/${limit}`,method:'get'})

//上架
///admin/product/onSale/{skuId}
export const reqOnSale = (skuId) => request({url:`/admin/product/onSale/${skuId}`,method:'get'})

//下架
///admin/product/cancelSale/{skuId}
export const reqCancelSale = (skuId) => request({url:`/admin/product/cancelSale/${skuId}`,method:'get'})

//获取SKU详情的接口
///admin/product/getSkuById/{skuId}  get
export const reqSkuDetailed = (skuId) => request({url:`/admin/product/getSkuById/${skuId}`,method:"get"})