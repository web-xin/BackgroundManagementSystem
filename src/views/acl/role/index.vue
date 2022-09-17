<template>
  <div>
    <el-form
      :inline="true"
      ref="form"
      label-width="80px"
      :model="tempSearchobj"
    >
      <el-form-item>
        <el-input
          placeholder="角色名称"
          v-model="tempSearchobj.roleName"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search"
          >查询</el-button
        >
        <el-button @click="clearSearch">清空</el-button>
      </el-form-item>
    </el-form>
    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="saveRole">添加</el-button>
      <el-button
        type="danger"
        :disabled="roleIds.length === 0"
        @click="deleteRoles"
        >批量删除</el-button
      >
    </div>
    <!--  -->
    <el-table
      ref="multipleTable"
      tooltip-effect="dark"
      style="width: 100%"
      border
      :data="roleList"
      v-loading="tableLoading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="60"> </el-table-column>
      <el-table-column type="index" label="序号" width="100" align="center">
      </el-table-column>
      <el-table-column label="角色名称">
        <template slot-scope="{ row }">
          <span v-if="!row.edit">{{ row.roleName }}</span>
          <template v-else>
            <el-input
              v-model="row.roleName"
              size="small"
              class="edit-input"
            ></el-input>
            <el-button
              type="warning"
              icon="el-icon-refresh"
              size="small"
              class="cancel-btn"
              @click="cancelEdit(row)"
              >取消</el-button
            >
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{ row }">
          <el-button
            type="info"
            title="分配权限"
            icon="el-icon-info"
            size="mini"
            @click="$router.push(`/acl/role/auth/${row.id}?roleName=${row.roleName}`)"
          ></el-button>

          <el-button
            type="primary"
            icon="el-icon-check"
            size="mini"
            title="确定"
            v-if="row.edit"
            @click="editRole(row)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            title="修改角色"
            v-else
            @click="row.edit = true"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            title="删除角色"
            @click="deleteRole(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--  -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="getRoleList"
      :current-page="page"
      :page-sizes="[5, 10, 15]"
      :page-size="limit"
      layout="prev, pager, next, jumper,-> ,sizes,total"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "Role",
  data() {
    return {
      page: 1,
      total: 20,
      limit: 5,
      tempSearchobj: {
        roleName: "",
      },
      searchObj: {
        roleName: "",
      },
      roleList: [], //角色列表数据
      tableLoading: false, //角色列表数据加载效果
      roleIds: [], //选择到的角色id数组
    };
  },
  mounted() {
    this.getRoleList();
  },
  methods: {
    // 获取角色列表数据
    async getRoleList(pager = 1) {
      this.page = pager;
      const { limit, searchObj } = this;
      this.tableLoading = true;
      this.roleList = [];
      let result = await this.$API.role.getPageList(
        this.page,
        limit,
        searchObj
      );
      if (result.code == 20000) {
        result.data.items.forEach((item) => {
          item.edit = false;
          item.originRoleName = item.roleName;
        });
        this.total = result.data.total;
        this.roleList = result.data.items;
        this.tableLoading = false;
      } else {
        this.tableLoading = false;
        this.$message.error("获取角色数据失败");
      }
    },
    //查询指定名称角色
    search() {
      this.searchObj = { ...this.tempSearchobj };
      this.getRoleList();
    },
    // 清空搜索关键词
    clearSearch() {
      this.tempSearchobj = {
        roleName: "",
      };
      this.searchObj = {
        roleName: "",
      };
      this.getRoleList();
    },
    // 改变分页器的limit时触发回调
    handleSizeChange(limits) {
      this.limit = limits;
      this.getRoleList();
    },
    // 添加角色名称
    saveRole() {
      this.$prompt("请输入新名称", "添加角色", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          this.$API.role.save({ roleName: value }).then((response) => {
            this.$message.success(response.message || "添加角色成功");
            this.getRoleList();
          });
        })
        .catch(() => {
          this.$message.warning("取消添加");
        });
    },
    // 删除角色
    deleteRole(row) {
      this.$confirm(`确定删除${row.roleName}吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$API.role.removeById(row.id).then(() => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getRoleList(
              this.roleList.length === 1 ? this.page - 1 : this.page
            );
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // table勾选框的回调
    handleSelectionChange(value) {
      this.roleIds = [];
      value.forEach((element) => {
        this.roleIds.push(element.id);
      });
    },
    // 批量删除角色
    deleteRoles() {
      this.$confirm("此操作将永久删除数据，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$API.role.removeRoles(this.roleIds).then(() => {
            this.$message({
              type: "success",
              message: "批量删除成功!",
            });
            this.getRoleList(
              this.roleList.length > this.roleIds.length
                ? this.page
                : this.page - 1
            );
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 取消角色名称修改
    cancelEdit(row){
      row.roleName = row.originRoleName
      row.edit = false
      this.$message.warning("取消角色修改")
    },
    // 修改角色名称
    editRole(row){
      this.$API.role.updateById({id:row.id,roleName:row.roleName}).then(() => {
        this.$message.success('修改角色成功')
        this.getRoleList(this.page)
      })
    }
  },
};
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>