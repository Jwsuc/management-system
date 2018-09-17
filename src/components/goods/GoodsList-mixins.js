export default {
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表
      goodsList: [],
      // 总数据条数
      total: 0
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 获取商品列表
    // 被 async 修饰的方法，叫做异步方法
    // async 关键字，只能修饰方法，但是方法的表现形式有很多种：
    // async show() {}
    // async () => {}
    //     this.$refs.addForm.validate(async  valid => { await  this.$http.post('添加表单', {}) })
    // async  function () {}
    async getGoodsList() {
      // await 是专门用来简化 promise 异步操作的
      // await 是用来修饰 Promise 实例对象
      // await 只能用在被 async 修饰的方法中
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) return this.$message.error('初始化商品列表失败！')
      // 为商品列表赋值
      this.goodsList = res.data.goods
      // 为总数量赋值
      this.total = res.data.total
      console.log(res)
    },
    // pageSize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // pageNum 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 根据Id删除商品数据
    async remove(id) {
      // 询问用户是否要删除商品
      const confirmResult = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      // 用户不想删除数据
      if (confirmResult !== 'confirm') {
        return this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }

      // 执行删除的业务逻辑
      const { data: res } = await this.$http.delete('goods/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除商品失败！')
      this.$message.success('删除商品成功！')
      this.getGoodsList()
    },
    // 跳转到添加商品的页面
    goAddPage() {
      // 可以使用 路由 path 地址直接跳转
      // this.$router.push('/goods/add')
      // 也可以，通过命名路由实现跳转
      this.$router.push({ name: 'goodsadd' })
    }
  }
}
