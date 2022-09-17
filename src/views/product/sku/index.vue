<template>
<!-- eslint-disable -->
  <div>
    <el-table style="width: 100%" border :data="spuList">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="skuName" label="名称" width="width">
      </el-table-column>
      <el-table-column prop="skuDesc" label="描述" width="width">
      </el-table-column>
      <el-table-column label="默认图片" width="120">
        <template slot-scope="{ row }">
          <img
            :src="row.skuDefaultImg"
            alt=""
            style="width: 100px; height: 100px"
          />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="80"> </el-table-column>
      <el-table-column prop="price" label="价格" width="80"> </el-table-column>
      <el-table-column label="操作" width="width">
        <template slot-scope="{ row }">
          <el-button
            type="success"
            icon="el-icon-top"
            size="mini"
            v-if="row.isSale == 0"
            @click="onSale(row)"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-bottom"
            size="mini"
            v-else
            @click="cancelSale(row)"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="$message({ type: 'info', message: '此功能正在开发中' })"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-info"
            size="mini"
            @click="showDetailed(row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="$message({ type: 'info', message: '此功能正在开发中' })"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="text-align: center"
      @size-change="handleSizeChange"
      @current-change="getSkuList"
      :current-page="page"
      :page-sizes="[10, 13, 16]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
    >
    </el-pagination>
    <el-drawer
      :visible.sync="drawer"
      direction="rtl"
      size="45%"
      :show-close="false"
    >
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ spuDetailedInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ spuDetailedInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ spuDetailedInfo.price }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag
            type="success"
            v-for="skuAttr in spuDetailedInfo.skuAttrValueList"
            :key="skuAttr.id"
            >{{ skuAttr.attrName }}</el-tag
          >
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <el-carousel height="150px">
            <el-carousel-item
              v-for="item in spuDetailedInfo.skuImageList"
              :key="item.id"
            >
              <img
                :src="item.imgUrl"
                alt=""
                style="width: 100%; height: 150px"
              />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
/* eslint-disable */ 
export default {
  name: "Sku",
  data() {
    return {
      page: 1,
      limit: 10,
      total: 0,
      spuList: [],
      spuDetailedInfo: {},
      drawer: false,
    };
  },
  mounted() {
    this.getSkuList();
  },
  methods: {
    async getSkuList(pager = 1) {
      this.page = pager;
      const { page, limit } = this;
      let result = await this.$API.sku.reqskuList(page, limit);
      if (result.code == 200) {
        this.total = result.data.total;
        this.spuList = result.data.records;
      }
    },
    handleSizeChange(changeLimit) {
      this.limit = changeLimit;
      this.getSkuList();
    },
    async onSale(row) {
      let result = await this.$API.sku.reqOnSale(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: "上架成功" });
        row.isSale = 1;
      } else {
        this.$message({ type: "error", message: "上架失败" });
      }
    },
    async cancelSale(row) {
      let result = await this.$API.sku.reqCancelSale(row.id);
      if (result.code == 200) {
        this.$message({ type: "success", message: "下架成功" });
        row.isSale = 0;
      } else {
        this.$message({ type: "error", message: "下架失败" });
      }
    },
    async showDetailed(row) {
      this.drawer = true;
      let result = await this.$API.sku.reqSkuDetailed(row.id);
      if (result.code == 200) {
        this.spuDetailedInfo = result.data;
      }
    },
  },
};
</script>

<style scoped>
/* eslint-disable */
.el-col-5 {
  text-align: right;
  font-size: 18px;
  margin: 10px;
}
.el-col-16 {
  margin: 10px;
}
/* 深度样式：样式穿透可以在加上scoped的样式让后代组件的html结构样式也生效 */
div/deep/.el-carousel__button{
  background-color: skyblue;
}
</style>
