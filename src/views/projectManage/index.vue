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
                :load="loadNode">
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ node.label }}</span>
                    <span v-show="node.label != '暂无内容'">
                      <el-button
                        v-show="node.isLeaf == false"
                        type="text"
                        size="mini"
                        @click="() => append(node, data)">
                        添加
                      </el-button>
                      <el-popconfirm
                        v-show="node.level>1"
                        title="确定要删除吗？"
                        @onConfirm="remove(node, data)"
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
            <el-row type="flex" justify="space-between"> 
              <el-col :span="5">
                <span>接口详情</span>
              </el-col>
              
              <el-col :span="3">
                <el-button type="primary" size="small" v-if="!modifyInterfaceDetail" @click="toModifyInterfaceDetail">修改信息</el-button>
                <div v-else>
                  <el-button type="success" size="small" @click="updateInterfaceDetail">保存</el-button>
                  <el-button type="warning" size="small" @click="modifyInterfaceDetail=false">取消</el-button>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="text item" style="height:400px">
            <el-scrollbar class="scrollbar cardScrollbar">
              <el-form ref="interfaceForm" :model="interfaceForm" label-width="80px" :rule="rules">
                <el-form-item label="名称" prop="interfaceName">
                  <span v-if="!modifyInterfaceDetail">{{ interfaceForm.interfaceName }}</span>
                  <el-input v-else v-model="interfaceForm.modifyInterfaceName" @input="change($event)" style="width: 300px"></el-input>
                </el-form-item>

                <el-form-item label="请求方法">
                  <div v-if="!modifyInterfaceDetail">
                    <el-tag v-if="interfaceForm.interfaceMethod == ''" type="info">无</el-tag>
                    <el-tag v-else-if="interfaceForm.interfaceMethod == 'get'">GET</el-tag>
                    <el-tag v-else-if="interfaceForm.interfaceMethod == 'post'" type="success">POST</el-tag>
                    <el-tag v-else-if="interfaceForm.interfaceMethod == 'delete'" type="danger">DELETE</el-tag>
                    <el-tag v-else-if="interfaceForm.interfaceMethod == 'update'" type="warning">WARNING</el-tag>
                    <el-tag v-else color="white">{{ interfaceForm.interfaceMethod }}</el-tag>
                  </div>
                  <el-select v-else v-model="interfaceForm.modifyInterfaceMethod" placeholder="请选择" @input="change($event)" style="width: 300px">
                    <el-option value="get" label="GET"></el-option>
                    <el-option value="post" label="POST"></el-option>
                    <el-option value="put" label="PUT"></el-option>
                    <el-option value="patch" label="PATCH"></el-option>
                    <el-option value="delete" label="DELETE"></el-option>
                    <el-option value="copy" label="COPY"></el-option>
                    <el-option value="head" label="HEAD"></el-option>
                    <el-option value="options" label="option"></el-option>
                    <el-option value="link" label="LINK"></el-option>
                    <el-option value="nulink" label="UNLINK"></el-option>
                    <el-option value="purge" label="PURGE"></el-option>
                    <el-option value="lock" label="LOCK"></el-option>
                    <el-option value="unlock" label="UNLOCK"></el-option>
                    <el-option value="propfind" label="PROPFIND"></el-option>
                    <el-option value="view" label="VIEW"></el-option>
                    <el-option value="" label="无"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item label="请求路径">
                  <div v-if="!modifyInterfaceDetail">
                    <span v-if="interfaceForm.interfaceRoute == ''">无</span>
                    <el-link v-else type="primary" :underline="false">{{ interfaceForm.interfaceRoute }}</el-link>
                  </div>
                  <el-input v-else v-model="interfaceForm.modifyInterfaceRoute" @input="change($event)" style="width: 300px"></el-input>
                </el-form-item>

                <el-form-item label="描述">
                  <span v-if="!modifyInterfaceDetail">{{ interfaceForm.interfaceInfo || "无" }}</span>
                  <el-input
                    v-else
                    type="textarea"
                    placeholder="请输入内容"
                    v-model="interfaceForm.modifyInterfaceInfo"
                    maxlength="120"
                    show-word-limit
                    @input="change($event)"
                  >
                  </el-input>
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
                            <el-input v-if="scope.row.isNewLine == 1" v-model="scope.row.parameterName" @input="change($event)"></el-input>
                            <!-- <el-input v-else-if="scope.row.isModify == 1" v-model="paramData[scope.$index].modifyParameterName" @input="change($event)"></el-input> -->
                            <input class="my-input" v-else-if="scope.row.isModify == 1" v-model="paramData[scope.$index].modifyParameterName"></input>
                            <span v-else ="scope.row.isModify != 1">{{ scope.row.parameterName }}</span>
                          </template>
                        </el-table-column>

                        <el-table-column
                        label="参数类型"
                        width="180">
                          <template slot-scope="scope">
                            <el-input v-if="scope.row.isNewLine == 1" v-model="scope.row.parameterType"></el-input>
                            <input class="my-input" v-else-if="scope.row.isModify == 1" v-model="paramData[scope.$index].modifyParameterType"></input>
                            <span v-else>{{ scope.row.parameterType }}</span>
                          </template>
                        </el-table-column>

                        <el-table-column
                        label="参数示例">
                          <template slot-scope="scope">
                            <el-input v-if="scope.row.isNewLine == 1" v-model="scope.row.example"></el-input>
                            <input class="my-input" v-else-if="scope.row.isModify == 1" v-model="paramData[scope.$index].modifyExample"></input>
                            <span v-else>{{ scope.row.example }}</span>
                          </template>
                        </el-table-column>

                        <el-table-column label="操作">
                          <template slot="header" slot-scope="scope">
                            <el-button
                              size="mini"
                              type="success"
                              @click="addParam()">添加参数</el-button>
                          </template>
                          <template slot-scope="scope">
                            <div v-if="scope.row.isNewLine == 1">
                              <el-button
                                size="mini"
                                type="primary"
                                @click="paramHandleAdd(scope.$index, scope.row)">保存</el-button>
                              <el-button
                                size="mini"
                                type="danger"
                                @click="paramHandleCancelAdd(scope.$index, scope.row)">取消</el-button>
                            </div>
                            <div v-else>
                              <div v-if="scope.row.isModify == 1">
                                <el-button
                                  size="mini"
                                  type="primary"
                                  @click="paramHandleSaveModify(scope.$index, scope.row)">保存</el-button>
                                <el-button
                                  size="mini"
                                  type="danger"
                                  @click="paramHandleCancelModify(scope.$index, scope.row)">取消</el-button>
                              </div>
                              <div v-else>
                                <el-button
                                  size="mini"
                                  @click="paramHandleModify(scope.$index, scope.row)"
                                  style="margin-right: 10px">编辑</el-button>
                                  <el-popconfirm
                                    title="确定要删除吗？"
                                    @onConfirm="paramHandleDelete(scope.$index, scope.row)"
                                  >
                                    <el-button
                                      size="mini"
                                      type="danger"
                                      slot="reference">删除</el-button>
                                  </el-popconfirm>
                              </div>
                            </div>
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
                            <el-input v-if="scope.row.isNewLine == 1" v-model="scope.row.parameterName" @input="change($event)"></el-input>
                            <!-- <el-input v-else-if="scope.row.isModify == 1" v-model="paramData[scope.$index].modifyParameterName" @input="change($event)"></el-input> -->
                            <input class="my-input" v-else-if="scope.row.isModify == 1" v-model="scope.row.modifyParameterName"></input>
                            <span v-else ="scope.row.isModify != 1">{{ scope.row.parameterName }}</span>
                          </template>
                        </el-table-column>

                        <el-table-column
                        label="参数类型"
                        width="180">
                          <template slot-scope="scope">
                            <el-input v-if="scope.row.isNewLine == 1" v-model="scope.row.parameterType"></el-input>
                            <input class="my-input" v-else-if="scope.row.isModify == 1" v-model="scope.row.modifyParameterType"></input>
                            <span v-else>{{ scope.row.parameterType }}</span>
                          </template>
                        </el-table-column>

                        <el-table-column
                        label="参数示例">
                          <template slot-scope="scope">
                            <el-input v-if="scope.row.isNewLine == 1" v-model="scope.row.example"></el-input>
                            <input class="my-input" v-else-if="scope.row.isModify == 1" v-model="scope.row.modifyExample"></input>
                            <span v-else>{{ scope.row.example }}</span>
                          </template>
                        </el-table-column>

                        <el-table-column label="操作">
                          <template slot="header" slot-scope="scope">
                            <el-button
                              size="mini"
                              type="success"
                              @click="addHeader()">添加参数</el-button>
                          </template>
                          <template slot-scope="scope">
                            <div v-if="scope.row.isNewLine == 1">
                              <el-button
                                size="mini"
                                type="primary"
                                @click="paramHandleAdd(scope.$index, scope.row)">保存</el-button>
                              <el-button
                                size="mini"
                                type="danger"
                                @click="headerHandleCancelAdd(scope.$index, scope.row)">取消</el-button>
                            </div>
                            <div v-else>
                              <div v-if="scope.row.isModify == 1">
                                <el-button
                                  size="mini"
                                  type="primary"
                                  @click="headerHandleSaveModify(scope.$index, scope.row)">保存</el-button>
                                <el-button
                                  size="mini"
                                  type="danger"
                                  @click="headerHandleCancelModify(scope.$index, scope.row)">取消</el-button>
                              </div>
                              <div v-else>
                                <el-button
                                  size="mini"
                                  @click="headerHandleModify(scope.$index, scope.row)"
                                  style="margin-right: 10px">编辑</el-button>
                                  <el-popconfirm
                                    title="确定要删除吗？"
                                    @onConfirm="paramHandleDelete(scope.$index, scope.row)"
                                  >
                                    <el-button
                                      size="mini"
                                      type="danger"
                                      slot="reference">删除</el-button>
                                  </el-popconfirm>
                              </div>
                            </div>
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
                            <el-input v-if="scope.row.isNewLine == 1" v-model="scope.row.parameterName" @input="change($event)"></el-input>
                            <!-- <el-input v-else-if="scope.row.isModify == 1" v-model="paramData[scope.$index].modifyParameterName" @input="change($event)"></el-input> -->
                            <input class="my-input" v-else-if="scope.row.isModify == 1" v-model="scope.row.modifyParameterName"></input>
                            <span v-else ="scope.row.isModify != 1">{{ scope.row.parameterName }}</span>
                          </template>
                        </el-table-column>

                        <el-table-column
                        label="参数类型"
                        width="180">
                          <template slot-scope="scope">
                            <el-input v-if="scope.row.isNewLine == 1" v-model="scope.row.parameterType"></el-input>
                            <input class="my-input" v-else-if="scope.row.isModify == 1" v-model="scope.row.modifyParameterType"></input>
                            <span v-else>{{ scope.row.parameterType }}</span>
                          </template>
                        </el-table-column>

                        <el-table-column
                        label="参数示例">
                          <template slot-scope="scope">
                            <el-input v-if="scope.row.isNewLine == 1" v-model="scope.row.example"></el-input>
                            <input class="my-input" v-else-if="scope.row.isModify == 1" v-model="scope.row.modifyExample"></input>
                            <span v-else>{{ scope.row.example }}</span>
                          </template>
                        </el-table-column>

                        <el-table-column label="操作">
                          <template slot="header" slot-scope="scope">
                            <el-button
                              size="mini"
                              type="success"
                              @click="addCookie()">添加参数</el-button>
                          </template>
                          <template slot-scope="scope">
                            <div v-if="scope.row.isNewLine == 1">
                              <el-button
                                size="mini"
                                type="primary"
                                @click="paramHandleAdd(scope.$index, scope.row)">保存</el-button>
                              <el-button
                                size="mini"
                                type="danger"
                                @click="cookieHandleCancelAdd(scope.$index, scope.row)">取消</el-button>
                            </div>
                            <div v-else>
                              <div v-if="scope.row.isModify == 1">
                                <el-button
                                  size="mini"
                                  type="primary"
                                  @click="cookieHandleSaveModify(scope.$index, scope.row)">保存</el-button>
                                <el-button
                                  size="mini"
                                  type="danger"
                                  @click="cookieHandleCancelModify(scope.$index, scope.row)">取消</el-button>
                              </div>
                              <div v-else>
                                <el-button
                                  size="mini"
                                  @click="cookieHandleModify(scope.$index, scope.row)"
                                  style="margin-right: 10px">编辑</el-button>
                                  <el-popconfirm
                                    title="确定要删除吗？"
                                    @onConfirm="paramHandleDelete(scope.$index, scope.row)"
                                  >
                                    <el-button
                                      size="mini"
                                      type="danger"
                                      slot="reference">删除</el-button>
                                  </el-popconfirm>
                              </div>
                            </div>
                          </template>
                        </el-table-column>
                      </el-table>
                    </el-tab-pane>
                  </el-tabs>
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
          <el-form ref="projectInfo" :model="projectDetail" label-width="100px" :rule="rules">
            <el-form-item label="项目名称" prop="projectName" style="margin-top:0px;margin-bottom:0px">
              <span v-if="!modifyProjectDetail">{{ projectDetail.projectName}}</span>
              <el-input v-else size="medium" v-model="projectDetail.modifyProjectName" @input="change($event)" style="width: 300px"></el-input>
            </el-form-item>

            <el-form-item label="归属项目组" prop="manageGroupId" style="margin-top:0px;margin-bottom:0px">
              <span v-if="!modifyProjectDetail">{{ projectDetail.manageGroupName}}</span>
              <el-select v-else v-model="projectDetail.modifyManageGroupId" @input="change($event)" style="width: 300px">
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
              <el-input v-else size="medium" v-model="projectDetail.modifyProjectAddress" @input="change($event)" style="width: 300px"></el-input>
            </el-form-item>

            <el-form-item label="数据库地址" prop="databaseAddress" style="margin-top:0px;margin-bottom:0px">
              <div v-if="!modifyProjectDetail">
                <span v-if="projectDetail.databaseAddress == ''">无</span>
                <el-link v-else type="primary" :underline="false">{{ projectDetail.databaseAddress }}</el-link>
              </div>
              <el-input v-else size="medium" v-model="projectDetail.modifyDatabaseAddress" @input="change($event)" style="width: 300px"></el-input>
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

    <el-dialog
      title=""
      :visible.sync="addInterfaceDialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form ref="addInterfaceForm" :model="addInterfaceForm" label-width="80px" :rules="rules">
        <el-form-item label="类型">
          <el-switch
            v-model="addInterfaceForm.isInterface"
            active-color="#13ce66"
            inactive-color="#409EFF"
            active-text="接口"
            inactive-text="接口分类">
          </el-switch>
        </el-form-item>
        
        <el-form-item label="名称" prop="interfaceName">
          <el-input v-model="addInterfaceForm.interfaceName"></el-input>
        </el-form-item>

        <el-form-item label="请求方法" v-show="addInterfaceForm.isInterface">
          <el-select v-model="addInterfaceForm.interfaceMethod" placeholder="请选择">
            <el-option value="get" label="GET"></el-option>
            <el-option value="post" label="POST"></el-option>
            <el-option value="put" label="PUT"></el-option>
            <el-option value="patch" label="PATCH"></el-option>
            <el-option value="delete" label="DELETE"></el-option>
            <el-option value="copy" label="COPY"></el-option>
            <el-option value="head" label="HEAD"></el-option>
            <el-option value="options" label="option"></el-option>
            <el-option value="link" label="LINK"></el-option>
            <el-option value="nulink" label="UNLINK"></el-option>
            <el-option value="purge" label="PURGE"></el-option>
            <el-option value="lock" label="LOCK"></el-option>
            <el-option value="unlock" label="UNLOCK"></el-option>
            <el-option value="propfind" label="PROPFIND"></el-option>
            <el-option value="view" label="VIEW"></el-option>
            <el-option value="" label="无"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="请求路径" v-show="addInterfaceForm.isInterface">
          <el-input v-model="addInterfaceForm.interfaceRoute"></el-input> 
        </el-form-item>

        <el-form-item label="接口描述" v-show="addInterfaceForm.isInterface">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="addInterfaceForm.interfaceInfo"
            maxlength="120"
            show-word-limit
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addInterfaceDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAddInterface()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getProjectListByUser, getProjectInfo, updateProjecInfo } from "@/api/project"
import { getInterfaceList, getInterfaceInfo, updateInterfaceInfo, deleteInterface, addInterface } from "@/api/interface"
import { addParameter, deleteParameter, updateParameter } from '@/api/parameter'
import { getGroupListForChange } from "@/api/group"

export default {
  data() {
    var validateInterfaceName  = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('不能为空！！！'));
      }
      else {
        callback();
      }
    };

    var validateProjectName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('项目名称不能为空！！！'));
      }
      else {
        callback();
      }
    }

    return {
      memberList:[],
      treeData: [],
      showInfo: false,
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'leaf'
      },

      rules: {
        interfaceName:  { validator: validateInterfaceName, trigger: 'blur' },
        projectName: { validator: validateProjectName, trigger: 'blur'}
      },

      modifyInterfaceDetail: false,
      currentInterfaceId: '',
      interfaceForm:{
        interfaceId: '',
        projectId:'',
        interfaceName: '',
        modifyInterfaceName: '',
        interfaceMethod:'',
        modifyInterfaceMethod: '',
        interfaceRoute:'',
        modifyInterfaceRoute: '',
        interfaceInfo:'',
        modifyInterfaceInfo: ''
      },
      activeName: 'requestParam',
      paramData:[],
      headerData:[],
      cookieData:[],
      hasNewParamter: false,
      hasNewHeader: false,
      hasNewCookie: false,

      addInterfaceDialogVisible: false,
      addInterfaceForm: {
        isInterface: true,
        interfaceName: '',
        interfaceMethod: '',
        interfaceRoute: '',
        interfaceInfo: '',

        belongId: '',
        projectId: ''
      },

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
      // this.showInfo =true;
      // console.log(data)
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

    append(node, data){
      console.log(node)
      console.log(data)
      this.addInterfaceDialogVisible = true
      if(node.data.interfaceId != undefined){
        this.addInterfaceForm.belongId = node.data.interfaceId
      }
      else{
        this.addInterfaceForm.belongId = 0
      }
      this.addInterfaceForm.projectId = node.data.projectId

      this.addInterfaceForm.isInterface = true
      this.addInterfaceForm.interfaceName = ''
      this.addInterfaceForm.interfaceMethod = ''
      this.addInterfaceForm.interfaceRoute = ''
      this.addInterfaceForm.interfaceInfo = ''
    },

    confirmAddInterface(){
      this.$refs['addInterfaceForm'].validate((valid) => {
        if (valid) {
          addInterface(this.addInterfaceForm).then(res => {
            if(res.code == 0){
              this.$message({
                message:'添加成功',
                type:'success'
              })
              this.refreshProjectList()
              this.addInterfaceDialogVisible = false
            }
            else{
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    remove(node, data){
      if(node.isLeaf == false) {
        this.$confirm('此操作将永久删除该分类及其下的所有内容, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteInterface(node.data.interfaceId, node.data.projectId).then(res => {
            if(res.code == 0){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.refreshProjectList()
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
        deleteInterface(node.data.interfaceId, node.data.projectId).then(res => {
          if(res.code == 0){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.refreshProjectList();
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

    paramHandleModify(index, row) {
      this.paramData[index].isModify = 1
      row.modifyParameterName = row.parameterName
      row.modifyParameterType = row.parameterType
      row.modifyExample = row.example
      this.$set(this.paramData, index, this.paramData[index])
    },

    headerHandleModify(index, row) {
      this.headerData[index].isModify = 1
      row.modifyParameterName = row.parameterName
      row.modifyParameterType = row.parameterType
      row.modifyExample = row.example
      this.$set(this.headerData, index, this.headerData[index])
    },

    cookieHandleModify(index, row) {
      this.cookieData[index].isModify = 1
      row.modifyParameterName = row.parameterName
      row.modifyParameterType = row.parameterType
      row.modifyExample = row.example
      this.$set(this.cookieData, index, this.cookieData[index])
    },

    paramHandleSaveModify(index, row) {
      if(this.paramData[index].modifyParameterName == ""){
        this.$message({
          message: '参数名不能为空',
          type: 'warning'
        })
        return
      }
      if(this.paramData[index].modifyParameterType == ""){
        this.$message({
          message: '参数类型不能为空',
          type: 'warning'
        })
        return
      }
      updateParameter(this.paramData[index], this.currentInterfaceId).then(res => {
        if(res.code == 0) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          getInterfaceInfo(this.currentInterfaceId).then(res => {
            if(res.code == 0) {
              this.interfaceForm = res.data.data;
              this.paramData = res.data.paramData
            }
            else {
              this.$message({
                message: res.message,
                type: 'error'
              });
            }
          })
        }
      })
    },

    headerHandleSaveModify(index, row) {
      if(this.headerData[index].modifyParameterName == ""){
        this.$message({
          message: '参数名不能为空',
          type: 'warning'
        })
        return
      }
      if(this.headerData[index].modifyParameterType == ""){
        this.$message({
          message: '参数类型不能为空',
          type: 'warning'
        })
        return
      }
      updateParameter(this.headerData[index], this.currentInterfaceId).then(res => {
        if(res.code == 0) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          getInterfaceInfo(this.currentInterfaceId).then(res => {
            if(res.code == 0) {
              this.interfaceForm = res.data.data;
              this.headerData = res.data.headerData;
            }
            else {
              this.$message({
                message: res.message,
                type: 'error'
              });
            }
          })
        }
      })
    },

    cookieHandleSaveModify(index, row) {
      if(this.cookieData[index].modifyParameterName == ""){
        this.$message({
          message: '参数名不能为空',
          type: 'warning'
        })
        return
      }
      if(this.cookieData[index].modifyParameterType == ""){
        this.$message({
          message: '参数类型不能为空',
          type: 'warning'
        })
        return
      }
      updateParameter(this.cookieData[index], this.currentInterfaceId).then(res => {
        if(res.code == 0) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          getInterfaceInfo(this.currentInterfaceId).then(res => {
            if(res.code == 0) {
              this.interfaceForm = res.data.data;
              this.cookieData = res.data.cookieData;
            }
            else {
              this.$message({
                message: res.message,
                type: 'error'
              });
            }
          })
        }
      })
    },

    paramHandleCancelModify(index, row){
      this.paramData[index].isModify = 0
      this.$set(this.paramData, index, this.paramData[index])
    },

    headerHandleCancelModify(index, row) {
      this.headerData[index].isModify = 0
      this.$set(this.headerData, index, this.headerData[index])
    },

    cookieHandleCancelModify(index ,row) {
      this.cookieData[index].isModify = 0
      this.$set(this.cookieData, index, this.cookieData[index])
    },

    paramHandleDelete(index, row) {
      deleteParameter(row.id, this.currentInterfaceId).then(res => {
        console.log(res)
        if(res.code == 0) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          getInterfaceInfo(this.currentInterfaceId).then(res => {
            if(res.code == 0) {
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
      })
    },

    addParam(){
      if(this.hasNewParamter){
        return
      }
      this.hasNewParamter = true;
      let newLine = {}
      newLine.parameterName = ''
      newLine.parameterType = ''
      newLine.example = ''
      newLine.isNewLine = 1
      newLine.type = 1
      this.paramData.push(newLine)
    },

    addHeader(){
      if(this.hasNewHeader){
        return
      }
      this.hasNewHeader = true;
      let newLine = {}
      newLine.parameterName = ''
      newLine.parameterType = ''
      newLine.example = ''
      newLine.isNewLine = 1
      newLine.type = 2
      this.headerData.push(newLine)
    },

    addCookie() {
      if(this.hasNewCookie){
        return
      }
      this.hasNewCookie = true;
      let newLine = {}
      newLine.parameterName = ''
      newLine.parameterType = ''
      newLine.example = ''
      newLine.isNewLine = 1
      newLine.type = 3
      this.cookieData.push(newLine)
    },

    paramHandleAdd(index, row) {
      console.log(row)
      if(row.parameterName == ""){
        this.$message({
          message: '参数名不能为空',
          type: 'warning'
        })
        return
      }
      if(row.parameterType == ""){
        this.$message({
          message: '参数类型不能为空',
          type: 'warning'
        })
        return
      }
      addParameter(row, this.currentInterfaceId).then(res => {
        if(res.code == 0) {
          row.isNewLine = 0
          this.hasNewParamter = false
          this.hasNewHeader =false
          this.hasNewCookie = false
          this.$message({
            message: '添加成功',
            type: 'success'
          })

          getInterfaceInfo(this.currentInterfaceId).then(res => {
            if(res.code == 0) {
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
        else{
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },

    paramHandleCancelAdd(index, row) {
      this.paramData.pop();
      this.hasNewParamter = false
    },

    headerHandleCancelAdd(index, row){
      this.headerData.pop()
      this.hasNewHeader =false
    },

    cookieHandleCancelAdd(index, row){
      this.cookieData.pop()
      this.hasNewCookie =false
    },

    handleClose(done) {
      this.addProjectDialogVisible = false
      this.addInterfaceDialogVisible  = false
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
      if(this.projectDetail.modifyProjectName == ""){
        this.$message({
          message: '项目名称不得为空',
          type:'warning'
        })
        return
      }
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
    },

    toModifyInterfaceDetail(){
      this.modifyInterfaceDetail = true;
      this.interfaceForm.modifyInterfaceName = this.interfaceForm.interfaceName;
      this.interfaceForm.modifyInterfaceMethod = this.interfaceForm.interfaceMethod;
      this.interfaceForm.modifyInterfaceRoute = this.interfaceForm.interfaceRoute
      this.interfaceForm.modifyInterfaceInfo = this.interfaceForm.interfaceInfo;
    },

    updateInterfaceDetail(){
      if(this.interfaceForm.modifyInterfaceName == ""){
        this.$message({
          message: '接口名称不得为空',
          type:'warning'
        })
        return
      }
      updateInterfaceInfo(this.interfaceForm).then(res => {
        if(res.code == 0){
          this.$message({
            message: '保存成功',
            type:'success'
          })

          this.interfaceForm.interfaceName = this.interfaceForm.modifyInterfaceName;
          this.interfaceForm.interfaceMethod = this.interfaceForm.modifyInterfaceMethod;
          this.interfaceForm.interfaceRoute = this.interfaceForm.modifyInterfaceRoute
          this.interfaceForm.interfaceInfo = this.interfaceForm.modifyInterfaceInfo;
          this.modifyInterfaceDetail = false;
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