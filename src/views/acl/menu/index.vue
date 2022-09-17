<template>
  <!-- eslint-disable  -->
  <div>
    <el-table
      :data="permissions"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="name" label="名称"> </el-table-column>
      <el-table-column prop="code" label="权限值"> </el-table-column>
      <el-table-column prop="toCode" label="跳转权限值"> </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button
            type="primary"
            icon="el-icon-plus"
            size="mini"
            :title="row.level == 3 ? '添加功能' : '添加菜单'"
            :disabled="row.level == 4"
            @click="addMenu(row)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            title="编辑菜单"
            :disabled="row.level == 1"
            @click="editMenu(row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            title="删除菜单"
            :disabled="row.level == 1"
            @click="deleteMenu(row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- :before-close="dialogBeforeClose" -->
    <el-dialog :title="title" :visible.sync="dialogVisible" width="width">
      <div>
        <el-form
          ref="form"
          label-width="120px"
          :model="permission"
          :rules="permissionRules"
        >
          <el-form-item
            label="父级名称"
            v-show="!(menuLevel == 1) && title != '修改菜单'"
          >
            <el-input v-model="permission.pname" disabled></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="permission.name"></el-input>
          </el-form-item>
          <el-form-item label="功能权限值" prop="code">
            <el-input v-model="permission.code"></el-input>
          </el-form-item>
          <el-form-item
            label="跳转路由权限值"
            v-show="(menuLevel == 3 && title != '修改菜单') || menuLevel == 4"
          >
            <el-input v-model="permission.toCode"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="sureSave">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 菜单权限校验的规则
const menuRules = {
  name: [{ required: true, message: "名称必须输入" }],
  code: [{ required: true, message: "权限值必须输入" }],
};

// 按钮功能权限校验的规则
const btnRules = {
  name: [{ required: true, message: "名称必须输入" }],
  code: [{ required: true, trigger: "blur", message: "功能权限值必须输入" }],
};
export default {
  name: "Menu",
  data() {
    return {
      permissions: [], //获取所有权限数据
      dialogVisible: false,
      title: "", //dialog标题
      menuLevel: 1, //菜单等级
      permission: {
        code: "",
        level: 0,
        name: "",
        toCode: "",
      },
    };
  },
  mounted() {
    this.getPermissions();
  },
  computed: {
    /* 
    根据权限的等级来计算确定校验规则
    */
    permissionRules() {
      return this.permission.level === 4 ? btnRules : menuRules;
    },
  },
  methods: {
    async getPermissions() {
      let result = await this.$API.permissions.getPermissionList();
      if (result.code == 20000) {
        this.permissions = result.data.children;
      }
    },
    // 添加菜单
    addMenu(row) {
      this.dialogVisible = true;
      this.$nextTick(() => this.$refs.form.clearValidate());
      switch (row.level) {
        case 1:
          this.title = "添加一级菜单";
          this.menuLevel = row.level;
          this.permission.type = 1;
          break;
        case 2:
          this.title = "添加二级菜单";
          this.menuLevel = row.level;
          this.permission.type = 1;
          break;
        default:
          this.title = "添加功能";
          this.menuLevel = row.level;
          this.permission.type = 2;
          break;
      }
      this.permission.level = row.level + 1;
      this.permission.pid = row.id;
      this.permission.pname = row.name;
    },
    // 取消添加
    cancel() {
      this.permission = {
        code: "",
        level: 0,
        name: "",
        toCode: "",
      };
      this.dialogVisible = false;
    },
    // 确定添加菜单或者功能
    sureSave() {
      this.$refs.form.validate(async (validate) => {
        if (validate) {
          const { permission } = this;
          delete permission.pname;
          this.dialogVisible = false;
          let result = await this.$API.permissions[
            this.title != "修改菜单" ? "addPermission" : "updatePermission"
          ](permission);
          if (result.code == 20000) {
            this.$message({
              type: "success",
              message: this.title != "修改菜单" ? "添加成功" : "修改成功",
            });
            this.getPermissions();
            this.permission = {
              code: "",
              level: 0,
              name: "",
              toCode: "",
            };
          }
        }
      });
    },
    // 编辑菜单或者功能
    editMenu(row) {
      this.dialogVisible = true;
      this.title = "修改菜单";
      this.menuLevel = row.level;
      this.permission = { ...row };
    },
    // 删除菜单或者功能
    deleteMenu(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$API.permissions.removePermission(row.id).then(() => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getPermissions()
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
</style>