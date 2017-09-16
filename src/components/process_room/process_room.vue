<template>
  <section>

    <!--面包屑导航-->
    <el-breadcrumb separator="/" class="bread-nav">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>加工间</el-breadcrumb-item>
    </el-breadcrumb>

    <!---->
    <!--匝信息结果表格-->
    <el-table :data="process_table_data" style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="ID" v-if="config.id_show">
        <template scope="scope">
          <el-tag>{{ scope.row.id }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="姓名">
        <template scope="scope">
          <el-tag>{{ scope.row.kind.name }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
  import axios from 'axios';
  let qs = require("qs");

  export default {
    data() {
      return {
        process_table_data:[],
        config: {}
      }
    },
    methods: {
      // 获取加工间表格信息
      getProcessData(){
        let self = this;
        axios.post('processor_queryAllProcessSlate.ajax')
          .then(function (res) {
            self.process_table_data = res.data.list;
          });
      }
    },
    mounted: function () {
      this.getProcessData();
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
</style>
