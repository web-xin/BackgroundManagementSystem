// 获取品牌管理列表数据
///admin/product/baseTrademark/{page}/{limit}
import request from '@/utils/request'

export const reqGetTradeMarkList = (page,limit) => request({url:`/admin/product/baseTrademark/${page}/${limit}`,method:'get'})

// 添加或修改品牌信息
//处理添加品牌
//新增品牌: /admin/product/baseTrademark/save   post  携带两个参数：品牌名称、品牌logo
//切记：对于新增的品牌，给服务器传递数据，不需要传递ID，ID是由服务器生成

//修改品牌的
//修改品牌 /admin/product/baseTrademark/update   put   携带三个参数：id、品牌名称、品牌logo
//切记：对于修改某一个品牌的操作，前端携带的参数需要带上id，你需要告诉服务器修改的是哪一个品牌

export const reqAddorUpdateTradeMark = (tradeMark) => {
    // 带有id代表是修改品牌信息
    if(tradeMark.id){
        return request({url:'/admin/product/baseTrademark/update',method:'put',data:tradeMark})
    }else{
        return request({url:'/admin/product/baseTrademark/save',method:'post',data:tradeMark})
    }
}

//删除品牌
///admin/product/baseTrademark/remove/{id}  delete

export const reqDeleteTradeMark = (id) => request({url:`/admin/product/baseTrademark/remove/${id}`,method:'delete'})
