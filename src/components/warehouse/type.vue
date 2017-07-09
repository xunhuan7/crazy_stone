<template>
  <section>

    <!--面包屑导航-->
    <el-breadcrumb separator="/" class="bread-nav">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>仓库管理</el-breadcrumb-item>
      <el-breadcrumb-item>种类管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!--添加新种类-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true">
        <el-col :span="5">
          <el-form-item>
            <el-input placeholder="种类编号" v-model="add_type.num"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item>
            <el-input placeholder="种类名" v-model="add_type.type"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" @click="addType">添加种类</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-col>

    <!--结果表格-->
    <el-table :data="table_data" style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="ID" v-if="config.id_show">
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
    <el-dialog title="编辑种类信息" :visible.sync="config.dialogVisible" size="tiny" class="model">
      <el-input v-model="edit.num">
        <template slot="prepend">种类编号</template>
      </el-input>
      <br><br>
      <el-input v-model="edit.type">
        <template slot="prepend">种类名称</template>
      </el-input>
      <br><br>
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
        // 添加种类
        add_type: {
          type: '',
          num: ''
        },
        // 修改种类信息
        edit: {
          id: '',
          num: '',
          type: ''
        },
        // 种类信息表格
        table_data: []
      }
    },
    methods: {
      // 获取种类数据
      getTypeData(){
        let self = this;
        axios.post('kind_queryAllKind.ajax')
          .then(function (res) {
            self.table_data = res.data.list;
          });
      },
      // 添加新种类
      addType(){
        let self = this;
        axios.post('kind_addKind.ajax', qs.stringify({
            name: self.add_type.type,
            num: self.add_type.num
          })
        )
          .then(function (res) {
            if (res.data.data === true) {
              self.$message("添加种类成功");
              self.getTypeData();
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
        axios.post('kind_deleteKindByIds.ajax', qs.stringify({
            ids: id
          })
        )
          .then(function (res) {
            self.$message("删除种类成功");
            self.getTypeData();
          });
      },
      // 编辑种类信息
      handleEdit(id, num, type) {
        this.config.dialogVisible = true;
        this.edit.id = id;
        this.edit.num = num;
        this.edit.type = type;
      },
      //提交编辑
      submitEdit() {
        let self = this;
        axios.post('kind_editKind.ajax', qs.stringify({
            id: self.edit.id,
            num: self.edit.num,
            name: self.edit.type
          })
        )
          .then(function (res) {
            if (res.data.data == true) {
              self.config.dialogVisible = false;
              self.$message("编辑成功");
              self.getTypeData();
            } else {
              self.$message({
                showClose: true,
                message: res.data.msg,
                type: 'warning'
              });
            }
          });
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
