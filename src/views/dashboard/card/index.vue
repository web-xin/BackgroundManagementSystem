<template>
  <div>
    <div class="card-header">
        <span>{{title}}</span>
        <i class="el-icon-info"></i>
    </div>
    <div class="card-datavalue">
        <span>{{count}}</span>
    </div>
    <div class="card-dataimg">
        <slot name="charts"></slot>
    </div>
    <div class="card-footer">
        <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
    name:'Card',
    props:['title','count']
}
</script>

<style>
.card-header{
    display: flex;
    justify-content: space-between;
    color: #D9D9E0;
}
.card-datavalue{
    font-size: 30px;
    padding: 10px 0;
}
.card-dataimg{
    height: 50px;
}
.card-footer{
    border-top: 1px solid #eee;
    padding-top: 10px;
}
</style>