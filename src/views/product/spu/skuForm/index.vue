<template>
  <div>
    <el-form ref="form" :model="skuInfo" label-width="80px">
      <el-form-item label="SPU名称"> {{ spuName }}</el-form-item>
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input type="number" v-model="skuInfo.price"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            :label="spuAttr.attrName"
            label-width="100"
            v-for="spuAttr in spuAttrList"
            :key="spuAttr.id"
          >
            <el-select
              v-model="spuAttr.attrIdAndAttrValueId"
              placeholder="请选择"
            >
              <el-option
                :label="spuAttrValue.valueName"
                :value="`${spuAttrValue.attrId}:${spuAttrValue.id}`"
                v-for="spuAttrValue in spuAttr.attrValueList"
                :key="spuAttrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true" ref="form" label-width="80px">
          <el-form-item
            :label="spuSaleAttr.saleAttrName"
            label-width="100"
            v-for="spuSaleAttr in spuSaleAttrList"
            :key="spuSaleAttr.id"
          >
            <el-select
              v-model="spuSaleAttr.attrIdAndAttrValueId"
              placeholder="请选择"
            >
              <el-option
                :label="spuSaleAttrValue.saleAttrValueName"
                :value="`${spuSaleAttr.id}:${spuSaleAttrValue.id}`"
                v-for="spuSaleAttrValue in spuSaleAttr.spuSaleAttrValueList"
                :key="spuSaleAttrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table
          style="width: 100%"
          border
          :data="spuImageList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="80"> </el-table-column>
          <el-table-column label="图片" width="width">
            <template slot-scope="{ row }">
              <img
                :src="row.imgUrl"
                alt=""
                style="width: 100px; height: 100px"
              />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row }">
              <el-button
                type="primary"
                v-if="row.isDefault == '0'"
                @click="chanegDefault(row)"
                >设置默认</el-button
              >
              <el-button v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveSku">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: "skuForm",
  data() {
    return {
      // 收集的sku信息
      skuInfo: {
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        price: 0,
        weight: "",
        skuName: "",
        skuAttrValueList: [
          /* {
            attrId: 0,
            attrName: "string",
            id: 0,
            skuId: 0,
            valueId: 0,
            valueName: "string",
          }, */
        ],
        skuDefaultImg: "",
        skuDesc: "",
        skuImageList: [
          /*  {
            id: 0,
            imgName: "string",
            imgUrl: "string",
            isDefault: "string",
            skuId: 0,
            spuImgId: 0,
          }, */
        ],
        skuSaleAttrValueList: [
          /* {
            id: 0,
            saleAttrId: 0,
            saleAttrName: "string",
            saleAttrValueId: 0,
            saleAttrValueName: "string",
            skuId: 0,
            spuId: 0,
          }, */
        ],
      },
      spuImageList: [], //sku图片数据
      spuSaleAttrList: [], //销售属性数据
      spuAttrList: [], //平台属性数据
      spuName: "", //spu名称
      imageList: [], //收集的图片列表
    };
  },
  methods: {
    // 初始化sku数据
    async initSkuDate(row, categoryId) {
      this.skuInfo.category3Id = categoryId.category3Id;
      this.skuInfo.spuId = row.id;
      this.skuInfo.tmId = row.tmId;
      this.spuName = row.spuName;
      // 获取图片的数据
      let imageListResult = await this.$API.spu.reqImageList(row.id);
      if (imageListResult.code == 200) {
        imageListResult.data.forEach((item) => {
          item.isDefault = "0";
        });
        this.spuImageList = imageListResult.data;
      }
      // 获取销售属性数据
      let saleAttrResult = await this.$API.spu.reqSpuSaleAttrList(row.id);
      if (saleAttrResult.code == 200) {
        this.spuSaleAttrList = saleAttrResult.data;
      }
      // 获取平台属性数据
      let attrResult = await this.$API.spu.reqAttrList(categoryId);
      if (attrResult.code == 200) {
        this.spuAttrList = attrResult.data;
      }
    },
    handleSelectionChange(selection) {
      this.imageList = selection;
    },
    chanegDefault(row) {
      this.spuImageList.forEach((item) => {
        item.isDefault = "0";
      });
      row.isDefault = "1";
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    cancel() {
      this.$emit("changeScreen", 0);
      Object.assign(this._data, this.$options.data());
    },
    async saveSku() {
      this.skuInfo.skuAttrValueList = this.spuAttrList.reduce((pre, item) => {
        if (item.attrIdAndAttrValueId) {
          const [attrId, valueId] = item.attrIdAndAttrValueId.split(":");
          pre.push({ attrId, valueId });
        }
        return pre;
      }, []);
      this.skuInfo.skuSaleAttrValueList = this.spuSaleAttrList.reduce(
        (pre, item) => {
          if (item.attrIdAndAttrValueId) {
            const [saleAttrId, saleAttrValueId] =
              item.attrIdAndAttrValueId.split(":");
            pre.push({ saleAttrId, saleAttrValueId });
          }
          return pre;
        },
        []
      );
      this.skuInfo.skuImageList = this.imageList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });
      let result = await this.$API.spu.reqSaveSkuinfo(this.skuInfo)
      if(result.code == 200){
        this.$message({type:'success',message:'保存成功'})
        this.$emit("changeScreen", 0);
      }
    },
  },
};
</script>

<style>
</style>