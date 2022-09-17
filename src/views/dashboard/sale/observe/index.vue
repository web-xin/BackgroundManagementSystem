<template>
  <div>
    <el-row :gutter="10" style="margin-top: 15px">
      <el-col :span="12">
        <el-card>
          <div slot="header" class="flexLayout">
            <span>线上热门搜索</span>
            <el-dropdown>
              <span class="el-dropdown-link">
                <i class="el-icon-more"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>黄金糕</el-dropdown-item>
                <el-dropdown-item>狮子头</el-dropdown-item>
                <el-dropdown-item>螺蛳粉</el-dropdown-item>
                <el-dropdown-item>双皮奶</el-dropdown-item>
                <el-dropdown-item>蚵仔煎</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div>
            <el-row :gutter="10">
              <el-col :span="12">
                <LineCharts title="搜索用户数" count="12321">
                  <template slot="main">
                    <span
                      >17.1&nbsp;<svg
                        t="1662887462104"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="9166"
                        width="16"
                        height="16"
                      >
                        <path
                          d="M960 704L512 256l-448 448z"
                          fill="#1afa29"
                          p-id="9167"
                        ></path>
                      </svg>
                    </span>
                  </template>
                </LineCharts>
              </el-col>
              <el-col :span="12">
                <LineCharts title="人均搜索次数" count="2.7">
                  <template slot="main">
                    <span
                      >2.7&nbsp;<svg
                        t="1662887352486"
                        class="icon"
                        viewBox="0 0 1024 1024"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        p-id="8224"
                        width="16"
                        height="16"
                      >
                        <path
                          d="M941.808046 195.931415 512 828.068585 82.191954 195.931415Z"
                          p-id="8225"
                          fill="#d81e06"
                        ></path></svg
                    ></span>
                  </template> </LineCharts
              ></el-col>
            </el-row>
            <el-table
              style="width: 100%"
              :default-sort="{ prop: 'date', order: 'descending' }"
              border
            >
              <el-table-column label="排名" width="80" type="index">
              </el-table-column>
              <el-table-column label="搜索关键字" width="180">
              </el-table-column>
              <el-table-column label="用户数" sortable> </el-table-column>
              <el-table-column label="周涨数" sortable> </el-table-column>
            </el-table>
            <el-pagination layout="prev, pager, next" :total="1000">
            </el-pagination>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12"
        ><el-card>
          <div slot="header" class="flexLayout">
            <span>销售额类别占比</span
            ><el-radio-group v-model="value">
              <el-radio-button label="全部渠道"></el-radio-button>
              <el-radio-button label="线上"></el-radio-button>
              <el-radio-button label="门店"></el-radio-button>
            </el-radio-group>
          </div>
          <div>
            <div class="charts" ref="charts"></div>
          </div> </el-card
      ></el-col>
    </el-row>
  </div>
</template>

<script>
import LineCharts from "./lineCharts";
import echarts from "echarts";
export default {
  name: "Observe",
  data() {
    return {
      value: "全部渠道",
    };
  },
  components: {
    LineCharts,
  },
  mounted() {
    //饼图
    let mychart = echarts.init(this.$refs.charts);
    mychart.setOption({
      title: {
        text: "视频",
        subtext: 1048,
        left: "center",
        top: "center",
      },
      tooltip: {
        trigger: "item",
      },
      series: [
        {
          name: "Access From",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: "#fff",
            borderWidth: 2,
          },
          label: {
            show: true,
            position: "outsize",
          },
          labelLine: {
            show: true,
          },
          data: [
            { value: 1048, name: "视频" },
            { value: 735, name: "Direct" },
            { value: 580, name: "Email" },
            { value: 484, name: "Union Ads" },
            { value: 300, name: "Video Ads" },
          ],
        },
      ],
    });
    //绑定事件

    mychart.on("mouseover", (params) => {
      //获取鼠标移上去那条数据
      const { name, value } = params.data;
      //重新设置标题
      mychart.setOption({
        title: {
          text: name,
          subtext: value,
        },
      });
    });
  },
};
</script>

<style scoped>
.flexLayout {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.charts{
    width: 100%;
    height: 280px;
}
</style>