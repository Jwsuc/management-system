<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示消息 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>

      <!-- 步骤条组件 -->
      <el-steps :active="activeName-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab 栏标签页 -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs tab-position="left" v-model="activeName" :before-leave="beforeTabLeave">
          <!-- 基本信息面板 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader expand-trigger="hover" :options="cateList" :props="cascaderConfig" v-model="addForm.goods_cat" @change="handleCascaderChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品参数面板 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="item in manyData" :key="item.attr_id" :label="item.attr_name">
              <!-- 把当前这个循环出来的动态参数下，所有 attr_vals 项，渲染为一个一个的 复选框 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox v-for="(item, i) in item.attr_vals" :key="i" :label="item" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品静态属性面板 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlyData" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 图片上传面板 -->
          <el-tab-pane label="商品图片" name="3">
            <!-- action 用来指定上传图片的接口地址 -->
            <!-- action 必须指定一个完整的请求路径，因为 el-upload 组件，在发起Ajax请求的时候，并没有触发 axios, 而是element-ui为el-upload封装了Ajax提交图片的行为 -->
            <!-- 注意：当图片上传成功以后，要主动把图片的信息，保存到 addForm.pics 数组中 -->
            <!-- 只要图片上传成功了，就会触发 on-success 指定的回调函数 -->
            <el-upload
            action="https://www.liulongbin.top:8888/api/private/v1/upload"
            :headers="uploadHeaders"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <!-- 商品描述面板 -->
          <!-- 用到的富文本编辑器 https://github.com/surmon-china/vue-quill-editor -->
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" class="addGoods" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览的对话框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      width="50%">
      <img class="previewImg" :src="previewImgSrc" alt="">
    </el-dialog>
  </div>
</template>

<script>
import mix from './Add-mixins.js'
export default {
  mixins: [mix]
}
</script>

<style lang="less" scoped>
.el-steps {
  margin: 15px 0;
}
.previewImg{
  width: 100%;
}
.addGoods{
  margin-top: 15px;
}
</style>
