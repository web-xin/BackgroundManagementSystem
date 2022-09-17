import request from '@/utils/request'
const api_name = '/admin/acl/user'

/* 
获取后台用户分页列表(带搜索)
*/
export const reqGetUserList = (page, limit, searchObj) => request({ url: `${api_name}/${page}/${limit}`, method: "get", params: searchObj })

/* 
保存一个新的后台用户
*/
export function add(user) {
    return request({
        url: `${api_name}/save`,
        method: 'post',
        data: user
    })
}

/* 
更新一个后台用户
*/
export function update(user) {
    return request({
        url: `${api_name}/update`,
        method: 'put',
        data: user
    })
}

/* 
删除某个用户
*/
export function removeById(id) {
    return request({
        url: `${api_name}/remove/${id}`,
        method: 'delete'
    })
}
/* 
批量删除多个用户
ids的结构: ids是包含n个id的数组
*/
export function removeUsers(ids) {
    return request({
        url: `${api_name}/batchRemove`,
        method: 'delete',
        data: ids
    })
}

/* 
获取某个用户的所有角色
*/
export function getRoles(userId) {
    return request({
        url: `${api_name}/toAssign/${userId}`,
        method: 'get'
    })
}

/* 
给某个用户分配角色
roleId的结构: 字符串, 'rId1,rId2,rId3'
*/
export function assignRoles(userId, roleId) {
    return request({
        url: `${api_name}/doAssign`,
        method: 'post',
        params: {
            userId,
            roleId
        }
    })
}