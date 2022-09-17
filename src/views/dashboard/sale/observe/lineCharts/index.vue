<template>
  <div>
    <div class="head">
      <span style="margin-right: 10px">{{ title }}</span>
      <i class="el-icon-info"></i>
    </div>
    <div class="main">
      <span style="margin-right: 30px; font-size: 20px">{{ count }}</span>
      <slot name="main"></slot>
    </div>
    <div class="charts" ref="echarts"></div>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "LineCharts",
  props: ["title", "count"],
  mounted() {
    let myEcharts = echarts.init(this.$refs.echarts);
    myEcharts.setOption({
      xAxis: {
        type: "category",
        show: false,
      },
      yAxis: {
        show: false,
      },
      series: [
        {
          type: "line",
          data: [50, 100, 34, 21, 56, 48, 20, 80],
          lineStyle: {
            color: "skyblue",
          },
          itemStyle: {
            opacity: 0,
          },
          //填充颜色设置
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "skyblue", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#fff", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
          smooth: true,
        },
      ],
      grid: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
      },
    });
  },
};
</script>

<style>
.main {
  margin: 10px 0;
}
.charts{
    width: 100%;
    height: 50px;
}
</style>