<template>
  <section>

    <!--面包屑导航-->
    <el-breadcrumb separator="/" class="bread-nav">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!--生成订单按钮-->
    <el-col :span="24">
      <el-col>
        <el-button type="primary" @click="showGenerateOrder">生成订单</el-button>
      </el-col>
    </el-col>

    <!--生成订单模态框-->
    <el-dialog title="生成订单" :visible.sync="config.generate_order_visible">
      <el-row>
        <el-col :span="2">
          <el-button>客户</el-button>
        </el-col>
        <el-col :span="10" :offset="8">
          <el-select v-model="customer" filterable placeholder="请选择">
            <el-option v-for="item in customers" :key="item.id" :value="item.name"></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-button>订单编号</el-button>
        </el-col>
        <el-col :span="8" :offset="8">
          <el-input v-model="order_num"></el-input>
        </el-col>
      </el-row>
      <br>
      <!--成品表格-->
      <el-table :data="product_table_data" ref="multipleTable" style="width: 100%" height="350">
        <el-table-column label="ID">
          <template scope="scope">
            <el-tag class="product_id">{{ scope.row.id }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="成品名">
          <template scope="scope">
            <el-tag type="primary">{{ scope.row.slateName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="单价">
          <template scope="scope">
            <el-tag>{{ scope.row.price }}</el-tag>
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
        <el-table-column label="片数">
          <template scope="scope">
            <el-tag type="danger">{{ scope.row.count }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="订单片数">
          <template scope="scope">
            <el-input class="order_count"></el-input>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="config.generate_order_visible = false">取 消</el-button>
        <el-button type="primary" @click="submitGenerateOrder">生成订单</el-button>
      </span>
    </el-dialog>

    <!--订单表格-->
    <el-table :data="order_table_data" style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="订单编号">
        <template scope="scope">
          <el-tag type="primary">{{ scope.row.orderNum }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="单价">
        <template scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户姓名">
        <template scope="scope">
          <span>{{ scope.row.customerId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="负责人">
        <template scope="scope">
          <span>{{ scope.row.user.loginName }}</span>
        </template>
      </el-table-column>
    </el-table>

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
          generate_order_visible: false
        },
        // 订单数据
        order_table_data: [],
        // 所有客户信息
        customers: [],
        // 选中的客户名
        customer: '',
        // 输入订单编号
        order_num: '',
        // 成品数据
        product_table_data: []
      }
    },
    methods: {
      //获取订单信息
      getOrderData() {
        let self = this;
        axios.post("order_queryAllOrder.ajax")
          .then(function (res) {
            self.order_table_data = res.data.list;
          });
      },
      // 调出生成订单模态框
      showGenerateOrder() {
        let self = this;
        self.config.generate_order_visible = true;
        axios.post("development_queryAllDevelopment.ajax")
          .then(function (res) {
            self.product_table_data = res.data.list;
          });
      },
      // 获取客户信息
      getCustomData() {
        let self = this;
        axios.post('customer_queryAllCustomer.ajax')
          .then(function (res) {
            self.customers = res.data.list;
          });
      },
      // 提交生成订单
      submitGenerateOrder() {
        let self = this,
          customer_id,
          data = [];
        // 根据客户名获取客户ID:customerId
        self.customers.forEach(function (item) {
          if (item.name == self.customer) {
            customer_id = item.id;
            return true;
          }
        });
        // 遍历表单数不为0的表格，获取当前行成品ID和成品数量:data

        $(".order_count").each(function () {
          let _this = this,
            count = $(_this).find("input").val();
          if (count) {
            let id = $(_this).parents("tr").find(".product_id").text();
            data.push({
              developmentId: id,
              count: count
            });
          }
        });
        axios.post("order_addOrder.ajax", {
          customerId: customer_id,
          orderNum: self.order_num,
          data: data
        })
          .then(function (res) {
            if (res.data.data) {
              self.config.generate_order_visible = false;
              self.getOrderData();
            } else {
              self.$message(res.data.msg);
            }
          });
      }
    },
    mounted: function () {
      this.getOrderData();
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
</style>
