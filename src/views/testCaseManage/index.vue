<template>
  <div>
    <el-row>  
      <el-col :span="5">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>用例列表</span>
            <!-- <el-button style="float: right; padding: 3px 0" type="text">添加项目</el-button> -->
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

      <el-col :span="19">
        <el-card class="box-card" v-show="showInfo">
          <div slot="header" class="clearfix">
            <span>详情</span>
            <el-button style="float: right; padding: 3px 0" type="text">button</el-button>
          </div>
          <div class="text item" style="height:400px">
            <el-scrollbar class="scrollbar">
              <el-form ref="form" :model="interfaceForm" label-width="80px">
                <el-form-item label="名称">
                  <span>{{ interfaceForm.interfaceName }}</span>
                </el-form-item>

                <el-form-item label="请求方法">
                  <el-tag v-if="interfaceForm.interfaceMethod == ''" type="info">无</el-tag>
                  <el-tag v-else-if="interfaceForm.interfaceMethod == 'get'">GET</el-tag>
                  <el-tag v-else-if="interfaceForm.interfaceMethod == 'post'" type="success">POST</el-tag>
                  <el-tag v-else-if="interfaceForm.interfaceMethod == 'delete'" type="danger">DELETE</el-tag>
                  <el-tag v-else-if="interfaceForm.interfaceMethod == 'update'" type="warning">WARNING</el-tag>
                  <el-tag v-else color="white">{{ interfaceForm.interfaceMethod }}</el-tag>
                </el-form-item>

                <el-form-item label="请求路径">
                  <span v-if="interfaceForm.interfaceRoute == ''">无</span>
                  <el-link v-else type="primary" :underline="false">{{ interfaceForm.interfaceRoute }}</el-link>
                </el-form-item>

                <el-form-item label="描述">
                  <span>{{ interfaceForm.interfaceInfo || "无" }}</span>
                </el-form-item>

                <el-form-item label="参数列表">
                  <el-table
                  :data="paramData"
                  stripe
                  border
                  style="width: 100%">
                    <el-table-column
                    type="index"
                    width="50">
                    </el-table-column>

                    <el-table-column
                    property="parameterName"
                    label="参数名"
                    width="180">
                    </el-table-column>

                    <el-table-column
                    property="parameterType"
                    label="参数类型"
                    width="180">
                    </el-table-column>

                    <el-table-column
                    property="example"
                    label="参数实例">
                    </el-table-column>

                    <el-table-column label="操作">
                      <template slot="header" slot-scope="scope">
                        <el-button
                          size="mini"
                          type="success"
                          @click="addParam()">添加参数</el-button>
                        <el-button
                      </template>
                      <template slot-scope="scope">
                        <el-button
                          size="mini"
                          @click="paramHandleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button
                          size="mini"
                          type="danger"
                          @click="paramHandleDelete(scope.$index, scope.row)">删除</el-button>
                      </template>
                    </el-table-column>
                      
                  </el-table>
                </el-form-item>
              </el-form>
            </el-scrollbar>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getProjectListByUser } from "@/api/project"
import { getTestCaseList } from "@/api/TestCase"
import { getInterfaceList, getInterfaceInfo } from "@/api/interface"

export default {
  data() {
    return {
      memberList:[],
      treeData: [],
      showInfo: false,
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'leaf'
      },
      interfaceForm:{
        interfaceName: '',
        interfaceMethod:'',
        interfaceRoute:'',
        interfaceInfo:'',
      },
      paramData:[]
    };
  },

  created(){
    getProjectListByUser().then(res => {
      if(res.code == 0){
        this.treeData = res.data
      }
    }).catch(() => {
      // console.log("error")
    })
  },


  methods: {
    handleNodeClick(data) {
      console.log(data)
      if(this.showInfo == false && data.leaf== true){
        this.showInfo = true;
      }
      if(data.leaf == true){
        // getInterfaceInfo(data.interfaceId).then(res => {
        //   if(res.code == 0) {
        //     this.interfaceForm = res.data;
        //     this.paramData = res.data.paramData;
        //   }
        //   else {
        //     this.$message({
        //       message: res.message,
        //       type: 'error'
        //     });
        //   }
        // })
      }
    },

    loadNode(node, resolve){
      if(node.data.projectId != undefined) {
        var testCaseId = 0;
        if(node.data.testCaseId != undefined){
          testCaseId = node.data.testCaseId;
        }
        getTestCaseList(node.data.projectId, testCaseId).then(res => {
          if (res.code == 0) {
            resolve(res.data)
          }
          else {
            this.$message({
              message: res.message,
              type: 'error'
            });
          }
        })
      }
    },

    paramHandleEdit(index, row) {
      console.log(index, row);
    },

    paramHandleDelete(index, row) {
      console.log(index, row);
    },

    addParam(){
      console.log("addParam")
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

</style>