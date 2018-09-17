<template>
  <div>
    <h3>Welcome</h3>
    <p>{{nameList}}</p>
    <!-- 复选框组 -->
    <el-checkbox-group v-model="nameList">
      <!-- 每次循环，都把当前循环项，渲染为一个 checkbox -->
      <el-checkbox v-for="(item, i) in nameList" :key="i" :label="item" border></el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nameList: ['小黄', '小红', '小兰', '小黑', '小吉吉']
    }
  }
}
</script>
