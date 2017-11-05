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
        <el-col :span="4">
          <el-form-item>
            <el-input placeholder="手机号码" v-model="add_custom.phone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-button type="primary" @click="addCustom">添加客户信息</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-col>

    <!--结果表格-->
    <el-table :data="custom_table_data" style="width: 100%" v-loading="config.custom_table_loading">
      <el-table-column type="index" width="80"></el-table-column>
      <el-table-column v-if="config.id_show">
        <template scope="scope">
          <el-tag>{{ scope.row.id }}</el-tag>
        </template>
      </el-table-column>
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
          <el-button size="small" @click="handleEdit( scope.row.name, scope.row.phone,scope.row.id)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--编辑客户信息模态框-->
    <el-dialog title="编辑客户信息" :visible.sync="config.dialogVisible" size="tiny" class="model">
      <el-input v-model="edit_custom.name">
        <template slot="prepend">客户姓名</template>
      </el-input>
      <br><br>
      <el-input v-model="edit_custom.phone">
        <template slot="prepend">联系方式</template>
      </el-input>
      <br><br>
      <span slot="footer" class="dialog-footer">
        <el-button @click="config.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEdit">确 定</el-button>
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
          id_show: false,
          custom_table_loading: false,
          dialogVisible: false
        },
        // 客户信息表格
        custom_table_data: [],
        // 添加新客户
        add_custom: {
          name: '',
          phone: ''
        },
        // 修改客户信息
        edit_custom: {
          name: '',
          phone: '',
          id: ''
        },
        // 分页信息
        page: {
          current_page: 1,
          total: 0
        }
      }
    },
    methods: {
      // 获取所有客户信息
      getCustomData() {
        this.config.custom_table_loading = true;
        axios.post('customer_queryAllCustomer.ajax', qs.stringify({
          startPage: this.page.current_page
        }))
          .then((res) => {
            this.config.custom_table_loading = false;
            this.custom_table_data = res.data.list;
            this.page.total = res.data.page.totalCount;

          });
      },
      // 添加新客户
      addCustom() {
        axios.post('customer_addCustomer.ajax', qs.stringify({
            name: this.add_custom.name,
            phone: this.add_custom.phone
          })
        )
          .then((res) => {
            if (res.data.data === true) {
              this.$message("添加客户信息成功");
              this.getCustomData();
            } else {
              this.$message({
                duration: 1000,
                message: res.data.msg,
                type: 'warning'
              });
            }
          });
      },
      // 编辑客户信息
      handleEdit(name, phone, id) {
        this.config.dialogVisible = true;
        this.edit_custom.name = name;
        this.edit_custom.phone = phone;
        this.edit_custom.id = id;
      },
      // 提交编辑
      submitEdit() {
        axios.post('customer_editCustomer.ajax', qs.stringify({
          name: this.edit_custom.name,
          phone: this.edit_custom.phone,
          id: this.edit_custom.id
        })).then((res) => {
          if (res.data.data === true) {
            this.config.dialogVisible = false;
            this.$message({
              duration: 1000,
              message: '编辑客户信息成功',
              type: 'success'
            });
          } else {
            this.$message({
              duration: 1000,
              message: res.data.msg,
              type: 'warning'
            });
          }
        })
      },
      // 删除客户
      handleDelete(id) {
        this.$confirm('此操作将删除该用户, 是否继续?', '注意', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {// 确认删除，调用删除接口
          axios.post('customer_deleteCustomerByIds.ajax', qs.stringify({
              ids: id
            })
          )
            .then((res) => {
              this.$message("删除客户成功");
              this.getCustomData();
            });
        }).catch(() => {// 取消删除
          this.$message({
            type: 'info',
            duration: 1000,
            message: '已取消删除'
          });
        });
      },
      // 分页
      currentChange(page) {
        this.page.current_page = page;
        this.getUserData();
      }
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
