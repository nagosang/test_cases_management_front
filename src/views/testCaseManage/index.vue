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
                      <el-tag size="mini" v-else-if="node.data.testCaseType == 0 && node.data.leaf == true" type="danger">反</el-tag>
                    </span>
                    <span v-show="node.label != '暂无内容'">
                      <el-button
                        v-show="node.isLeaf == false"
                        type="text"
                        size="mini"
                        @click="handleAddTestCase(node)">
                        添加
                      </el-button>
                      <el-popconfirm
                        v-show="node.level>1"
                        title="确定要删除吗？"
                        @onConfirm="confirmDeleteTestCase(node, data)"
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
          </div>
          <div class="text item" style="height:400px">
            <el-scrollbar class="scrollbar" ref="testCaseInfoScrollbar" style="height: 400px">
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
                row-key="id"
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
                        type="success"
                        @click="addStep()">
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
                        @onConfirm="deleteTestCaseStep(scope.$index, scope.row)"
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

    <el-dialog
      title=""
      :visible.sync="addTestCaseDialogVisible"
      width="30%"
      >
      <el-form ref="addTestCaseForm" :model="addTestCaseForm" label-width="80px">
        <el-form-item label="类型">
          <el-switch
            v-model="addTestCaseForm.isTestCase"
            active-color="#13ce66"
            inactive-color="#409EFF"
            active-text="测试用例"
            inactive-text="用例分类">
          </el-switch>
        </el-form-item>
        
        <el-form-item label="名称" prop="">
          <el-input v-model="addTestCaseForm.testCaseName"></el-input>
        </el-form-item>

        <el-form-item label="类型" v-show="addTestCaseForm.isTestCase">
          <el-switch
            v-model="addTestCaseForm.testCaseType"
            active-color="#67C23A"
            inactive-color="#F56C6C"
            active-text="正例"
            inactive-text="反例">
          </el-switch>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addTestCaseDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmToAddTestCase()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getProjectListByUser } from "@/api/project"
import { getTestCaseList, getTestCaseInfo, updateTestCaseStep, createTestCaseStep, deleteTestCaseStep, changeTestCaseStep, createTestCase, deleteTestCase } from "@/api/TestCase"
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
      hasNewLine: false,
      stepList:[],
      mySort: null,
      canDrop: true,

      addTestCaseDialogVisible: false,
      addTestCaseForm:{
        projectId: '',
        belong:'',
        isTestCase: true,
        testCaseName:'',
        testCaseType: false,
      }
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

          for(var i = 0;i<self.stepList.length;i++) {
            self.stepList[i].stepNo = i+1
          }
          self.toChangeTestCaseStep();
        }
      })
    },

    toChangeTestCaseStep(){
      changeTestCaseStep(this.currentTestCase.projectId, this.stepList).then(res => {
        if(res.code != 0){
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
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
          this.hasNewLine = false
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

      if(this.stepList[index].isNewLine!=undefined && this.stepList[index].isNewLine==true){
        this.stepList.pop()
        this.hasNewLine =false;
      }
      this.mySort.option("disabled", false); // set
    },

    paramConfirmEdit(index, row) {
      if(this.stepList[index].modifyStepInfo==""){
        this.$message({
          message:'用例步骤不能为空',
          type: 'warning'
        })
        return
      }

      if(this.stepList[index].isNewLine!=undefined && this.stepList[index].isNewLine==true){
        this.stepList[index].stepNo= this.stepList.length
        this.stepList[index].testCaseId = this.currentTestCase.id
        createTestCaseStep(this.currentTestCase.projectId, row).then(res => {
          if(res.code == 0) {
            this.refreshTestCaseInfo(this.currentTestCase.id)

            this.mySort.option("disabled", false); // set
            this.$message({
              message: '添加成功',
              type: 'success'
            })
          }
        })
      }
      else{
        updateTestCaseStep(this.currentTestCase.projectId, row).then(res => {
        if(res.code == 0) {
          this.refreshTestCaseInfo(this.currentTestCase.id)

          this.mySort.option("disabled", false); // set
          
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        }
      })
      }
    },

    paramHandleDelete(index, row) {
      console.log(index, row);
    },

    addStep(){
      if(this.hasNewLine){
        console.log('has newline')
        return
      }
      this.hasNewLine = true;
      let newLine = {}
      newLine.isNewLine = true;
      newLine.isModify = true;
      newLine.modifyStepInfo = '';
      newLine.modifyStepParam = '';
      newLine.modifyExpect = '';

      this.mySort.option("disabled", true); // set
      this.stepList.push(newLine)
      this.$nextTick(() => {
        this.$refs['testCaseInfoScrollbar'].$refs['wrap'].scrollTop = this.$refs['testCaseInfoScrollbar'].$refs['wrap'].scrollHeight
      })
    },

    deleteTestCaseStep(index, row) {
      deleteTestCaseStep(row.id, this.currentTestCase.projectId).then(res => {
        if(res.code == 0){
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.refreshTestCaseInfo(this.currentTestCase.id);
        }
        else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    },

    handleAddTestCase(node) {
      console.log(node)
      this.addTestCaseForm.projectId = node.data.projectId
      this.addTestCaseForm.testCaseName = ''
      if(node.data.testCaseId != undefined){
        this.addTestCaseForm.belong = node.data.testCaseId
      }
      else{
        this.addTestCaseForm.belong = 0;
      }
      this.addTestCaseDialogVisible = true
    },

    confirmToAddTestCase(){
      if(this.addTestCaseForm.testCaseName == ""){
        this.$message({
          message:'名称不得为空',
          type:'warning'
        })
        return
      }
      createTestCase(this.addTestCaseForm, this.addTestCaseForm.projectId).then(res => {
        if(res.code == 0){
          this.refreshTestCaseList()
          this.showInfo = false
          this.addTestCaseDialogVisible =false
          this.$message({
            message: '添加成功',
            type:'success'
          })
        }
        else{
          this.message({
            message: res.message,
            type:'error'
          })
        }
      })
    },

    confirmDeleteTestCase(node, data){
      if(node.isLeaf == false) {
        this.$confirm('此操作将永久删除该分类及其下的所有内容, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteTestCase(node.data.testCaseId, node.data.projectId).then(res => {
            if(res.code == 0){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.refreshTestCaseList()
            }
            else{
              this.$message({
                type: 'error',
                message: res.msg
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      }
      else {
        deleteTestCase(node.data.testCaseId, node.data.projectId).then(res => {
          if(res.code == 0){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.refreshTestCaseList();
          }
          else{
            this.$message({
              type: 'error',
              message: res.msg
            })
          }
        })
      }
    },
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