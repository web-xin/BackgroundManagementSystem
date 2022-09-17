<template>
  <div>
    <el-form
      :inline="true"
      ref="form"
      :model="tempSearchObj"
      label-width="80px"
    >
      <el-form-item>
        <el-input
          v-model="tempSearchObj.username"
          placeholder="用户名"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="search"
          >查询</el-button
        >
        <el-button @click="clearSearch">清空</el-button>
      </el-form-item>
    </el-form>
    <div style="margin: 0 0 22px 0">
      <el-button type="primary" @click="showAddUser">添加</el-button>
      <el-button
        type="danger"
        :disabled="multipleSelection.length === 0"
        @click="deleteUsers"
        >批量删除</el-button
      >
    </div>
    <!-- @selection-change="handleSelectionChange" -->
    <el-table
      ref="multipleTable"
      tooltip-effect="dark"
      style="width: 100%"
      border
      :data="users"
      v-loading="tableLoading"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="60"> </el-table-column>
      <el-table-column type="index" label="序号" width="80"> </el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="nickName" label="用户名称"></el-table-column>
      <el-table-column prop="roleName" label="权限列表"></el-table-column>
      <el-table-column prop="gmtCreate" label="创建时间"></el-table-column>
      <el-table-column prop="gmtModified" label="更新时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button
            type="info"
            icon="el-icon-user"
            size="mini"
            title="分配角色"
            @click="editRole(row)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            title="修改用户"
            @click="updateUser(row)"
          ></el-button>

          <el-popconfirm
            :title="`确认删除${row.username}吗？`"
            @onConfirm="deleteUser(row)"
          >
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              title="删除用户"
              slot="reference"
              style="margin-left: 10px"
            ></el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- @size-change="handleSizeChange"
      @current-change="handleCurrentChange" -->
    <el-pagination
      :current-page="page"
      :page-sizes="[5, 10, 15]"
      :page-size="limit"
      layout=" prev, pager, next, jumper,->,sizes,total"
      :total="total"
      style="padding: 20px 0"
      @current-change="getUserList"
      @size-change="handleSizeChange"
    >
    </el-pagination>
    <el-dialog
      :title="user.id ? '修改用户' : '添加用户'"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        :rules="rules"
        label-position="right"
        label-width="100px"
        :model="user"
        ref="userForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="user.username"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input v-model="user.nickName"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" v-if="!user.id">
          <el-input type="password" v-model="user.password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancal">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate" :loading="loading"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog title="设置角色" :visible.sync="dialogVisible" width="width">
      <el-form ref="form" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="userName" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
            >全选</el-checkbox
          >
          <div style="margin: 15px 0"></div>
          <el-checkbox-group
            v-model="checkedCities"
            @change="handleCheckedCitiesChange"
          >
            <el-checkbox
              v-for="role in allRolesList"
              :label="role.id"
              :key="role.id"
              >{{ role.roleName }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="cancalRole">取 消</el-button>
        <el-button type="primary" @click="saveRole()" :loading="saveLoading"
          >保存</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "User",
  data() {
    return {
      tableLoading: false,
      dialogVisible: false, //控制设置角色对话框显示与隐藏
      user: {}, //收集用户信息
      tempSearchObj: {
        username: "",
      },
      searchObj: {
        username: "",
      },
      page: 1,
      limit: 5,
      total: 20,
      dialogFormVisible: false,
      rules: {
        username: [
          { required: true, message: "用户名必须输入" },
          { min: 4, message: "用户名不能小于4位" },
        ],
        password: [{ required: true, validator: this.validatePassword }],
      },
      users: [],
      selectedIds: [], // 所有选择的user的id的数组
      loading: false, //控制添加用户确定按钮的加载
      multipleSelection: [], //table选中的用户
      userName: "",
      checkAll: false,
      checkedCities: [],
      isIndeterminate: false,
      allRolesList: [], //角色列表数据
      saveLoading:false,
      userRoleId:'',
      assignRoles:[]
    };
  },
  mounted() {
    this.getUserList();
  },
  methods: {
    cancal() {
      this.dialogFormVisible = false;
      this.user = {};
    },
    showAddUser() {
      this.dialogFormVisible = true;
      this.$nextTick(() => this.$refs.userForm.clearValidate()); //清除表单规则提示
    },
    validatePassword(rule, value, callback) {
      if (!value) {
        callback("密码必须输入");
      } else if (!value || value.length < 6) {
        callback("密码不能小于6位");
      } else {
        callback();
      }
    },
    async getUserList(pager = 1) {
      this.page = pager;
      const { page, limit } = this;
      this.tableLoading = true;
      this.users = [];
      let result = await this.$API.user.reqGetUserList(
        page,
        limit,
        this.searchObj
      );
      if (result.code == 20000) {
        this.users = result.data.items.filter(
          (item) => item.username !== "admin"
        );
        this.total = result.data.total - 1;
        this.tableLoading = false;
      }
    },
    handleSizeChange(limitnum) {
      this.limit = limitnum;
      this.getUserList();
    },
    search() {
      this.searchObj = { ...this.tempSearchObj };
      this.getUserList();
    },
    clearSearch() {
      this.tempSearchObj = {
        userName: "",
      };
      this.searchObj = {
        userName: "",
      };
      this.getUserList();
    },
    addOrUpdate() {
      this.$refs.userForm.validate((validate) => {
        if (validate) {
          const { user } = this;
          this.loading = true;
          this.$API.user[this.user.id ? "update" : "add"](user).then(
            (response) => {
              this.$message({
                type: "success",
                message: user.id ? "修改成功" : "添加成功",
              });
              this.loading = false;
              this.getUserList(user.id ? this.page : 1);
              this.user = {};
              this.dialogFormVisible = false;
            },
            (error) => {
              this.loading = false;
              this.$message({
                type: "error",
                message: user.id ? "修改失败" : "添加失败",
              });
            }
          );
        } else {
          this.$message({
            type: "warning",
            message: "输入的密码或用户名不符合",
          });
        }
      });
    },
    updateUser(row) {
      this.dialogFormVisible = true;
      this.user = cloneDeep(row);
    },
    deleteUser(row) {
      this.$API.user.removeById(row.id).then((response) => {
        this.$message({ type: "success", message: "删除用户成功" });
        this.getUserList(this.users.length < 2 ? this.page - 1 : this.page);
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = [];
      val.forEach((element, index) => {
        this.multipleSelection.splice(index, 1, element.id);
      });
    },
    deleteUsers() {
      this.$confirm("确定删除吗?")
        .then(async () => {
          await this.$API.user.removeUsers(this.multipleSelection);
          this.$message.success("删除成功");
          this.getUserList();
        })
        .catch(() => {
          this.$message.info("取消删除");
        });
    },
    handleCheckAllChange(val /*boolean */) {
      let allRolesList1 = [];
      this.allRolesList.forEach((item, index) => {
        allRolesList1[index] = item.id;
      });
      this.checkedCities = val ? allRolesList1 : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.allRolesList.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.allRolesList.length;
    },
    editRole(row) {
      this.checkedCities = []
      this.userRoleId = row.id
      this.dialogVisible = true;
      this.userName = row.username;
      this.$API.user.getRoles(row.id).then((response) => {
        this.allRolesList = response.data.allRolesList;
        this.assignRoles = response.data.assignRoles
        this.assignRoles.forEach((item) => {
          this.checkedCities.push(item.id)
        })
      });
    },
    cancalRole(){
      this.dialogVisible = false
      this.checkedCities = []
      this.isIndeterminate = false
    },
    saveRole(){
      let roleId = ''
      this.checkedCities.forEach(item => {
        roleId = item + ',' + roleId
      })
      roleId = roleId.slice(0,roleId.length - 1)
      this.$API.user.assignRoles(this.userRoleId,roleId).then(() => {
        this.$message({type:'success',message:'分配角色成功'})
        this.getUserList(this.page)
      })
      this.dialogVisible = false
    }
  },
};
</script>

<style>
</style>