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
                :load="loadNode">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>
                      {{ node.label }}
                      <el-tag size="mini" v-if="node.data.testCaseType == 1 && node.data.leaf == true">正</el-tag>
                      <el-tag size="mini" v-else-if="node.data.leaf == true" type="danger">反</el-tag>
                    </span>
                    <span v-show="node.label != '暂无内容'">
                      <el-button
                        v-show="node.isLeaf == false"
                        type="text"
                        size="mini"
                        @click="">
                        添加
                      </el-button>
                      <el-popconfirm
                        v-show="node.level>1"
                        title="确定要删除吗？"
                        @onConfirm=""
                      >
                        <el-button
                          type="text"
                          size="mini"
                          slot="reference">
                          删除
                        </el-button>
                      </el-popconfirm>
                    </span>
                  </span>
              </el-tree>
            </el-scrollbar>
          </div>
        </el-card>
      </el-col>

      <el-col :span="19">
        <el-card class="box-card" v-show="showInfo">
          <div slot="header" class="clearfix">
            <span>
              {{ currentTestCase.testCaseName }}
              <el-tag size="mini" v-if="currentTestCase.testCaseType == 1">正</el-tag>
              <el-tag size="mini" v-else type="danger">反</el-tag>
            </span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="test()">button</el-button>
          </div>
          <div class="text item" style="height:400px">
            <el-scrollbar class="scrollbar">
              <el-form :inline="true" :model="currentTestCase">
                <el-form-item label="用例创建人">
                  <span style="width: 120px">{{ currentTestCase.createUserName }}</span>
                </el-form-item>

                <el-form-item label="最后修改人">
                  <span style="width: 120px">{{ currentTestCase.lastModifyUserName }}</span>
                </el-form-item>

                <el-form-item label="最后更新时间">
                  <span style="width: 120px">{{ currentTestCase.lastModifyTime }}</span>
                </el-form-item>
              </el-form>

              <el-table
                :data="stepList"
                border
                align="left"
                row-key="stepNo"
              >              
                <el-table-column
                  label="用例步骤"
                  width="400">
                  <template slot-scope="scope">
                    <span v-if="!scope.row.isModify">{{ scope.row.stepInfo }}</span>
                    <input class="my-input" v-else v-model="scope.row.modifyStepInfo"></input>
                  </template>
                </el-table-column>

                <el-table-column
                  label="用例变量"
                  width="400">
                  <template slot-scope="scope">
                    <span v-if="!scope.row.isModify">{{ scope.row.stepParam }}</span>
                    <input class="my-input" v-else v-model="scope.row.modifyStepParam"></input>
                  </template>
                </el-table-column>

                <el-table-column
                  label="预期">
                  <template slot-scope="scope">
                    <span v-if="!scope.row.isModify">{{ scope.row.expect }}</span>
                    <input class="my-input" v-else v-model="scope.row.modifyExpect"></input>
                  </template>
                </el-table-column>

                <el-table-column
                width="120px">
                  <template slot="header" slot-scope="scope">
                      <el-button 
                        size="small"
                        type="success">
                        添加步骤
                      </el-button>
                  </template>
                  <template slot-scope="scope">
                    <div v-if="scope.row.isModify == undefined || !scope.row.isModify">
                      <el-button
                        style="margin-right:20px"
                        size="medium"
                        type="primary"
                        icon="el-icon-edit"
                        circle
                        @click="paramHandleEdit(scope.$index, scope.row)">
                      </el-button>
                      <el-popconfirm
                        title="确定要删除吗？"
                        @onConfirm=""
                      >
                        <el-button
                          slot="reference"
                          size="medium"
                          type="danger"
                          icon="el-icon-delete"
                          circle>
                        </el-button>
                      </el-popconfirm>
                    </div>
                    <div v-else>
                      <el-button
                        style="margin-right:10px"
                        size="medium"
                        type="success"
                        icon="el-icon-check"
                        circle
                        @click="paramConfirmEdit(scope.$index, scope.row)">
                      </el-button>
                      <el-button
                        size="medium"
                        icon="el-icon-close"
                        circle
                        @click="paramCancelEdit(scope.$index, scope.row)">
                      </el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-scrollbar>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getProjectListByUser } from "@/api/project"
import { getTestCaseList, getTestCaseInfo, pdateTestCaseStep, updateTestCaseStep } from "@/api/TestCase"
import Sortable from 'sortablejs'
import draggable from 'vuedraggable'

export default {
  components: {
    Sortable,
    draggable
  },
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
      currentTestCase: {
        projectId: '',
        id: '',
        testCaseName: '',
        testCaseType: '',
        createUserName: '',
        lastModifyUserName: '',
        lastModifyTime: ''
      },
      stepList:[],
      mySort: null,
      canDrop: true
    };
  },

  created(){
    this.refreshTestCaseList()
  },

  mounted() {
    this.rowDrop()
  },

  methods: {
    rowDrop() {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      let self = this;
      this.mySort =  Sortable.create(tbody,{
        animation:300,
        onEnd({ newIndex, oldIndex }) {// 修改data中的数组，
          const targetRow = self.stepList.splice(oldIndex, 1)[0]
          self.stepList.splice(newIndex, 0, targetRow)
        }
      })
    },

    test(){
      var state = this.mySort.option("disabled"); // get
      this.mySort.option("disabled", !state); // set
      console.log(this.stepList)
    },

    refreshTestCaseList() {
      getProjectListByUser().then(res => {
        if(res.code == 0){
          this.treeData = res.data
        }
      }).catch(() => {
        // console.log("error")
      })
    },

    handleNodeClick(data) {
      if(data.leaf == true){
        this.showInfo = true;
        this.currentTestCase.projectId = data.projectId;
        this.currentTestCase.id = data.testCaseId;
        this.currentTestCase.testCaseName = data.label;
        this.currentTestCase.testCaseType = data.testCaseType;

        this.refreshTestCaseInfo(this.currentTestCase.id)
      }
    },
    
    refreshTestCaseInfo(testCaseId){
      getTestCaseInfo(testCaseId).then(res => {
        if(res.code==0) {
          this.currentTestCase = res.data.testCaseInfo;
          this.stepList = res.data.testCase;
        }
        else{
          this.$message({
            message: res.message,
            type:'error'
          })
        }
      })
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
      this.mySort.option("disabled", true); // set

      this.stepList[index].isModify = true;
      this.stepList[index].modifyStepInfo = this.stepList[index].stepInfo
      this.stepList[index].modifyStepParam = this.stepList[index].stepParam
      this.stepList[index].modifyExpect = this.stepList[index].expect
      this.$set(this.stepList,index, this.stepList[index])
    },

    paramCancelEdit(index,row) {
      this.stepList[index].isModify = false
      this.$set(this.stepList,index, this.stepList[index])

      this.mySort.option("disabled", false); // set
    },

    paramConfirmEdit(index, row) {
      updateTestCaseStep(this.currentTestCase.projectId, row).then(res => {
        if(res.code == 0) {
          console.log(this.currentTestCase)
          this.refreshTestCaseInfo(this.currentTestCase.id)

          this.mySort.option("disabled", false); // set
          
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        }
      })
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

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .my-input{
    -webkit-appearance: none;
    background-color: #FFF;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 40px;
    line-height: 40px;
    outline: 0;
    padding: 0 15px;
    -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width: 100%;
  }
</style>