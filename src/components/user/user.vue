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
        <el-col :span="4">
          <el-form-item>
            <el-input placeholder="用户名" v-model="add_user.username"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item>
            <el-input placeholder="账号" v-model="add_user.account_number"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item>
            <el-input placeholder="密码" v-model="add_user.password"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-select v-model="add_user.role" placeholder="请选择">
              <el-option v-for="item in add_user.roles" :key="item.value" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" @click="addUser">添加新用户</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-col>

    <!--结果表格-->
    <el-table :data="bundle_table_data" style="width: 100%">
      <el-table-column type="index" width="20"></el-table-column>
      <el-table-column label="ID" v-if="config.id_show">
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

    <!--模态框-->
    <el-dialog title="编辑用户信息" :visible.sync="config.dialogVisible" size="tiny" class="model">
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
        <el-option v-for="item in edit.update_roles" :key="item.value" :value="item.value"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="config.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEdit">确 定</el-button>
      </span>
    </el-dialog>

    <!--分页-->
    <el-pagination layout="prev, pager, next" :total="page.total" :page-size="15" @current-change="handleCurrentChange"
                   style="float: right;margin-top: 20px"></el-pagination>

  </section>
</template>

<script>
  import axios from 'axios';

  let qs = require("qs");

  export default {
    data() {
      return {
        config: {
          // id列不显示，传参使用
          id_show: false,
          dialogVisible: false,
        },
        // 添加新用户
        add_user: {
          userName: '',
          account_number: '',
          password: '',
          role: '',
          roles: [
            {value: '工人'},
            {value: '管理员'},
            {value: '财务人员'}
          ]
        },
        // 修改用户信息
        edit: {
          id: '',
          user_name: '',
          login_name: '',
          current_login_name: '',
          password: '',
          update_role: '',
          update_roles: [
            {value: '工人'},
            {value: '管理员'},
            {value: '财务人员'}
          ]
        },
        // 用户信息表格
        bundle_table_data: [],
        //分页信息
        page: {
          total: 80,
          tagret_page: 1
        }
      }
    },
    methods: {
      // 获取所有用户信息
      getUserData() {
        let self = this;
        axios.post('user_queryAllUsers.ajax', qs.stringify({
            startPage: self.page.tagret_page
          })
        )
          .then(function (res) {
            self.bundle_table_data = res.data.list;
            self.page.total = res.data.page.totalCount;
          });
      },
      // 添加新用户
      addUser() {
        let self = this;
        let data_role;
        switch (self.add_user.role) {
          case "管理员":
            data_role = 1;
            break;
          case "工人":
            data_role = 2;
            break;
          case "财务人员":
            data_role = 3;
            break;
        }
        axios.post('user_addUser.ajax', qs.stringify({
            userName: self.add_user.username,
            roleIds: data_role,
            loginName: self.add_user.account_number,
            password: self.add_user.password
          })
        )
          .then(function (res) {
            if (res.data.data === true) {
              self.$message("添加用户成功");
              self.getUserData();
            } else {
              self.$message({
                showClose: true,
                message: res.data.msg,
                type: 'warning'
              });
            }
          });
      },
      // 删除用户
      handleDelete(id) {
        let self = this;
        axios.post('user_deleteUserByIds.ajax', qs.stringify({
            ids: id
          })
        )
          .then(function (res) {
            self.$message("删除用户成功");
            self.getUserData();
          });
      },
      // 编辑用户信息
      handleEdit(id, login_name, user_name, role, current_user) {
        this.config.dialogVisible = true;
        this.edit.id = id;
        this.edit.login_name = login_name;
        this.edit.user_name = user_name;
        this.edit.update_role = role;
        this.edit.password = '';
        this.edit.current_login_name = current_user;
      },
      // 提交编辑
      submitEdit() {
        let self = this;
        let data_update_role;
        switch (self.edit.update_role) {
          case "管理员":
            data_update_role = 1;
            break;
          case "工人":
            data_update_role = 2;
            break;
          case "财务人员":
            data_update_role = 3;
            break;
        }
        axios.post('user_updateUser.ajax', qs.stringify({
            id: self.edit.id,
            loginName: self.edit.login_name,
            userName: self.edit.user_name,
            password: self.edit.password,
            roleIds: data_update_role,
            currentLoginName: self.edit.current_login_name
          })
        )
          .then(function (res) {
            if (res.data.data == true) {
              self.config.dialogVisible = false;
              self.$message("编辑成功");
              self.getUserData();
            } else {
              self.$message({
                showClose: true,
                message: res.data.msg,
                type: 'warning'
              });
            }
          });
      },
      // 分页
      handleCurrentChange(page) {
        this.page.tagret_page = page;
        this.getUserData();
      }
    },
    mounted: function () {
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
