<template>
  <div>
    <el-input v-model="$route.query.roleName" disabled></el-input>
    <el-tree
      style="margin: 20px 0"
      ref="tree"
      :data="allPermissions"
      node-key="id"
      show-checkbox
      default-expand-all
      :props="defaultProps"
    />
    <el-button :loading="loading" type="primary" @click="save">保存</el-button>
    <el-button @click="$router.replace({ name: 'Role' })">取消</el-button>
  </div>
</template>

<script>
export default {
  name: "RoleAuth",
  data() {
    return {
      loading: false, // 用来标识是否正在保存请求中的标识, 防止重复提交
      allPermissions: [], // 所有
      defaultProps: {
        children: "children",
        label: "name",
      },
    };
  },
  created() {
    this.init();
  },
  methods: {
    // 初始化数据
    init() {
      const roleId = this.$route.params.id;
      this.getPermissions(roleId);
    },
    // 获取角色的所有权限列表
    getPermissions(roleId) {
      this.$API.permissions.toAssign(roleId).then((response) => {
        const allPermissions = response.data.children;
        this.allPermissions = allPermissions;
        const checkedIds = this.getCheckedIds(allPermissions);
        this.$refs.tree.setCheckedKeys(checkedIds);
      });
    },
    // 获取角色已选择的权限
    getCheckedIds(allPermissions, initArr = []) {
      return allPermissions.reduce((pre, item) => {
        if (item.select && item.level === 4) {
          pre.push(item.id);
        } else if (item.children) {
          this.getCheckedIds(item.children, initArr);
        }
        return pre;
      }, initArr);
    },
    /* 
      保存权限列表
      */
    save() {
      var ids = this.$refs.tree.getCheckedKeys().join(",");
      /* 
        vue elementUI tree树形控件获取父节点ID的实例
        修改源码:
        情况1: element-ui没有实现按需引入打包
          node_modules\element-ui\lib\element-ui.common.js    25382行修改源码  去掉 'includeHalfChecked &&'
          // if ((child.checked || includeHalfChecked && child.indeterminate) && (!leafOnly || leafOnly && child.isLeaf)) {
          if ((child.checked || child.indeterminate) && (!leafOnly || leafOnly && child.isLeaf)) {
        情况2: element-ui实现了按需引入打包
          node_modules\element-ui\lib\tree.js    1051行修改源码  去掉 'includeHalfChecked &&'
          // if ((child.checked || includeHalfChecked && child.indeterminate) && (!leafOnly || leafOnly && child.isLeaf)) {
          if ((child.checked || child.indeterminate) && (!leafOnly || leafOnly && child.isLeaf)) {
        */
      this.loading = true;
      this.$API.permissions
        .doAssign(this.$route.params.id, ids)
        .then((result) => {
          this.loading = false;
          this.$message.success(result.$message || "分配权限成功");
          // 必须在跳转前获取(跳转后通过this获取不到正确的数据了)
          const roleName = this.$route.query.roleName;
          const roles = this.$store.state.user.roles;
          this.$router.replace("/acl/role", () => {
            console.log("replace onComplete");
            // 跳转成功后, 判断如果更新的是当前用户对应角色的权限, 重新加载页面以获得最新的数据
            if (roles.includes(roleName)) {
              window.location.reload();
            }
          });
        });
    },
  },
};
</script>

<style>
</style>