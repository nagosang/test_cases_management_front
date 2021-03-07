<template>
  <div>
    <el-row>  
      <el-col :span="5">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>项目列表</span>
            <el-button style="float: right; padding: 3px 0" type="text">添加项目</el-button>
          </div>
          <div class="text item" style="height:400px">
            <el-scrollbar class="scrollbar cardScrollbar">
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
            <el-scrollbar class="scrollbar cardScrollbar">
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

    <el-row>
      <el-col :span="24">
        <el-card class="box-card" style="height: 350px" v-show="showProjectInfo">
          <div slot="header" class="clearfix">
            <el-row type="flex" justify="space-between"> 
              <el-col :span="5">
                <span>项目详情</span>
              </el-col>
              
              <el-col :span="2">
                <el-button type="primary" size="small" v-if="!modifyProjectDetail" @click="toModifyProjectDetail">修改信息</el-button>
                <div v-else>
                  <el-button type="success" size="small" @click="updateProjectDetail">保存</el-button>
                  <el-button type="warning" size="small" @click="modifyProjectDetail=false">取消</el-button>
                </div>
              </el-col>
            </el-row>
          </div>
          <el-form ref="projectInfo" :model="projectDetail" label-width="100px">
            <el-form-item label="项目名称" prop="projectName" style="margin-top:0px;margin-bottom:0px">
              <span v-if="!modifyProjectDetail">{{ projectDetail.projectName}}</span>
              <el-input v-else size="medium" v-model="projectDetail.modifyProjectName" @input="change($event)"></el-input>
            </el-form-item>

            <el-form-item label="归属项目组" prop="manageGroupId" style="margin-top:0px;margin-bottom:0px">
              <span v-if="!modifyProjectDetail">{{ projectDetail.manageGroupName}}</span>
              <el-select v-else v-model="projectDetail.modifyManageGroupId" @input="change($event)">
                <el-option
                  v-for="item in groupOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="项目地址" prop="projectAddress" style="margin-top:0px;margin-bottom:0px">
              <div v-if="!modifyProjectDetail">
                <span v-if="projectDetail.projectAddress == ''">无</span>
                <el-link v-else type="primary" :underline="false">{{ projectDetail.projectAddress }}</el-link>
              </div>
              <el-input v-else size="medium" v-model="projectDetail.modifyProjectAddress" @input="change($event)"></el-input>
            </el-form-item>

            <el-form-item label="数据库地址" prop="databaseAddress" style="margin-top:0px;margin-bottom:0px">
              <div v-if="!modifyProjectDetail">
                <span v-if="projectDetail.databaseAddress == ''">无</span>
                <el-link v-else type="primary" :underline="false">{{ projectDetail.databaseAddress }}</el-link>
              </div>
              <el-input v-else size="medium" v-model="projectDetail.modifyDatabaseAddress" @input="change($event)"></el-input>
            </el-form-item>

            <el-form-item label="项目详情" prop="projectInfo" style="margin-top:0px;margin-bottom:0px">
              <span v-if="!modifyProjectDetail">{{ projectDetail.projectInfo || "无"}}</span>
              <el-input
                v-else
                type="textarea"
                placeholder="请输入内容"
                v-model="projectDetail.modifyProjectInfo"
                maxlength="120"
                show-word-limit
                @input="change($event)"
              >
              </el-input>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      title="新增项目"
      :visible.sync="addProjectDialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form ref="addProjectForm" :model="addProjectForm" label-width="80px" >
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addProjectDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getProjectListByUser, getProjectInfo, updateProjecInfo } from "@/api/project"
import { getInterfaceList, getInterfaceInfo } from "@/api/interface"
import { getGroupListForChange } from "@/api/group"

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
      paramData:[],

      addProjectDialogVisible: false,
      addProjectForm:[],

      showProjectInfo:false,
      modifyProjectDetail:false,
      projectDetail:{
        projectId:'',
        projectName:'',
        modifyProjectName: '',
        manageGroupId:'',
        modifyManageGroupId:'',
        manageGroupName: '',
        projectAddress: '',
        modifyProjectAddress: '',
        databaseAddress: '',
        modifyDatabaseAddress: '',
        projectInfo:'',
        modifyProjectInfo: ''
      },
      groupOptions: []
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
      // this.showInfo =true;
      // console.log(data)
      if(data.leaf == true){
        this.showInfo = true;
        getInterfaceInfo(data.interfaceId).then(res => {
          if(res.code == 0) {
            this.interfaceForm = res.data;
            this.paramData = res.data.paramData;
          }
          else {
            this.$message({
              message: res.message,
              type: 'error'
            });
          }
        })
      }
      else {
        this.showProjectInfo = true
        getProjectInfo(data.projectId).then(res => {
          if(res.code == 0){
            this.projectDetail = res.data
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

    paramHandleEdit(index, row) {
      console.log(index, row);
    },

    paramHandleDelete(index, row) {
      console.log(index, row);
    },

    addParam(){
      console.log("addParam")
    },

    handleClose(done) {
      this.addProjectDialogVisible = false
    },

    change(e) {
      this.$forceUpdate()
    },

    toModifyProjectDetail(){
      this.projectDetail.modifyProjectName = this.projectDetail.projectName
      this.projectDetail.modifyManageGroupId = this.projectDetail.manageGroupId
      this.projectDetail.modifyProjectInfo = this.projectDetail.projectInfo
      this.projectDetail.modifyProjectAddress = this.projectDetail.projectAddress
      this.projectDetail.modifyDatabaseAddress = this.projectDetail.databaseAddress
      getGroupListForChange(this.projectDetail.manageGroupId).then(res => {
        if(res.code == 0) {
          this.groupOptions = res.data
          this.modifyProjectDetail = true
        }
        else {
          this.$message({
            message: res.msg,
            type: 'error'
          });
        }
      })
    },

    updateProjectDetail(){
      updateProjecInfo(this.projectDetail).then(res =>{
        if(res.code == 0){
          this.$message({
            message: '保存成功',
            type:'success'
          })
          
          this.projectDetail.projectName=this.projectDetail.modifyProjectName
          this.projectDetail.manageGroupId=this.projectDetail.modifyManageGroupId
          this.projectDetail.projectInfo=this.projectDetail.modifyProjectInfo
          this.projectDetail.projectAddress=this.projectDetail.modifyProjectAddress
          this.projectDetail.databaseAddress=this.projectDetail.modifyDatabaseAddress
          this.modifyProjectDetail = false

          getProjectListByUser().then(res => {
            if(res.code == 0){
              this.treeData = res.data
            }
          }).catch(() => {
            // console.log("error")
          })
        }
        else{
          this.$message({
            message: res.msg,
            type:'error'
          })
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

  .cardScrollbar .el-scrollbar__wrap{
    overflow-x: hidden;
  }

</style>