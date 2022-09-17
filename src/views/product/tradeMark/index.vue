<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="addTradeMark"
      >添加</el-button
    >
    <el-table style="width: 100%; margin: 20px 0" :border="true" :data="list">
      <el-table-column type="index" label="序号" width="75px" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌LOGO" width="width">
        <template slot-scope="{ row }">
          <img
            :src="row.logoUrl"
            style="width: 100px; height: 100px"
            alt="图片消失"
            ref="logoimg"
          />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <template slot-scope="{ row }">
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-edit"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align: center"
      :current-page="page"
      :page-sizes="[5, 8, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->, sizes ,total"
      :total="total"
      @current-change="getListInfo"
      @size-change="changeSizeHandler"
      @prev-click="getListInfo"
      @next-click="getListInfo"
    >
    </el-pagination>
    <el-dialog
      :title="this.tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        :model="tmForm"
        style="width: 80%"
        label-position="left"
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTradeMarkSubmitHandler"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable*/
export default {
  name: "TradeMark",
  data() {
    return {
      page: 1,
      limit: 5,
      list: [],
      total: 0,
      // dialog是否显示
      dialogFormVisible: false,
      tmForm: {
        tmName: "",
        logoUrl: "",
      },
      imageUrl: "",
      rules: {
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "change",
          },
        ],
        logoUrl: [{ required: true, message: "请选择品牌LOGO" }],
      },
    };
  },
  mounted() {
    this.getListInfo();
  },
  methods: {
    // 获取品牌信息列表
    getListInfo(pager = 1) {
      this.page = pager;
      const { page, limit } = this;
      this.$API.tradeMark.reqGetTradeMarkList(page, limit).then(
        (response) => {
          if (response.code == 200) {
            this.total = response.data.total;
            this.list = response.data.records;
          }
        },
        (error) => {
          console.error(error);
        }
      );
    },
    changeSizeHandler(limit) {
      this.limit = limit;
      this.getListInfo();
    },
    addTradeMark() {
      this.dialogFormVisible = true;
      this.imageUrl = "";
      this.tmForm = {
        tmName: "",
        logoUrl: "",
      };
    },
    updateTradeMark(row) {
      this.dialogFormVisible = true;
      this.tmForm = { ...row };
      this.imageUrl = this.tmForm.logoUrl;
    },
    // 图片成功上传的回调
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.tmForm.logoUrl = this.imageUrl;
    },
    // 图片上传之前的回调
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 添加或修改确认提交
    addTradeMarkSubmitHandler() {
      this.$refs.ruleForm.validate(async (isSuccess) => {
        if (isSuccess) {
          let result = await this.$API.tradeMark.reqAddorUpdateTradeMark(
            this.tmForm
          );
          if (result.code === 200) {
            this.$message({
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
              type: "success",
            });
            this.getListInfo(this.tmForm.id ? this.page : 1);
          } else {
            this.$message({
              message: this.tmForm.id ? "修改品牌失败" : "添加品牌失败",
              type: "error",
            });
          }
          this.dialogFormVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 删除品牌信息
    deleteTradeMark(row) {
      this.$confirm(`你是否要删除${row.tmName}品牌?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let result = await this.$API.tradeMark.reqDeleteTradeMark(row.id);
          if (result.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getListInfo(this.list.length>1?this.page:this.page-1)
          }else{
            this.$message({
              type: "error",
              message: "删除失败!",
            });
          }
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
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
