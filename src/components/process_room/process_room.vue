<template>
  <section>

    <!--面包屑导航-->
    <el-breadcrumb separator="/" class="bread-nav">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>加工间</el-breadcrumb-item>
    </el-breadcrumb>

    <!--匝信息结果表格-->
    <el-table :data="process_table_data" style="width: 100%">
      <el-table-column type="index" width="80"></el-table-column>
      <el-table-column v-if="config.id_show">
        <template scope="scope">{{ scope.row.slateId }}</template>
      </el-table-column>
      <el-table-column v-if="config.id_show">
        <template scope="scope">{{ scope.row.stabKindId }}</template>
      </el-table-column>
      <el-table-column label="所属种类">
        <template scope="scope">
          <el-tag type="primary">{{ scope.row.kindName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="匝编号">
        <template scope="scope">
          <el-tag type="primary">{{ scope.row.stabKindNum }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="片编号">
        <template scope="scope">
          <el-tag type="success">{{ scope.row.proNum }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="价格">
        <template scope="scope">{{ scope.row.price }}</template>
      </el-table-column>
      <el-table-column label="面积">
        <template scope="scope">{{ scope.row.acreage }}</template>
      </el-table-column>
      <el-table-column label="出库人员">
        <template scope="scope">
          <el-tag type="danger">{{ scope.row.operatorName }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button size="small" type="primary">返库</el-button>
          <el-button size="small" type="primary">出成品</el-button>
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
        process_table_data: [],
        config: {
          id_show: false
        }
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
