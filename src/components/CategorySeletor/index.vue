<template>
  <div>
    <el-form :inline="true" :model="cForm" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select
          v-model="cForm.category1Id"
          placeholder="请选择"
          :disabled="!show"
        >
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="c1 in list1"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          v-model="cForm.category2Id"
          placeholder="请选择"
          :disabled="!show"
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="c2 in list2"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          v-model="cForm.category3Id"
          placeholder="请选择"
          :disabled="!show"
        >
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="c3 in list3"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySeletor",
  data() {
    return {
      // 一级列表数据
      list1: [],
      // 二级列表数据
      list2: [],
      // 三级列表数据
      list3: [],
      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  props: ["show"],
  watch: {
    "cForm.category1Id": {
      async handler(newValue, oldValue) {
        this.cForm.category2Id = "";
        this.cForm.category3Id = "";
        this.list3 = [];
        if (newValue) {
          let resoult = await this.$API.attr.reqCategory2List(newValue);
          if (resoult.code == 200) {
            this.list2 = resoult.data;
          }
          this.$emit("getCategoryList", this.cForm);
        }
      },
    },
    "cForm.category2Id": {
      async handler(newValue, oldValue) {
        this.cForm.category3Id = "";
        if (newValue) {
          let resoult = await this.$API.attr.reqCategory3List(newValue);
          if (resoult.code == 200) {
            this.list3 = resoult.data;
          }
          this.$emit("getCategoryList", this.cForm);
        }
      },
    },
    "cForm.category3Id": {
      async handler(newValue, oldValue) {
        if (newValue) {
          this.$emit("getCategoryList", this.cForm);
        }
      },
    },
  },
  mounted() {
    this.getCategory1List();
  },
  methods: {
    async getCategory1List() {
      let resoult = await this.$API.attr.reqCategory1List();
      if (resoult.code == 200) {
        this.list1 = resoult.data;
      }
    },
  },
};
</script>

<style>
</style>