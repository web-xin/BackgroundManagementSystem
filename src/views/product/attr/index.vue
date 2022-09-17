<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySeletor
        @getCategoryList="getAttrList"
        :show="isShowTable"
      ></CategorySeletor>
    </el-card>
    <el-card>
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addAttr"
          :disabled="!category3Id"
          >添加属性</el-button
        >
        <el-table :data="attrList" style="width: 100%" border>
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150px">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <template slot-scope="{ row }">
              <el-tag
                type="success"
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                style="margin: 0 10px"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150px">
            <template slot-scope="{ row }">
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-edit"
                @click="editAttr(row)"
                title="编辑"
              ></el-button>
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="$message('此功能暂时还没实现')"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowTable">
        <el-form
          :inline="true"
          ref="form"
          :model="attrForm"
          label-width="80px"
          label-position="left"
        >
          <el-form-item label="属性名">
            <el-input
              v-model="attrForm.attrName"
              placeholder="请输入属性名"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!attrForm.attrName"
          @click="addAttrValue"
          >添加属性值</el-button
        >
        <el-button @click="isShowTable = !isShowTable">取消</el-button>
        <el-table
          :data="attrForm.attrValueList"
          style="width: 100%; margin: 20px 0"
          border
        >
          <el-table-column type="index" label="序号" width="80px">
          </el-table-column>
          <el-table-column label="属性值名称" width="width">
            <template slot-scope="{ row, $index }">
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值名称"
                size="mini"
                v-if="isInput[$index]"
                @blur="hideInput($index, row)"
                :ref="$index"
              ></el-input>
              <span v-else>{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-edit"
                @click="showInput($index)"
                style="margin: 0 10px"
              ></el-button>
              <el-popconfirm :title="`确定删除${row.valueName}吗？`">
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  slot="reference"
                  @onConfirm="deleteAttrValue($index)"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="saveAttr"
          :disabled="attrForm.attrValueList.length == 0"
          >保存</el-button
        >
        <el-button @click="isShowTable = !isShowTable">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
/* eslint-disable */
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      attrList: [],
      category3Id: "",
      categoryId: "",
      isShowTable: true,
      isInput: [],
      attrForm: {
        attrName: "", //属性名
        attrValueList: [
          //属性名中属性值，因为属性值可以是多个，因此需要的是数组
          /* {
            attrId: undefined, //属性的id
            valueName: "", //属性值
          }, */
        ],
        categoryId: 0, //category3Id
        categoryLevel: 3,
      },
    };
  },
  methods: {
    // 获取属性列表
    async getAttrList(categoryId) {
      this.category3Id = categoryId.category3Id;
      this.categoryId = categoryId;
      this.attrList = [];
      if (categoryId.category3Id) {
        let result = await this.$API.attr.reqAttrList(categoryId);
        if (result.code == 200) {
          this.attrList = result.data;
        }
      }
    },
    // 添加属性值
    addAttrValue() {
      this.attrForm.attrValueList.push({
        attrId: this.attrForm.id, //属性的id
        valueName: "", //属性值
      });
      this.isInput.push(true);
      this.attrForm.categoryId = this.category3Id;
      this.$nextTick(() => {
        this.$refs[this.attrForm.attrValueList.length - 1].focus();
      });
    },
    // 添加属性名
    addAttr() {
      this.isShowTable = !this.isShowTable;
      this.isInput = [];
      this.attrForm = {
        attrName: "", //属性名
        attrValueList: [
          //属性名中属性值，因为属性值可以是多个，因此需要的是数组
          /* {
            attrId: undefined, //属性的id
            valueName: "", //属性值
          }, */
        ],
        categoryId: 0, //category3Id
        categoryLevel: 3,
      };
    },
    // 删除属性值
    deleteAttrValue(index) {
      // console.log(index)
      this.attrForm.attrValueList.splice(index, 1);
      this.isInput.splice(index, 1);
    },
    // 显示文本框
    showInput(index) {
      // console.log(index)
      // 数组的响应式 arr[0] = 1 不奏效不会引起模板解析
      this.isInput.splice(index, 1, true);
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    // 隐藏文本框
    hideInput(index, row) {
      let isEqual = this.attrForm.attrValueList.some((element) => {
        if (row !== element) {
          return row.valueName === element.valueName;
        }
      });
      if (!row.valueName.trim()) {
        this.$message({
          message: "输入的值不能为空请重新输入",
          type: "warning",
        });
        return;
      } else if (isEqual) {
        this.$message({
          message: "输入的值有重复的请重新输入",
          type: "warning",
        });
        return;
      }
      this.isInput.splice(index, 1, false);
    },
    // 保存添加的属性
    async saveAttr() {
      let flag = true;
      for (let index in this.isInput) {
        if (this.isInput[index]) {
          flag = false;
          break;
        }
      }
      if (flag) {
        let resoult = await this.$API.attr.reqAddorUpdateAttr(this.attrForm);
        if (resoult.code == 200) {
          this.$message({
            message: "保存成功",
            type: "success",
          });
          let resoult = await this.$API.attr.reqAttrList(this.categoryId);
          if (resoult.code == 200) {
            this.attrList = resoult.data;
          }
        } else {
          this.$message({
            message: `${resoult.data}`,
            type: "error",
          });
        }
        this.isShowTable = true;
      } else {
        this.$message({
          message: "你添加的属性值名称有误，请重新输入属性值名称",
          type: "warning",
        });
      }
    },
    // 编辑属性
    editAttr(row) {
      this.isShowTable = false;
      this.attrForm = cloneDeep(row);
      // 初始化控制input是否显示数组
      this.isInput = new Array(row.attrValueList.length);
    },
  },
};
</script>

<style>
</style>
