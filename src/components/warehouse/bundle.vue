<template>
  <section>

    <!--面包屑导航-->
    <el-breadcrumb separator="/" class="bread-nav">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>仓库管理</el-breadcrumb-item>
      <el-breadcrumb-item>匝管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!--查询匝-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true">
        <el-col :span="7">
          <el-form-item label="匝编号">
            <el-input placeholder="选填" v-model="query_bundle.query_num"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="材料种类">
            <el-select v-model="query_bundle.query_type" placeholder="请选择">
              <el-option v-for="item in query_bundle.all_type" :key="item.id" :value="item.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" @click="getQueryBundleData">查询</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-button type="success" @click="addBundle">添加</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-col>

    <!--添加匝模态框-->
    <el-dialog title="添加匝" :visible.sync="config.bundleVisible" size="tiny" class="model">

      <span slot="footer" class="dialog-footer">
        <el-button @click="config.bundleVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddBundle">确 定</el-button>
      </span>
    </el-dialog>

    <!--结果表格-->
    <el-table :data="table_data" style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="ID" v-if="config.id_show">
        <template scope="scope">
          <el-tag>{{ scope.row.id }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="匝编号">
        <template scope="scope">
          <el-tag type="primary">{{ scope.row.num }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="所属种类">
        <template scope="scope">
          <el-tag type="primary">{{ scope.row.kind.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="入库时间">
        <template scope="scope">
          <span>{{ scope.row.in_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最近出库时间">
        <template scope="scope">
          <span>{{ scope.row.out_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入库时片数">
        <template scope="scope">
          <span><el-tag type="danger">{{ scope.row.originalCount }}</el-tag></span>
        </template>
      </el-table-column>
      <el-table-column label="入库时总面积">
        <template scope="scope">
          <span>{{ scope.row.originalAcreage }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前片数">
        <template scope="scope">
          <span>{{ scope.row.currentCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前总面积">
        <template scope="scope">
          <span>{{ scope.row.currentAcreage }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出库数量">
        <template scope="scope">
          <span>{{ scope.row.outCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出库面积">
        <template scope="scope">
          <span>{{ scope.row.outAcreage }}</span>
        </template>
      </el-table-column>
      <el-table-column label="返库数量">
        <template scope="scope">
          <span>{{ scope.row.backCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button size="small"
                     @click="handleEdit(scope.row.user.id,scope.row.user.loginName,scope.row.user.userName,scope.row.roleList[0].roleName,scope.row.user.loginName)">
            编辑
          </el-button>
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
        config: {
          // id列不显示，传参使用
          id_show: false,
          bundleVisible: false,
        },
        // 根据种类、匝编号查询匝信息
        query_bundle: {
          query_num: '',
          query_id: '',
          all_type: []
        },
        // 匝信息表格
        table_data: []
      }
    },
    methods: {
      //获取所有材料种类
      getStoneType(){
        let self = this;
        axios.post('kind_queryAllKind.ajax')
          .then(function (res) {
            self.query_bundle.all_type = res.data.list;
          });
      },
      // 获取所有匝信息
      getBundleData(){
        let self = this;
        axios.post('stabKind_queryAllStabKind.ajax')
          .then(function (res) {
            self.table_data = res.data.list;
          });
      },
      // 根据种类、匝编号查询匝信息
      getQueryBundleData(){
        let self = this;
        let query_id;
        if (self.query_bundle.query_type == '' && self.query_bundle.query_id == '') {
          self.$message({
            message: "查询参数不能为空",
            type: 'warning',
            duration: '1000'
          });
          return;
        }
        for (let i = 0; i < self.query_bundle.all_type.length; i++) {
          if (self.query_bundle.all_type[i].name == self.query_bundle.query_type) {
            query_id = self.query_bundle.all_type[i].id;
            break;
          }
        }
        axios.post('stabKind_queryALLStabKindByKindId.ajax', qs.stringify({
            num: self.query_bundle.query_id,
            id: query_id
          })
        )
          .then(function (res) {
            self.table_data = res.data.list;
          });
      },
      // 添加新匝
      addBundle() {
        this.config.bundleVisible = true;
      },
      // 提交添加
      submitAddBundle(){

      }
    },
    mounted: function () {
      this.getBundleData();
      this.getStoneType();
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
