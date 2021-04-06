<template>
  <div >
    <el-row>  
      <el-col :span="5">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>项目列表</span>
          </div>
          <div class="text item" style="height:400px">
            <el-scrollbar class="scrollbar cardScrollbar">
              <el-tree
                :data="treeData"
                :props="defaultProps"
                @node-click="handleNodeClick"
                lazy
                accordion
                :load="loadNode">
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ node.label }}</span>
                  </span>
                </el-tree>
            </el-scrollbar>
          </div>
        </el-card>
      </el-col>

      <el-col :span="19">
        <el-card class="box-card" v-show="showInfo" style="height:800px">
          <div slot="header" class="clearfix">
            <span>{{ interfaceForm.interfaceName }}</span>
          </div>
          <div class="text item" style="height:800px">
            <el-scrollbar class="scrollbar cardScrollbar">
              <el-form ref="interfaceForm" :model="interfaceForm" label-width="80px">
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
                  <el-tabs v-model="activeName" type="border-card">
                    <el-tab-pane label="请求参数" name="requestParam">
                      <el-table
                      :data="paramData"
                      stripe
                      border
                      height="300"
                      style="width: 90%">
                        <el-table-column
                        type="index"
                        width="50">
                        </el-table-column>

                        <el-table-column
                        label="参数名"
                        width="180">
                          <template slot-scope="scope">
                            <span>{{ scope.row.parameterName }}</span>
                          </template>
                        </el-table-column>

                        <el-table-column
                        label="参数类型"
                        width="180">
                          <template slot-scope="scope">
                            <span>{{ scope.row.parameterType }}</span>
                          </template>
                        </el-table-column>

                        <el-table-column
                        label="参数示例">
                          <template slot-scope="scope">
                            <span>{{ scope.row.example }}</span>
                          </template>
                        </el-table-column>

                        <el-table-column label="参数值">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.value"></el-input>
                          </template>
                        </el-table-column>
                          
                      </el-table>
                    </el-tab-pane>
                    
                    <el-tab-pane label="请求头" name="requestHeader">
                      <el-table
                      :data="headerData"
                      stripe
                      border
                      height="300"
                      style="width: 90%">
                        <el-table-column
                        type="index"
                        width="50">
                        </el-table-column>

                        <el-table-column
                        label="参数名"
                        width="180">
                          <template slot-scope="scope">
                            <span>{{ scope.row.parameterName }}</span>
                          </template>
                        </el-table-column>

                        <el-table-column
                        label="参数类型"
                        width="180">
                          <template slot-scope="scope">
                            <span>{{ scope.row.parameterType }}</span>
                          </template>
                        </el-table-column>

                        <el-table-column
                        label="参数示例">
                          <template slot-scope="scope">
                            <span>{{ scope.row.example }}</span>
                          </template>
                        </el-table-column>

                        <el-table-column label="参数值">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.value"></el-input>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-tab-pane>

                    <el-tab-pane label="cookie" name="cookie">
                      <el-table
                      :data="cookieData"
                      stripe
                      border
                      height="300"
                      style="width: 90%">
                        <el-table-column
                        type="index"
                        width="50">
                        </el-table-column>

                        <el-table-column
                        label="参数名"
                        width="180">
                          <template slot-scope="scope">
                            <span>{{ scope.row.parameterName }}</span>
                          </template>
                        </el-table-column>

                        <el-table-column
                        label="参数类型"
                        width="180">
                          <template slot-scope="scope">
                            <span>{{ scope.row.parameterType }}</span>
                          </template>
                        </el-table-column>

                        <el-table-column
                        label="参数示例">
                          <template slot-scope="scope">
                            <span>{{ scope.row.example }}</span>
                          </template>
                        </el-table-column>

                        <el-table-column label="参数值">
                          <template slot-scope="scope">
                            <el-input v-model="scope.row.value"></el-input>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-tab-pane>
                  </el-tabs>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="handleToAutoTest()" v-loading.fullscreen.lock="fullscreenLoading">自动测试</el-button>
                </el-form-item>
              </el-form>
            </el-scrollbar>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog title="测试结果" :visible.sync="resultsDialogVisible">
      <el-form :model="resaultsForm" label-width="80px">
        <el-form-item label="响应码">
          <span style="width: 120px">{{ resaultsForm.statusCode }}</span>
        </el-form-item>
        
        <el-form-item label="响应码值">
          <span style="width: 120px">{{ resaultsForm.statusCodeValue }}</span>
        </el-form-item>

        <el-form-item label="响应头">
          <span style="width: 120px">{{ resaultsForm.headers }}</span>
        </el-form-item>

        <el-form-item label="返回值">
          <div class="text item" style="height:400px">
            <el-scrollbar class="scrollbar cardScrollbar">
              <vue-json-pretty
                :data="resaultsForm.body"
              >   
              </vue-json-pretty>
            </el-scrollbar>
          </div>
        </el-form-item>


      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resultsDialogVisible = false">测试不通过</el-button>
        <el-button type="primary" @click="handleConfirmTestResults()">测试通过</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
import { getProjectListByUser } from "@/api/project"
import { getInterfaceList, getInterfaceInfo } from "@/api/interface"
import { autoTest, confirmTestResults } from "@/api/autoTest"

export default {
  components: {
    VueJsonPretty
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
      modifyInterfaceDetail: false,
      currentInterfaceId: '',
      interfaceForm:{
        interfaceId: '',
        projectId:'',
        interfaceName: '',
        interfaceMethod:'',
        interfaceRoute:'',
        interfaceInfo:'',
      },
      activeName: 'requestParam',
      paramData:[],
      headerData:[],
      cookieData:[],

      fullscreenLoading: false,

      resultsDialogVisible: false,
      resaultsForm:[]
    };
  },

  created(){
    this.refreshProjectList()
  },


  methods: {
    refreshProjectList(){
      getProjectListByUser().then(res => {
        if(res.code == 0){
          this.treeData = res.data
        }
      }).catch(() => {
        // console.log("error")
      })
    },

    handleNodeClick(data) {
      if(data.label=='暂无内容'){
        return
      }
      this.modifyInterfaceDetail =false
      this.modifyProjectDetail =false
      if(data.leaf == true){
        this.showInfo = true;
        getInterfaceInfo(data.interfaceId).then(res => {
          if(res.code == 0) {
            this.currentInterfaceId = data.interfaceId
            this.interfaceForm = res.data.data;
            this.paramData = res.data.paramData
            this.headerData = res.data.headerData
            this.cookieData = res.data.cookieData
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

    loadNode(node, resolve){
      if(node.data.projectId != undefined) {
        var interfaceId = 0;
        if(node.data.interfaceId != undefined){
          interfaceId = node.data.interfaceId;
        }
        getInterfaceList(node.data.projectId, interfaceId).then(res => {
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

    change(e) {
      this.$forceUpdate()
    },

    handleToAutoTest(){
      this.fullscreenLoading = true;
      var data = {};
      data.paramData = this.paramData
      data.headerData = this.headerData
      data.cookieData = this.cookieData
      autoTest(data, this.interfaceForm.interfaceMethod, this.currentInterfaceId).then(res => {
        if(res.code == 0){
          this.resaultsForm = res.data;
          this.resaultsForm.body = JSON.parse(this.resaultsForm.body)
        }
      }).then(() => {
        this.fullscreenLoading = false
        this.resultsDialogVisible = true
      })
    },

    handleConfirmTestResults() {
      confirmTestResults(this.resaultsForm.id).then(res => {
        if(res.code == 0){
          this.resultsDialogVisible = false
        }
      })
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

  .el-scrollbar .el-scrollbar__wrap {
    overflow-x: hidden;
  }

  .el-select-dropdown .el-scrollbar {
    padding-bottom: 17px;
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