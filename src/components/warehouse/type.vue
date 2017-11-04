<template>

  <section>

    <!--面包屑导航-->
    <el-breadcrumb separator="/" class="bread-nav">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>库存管理</el-breadcrumb-item>
      <el-breadcrumb-item>种类管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!--添加新种类-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true">
        <el-col :span="4">
          <el-form-item>
            <el-input placeholder="种类编号" v-model="add_type.num"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-input placeholder="种类名" v-model="add_type.type"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-button type="primary" @click="add_type.flag && addType()">添加种类</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-col>

    <!--结果表格-->
    <el-table :data="type_table_data" style="width: 100%" v-loading="config.table_loading">
      <el-table-column type="index"></el-table-column>
      <el-table-column v-if="false">
        <template scope="scope">
          <el-tag>{{ scope.row.id }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="种类编号">
        <template scope="scope">
          <el-tag type="primary">{{ scope.row.num }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="种类名称">
        <template scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.row.id,scope.row.num,scope.row.name)">
            编辑
          </el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--模态框-->
    <el-dialog title="编辑种类信息" :visible.sync="config.dialog_visible" size="tiny" class="model">
      <el-input v-model="edit.num">
        <template slot="prepend">种类编号</template>
      </el-input>
      <br><br>
      <el-input v-model="edit.type">
        <template slot="prepend">种类名称</template>
      </el-input>
      <br><br>
      <span slot="footer" class="dialog-footer">
    <el-button @click="config.dialog_visible = false">取 消</el-button>
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
          dialog_visible: false,
          table_loading: false
        },
        // 种类信息表格
        type_table_data: [],
        // 添加种类
        add_type: {
          flag: true,
          type: '',
          num: ''
        },
        // 修改种类信息
        edit: {
          id: '',
          num: '',
          type: ''
        },
        // 分页信息
        page: {
          current_page: 1,
          total: 0
        }
      }
    },
    methods: {
      // 获取种类数据
      getTypeData() {
        this.config.table_loading = true;
        axios.post('kind_queryAllKind.ajax', qs.stringify({
            startPage: this.page.current_page
          })
        )
          .then((res) => {
            this.type_table_data = res.data.list;
//              this.page.total = res.data.page.totalCount; TODO:总条数
            this.page.total = 20;
            this.config.table_loading = false;
          });
      },
      // 添加新种类
      addType() {
        if (!this.add_type.type || !this.add_type.num) {
          this.$message({
            type: 'warning',
            duration: 1000,
            message: '请填写完整信息'
          });
          return;
        }
        this.add_type.flag = false;
        axios.post('kind_addKind.ajax', qs.stringify({
            name: this.add_type.type,
            num: this.add_type.num
          })
        )
          .then((res) => {
            this.add_type.flag = true;
            if (res.data.data === true) {
              this.$message({
                type: 'success',
                duration: 800,
                message: '添加种类成功'
              });
              this.add_type.type = '';
              this.add_type.num = '';
              this.getTypeData();
            } else {
              this.$message({
                showClose: true,
                message: res.data.msg,
                type: 'warning'
              });
            }
          });
      },
      // 删除种类
      handleDelete(id) {
        this.$confirm('此操作将删除该种类, 是否继续?', '注意', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {// 确认删除，调用删除接口
          this.config.table_loading = true;
          axios.post('kind_deleteKindByIds.ajax', qs.stringify({
              ids: id
            })
          )
            .then((res) => {
              if (res.data.data === true) {
                this.$message({
                  type: 'success',
                  duration: 800,
                  message: '删除成功!'
                });
                this.getTypeData();
              } else {
                this.$message({
                  type: 'error',
                  duration: 1200,
                  message: res.data.msg
                });
                this.config.table_loading = false;
              }
            });
        }).catch(() => {// 取消删除
          this.$message({
            type: 'info',
            duration: 800,
            message: '已取消删除'
          });
        });
      },
      // 编辑种类信息
      handleEdit(id, num, type) {
        this.config.dialog_visible = true;
        this.edit.id = id;
        this.edit.num = num;
        this.edit.type = type;
      },
      //提交编辑
      submitEdit() {
        axios.post('kind_editKind.ajax', qs.stringify({
            id: this.edit.id,
            num: this.edit.num,
            name: this.edit.type
          })
        )
          .then((res) => {
            if (res.data.data == true) {
              this.config.dialog_visible = false;
              this.$message({
                duration: 800,
                message: "编辑成功",
                type: 'warning'
              });
              this.getTypeData();
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
        this.getTypeData();
      }
    },
    mounted: function () {
      this.getTypeData();
    }
  }

</script>

<style scoped>
  body {
    margin: 0;
  }

  .contain {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;
  }

  /*头部*/
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
