<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>卡片名称</span>
      <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
    </div>
    <div class="text item">
      <el-tree
        :data="treeData"
        :props="defaultProps"
        @node-click="handleNodeClick"
        lazy
        :load="loadNode"></el-tree>
    </div>
  </el-card>
</template>

<script>
import { getGroupList } from '@/api/group'

export default {
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'leaf'
      }
    };
  },

  created(){
    getGroupList().then(res => {
      if(res.code == 0){
        this.treeData = res.data
      }
    }).catch(() => {
      console.log("error")
    })
  },

  methods: {
    handleNodeClick(data) {
      console.log(data);
    },

    loadNode(node, resolve){
      console.log(node);
      
      resolve(data);
    }
  }
}
</script>

<style>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    margin: 2%;
    width: 96%;
    height: 500px;
  }
</style>