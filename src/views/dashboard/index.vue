<template>
  <div class="dashboard-container">
    <el-row :gutter="10">
      <el-col :span="6">
        <el-card>
          <Card title="总销售额" count="¥ 126560">
            <template slot="charts">
              <span
                >周同比 56.67% &nbsp;<svg
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
                  ></path></svg
                >&nbsp;日同比 19.96%&nbsp;<svg
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
            </template>
            <template slot="footer">
              <span>日销售额￥ 12423</span>
            </template>
          </Card>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Card title="访问量" count="88460">
            <template slot="charts">
              <LineCharts></LineCharts>
            </template>
            <template slot="footer">
              <span>日访问量 1234</span>
            </template>
          </Card>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Card title="支付笔数" count="88460">
            <template slot="charts">
              <BarCharts></BarCharts>
            </template>
            <template slot="footer">
              <span>转换率64%</span>
            </template>
          </Card>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <Card title="支付笔数" count="88460">
            <template slot="charts">
              <ProgressCharts></ProgressCharts>
            </template>
            <template slot="footer">
              <span
                >周同比 56.67% &nbsp;<svg
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
                  ></path></svg
                >&nbsp;日同比 19.96%&nbsp;<svg
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
            </template>
          </Card>
        </el-card>
      </el-col>
    </el-row>
    <Sale></Sale>
  </div>
</template>

<script>
import Card from "@/views/dashboard/card";
import LineCharts from "@/views/dashboard/lineCharts";
import BarCharts from "@/views/dashboard/barCharts";
import ProgressCharts from "@/views/dashboard/progressCharts";
import Sale from '@/views/dashboard/sale'
export default {
  name: "Dashboard",
  components: {
    Card,
    LineCharts,
    BarCharts,
    ProgressCharts,
    Sale
  },
};
</script>

<style lang="scss" scoped>
</style>
