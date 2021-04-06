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
            <span>{{ interfaceName }}</span>
          </div>
          <div class="text item" style="height:800px">
            <el-table
              v-loading="tableLoading"
              :data="tableData"
              stripe
              style="width: 100%"
              height="650"
            >
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-tabs v-model="activeName">
                    <el-tab-pane label="响应体" name="body">
                      <div style="height: 200px">
                        <el-scrollbar class="scrollbar cardScrollbar">
                          <vue-json-pretty
                            :data="JSON.parse(scope.row.body)"
                          >   
                          </vue-json-pretty>
                        </el-scrollbar>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="响应头" name="header">
                      <div style="height: 200px">
                        <el-scrollbar class="scrollbar cardScrollbar">
                          <vue-json-pretty
                            :data="scope.row.headers"
                          >   
                          </vue-json-pretty>
                        </el-scrollbar>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="请求头数据" name="testHeader">
                      <el-table
                        :data="JSON.parse(scope.row.testHeader)"
                        stripe
                        border
                        height="200"
                      >
                        <el-table-column
                          type="index"
                          width="50">
                        </el-table-column>

                        <el-table-column
                          label="参数名"
                          prop="parameterName"
                          width="150">
                        </el-table-column>

                        <el-table-column
                          label="参数值"
                          prop="value"
                          width="300">
                        </el-table-column>
                      </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="请求体数据" name="testBody">
                      <el-table
                        :data="JSON.parse(scope.row.testBody)"
                        stripe
                        border
                        height="200"
                      >
                        <el-table-column
                          type="index"
                          width="50">
                        </el-table-column>

                        <el-table-column
                          label="参数名"
                          prop="parameterName"
                          width="150">
                        </el-table-column>

                        <el-table-column
                          label="参数值"
                          prop="value"
                          width="300">
                        </el-table-column>
                      </el-table>
                    </el-tab-pane>
                    <el-tab-pane label="请求Cookie数据" name="testCookie">
                      <el-table
                        :data="JSON.parse(scope.row.testCookie)"
                        stripe
                        border
                        height="200"
                      >
                        <el-table-column
                          type="index"
                          width="50">
                        </el-table-column>

                        <el-table-column
                          label="参数名"
                          prop="parameterName"
                          width="150">
                        </el-table-column>

                        <el-table-column
                          label="参数值"
                          prop="value"
                          width="300">
                        </el-table-column>
                      </el-table>
                    </el-tab-pane>
                  </el-tabs>
                </template>
              </el-table-column>

              <el-table-column
                type="index"
                width="50">
              </el-table-column>

              <el-table-column
                label="响应码"
                width="100">
                <template slot-scope="scope">
                  <span>{{ scope.row.statusCode }}</span>
                </template>
              </el-table-column>

              <el-table-column
                label="响应码值"
                width="150">
                <template slot-scope="scope">
                  <span>{{ scope.row.statusCodeValue }}</span>
                </template>
              </el-table-column>

              <el-table-column
                label="请求方式"
                width="150">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.method == 'get'">GET</el-tag>
                  <el-tag v-else-if="scope.row.method == 'post'" type="success">POST</el-tag>
                </template>
              </el-table-column>

              <el-table-column
                label="测试用户"
                width="150">
                <template slot-scope="scope">
                  <span>{{ scope.row.testUser }}</span>
                </template>
              </el-table-column>
              
              <el-table-column
                label="测试时间">
                <template slot-scope="scope">
                  <span>{{ scope.row.date }}</span>
                </template>
              </el-table-column>

              <el-table-column
                label="测试结果"
                width="150">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.isPass == 1" type="success">测试通过</el-tag>
                  <el-tag v-else type="danger">测试不通过</el-tag>
                </template>
              </el-table-column>

              <el-table-column
                label="操作"
                width="150">
                <template slot-scope="scope">
                  <el-button type="primary" size="medium" @click="reTest(scope.row)" v-loading.fullscreen.lock="fullscreenLoading">再次测试</el-button>
                </template>
              </el-table-column>

            </el-table>
            <el-pagination
              small
              layout="prev, pager, next"
              :total="total"
              @current-change="handleCurrentChange">
            </el-pagination>
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
import { getInterfaceList} from "@/api/interface"
import { queryTestResultsByPage } from "@/api/autoTest"
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
      currentInterfaceId: '',
      interfaceName: '',

      fullscreenLoading: false,
      
      total: 0,
      page: 1,
      tableData:[],
      tableLoading: false,

      activeName: 'body',

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
        this.interfaceName = data.label
        this.currentInterfaceId = data.interfaceId
        this.getTestResultsList();
        this.page = 1
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

    getTestResultsList() {
      this.tableLoading = true
      queryTestResultsByPage(this.currentInterfaceId, this.page).then(res => {
        if(res.code == 0){
          this.total = res.data.count
          this.tableData = res.data.tableData
        }
        else{
          this.$message({
            message: res.message,
            type:'error'
          })
        }
      }).then(() => {
        this.tableLoading = false
      })
    },

    handleCurrentChange: function(currentPage){
      this.page = currentPage
      this.getTestResultsList()
    },

    reTest(row) {
      this.fullscreenLoading = true
      // var data = {
      //   'paramData': row.testBody,
      //   'haderData': row.testHeader,
      //   'cookieData': row.testCookie
      // };
      var data = {}
      data.paramData = JSON.parse(row.testBody)
      data.headerData = JSON.parse(row.testHeader)
      data.cookieData = JSON.parse(row.testCookie)
      autoTest(data, row.method, this.currentInterfaceId).then(res => {
        if(res.code == 0){
          this.resaultsForm = res.data;
          this.resaultsForm.body = JSON.parse(this.resaultsForm.body)
        }
      }).then(() => {
        this.fullscreenLoading = false
        this.resultsDialogVisible = true
        this.getTestResultsList()
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