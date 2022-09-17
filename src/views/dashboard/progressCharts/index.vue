<template>
  <div class="charts" ref="echarts"></div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "ProgressCharts",
  mounted() {
    let myEcharts = echarts.init(this.$refs.echarts);
    myEcharts.setOption({
      xAxis: {
        show: false,
        min: 0,
        max: 100,
      },
      yAxis: {
        show: false,
        type: "category",
      },
      series: [
        {
          type: "bar",
          data: [78],
          barWidth: "10px",
          color: "yellowgreen",
          showBackground: true,
          backgroundStyle: {
            color: "#eee",
          },
          //文本标签
          label: {
            show: true,
            //改变文本内容
            formatter: "|",
            //文本标签位置调试
            position: "right",
          },
        },
      ],
      //布局调试
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
    });
  },
};
</script>

<style>
</style>