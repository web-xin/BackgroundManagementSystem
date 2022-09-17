<template>
  <div>
    <el-form label-width="80px" :model="spuinfo">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spuinfo.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spuinfo.tmId">
          <el-option
            :label="tradeMark.tmName"
            :value="tradeMark.id"
            v-for="tradeMark in tradeMarkList"
            :key="tradeMark.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <el-input
          type="textarea"
          rows="4"
          placeholder="描述"
          v-model="spuinfo.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleAvatarSuccess"
          :file-list="spuImageList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          v-model="attrIdAndAttrName"
          :placeholder="`还有${notSelectSaleAttr.length}个未选项`"
        >
          <el-option
            :label="notSelect.name"
            :value="`${notSelect.id}:${notSelect.name}`"
            v-for="notSelect in notSelectSaleAttr"
            :key="notSelect.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addSaleAttr"
          :disabled="!attrIdAndAttrName"
          >添加销售属性</el-button
        >
        <el-table style="width: 100%" border :data="spuinfo.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <template slot-scope="{ row, $index }">
              <el-tag
                :key="tag.id"
                v-for="tag in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="handleClose(tag, $index)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!--$event.target.blur():解决keyup和blur事件的二次触发  -->
              <el-input
                class="input-new-tag"
                v-if="inputVisible[$index]"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="$event.target.blur()"
                @blur="handleInputConfirm(row, $index)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput($index)"
                >+ 添加销售属性值</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ $index }">
              <el-button
                type="dengar"
                size="mini"
                icon="el-icon-delete"
                @click="deleteSaleAttr($index)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveSpu">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: "spuForm",
  computed: {
    notSelectSaleAttr() {
      return this.baseSaleAttrList.filter((item1) => {
        return this.spuinfo.spuSaleAttrList.every((item2) => {
          return item1.name !== item2.saleAttrName;
        });
      });
    },
  },
  data() {
    return {
      inputVisible: [],
      inputValue: "",
      attrIdAndAttrName: "",
      dialogImageUrl: "",
      dialogVisible: false,
      inputValue: "",
      spuinfo: {
        //三级分类的id
        category3Id: 0,
        //描述
        description: "",
        //spu名称
        spuName: "",
        //平台的id
        tmId: "",
        //收集SPU图片的信息
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        //平台属性与属性值收集
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "string",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0,
          //     },
          //   ],
          // },
        ],
      }, //spu的信息
      tradeMarkList: [], //品牌数据列表
      spuImageList: [], //spu图片数据列表
      baseSaleAttrList: [], //销售属性列表
    };
  },
  methods: {
    handleRemove(file, fileList) {
      this.spuImageList = [...fileList];
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleClose(tag, index) {
      // this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      this.spuinfo.spuSaleAttrList[index].spuSaleAttrValueList.splice(
        this.spuinfo.spuSaleAttrList[index].spuSaleAttrValueList.indexOf(tag),
        1
      );
    },
    handleAvatarSuccess(res, file, fileList) {
      this.spuImageList = [...fileList];
    },

    showInput(index) {
      this.inputVisible.splice(index, 1, true);
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm(row, index) {
      // baseSaleAttrId, saleAttrValueName: inputValue
      let inputValue = this.inputValue;
      let { baseSaleAttrId, saleAttrName, spuId } =
        this.spuinfo.spuSaleAttrList[index];
      let isRepeat = this.spuinfo.spuSaleAttrList[
        index
      ].spuSaleAttrValueList.every((item) => {
        return item.saleAttrValueName != inputValue;
      });
      if (!(inputValue.trim())) {
        this.$message({
          type: "warning",
          message: "值不能为空，请重新输入",
        });
        return;
      }
      if (!isRepeat) {
        this.$message({
          type: "warning",
          message: "值不能重复，请重新输入",
        });
        return;
      }
      this.spuinfo.spuSaleAttrList[index].spuSaleAttrValueList.push({
        baseSaleAttrId,
        saleAttrValueName: inputValue,
        saleAttrName,
        spuId,
      });
      this.inputVisible[index] = false;
      this.inputValue = "";
    },
    cancel() {
      this.$emit("changeScreen", { screen: 0, flag: "" });
      Object.assign(this._data, this.$options.data());
    },
    // 初始化spu数据
    async initSpuData(row, category3Id) {
      if (row.id) {
        //获取spu的信息
        let spuinfoResult = await this.$API.spu.reqSpuinfo(row.id);
        if (spuinfoResult.code == 200) {
          this.spuinfo = spuinfoResult.data;
          this.inputVisible = new Array(this.spuinfo.spuSaleAttrList.length);
        }
        // 获取spu图标列表数据
        let spuImageResult = await this.$API.spu.reqSpuImageList(row.id);
        if (spuImageResult.code == 200) {
          this.spuImageList = spuImageResult.data;
          this.spuImageList.forEach((item) => {
            item.name = item.imgName;
            item.url = item.imgUrl;
          });
        }
      } else {
        this.spuinfo.category3Id = category3Id;
      }
      // 获取品牌列表数据
      let tradeMarkResult = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkResult.code == 200) {
        this.tradeMarkList = tradeMarkResult.data;
      }

      // 获取spu所有的销售属性
      let baseSaleAttrResult = await this.$API.spu.reqbaseSaleAttr();
      if (baseSaleAttrResult.code == 200) {
        this.baseSaleAttrList = baseSaleAttrResult.data;
      }
    },
    // 添加销售属性
    addSaleAttr() {
      let [baseSaleAttrId, saleAttrName] = this.attrIdAndAttrName.split(":");
      //向SPU对象的spuSaleAttrList属性里面添加新的销售属性
      let newSaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
        spuId: this.spuinfo.id,
      };
      //添加新的销售属性
      this.spuinfo.spuSaleAttrList.push(newSaleAttr);
      //清空数据
      this.attrIdAndAttrName = "";
      this.inputVisible.push(false);
    },
    deleteSaleAttr(index) {
      this.spuinfo.spuSaleAttrList.splice(index, 1);
      this.inputVisible.splice(index, 1);
    },
    async saveSpu() {
      this.spuinfo.spuImageList = this.spuImageList.map((item) => {
        return {
          imageName: item.name,
          imageUrl: (item.response && item.response.data) || item.url,
        };
      });
      let result = await this.$API.spu.reqAddOrUpdateSpu(this.spuinfo);
      if (result.code == 200) {
        this.$message({
          type: "success",
          message: "保存成功",
        });
        this.$emit("changeScreen", {
          screen: 0,
          flag: this.spuinfo.id ? "修改" : "添加",
        });
      }
      Object.assign(this._data, this.$options.data());
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>