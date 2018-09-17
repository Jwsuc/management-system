// 导入并得到角色对象
const role = require('./tree_data.js')

// 需求：通过递归，获取到当前角色下，所有的三级节点的Id，存放到一个数组中
function getLeafIds(node, keys) {
  // 判断 node 节点，是否为三级节点
  if (!node.children) {
    // 如果没有children属性，证明当前的node是三级节点
    // 这是 递归的结束条件【一定要有结束条件】
    keys.push(node.id)
  } else {
    // 不是三级节点
    node.children.forEach(item => {
      getLeafIds(item, keys)
    })
  }
}

const k = []

getLeafIds(role, k)
console.log(k)
