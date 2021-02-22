<template>
  <div>
    <el-row>  
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>组列表</span>
            <el-button style="float: right; padding: 3px 0" type="text">添加组</el-button>
          </div>
          <div class="text item" style="height:400px">
            <el-scrollbar class="scrollbar">
              <el-tree
                :data="treeData"
                :props="defaultProps"
                @node-click="handleNodeClick"
                lazy
                accordion
                :load="loadNode"></el-tree>
            </el-scrollbar>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>组成员</span>
            <el-button style="float: right; padding: 3px 0" type="text">添加组成员</el-button>
          </div>
          <div class="text item" style="height:400px">
            <el-scrollbar class="scrollbar">
              <ul class="memberList">
                <li v-for="i in memberList" :key="i.userId" class="memberListItem">{{ i.userName }}</li>
              </ul>
            </el-scrollbar>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getGroupList } from '@/api/group'
import { getProjectListByGroup } from "@/api/project"
import { getGroupMember } from '@/api/user'

export default {
  data() {
    return {
      memberList:[],
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
      if(data.GroupId != undefined){
        getGroupMember(data.GroupId).then(res => {
          if(res.code == 0){
            this.memberList = res.data;
          }
        })
      }
    },

    loadNode(node, resolve){
      // console.log(node.data.GroupId);
      if(node.data.GroupId != undefined) {
        getProjectListByGroup(node.data.GroupId).then(res => {
          if (res.code == 0) {
            resolve(res.data)
          }
          else {
            this.$message({
              message: res.msg,
              type: 'error'
            });
          }
        })
      }
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
    height: 500px;
  }

  .scrollbar{
    height: 100%;
  }

  .el-scrollbar__wrap{
    overflow-x: hidden;
  }

  .memberListItem{
    display: flex;
    align-items: center;
    height: 50px;
    width: 80%;
    background: #e8f3fe;
    margin: 10px;
    color: #7dbcfc;
    
  }
</style>