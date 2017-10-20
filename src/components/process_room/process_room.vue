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
          <el-button size="small" type="primary" @click="showBackWareHouse(scope.row.slateId,scope.row.stabKindId)">返库
          </el-button>
          <el-button size="small" type="primary" @click="showOutputProduct(scope.row.slateId)">
            出成品
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--返库模态框-->
    <el-dialog title="返库" :visible.sync="config.back_warehouse_visible" size="tiny">
      <el-form style="text-align: center" class="add_back_rows">
        <el-row>
          <el-button type="primary" @click="addBackRow">添加一行（米）</el-button>
        </el-row>
        <br>
        <el-row class="add_back_row">
          <el-col :span="10">
            <el-input class="add_back_width"></el-input>
          </el-col>
          <el-col :span="4">*</el-col>
          <el-col :span="10">
            <el-input class="add_back_height"></el-input>
          </el-col>
        </el-row>
        <br/>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="config.back_warehouse_visible = false">取 消</el-button>
        <el-button type="primary" @click="submitBackWarehouse">返 库</el-button>
      </span>
    </el-dialog>

    <!--出成品模态框-->
    <el-dialog title="出成品" :visible.sync="config.output_product_visible">
      <el-form style="text-align: center" class="add_output_rows">
        <el-row>
          <el-button type="primary" @click="addOutputRow">添加一行（米）</el-button>
        </el-row>
        <br>
        <el-row class="add_output_row">
          <el-col :span="3">规格：</el-col>
          <el-col :span="3">
            <el-input class="add_output_width" placeholder="长"></el-input>
          </el-col>
          <el-col :span="1">*</el-col>
          <el-col :span="3">
            <el-input class="add_output_height" placeholder="宽"></el-input>
          </el-col>
          <el-col :span="3">名称：</el-col>
          <el-col :span="5">
            <el-input class="add_output_name"></el-input>
          </el-col>
          <el-col :span="3">单价：</el-col>
          <el-col :span="3">
            <el-input class="add_output_price"></el-input>
          </el-col>
        </el-row>
        <br/>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="config.output_product_visible = false">取 消</el-button>
        <el-button type="primary" @click="submitOutputProduct">出成品</el-button>
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
        process_table_data: [],
        config: {
          id_show: false,
          back_warehouse_visible: false,
          output_product_visible: false
        },
        // 返库使用的ID
        back: {
          processSlateId: '',
          stabKindId: ''
        },
        // 出成品使用的ID
        output: {
          processSlateId: ''
        }
      }
    },
    methods: {
      // 获取加工间表格信息
      getProcessData(){
        let self = this;
        axios.post('processor_queryProcessSlateByPage.ajax')
          .then(function (res) {
            self.process_table_data = res.data.list;
          });
      },
      // 调出返库模态框
      showBackWareHouse(slateId, stabKindId){
        this.config.back_warehouse_visible = true;
        this.back.processSlateId = slateId;
        this.back.stabKindId = stabKindId;
      },
      // 添加一行返库数据
      addBackRow(){
        $('<div class="el-row" class="add_back_row">' +
          '<div class="el-col el-col-10"><div class="el-input"><input autocomplete="off" type="text" rows="2" validateevent="true" class="el-input__inner add_back_width"></div></div>' +
          '<div class="el-col el-col-4">*</div>' +
          '<div class="el-col el-col-10"><div class="el-input"><input autocomplete="off" type="text" rows="2" validateevent="true" class="el-input__inner add_back_height"></div></div>' +
          '</div><br/>').appendTo(".add_back_rows");
      },
      // 提交返库
      submitBackWarehouse(){
        let self = this,
          data = [];
        $(".add_back_row").each(function () {
          let width = $(this).find(".add_back_width > input").val(),
            height = $(this).find(".add_back_height > input").val();
          if (width && height) {
            data.push({
              length: width,
              height: height
            });
          }
        });
        axios.post('processor_backStorage.ajax', {
          processSlateId: self.back.processSlateId,
          stabKindId: self.back.stabKindId,
          data: data
        })
          .then(function (res) {
            if (res.data.data == true) {
              self.$message({
                message: "返库成功",
                type: 'success',
                duration: '1000'
              });
              self.getProcessData();
              self.config.back_warehouse_visible = false;
            } else {
              self.$message(res.data.msg);
            }
          });
      },
      // 调出出成品模态框
      showOutputProduct(slateId){
        this.config.output_product_visible = true;
        this.output.processSlateId = slateId;
      },
      // 添加一行出成品数据
      addOutputRow(){
        $('<div class="add_output_row el-row">' +
          '<div class="el-col el-col-3">规格：</div>' +
          '<div class="el-col el-col-3"><div class="add_output_width el-input"><input autocomplete="off" placeholder="长" type="text" rows="2" validateevent="true" class="el-input__inner"></div></div>' +
          '<div class="el-col el-col-1">*</div>' +
          '<div class="el-col el-col-3"><div class="add_output_height el-input"><input autocomplete="off" placeholder="宽" type="text" rows="2" validateevent="true" class="el-input__inner"></div></div>' +
          '<div class="el-col el-col-3">名称：</div>' +
          '<div class="el-col el-col-5"><div class="add_output_name el-input"><input autocomplete="off" type="text" rows="2" validateevent="true" class="el-input__inner"></div></div>' +
          '<div class="el-col el-col-3">单价：</div>' +
          '<div class="el-col el-col-3"><div class="add_output_price el-input"><input autocomplete="off" type="text" rows="2" validateevent="true" class="el-input__inner"></div></div>' +
          '</div><br/>').appendTo(".add_output_rows");
      },
      // 提交出成品
      submitOutputProduct(){
        let self = this,
          data = [];
        $(".add_output_row").each(function () {
          let width = $(this).find(".add_output_width > input").val(),
            height = $(this).find(".add_output_height > input").val(),
            name = $(this).find(".add_output_name > input").val(),
            price = $(this).find(".add_output_price > input").val();
          if (width && height && name && price) {
            data.push({
              length: width,
              height: height,
              slateName: name,
              price: price
            });
          }
        });
        axios.post('processor_produceDevelopment.ajax', {
          processSlateId: self.output.processSlateId,
          development: data
        })
          .then(function (res) {
            if (res.data.data == true) {
              self.$message({
                message: "出成品成功",
                type: 'success',
                duration: '1000'
              });
              self.getProcessData();
              self.config.output_product_visible = false;
            } else {
              self.$message(res.data.msg);
            }
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
