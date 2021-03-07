<template>
  <div>
    <el-row>  
      <el-col :span="12">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>组列表</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="addGroupClick" v-show="isLeader">添加组</el-button>
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
                  <span v-show="node.isLeaf=== false">
                    <el-popconfirm
                      title="确定要解散该组吗？"
                      @onConfirm="delGroupClick(node, data)"
                    >
                      <el-button
                        type="text"
                        size="mini"
                        slot="reference">
                        解散组
                      </el-button>
                    </el-popconfirm>
                  </span>
                 </span>
              </el-tree>
            </el-scrollbar>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card class="box-card" v-show="showMember">
          <div slot="header" class="clearfix">
            <span>{{ showGroupName }}组成员</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="addGroupMember" v-show="isLeader">添加组成员</el-button>
          </div>
          <div class="text item" style="height:400px">
            <el-scrollbar class="scrollbar cardScrollbar">
              <ul class="memberList">
                <li v-for="i in memberList" :key="i.userId" class="memberListItem">
                  <span>{{ i.userName }}<el-tag type="success" v-show="isShowTag(i.role)">组长</el-tag></span>
                  <div>
                    <el-button
                      type="text"
                      size="mini"
                      v-show="!isShowTag(i.role)"
                      @click="clickToChangeLeader(i.belongGroupId, i.userId)">
                      任命组长
                    </el-button>
                    
                    <el-button
                      type="text"
                      size="mini"
                      v-if="i.userId === name"
                      @click="clickToExitGroup(i.belongGroupId, i.userId)">
                      退出该组
                    </el-button>
                    <el-button
                      type="text"
                      size="mini"
                      v-else-if="isLeader && !isShowTag(i.role)"
                      @click="clickToRemoveMember(i.belongGroupId, i.userId)">
                      移除该组员
                    </el-button>
                  </div>
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      title="添加组"
      :visible.sync="addGroupDialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form ref="addGroupForm" :model="addGroupForm" label-width="80px" :rules="rules">
        <el-form-item label="组名" prop="groupName">
          <el-input v-model="addGroupForm.groupName"></el-input>
        </el-form-item>

        <el-form-item label="组长" prop="leaderAlternate">
          <el-autocomplete
            class="inline-input"
            v-model="addGroupForm.leaderAlternateName"
            :fetch-suggestions="leaderSearch"
            placeholder="请选择组长"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addGroupDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addGroupFormConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="添加组"
      :visible.sync="addGroupMemberDialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form ref="addGroupMemberForm" :model="addGroupMemberForm" label-width="80px" :rules="rules">
        <el-form-item label="新增组员" prop="member">
          <el-autocomplete
            class="inline-input"
            v-model="addGroupMemberForm.memberName"
            :fetch-suggestions="memberSearch"
            placeholder="请选择组员"
            @select="handleSelect2"
          ></el-autocomplete>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addGroupMemberDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addGroupMemberConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getGroupList, createGroup, deleteGroup, groupAddMember, groupChangeLeader, removeMember } from '@/api/group'
import { getProjectListByGroup } from "@/api/project"
import { getGroupMember, getNoGroupUser } from '@/api/user'

export default {
  computed: {
    ...mapGetters([
      'name',
      'role'
    ])
  },
  data() {

    var validateGroupName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入组名'));
      }
      else {
        callback();
      }
    };

    var validateLearLeaderAlternate = (rule, value, callback) => {
      if (this.addGroupForm.leaderAlternateId === '') {
        callback(new Error('请选择一位用户'));
      }
      else {
        callback();
      }
    };

    var validateLearMember = (rule, value, callback) => {
      if (this.addGroupMemberForm.memberId === '') {
        callback(new Error('请选择一位用户'));
      }
      else {
        callback();
      }
    };

    return {
      memberList:[],
      treeData: [],
      showMember: false,
      showGroupName: '',
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'leaf'
      },

      addGroupDialogVisible: false,
      addGroupForm: {
        groupName: '',
        leaderAlternateId:'',
        leaderAlternateName: ''
      },
      noGroupUser:[],

      rules: {
        groupName:{ validator: validateGroupName, trigger: 'blur' },
        leaderAlternate:{validator: validateLearLeaderAlternate}
      },

      rules: {
        member:{validator: validateLearMember}
      },

      isLeader: false,

      addGroupMemberDialogVisible: false,
      addGroupMemberForm: {
        groupId:'',
        memberId:'',
        memberName: ''
      },
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

    if(this.role.indexOf("1")!=-1 || this.role.indexOf("3") !=-1){
      this.isLeader = true;
    }
  },


  methods: {
    handleNodeClick(data) {
      if(data.GroupId != undefined){
        getGroupMember(data.GroupId).then(res => {
          if(res.code == 0){
            this.memberList = res.data;
          }
          else {
            this.$message({
              message: res.message,
              type: 'error'
            });
          }
        })

        this.showMember = true;
        this.showGroupName = data.label
        // console.log(data)
        this.addGroupMemberForm.groupId = data.GroupId
      }
    },

    isShowTag(userRole) {
      if(userRole.indexOf("3") != -1) {
        return true;
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
    },

    addGroupClick(){
      this.addGroupDialogVisible = true;
      if (this.$refs['addGroupForm'] !== undefined) {
        this.$refs['addGroupForm'].resetFields();
        this.addGroupForm.leaderAlternateName=''
      }
      getNoGroupUser().then(res => {
        if(res.code == 0){
          this.noGroupUser = res.data;
        }
        else{
          this.$message({
            message: res.message,
            type: 'error'
          });
        }
      })
    },

    handleClose(done) {
      this.addGroupDialogVisible = false
    },

    addGroupFormConfirm(){
      this.$refs['addGroupForm'].validate((valid) => {
        if (valid) {
          createGroup(this.addGroupForm).then(res => {
            if(res.code == 0){
              this.addGroupDialogVisible = false
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              getGroupList().then(res => {
                if(res.code == 0){
                  this.treeData = res.data
                }
              }).catch(() => {
                console.log("error")
              })
            }
            else{
              this.$message({
                message: '添加失败',
                type: 'danger'
              })
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    leaderSearch(queryString, cb) {
      var userlist = this.noGroupUser;
      var results = queryString ? userlist.filter(this.createFilter(queryString)) : userlist;
      // 调用 callback 返回建议列表的数据
      cb(results);
      this.addGroupForm.leaderAlternateId = ''
    },

    createFilter(queryString) {
      return (res) => {
        return (res.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },

    handleSelect(item) {
      this.addGroupForm.leaderAlternateId = item.userId;
    },

    delGroupClick(node, data){
      deleteGroup(data.GroupId).then(res => {
        if(res.code == 0){
          this.$message({
            message: '解散成功',
            type: 'success'
          })
          getGroupList().then(res => {
            if(res.code == 0){
              this.treeData = res.data
            }
          }).catch(() => {
            console.log("error")
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

    memberSearch(queryString, cb) {
      var userlist = this.noGroupUser;
      var results = queryString ? userlist.filter(this.createFilter(queryString)) : userlist;
      // 调用 callback 返回建议列表的数据
      cb(results);
      this.addGroupMemberForm.memberName=''
    },

    handleSelect2(item) {
      this.addGroupMemberForm.memberId = item.userId;
    },
    
    addGroupMember(){
      this.addGroupMemberDialogVisible = true;
      if (this.$refs['addGroupMemberForm'] !== undefined) {
        this.$refs['addGroupMemberForm'].resetFields();
        this.addGroupMemberForm.memberName=''
      }
      getNoGroupUser().then(res => {
        if(res.code == 0){
          this.noGroupUser = res.data;
        }
        else{
          this.$message({
            message: res.message,
            type: 'error'
          });
        }
      })
    },
    
    addGroupMemberConfirm() {
      console.log(this.addGroupMemberForm)
      this.$refs['addGroupMemberForm'].validate((valid) => {
        if (valid) {
          groupAddMember(this.addGroupMemberForm.memberId, this.addGroupMemberForm.groupId).then(res => {
            if(res.code == 0){
              this.addGroupMemberDialogVisible =false;
              this.$message({
                message:'添加成功',
                type: 'success'
              })
              getGroupMember(this.addGroupMemberForm.groupId).then(res => {
                if(res.code == 0){
                  this.memberList = res.data;
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
                message: res.message,
                type: 'error'
              });
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    clickToChangeLeader(groupId, newLeaderId) {
      groupChangeLeader(groupId, newLeaderId).then(res => {
        if(res.code == 0){
          this.$message({
            message:'组长变更成功',
            type:'success'
          })
          getGroupMember(groupId).then(res => {
          if(res.code == 0){
            this.memberList = res.data;
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

    clickToExitGroup(groupId, memberId) {
      this.$confirm('此操作将退出组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeMember(groupId, memberId).then(res => {
          if(res.code == 0) {
            this.$message({
              type: 'success',
              message: '退出成功!'
            })
            getGroupMember(groupId).then(res => {
              if(res.code == 0){
                this.memberList = res.data;
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
            this.$message({
              type: 'error',
              message: res.msg
            });
          }
        })
        
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });          
      });
    },

    clickToRemoveMember(groupId, memberId) {
      this.$confirm('此操作将移除改组员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        removeMember(groupId, memberId).then(res => {
          if(res.code == 0) {
            this.$message({
              type: 'success',
              message: '移除成功!'
            })
            getGroupMember(groupId).then(res => {
              if(res.code == 0){
                this.memberList = res.data;
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
            this.$message({
              type: 'error',
              message: res.msg
            });
          }
        })
        
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });          
      });
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

  .memberListItem{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    width: 90%;
    background: #e8f3fe;
    margin: 10px;
    color: #7dbcfc;
    
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>