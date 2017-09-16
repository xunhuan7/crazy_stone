<template>
  <section>

    <!--面包屑导航-->
    <el-breadcrumb separator="/" class="bread-nav">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>库存管理</el-breadcrumb-item>
      <el-breadcrumb-item>匝管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!--查询匝-->
    <el-col :span="24" class="toolbar">
      <el-form :inline="true">
        <el-col :span="6">
          <el-form-item label="材料种类">
            <el-select v-model="query_bundle.query_type" placeholder="请选择">
              <el-option v-for="item in query_bundle.all_type" :key="item.id" :value="item.name + item.num"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="匝编号">
            <el-input placeholder="选填" v-model="query_bundle.query_num"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" icon="search" @click="getQueryBundleData">查询</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-button type="success" @click="addBundle">添加匝</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-col>

    <!--添加匝模态框-->
    <el-dialog title="添加匝" :visible.sync="config.add_bundle_visible" size="tiny">
      <el-form label-width="80px"><br>
        <el-form-item label="材料种类">
          <el-select v-model="add_bundle.add_type" placeholder="请选择">
            <el-option v-for="item in add_bundle.all_type" :key="item.id" :value="item.name + item.num"></el-option>
          </el-select>
        </el-form-item>
        <br>
        <el-form-item label="新匝编号">
          <el-input v-model="add_bundle.add_num"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="板材名">
          <el-input v-model="add_bundle.add_slateName"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="单价">
          <el-input v-model="add_bundle.add_price"></el-input>
        </el-form-item>
        <br>
        <el-form-item label="备注">
          <el-input v-model="add_bundle.add_description"></el-input>
        </el-form-item>
      </el-form>
      <br>
      <el-form style="text-align: center" class="add_bundle_rows">
        <el-row>
          <el-button type="primary" @click="addBundleRow">添加一行（米）</el-button>
        </el-row>
        <br>
        <el-row class="add_bundle_row">
          <el-col :span="5">
            <el-input class="add_bundle_width"></el-input>
          </el-col>
          <el-col :span="4">*</el-col>
          <el-col :span="5">
            <el-input class="add_bundle_height"></el-input>
          </el-col>
          <el-col :span="4">片数</el-col>
          <el-col :span="5">
            <el-input class="add_bundle_num"></el-input>
          </el-col>
        </el-row>
        <el-row class="add_bundle_row">
          <el-col :span="5">
            <el-input class="add_bundle_width"></el-input>
          </el-col>
          <el-col :span="4">*</el-col>
          <el-col :span="5">
            <el-input class="add_bundle_height"></el-input>
          </el-col>
          <el-col :span="4">片数</el-col>
          <el-col :span="5">
            <el-input class="add_bundle_num"></el-input>
          </el-col>
        </el-row>
      </el-form>
      <br>
      <span slot="footer" class="dialog-footer">
        <el-button @click="config.add_bundle_visible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddBundle">确 定</el-button>
      </span>
    </el-dialog>

    <!--匝信息结果表格-->
    <el-table :data="bundle_table_data" style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column label="ID" v-if="config.id_show">
        <template scope="scope">
          <el-tag>{{ scope.row.id }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="所属种类">
        <template scope="scope">
          <el-tag type="danger">{{ scope.row.kind.name }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="匝编号">
        <template scope="scope">
          <el-tag type="primary">{{ scope.row.num }}</el-tag>
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
      <el-table-column label="入库片数">
        <template scope="scope">
          <span><el-tag type="danger">{{ scope.row.originalCount }}</el-tag></span>
        </template>
      </el-table-column>
      <el-table-column label="入库面积">
        <template scope="scope">
          <span>{{ scope.row.originalAcreage }}</span>
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
      <el-table-column label="备注">
        <template scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button size="small" @click="outputBundle(scope.row.id)">
            出库
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--出库模态框-->
    <el-dialog title="出库" :visible.sync="config.output_bundle_visible" size="tiny">
      <el-table :data="slate_table_data" ref="multipleTable" style="width: 100%" id="output_table">
        <el-table-column type="selection">
        </el-table-column>
        <el-table-column label="ID">
          <template scope="scope">
            <el-tag type="primary">{{ scope.row.id }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="板材名">
          <template scope="scope">
            <el-tag type="danger">{{ scope.row.slateName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="价格">
          <template scope="scope">
            <span>{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="宽">
          <template scope="scope">
            <el-tag>{{ scope.row.length }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="高">
          <template scope="scope">
            <el-tag>{{ scope.row.height }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="config.output_bundle_visible = false">取 消</el-button>
        <el-button type="primary" @click="submitOutputBundle">出 库</el-button>
      </span>
    </el-dialog>

  </section>
</template>

<script>
  import axios from 'axios';
  import $ from 'jquery';
  let qs = require("qs");

  export default {
    data() {
      return {
        config: {
          id_show: false,
          add_bundle_visible: false,
          output_bundle_visible: false
        },
        // 根据种类、匝编号查询匝信息
        query_bundle: {
          all_type: [],
          query_num: '',
          query_type: ''
        },
        // 匝信息表格
        bundle_table_data: [],
        // 添加匝
        add_bundle: {
          add_type: '',
          add_num: '',
          add_slateName: '',
          add_price: '',
          add_description: ''
        },
        // 板材信息表格
        slate_table_data: [],
        multipleSelection: []
      }
    },
    methods: {
      //获取所有材料种类
      getStoneType(){
        let self = this;
        axios.post('kind_queryAllKind.ajax')
          .then(function (res) {
            self.query_bundle.all_type = res.data.list;
            self.add_bundle.all_type = res.data.list;
            let list = res.data.list;
            for (let i = 0; i < list.length; i++) {
              sessionStorage.setItem(list[i].name + list[i].num, list[i].id);
            }
          });
      },
      // 获取所有匝信息
      getBundleData(){
        let self = this;
        axios.post('stabKindAndSlate_queryAllStabKind.ajax')
          .then(function (res) {
            self.bundle_table_data = res.data.list;
          });
      },
      // 根据种类、匝编号查询匝信息
      getQueryBundleData(){
        let self = this;
        let query_id;
        if (self.query_bundle.query_type == '' && self.query_bundle.query_num == '') {
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
        axios.post('stabKindAndSlate_queryStabKindByKindIdOrNum.ajax', qs.stringify({
            num: self.query_bundle.query_num,
            id: query_id
          })
        )
          .then(function (res) {
            self.bundle_table_data = res.data.list;
          });
      },
      // 调出添加匝模态框
      addBundle() {
        this.config.add_bundle_visible = true;
      },
      // 添加一行板材数据
      addBundleRow(){
        $('<div class="el-row" class="add_bundle_row">' +
          '<div class="el-col el-col-5"><div class="el-input"><input autocomplete="off" type="text" rows="2" validateevent="true" class="el-input__inner add_bundle_width"></div></div>' +
          '<div class="el-col el-col-4">*</div>' +
          '<div class="el-col el-col-5"><div class="el-input"><input autocomplete="off" type="text" rows="2" validateevent="true" class="el-input__inner add_bundle_height"></div></div>' +
          '<div class="el-col el-col-4">片数</div>' +
          '<div class="el-col el-col-5"><div class="el-input"><input autocomplete="off" type="text" rows="2" validateevent="true" class="el-input__inner add_bundle_num"></div></div>' +
          '</div>').appendTo(".add_bundle_rows");
      },
      // 提交添加新匝
      submitAddBundle(){
        let self = this;
        let kind_id = sessionStorage.getItem(self.add_bundle.add_type),
          data = [];
        $(".add_bundle_row").each(function () {
          let num = $(this).find(".add_bundle_num > input").val();
          let width = $(this).find(".add_bundle_width > input").val();
          let height = $(this).find(".add_bundle_height > input").val();
          if (num) {
            for (let i = 0; i < num; i++) {
              data.push({
                length: width,
                height: height
              });
            }
          }
        });
        axios.post('stabKindAndSlate_addStabKind.ajax', {
          kindId: kind_id,
          num: self.add_bundle.add_num,
          slateName: self.add_bundle.add_slateName,
          price: self.add_bundle.add_price,
          description: self.add_bundle.add_description,
          data: data
        })
          .then(function (res) {
            if (res.data.data == true) {
              self.getBundleData();
              self.config.add_bundle_visible = false;
              self.$message({
                message: res.data.msg,
                type: 'info',
                duration: 800
              });
            } else {
              self.$message(res.data.msg);
            }
          })
      },
      // 调出出库模态框
      outputBundle(id){
        let self = this;
        self.config.output_bundle_visible = true;
        axios.post('stabKindAndSlate_querySlateByStabKindId.ajax', qs.stringify({
            stabKindId: id
          })
        )
          .then(function (res) {
            if (res.data.data == true) {
              self.slate_table_data = res.data.list;
            }
          });
      },
      // 提交出库
      submitOutputBundle(){
       $("#output_table ")
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
