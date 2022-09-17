<template>
  <div class="charts" ref="echarts"></div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "BarCharts",
  mounted() {
    let myCharts = echarts.init(this.$refs.echarts);
    myCharts.setOption({
      xAxis: {
        show: false,
        type: "category",
      },
      yAxis: {
        show: false,
      },
      series: [
        {
          type: "bar",
          data: [10, 7, 33, 12, 48, 9, 29, 10, 44, 33, 22, 8],
          color: "cyan",
        },
      ],
      //布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
      tooltip:{}
    });
  },
};
</script>

<style>
.charts {
  height: 100%;
  width: 100%;
}
</style>