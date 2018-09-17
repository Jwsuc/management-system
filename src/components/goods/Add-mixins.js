import _ from 'lodash'

export default {
  data() {
    return {
      // 默认，让name为"0"的面板被激活
      activeName: '0',
      // 添加商品的表单数据对象
      addForm: {
        // 商品名称
        goods_name: '',
        // 商品价格
        goods_price: '',
        // 商品重量
        goods_weight: '',
        // 商品数量
        goods_number: '',
        // 商品的所属分类
        goods_cat: [],
        // 当前商品所有的图片信息
        pics: [],
        // 商品的描述
        goods_introduce: '',
        // 所有静态参数和动态参数，都要保存到 attrs 中
        attrs: []
      },
      // 添加商品表单的验证规则对象
      addFormRules: {
        goods_name: [{ required: true, message: '请填写商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请填写商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请填写商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请填写商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }]
      },
      // 所有商品分类的列表数据
      cateList: [],
      // 级联选择框的配置对象
      cascaderConfig: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 所有的动态参数列表
      manyData: [],
      // 所有的静态属性参数列表
      onlyData: [],
      // 上传组件的headers请求头配置对象
      uploadHeaders: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 图片预览对话框的显示与隐藏
      previewVisible: false,
      // 预览图片的URL地址，默认为空
      previewImgSrc: ''
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) return this.$message.error('初始化商品分类失败！')
      this.cateList = res.data
    },
    // 商品分类级联选择框选中项发生了变化
    handleCascaderChange() {
      if (this.addForm.goods_cat.length === 3) {
        // 选中了三级分类
      } else {
        // 未选中三级分类
        this.addForm.goods_cat = []
      }
      console.log(this.addForm.goods_cat)
    },
    beforeTabLeave(newPanel, oldPanel) {
      // 用户正处于第一个面板，且没有选中商品的分类
      if (oldPanel === '0' && this.addForm.goods_cat.length !== 3) {
        // 阻止面板的切换
        // 强制用户留在第一个面板
        this.$message.error('请先选择商品分类！')
        return false
      }
    },
    // 获取分类下，所有动态参数的数据列表
    async getManyData() {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: { sel: 'many' }
      })

      if (res.meta.status !== 200) return this.$message.error('获取动态参数列表失败！')
      // 把动态参数中的每一项数据中的 attr_vals，都从字符串分割为数组
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
      })
      this.manyData = res.data
      console.log(res)
    },
    // 根据选中的三级商品分类Id，获取分类下所有的静态属性
    async getOnlyData() {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
        params: { sel: 'only' }
      })

      if (res.meta.status !== 200) return this.$message.error('获取动态参数列表失败！')
      // 把动态参数中的每一项数据中的 attr_vals，都从字符串分割为数组
      this.onlyData = res.data
      console.log(res)
    },
    // 预览图片时候，触发的方法
    handlePreview(result) {
      this.previewImgSrc = result.response.data.url
      this.previewVisible = true
    },
    // 当移除图片，会触发这个方法
    handleRemove(result) {
      // 1. 根据 result.response.data.temp_path 从 addForm.pics 数组中，找到要删除那个对象的索引值
      const index = this.addForm.pics.findIndex(item => item.pic === result.response.data.tmp_path)
      // 根据索引删除对应的图片信息对象
      this.addForm.pics.splice(index, 1)
      console.log(this.addForm)
    },
    // 图片上传成功
    handleSuccess(result) {
      if (result.meta.status === 200) {
        // 把上传成功后，图片的临时路径，保存到 addForm.pics 数组中，作为对象来保存
        this.addForm.pics.push({
          pic: result.data.tmp_path
        })

        console.log(this.addForm)
      }
    },
    // 添加商品
    addGoods() {
      // 1. 先进行表单的校验，如果校验不通过，则禁止添加商品
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请补全商品的信息后再添加！')
        // 2. 为 addForm 补全 attrs 参数项
        // 2.1 先把所有 manyData 中的动态参数，保存到 addForm.attrs 中
        this.manyData.forEach(item => {
          const obj1 = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') }
          this.addForm.attrs.push(obj1)
        })
        // 2.2 把 onlyData 中的静态属性，保存到 addForm.attrs 中
        this.onlyData.forEach(item => {
          const obj2 = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(obj2)
        })

        // 把表单数据对象中的商品分类数组，合并为一个 字符串，然后重新赋值给 addForm.goods_cat
        // 注意：不能直接把 this.addForm.goods_cat 从数组变成字符串，因为页面上的 级联选择框要求 goods_cat 必须是数组
        // 注意：但是，服务器只接受 字符串类型的 goods_cat
        // 所以，我们可以使用 lodash 的 cloneDeep 方法，把 this.addForm 对象，深拷贝一份，从而把深拷贝出来的对象，提交到服务器去保存就行了！！！
        // this.addForm.goods_cat = this.addForm.goods_cat.join(',')
        const newForm = _.cloneDeep(this.addForm)
        // 只修改newForm中的goods_cat，不会影响this.addForm中的goods_cat
        newForm.goods_cat = newForm.goods_cat.join(',')
        // 到此位置，添加商品时候的数据。就已经准备完毕了，只剩下提交请求了！！！
        const { data: res } = await this.$http.post('goods', newForm)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success('添加商品成功！')
        // 跳转到商品列表页
        this.$router.push('/goods/list')
      })
    }
  },
  watch: {
    // 监视 被激活的面板的名称的变化，从而根据不同的面板，做不同的事情
    activeName(newVal) {
      // 证明进入到了商品参数面板
      if (newVal === '1') {
        // 根据选中的商品分类Id，获取分类下所有的动态参数
        this.getManyData()
      } else if (newVal === '2') {
        // 进入了静态属性面板
        this.getOnlyData()
      }
    }
  },
  computed: {
    // 通过计算属性，自定对选中的三级分类Id，进行求值
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[this.addForm.goods_cat.length - 1]
      } else {
        return null
      }
    }
  }
}
