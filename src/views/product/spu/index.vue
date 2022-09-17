<template>
  <div>
    <el-card style="margin: 20px 0">
      <CategorySeletor
        @getCategoryList="getSpuList"
        :show="screen == 0"
      ></CategorySeletor>
    </el-card>
    <el-card>
      <!-- 显示spu列表数据 -->
      <div v-show="screen == 0">
        <el-button
          type="primary"
          icon="el-icon-plus"
          style="margin-bottom: 10px"
          :disabled="!categoryId.category3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table style="width: 100%" border :data="spuList">
          <el-table-column type="index" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="spuName" label="spu名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="spu描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <el-button
                type="success"
                size="mini"
                icon="el-icon-plus"
                title="添加sku"
                @click="addSku(row)"
              ></el-button>
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-edit"
                title="修改spu"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="info"
                size="mini"
                icon="el-icon-info"
                title="查看当前spu全部sku列表"
                @click="showSkuList(row)"
              ></el-button>
              <el-popconfirm
                :title="`确定要删除${row.spuName}吗？`"
                @onConfirm="deleteSpu(row)"
              >
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  title="删除spu"
                  slot="reference"
                  style="margin-left: 10px"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
         -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="getSpuListValue"
          style="text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 7]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->, sizes,total"
          :total="total"
        >
        </el-pagination>
      </div>
      <spuForm
        v-show="screen == 1"
        ref="spu"
        @changeScreen="changeScreen"
      ></spuForm>
      <skuForm
        v-show="screen == 2"
        ref="sku"
        @changeScreen="changeSkuScreen"
      ></skuForm>
      <el-dialog
        :title="`${spuName}的sku列表`"
        :visible.sync="dialogTableVisible"
        :before-close="close"
      >
        <el-table :data="skuList" v-loading="loading">
          <el-table-column
            property="skuName"
            label="名称"
            width="150"
          ></el-table-column>
          <el-table-column
            property="price"
            label="价格"
            width="200"
          ></el-table-column>
          <el-table-column property="weight" label="重量"></el-table-column>
          <el-table-column
            property="name"
            label="默认图片"
            width="200"
          >
            <template slot-scope="{row}">
              <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px">
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
/* eslint-disable */
import spuForm from "@/views/product/spu/spuForm";
import skuForm from "@/views/product/spu/skuForm";
export default {
  name: "Spu",
  data() {
    return {
      categoryId: {}, //获取三级列表id
      total: 0,
      page: 1,
      limit: 3,
      spuList: [],
      screen: 0,
      skuList: [],
      dialogTableVisible: false,
      spuName: "",
      loading:true
    };
  },
  components: {
    spuForm,
    skuForm,
  },
  methods: {
    getSpuList(categoryId) {
      this.categoryId = categoryId;
      if (categoryId.category3Id) {
        this.getSpuListValue();
      }
    },
    async getSpuListValue(pager = 1) {
      this.page = pager;
      let { page, limit } = this;
      let { category3Id } = this.categoryId;
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      if (result.code == 200) {
        this.spuList = result.data.records;
        this.total = result.data.total;
      }
    },
    handleSizeChange(changeLimit) {
      this.limit = changeLimit;
      this.getSpuListValue();
    },
    // 添加spu
    addSpu() {
      this.screen = 1;
      this.$refs.spu.initSpuData({ id: "" }, this.categoryId.category3Id);
    },
    addSku(row) {
      this.screen = 2;
      this.$refs.sku.initSkuDate(row, this.categoryId);
    },
    updateSpu(row) {
      this.screen = 1;
      this.$refs.spu.initSpuData(row);
    },
    changeScreen(value) {
      this.screen = value.screen;
      if (value.flag == "修改") {
        this.getSpuListValue(this.page);
      } else {
        this.getSpuListValue();
      }
    },
    changeSkuScreen(value) {
      this.screen = value;
    },
    async deleteSpu(row) {
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      if (result.code == 200) {
        this.$message({
          type: "success",
          message: "删除成功",
        });
        this.getSpuListValue(
          this.spuList.length > 1 ? this.page : this.page - 1
        );
      }
    },
    async showSkuList(row) {
      this.dialogTableVisible = true;
      this.spuName = row.spuName;
      let result = await this.$API.spu.reqGetSkuList(row.id);
      if (result.code == 200) {
        this.skuList = result.data;
        this.loading = false
      }
    },
    close(done){
      this.loading = true;
      this.skuList = []
      done()
    }
  },
};
</script>

<style>
</style>
