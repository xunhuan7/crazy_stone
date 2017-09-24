<template>
  <section>

    <!--面包屑导航-->
    <el-breadcrumb separator="/" class="bread-nav">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>客户管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!--添加新客户-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true">
        <el-col :span="4">
          <el-form-item>
            <el-input placeholder="姓名" v-model="add_custom.name"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item>
            <el-input placeholder="手机号码" v-model="add_custom.phone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" @click="addCustom">添加客户信息</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-col>

    <!--结果表格-->
    <el-table :data="custom_table_data" style="width: 100%">
      <el-table-column label="ID" v-if="config.id_show">
        <template scope="scope">
          <el-tag>{{ scope.row.id }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column type="index" width="100"></el-table-column>
      <el-table-column label="客户名">
        <template scope="scope">
          <el-tag type="primary">{{ scope.row.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="手机号码">
        <template scope="scope">
          <el-tag type="success">{{ scope.row.phone }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button size="small"
                     @click="handleEdit(scope.row.user.id,scope.row.user.loginName,scope.row.user.userName,scope.row.roleList[0].roleName,scope.row.user.loginName)">
            编辑
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
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
        add_custom: {
          name: '',
          phone: ''
        },
        // 修改用户信息
        edit: {},
        // 客户信息表格
        custom_table_data: []
      }
    },
    methods: {
      // 获取所有客户信息
      getCustomData() {
        let self = this;
        axios.post('customer_queryAllCustomer.ajax')
          .then(function (res) {
            self.custom_table_data = res.data.list;
          });
      },
      // 添加新客户
      addCustom() {
        let self = this;
        axios.post('customer_addCustomer.ajax', qs.stringify({
            name: self.add_custom.name,
            phone: self.add_custom.phone
          })
        )
          .then(function (res) {
            if (res.data.data === true) {
              self.$message("添加客户信息成功");
              self.getCustomData();
            } else {
              self.$message({
                showClose: true,
                message: res.data.msg,
                type: 'warning'
              });
            }
          });
      },
      // 删除客户
      handleDelete(id) {
        let self = this;
        axios.post('customer_deleteCustomerByIds.ajax', qs.stringify({
            ids: id
          })
        )
          .then(function (res) {
            self.$message("删除客户成功");
            self.getCustomData();
          });
      },
      // 编辑客户信息
      handleEdit() {

      },
      // 提交编辑
      submitEdit() {

      },
    },
    mounted: function () {
      this.getCustomData();
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
