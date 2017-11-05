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
        <el-col :span="7">
          <el-form-item label="材料种类">
            <el-select v-model="query_bundle.query_type" placeholder="请选择">
              <el-option v-for="item in query_bundle.all_type" :key="item.id" :value="item.id"
                         :label="item.name + '：' + item.num"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="匝编号">
            <el-input placeholder="选填" v-model="query_bundle.query_num"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item>
            <el-button type="primary" icon="search" @click="getQueryBundleData">查询</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-button type="success" @click="addBundle">添加匝</el-button>
          </el-form-item>
        </el-col>
      </el-form>
    </el-col>

    <!--添加匝模态框-->
    <el-dialog title="添加匝" :visible.sync="config.add_bundle_visible" size="tiny" class="add_bundle_box">
      <el-form label-width="80px"><br>
        <el-form-item label="材料种类">
          <el-select v-model="add_bundle.add_type" placeholder="请选择">
            <el-option v-for="item in add_bundle.all_type" :key="item.id" :value="item.id"
                       :label="item.name + '：' + item.num"></el-option>
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
        <br/>
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
        <br class="clear"/>
      </el-form>
      <br>
      <span slot="footer" class="dialog-footer">
        <el-button @click="config.add_bundle_visible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddBundle" v-loading="config.add_button_loading">确 定</el-button>
      </span>
    </el-dialog>

    <!--匝信息结果表格-->
    <el-table :data="bundle_table_data" v-loading="config.bundle_table_loading">
      <el-table-column type="index" width="80"></el-table-column>
      <el-table-column v-if="false">
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
          <el-button size="small" type="primary" @click="outputBundle(scope.row.id)">
            出库
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--出库模态框-->
    <el-dialog title="出库" :visible.sync="config.output_bundle_visible">
      <el-table :data="slate_table_data" ref="multipleTable" style="width: 100%" @selection-change="selectOutput"
                v-loading="config.output_table_loading">
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
        <el-button type="primary" @click="submitOutputBundle" v-loading="config.output_button_loading">出 库</el-button>
      </span>
    </el-dialog>

    <!--匝信息分页-->
    <el-pagination layout="prev, pager, next" :total="page.total" :page-size="15" :current-page="page.current_page"
                   @current-change="currentChange"
                   style="float: right;margin-top: 20px">
    </el-pagination>

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
          add_bundle_visible: false,
          output_bundle_visible: false,
          bundle_table_loading: false,
          add_button_loading: false,
          output_table_loading: false,
          output_button_loading: false
        },
        // 根据种类、匝编号查询匝信息
        query_bundle: {
          all_type: [],
          query_num: '',
          query_type: '',
          // 是否查询：为true时调用查询分页
          is_query: false
        },
        // 匝信息表格
        bundle_table_data: [],
        // 添加匝
        add_bundle: {
          all_type: [],
          add_type: '',
          add_num: '',
          add_slateName: '',
          add_price: '',
          add_description: ''
        },
        // 板材信息表格
        slate_table_data: [],
        multipleSelection: [],
        // 出库
        selects: [],
        bundle_code: '',
        // 分页
        page: {
          current_page: 1,
          total: 0
        }
      }
    },
    methods: {

      //获取所有材料种类
      getStoneType() {
        axios.post('kind_queryAllKind.ajax')
          .then((res) => {
              this.add_bundle.all_type = res.data.list;
              this.query_bundle.all_type = res.data.list;
            }
          )
        ;
      },

      // 获取所有匝信息
      getBundleData() {
        this.config.bundle_table_loading = true;
        axios.post('stabKindAndSlate_queryStabKindByPage.ajax', qs.stringify({
            startPage: this.page.current_page
          })
        )
          .then((res) => {
            this.config.bundle_table_loading = false;
            this.bundle_table_data = res.data.list;
            this.page.total = res.data.page.totalCount;
          });
      },

      // 根据种类、匝编号查询匝信息
      getQueryBundleData() {
        if (this.query_bundle.query_type == '' && this.query_bundle.query_num == '') {
          this.currentChange();
          return;
        }
        this.config.bundle_table_loading = true;
        this.query_bundle.is_query = true;
        axios.post('stabKindAndSlate_queryStabKindByKindIdOrNum.ajax', qs.stringify({
            num: this.query_bundle.query_num,
            id: this.query_bundle.query_type,
            startPage: this.page.current_page
          })
        )
          .then((res) => {
            this.config.bundle_table_loading = false;
            this.bundle_table_data = res.data.list;
            // 分页组件重写
            this.page.total = res.data.page.totalCount;
          });
      },

      // 调出添加匝模态框
      addBundle() {
        this.config.add_bundle_visible = true;
        $(".clear").nextAll().remove();
        $(".add_bundle_box input").val('');
      },

      // 添加一行板材数据
      addBundleRow() {
        $('<div class="el-row" class="add_bundle_row">' +
          '<div class="el-col el-col-5"><div class="el-input"><input autocomplete="off" type="text" rows="2" validateevent="true" class="el-input__inner add_bundle_width"></div></div>' +
          '<div class="el-col el-col-4">*</div>' +
          '<div class="el-col el-col-5"><div class="el-input"><input autocomplete="off" type="text" rows="2" validateevent="true" class="el-input__inner add_bundle_height"></div></div>' +
          '<div class="el-col el-col-4">片数</div>' +
          '<div class="el-col el-col-5"><div class="el-input"><input autocomplete="off" type="text" rows="2" validateevent="true" class="el-input__inner add_bundle_num"></div></div>' +
          '</div><br/>').appendTo(".add_bundle_rows");
      },

      // 提交添加新匝
      submitAddBundle() {
        if (!this.add_bundle.add_type || !this.add_bundle.add_num || !this.add_bundle.add_slateName || !this.add_bundle.add_price) { // 数据过滤
          this.$message({
            message: '请填写完整信息',
            type: 'warning',
            duration: 1000
          });
          return;
        } else if (!parseInt(this.add_bundle.add_price)) {
          this.$message({
            message: '价格必须为正整数',
            type: 'warning',
            duration: 1000
          });
          return;
        }
        // 确认添加
        this.$confirm('确认添加吗?', '提示', {}).then(() => {
          let kind_id = this.add_bundle.add_type,
            data = [];
          $(".add_bundle_row").each(function () {
            let num = $(this).find(".add_bundle_num > input").val(),
              width = $(this).find(".add_bundle_width > input").val(),
              height = $(this).find(".add_bundle_height > input").val();
            if (num) {
              for (let i = 0; i < num; i++) {
                data.push({
                  length: width,
                  height: height
                });
              }
            }
          });
          this.config.add_button_loading = true;
          axios.post('stabKindAndSlate_addStabKind.ajax', {
            kindId: kind_id,
            num: this.add_bundle.add_num,
            slateName: this.add_bundle.add_slateName,
            price: parseInt(this.add_bundle.add_price),
            description: this.add_bundle.add_description,
            data: data
          })
            .then((res) => {
              if (res.data.data === true) {
                this.config.add_button_loading = false;
                this.config.add_bundle_visible = false;
                this.getBundleData();
                this.$message({
                  message: '添加匝成功',
                  type: 'info',
                  duration: 1000
                });
              } else {
                this.$message({
                  message: res.data.msg,
                  type: 'warning',
                  duration: 1000
                });
              }
            })
        });
      },

      // 调出出库模态框
      outputBundle(id) {
        this.bundle_code = id;
        this.config.output_bundle_visible = true;
        this.config.output_table_loading = true;
        axios.post('stabKindAndSlate_querySlateByStabKindId.ajax', qs.stringify({
            stabKindId: id
          })
        )
          .then((res) => {
            if (res.data.data === true) {
              this.config.output_table_loading = false;
              this.slate_table_data = res.data.list;
            }
          });
      },

      // 选中出库
      selectOutput(selects) {
        this.selects = selects;
      },

      // 提交出库
      submitOutputBundle() {
        // 未选择出库板材
        if (this.selects.length == 0) {
          this.$message({
            message: "未选择出库板材",
            type: 'warning',
            duration: '1000'
          });
          return;
        }
        this.$confirm('确认出库吗?', '提示', {}).then(() => {
          let ids = this.selects.map(item => item.id).toString();
          this.config.output_button_loading = true;
          axios.post('stabKindAndSlate_outStock.ajax', qs.stringify({
              ids: ids,
              stabKindId: this.bundle_code
            })
          )
            .then((res) => {
              this.config.output_button_loading = false;
              if (res.data.data === true) {
                this.$message({
                  message: "出库成功",
                  type: 'success',
                  duration: '1000'
                });
                this.config.output_bundle_visible = false;
                this.getBundleData();
              } else {
                this.$message({
                  message: res.data.msg,
                  type: 'warning',
                  duration: '1000'
                });
              }
            });
        });
      },

      // 分页
      currentChange(page) {
        this.page.current_page = page;
        // 查询结果分页
        if (this.query_bundle.is_query) {
          this.getQueryBundleData();
        } else {
          // 所有分页
          this.getBundleData();
        }
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
