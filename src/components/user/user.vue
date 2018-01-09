<template>

  <section>

    <!--面包屑导航-->
    <el-breadcrumb separator="/" class="bread-nav">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!--添加新用户-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true">
        <el-col :span="3">
          <el-form-item>
            <el-input placeholder="用户名" v-model="add_user.username"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-input placeholder="账号" v-model="add_user.account_number"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-input placeholder="密码" v-model="add_user.password"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-select v-model="add_user.role" placeholder="请选择">
              <el-option v-for="item in add_user.roles" :key="item.id" :value="item.id"
                         :label="item.roleName"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3" style="margin-left: 10%">
          <el-form-item>
            <el-button type="primary" @click="add_user.flag && addUser()" v-loading="config.add_user_loading">添加新用户
            </el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-col>

    <!--结果表格-->
    <el-table :data="bundle_table_data" style="width: 100%" v-loading="config.table_loading">
      <el-table-column type="index" width="80"></el-table-column>
      <el-table-column v-if="false">
        <template scope="scope">
          <el-tag>{{ scope.row.user.id }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="用户名">
        <template scope="scope">
          <el-tag type="primary">{{ scope.row.user.userName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="账号">
        <template scope="scope">
          <span>{{ scope.row.user.loginName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限">
        <template scope="scope">
          <span><el-tag type="danger">{{ scope.row.roleList[0].roleName }}</el-tag></span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button size="small"
                     @click="handleEdit(scope.row.user.id,scope.row.user.loginName,scope.row.user.userName,scope.row.roleList[0].roleName,scope.row.user.loginName)">
            编辑
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.user.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--编辑用户信息模态框-->
    <el-dialog title="编辑用户信息" :visible.sync="config.dialog_visible" size="tiny" class="model">
      <el-input v-model="edit.user_name">
        <template slot="prepend">用户名</template>
      </el-input>
      <br><br>
      <el-input v-model="edit.login_name">
        <template slot="prepend">账&nbsp;&nbsp;&nbsp;号</template>
      </el-input>
      <br><br>
      <el-input placeholder="请输入新的密码" v-model="edit.password">
        <template slot="prepend">密&nbsp;&nbsp;&nbsp;码</template>
      </el-input>
      <br><br>
      <el-select v-model="edit.update_role" placeholder="请选择" style="display: block">
        <el-option v-for="item in edit.update_roles" :key="item.id" :value="item.id" :label="item.roleName"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="config.dialog_visible = false">取 消</el-button>
        <el-button type="primary" @click="edit.flag && submitEdit()"
                   v-loading="config.edit_user_loading">确 定</el-button>
      </span>
    </el-dialog>

    <!--分页-->
    <el-pagination layout="prev, pager, next" :total="page.total" :page-size="15" @current-change="currentChange"
                   style="float: right;margin-top: 20px">
    </el-pagination>

  </section>

</template>

<script>

  import axios from 'axios';

  let qs = require("qs");

  export default {
    data() {
      return {
        config: {
          dialog_visible: false,
          table_loading: false,
          add_user_loading: false,
          edit_user_loading: false
        },
        // 用户信息表格
        bundle_table_data: [],
        // 添加新用户
        add_user: {
          flag: true,
          userName: '',
          account_number: '',
          password: '',
          role: '',
          roles: []
        },
        // 编辑用户信息
        edit: {
          flag: true,
          id: '',
          user_name: '',
          login_name: '',
          current_login_name: '',
          password: '',
          update_role: '',
          update_roles: []
        },
        // 分页信息
        page: {
          current_page: 1,
          total: 0
        }
      }
    },
    methods: {
      // 获取所有用户信息
      getUserData() {
        this.config.table_loading = true;
        axios.post('user_queryAllUsers.ajax', qs.stringify({
            startPage: this.page.current_page,
          })
        )
          .then((res) => {
            let filterResult = res.data.list.filter(function (item) {
              item.roleList.forEach(function (i) {
                return i.id !== 1;
              });
            });
            this.bundle_table_data = filterResult;
            this.page.total = res.data.page.totalCount;
            this.config.table_loading = false;
          });
      },
      // 获取所有角色
      getAllRoles() {
        axios.post('role_queryAllRole.ajax')
          .then((res) => {
            this.add_user.roles = res.data.list;
            this.edit.update_roles = res.data.list;
          });
      },
      // 添加新用户
      addUser() {
        // 数据过滤
        if (!this.add_user.username || !this.add_user.account_number || !this.add_user.password || !this.add_user.role) {
          this.$message({
            type: 'warning',
            duration: 1000,
            message: '请填写完整信息'
          });
          return;
        }
        this.add_user.flag = false;
        this.config.add_user_loading = true;
        axios.post('user_addUser.ajax', qs.stringify({
            userName: this.add_user.username,
            roleIds: this.add_user.role,
            loginName: this.add_user.account_number,
            password: this.add_user.password
          })
        )
          .then((res) => {
            this.add_user.flag = true;
            this.config.add_user_loading = false;
            if (res.data.data === true) {
              this.$message("添加用户成功");
              this.getUserData();
              this.add_user.username = '';
              this.add_user.account_number = '';
              this.add_user.password = '';
              this.add_user.role = '';
            } else {
              this.$message({
                type: 'warning',
                message: res.data.msg,
                duration: 1000
              });
            }
          });
      },
      // 删除用户信息
      handleDelete(id) {
        this.$confirm('此操作将删除该用户, 是否继续?', '注意', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {// 确认删除，调用删除接口
          this.config.table_loading = true;
          axios.post('user_deleteUserByIds.ajax', qs.stringify({
              ids: id
            })
          )
            .then((res) => {
              if (res.data.data === true) {
                this.$message({
                  type: 'success',
                  duration: 1000,
                  message: '删除成功!'
                });
                this.getUserData();
              } else {
                this.$message({
                  type: 'error',
                  duration: 1000,
                  message: res.data.msg
                });
                this.config.table_loading = false;
              }
            });
        }).catch(() => {// 取消删除
          this.$message({
            type: 'info',
            duration: 1000,
            message: '已取消删除'
          });
        });
      },
      // 编辑用户信息
      handleEdit(id, login_name, user_name, role, current_user) {
        this.config.dialog_visible = true;
        this.edit.id = id;
        this.edit.login_name = login_name;
        this.edit.user_name = user_name;
        this.edit.update_role = role;
        this.edit.password = '';
        this.edit.current_login_name = current_user;
      },
      // 提交编辑
      submitEdit() {
        // 数据过滤
        if (!this.edit.login_name || !this.edit.user_name || !this.edit.password) {
          this.$message({
            type: 'warning',
            duration: 1000,
            message: '请填写完整信息'
          });
          return;
        }
        this.edit.flag = false;
        this.config.edit_user_loading = true;
        axios.post('user_updateUser.ajax', qs.stringify({
            id: this.edit.id,
            loginName: this.edit.login_name,
            userName: this.edit.user_name,
            password: this.edit.password,
            roleIds: this.edit.update_role,
            currentLoginName: this.edit.current_login_name
          })
        )
          .then((res) => {
            this.edit.flag = true;
            this.config.edit_user_loading = false;
            if (res.data.data == true) {
              this.config.dialog_visible = false;
              this.$message("编辑成功");
              this.getUserData();
            } else {
              this.$message({
                duration: 1000,
                message: res.data.msg,
                type: 'warning'
              });
            }
          });
      },
      // 分页
      currentChange(page) {
        this.page.current_page = page;
        this.getUserData();
      }
    },
    mounted: function () {
      this.getAllRoles();
      this.getUserData();
    }
  }

</script>

<style scoped>

  * {
    margin: 0;
  }

  .bread-nav {
    float: right;
    margin-bottom: 10px;
  }

  .toolbar {
    background: #f2f2f2;
    margin: 5px 0;
  }

  .toolbar .el-form-item {
    margin: 20px 0 5px 20px;
  }

</style>
