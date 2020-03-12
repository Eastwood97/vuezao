<template>
  <section>
    <div class="table"> <!-- 页面表格begin -->
      <div class="crumbs"> <!-- 页面标题begin -->
        <el-breadcrumb separator="/">
          <el-breadcrumb-item><i class="el-icon-warning"></i> 报警信息</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="container" style="height: 620px"><!-- 页面内容区begin -->
        <!-- 搜索区begin -->
        <div class="handle-box">
          <!--工具条-->
          <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
              <el-form-item>
                设备：
                <el-input v-model="filters.devId" placeholder="设备号" style="width:200px; heght:30px;"
                          size="mini"></el-input>
              </el-form-item>
              <el-form-item>
                姓名：
                <el-input v-model="filters.name" placeholder="姓名" style="width:200px; heght:30px;"
                          size="mini"></el-input>
              </el-form-item>
              <el-form-item>
                imsi：
                <el-input v-model="filters.imsi" placeholder="imsi" style="width:200px; heght:30px;"
                          size="mini"></el-input>
              </el-form-item>
              <el-form-item>
                imei：
                <el-input v-model="filters.imei" placeholder="imei" style="width:200px; heght:30px;"
                          size="mini"></el-input>
              </el-form-item>
              <el-form-item>
                备注：
                <el-input v-model="filters.detail" placeholder="备注" style="width:200px; heght:30px;"
                          size="mini"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="getResult(1)" size="mini" plain>搜索</el-button>
              </el-form-item>
              <el-form-item>
                <!--<el-button type="success" icon="el-icon-circle-plus-outline" @click="handleAdd" size="mini" round>新增-->
                <!--</el-button>-->
              </el-form-item>
            </el-form>
          </el-col>
        </div>
        <div>
          <el-col :span="24">
            <el-collapse v-for="(item,index) in tableData" :key="index" @change="changeCollapse" v-model="activeName"
                         accordion>
              <el-collapse-item :name="index">
                <template slot="title">
                  <i class="tip" v-if="item.state==0"> </i>
                  <i class="tips" v-if="item.state!=0"> </i>
                  <i class="tips"> </i>
                  <span style="width:32%" v-if="item.state==0">
                     <el-tag type="danger"> 捕获时间：{{dateFormat(item.createTime)}}</el-tag>
                  </span>
                  <span style="width:32%" v-if="item.state!=0">
                    <el-tag type="success"> 捕获时间：{{dateFormat(item.createTime)}}</el-tag>
                  </span>
                  <span style="margin-left:100px;width: 32%" v-if="item.state==0">
                     <el-tag type="danger">imsi：{{item.imsi}}</el-tag>
                  </span>
                  <span style="margin-left:100px;width: 32%" v-if="item.state!=0">
                    <el-tag type="success">imsi：{{item.imsi}}</el-tag>
                  </span>
                  <span style="margin-left:100px;width: 36%" v-if="item.state==0">
                    <el-tag type="danger" size="medium">姓名：{{item.name}}</el-tag>
                  </span>
                  <span style="margin-left:100px;width: 36%" v-if="item.state!=0">
                    <el-tag type="success" size="medium">姓名：{{item.name}}</el-tag>
                  </span>
                </template>
                <div style="width: 100%;margin-left:1%">
                  <template>
                    <el-table :data="tableDatas"
                              style="width: 99%;top: -17px;">
                      <el-table-column
                        prop="devId" label="设备号" align="center">
                      </el-table-column>
                      <el-table-column prop="imsi" min-width="130px" label="imsi" align="center">
                      </el-table-column>
                      <el-table-column prop="imei" min-width="130px" label="imei" align="center">
                      </el-table-column>
                      <el-table-column prop="name" label="姓名" align="center">
                      </el-table-column>
                      <el-table-column prop="createTime" label="捕获日期" align="center" :formatter="dateFormats"
                                       min-width="130px" sortable>
                      </el-table-column>
                      <el-table-column prop="location" label="地址" min-width="130px" align="center">
                      </el-table-column>
                      <el-table-column label="操作" fixed="right" align="center">
                        <template slot-scope="scope">
                          <el-button size="mini" plain type="danger" @click="handleDelete(scope.$index, scope.row)">删除
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
                </div>
              </el-collapse-item>
            </el-collapse>
            <br>
            <el-row class="mgb15" v-show="tableData.length>0">
              <el-button style="margin-top: 0px" size="small" round type="primary" plain @click="handleReadList">
                全部已读
              </el-button>
              <el-pagination style="text-align: right;margin-top: -30px"
                             background
                             :page-size="pageSize"
                             @current-change="handleCurrentChange"
                             :current-page="currentPage"
                             layout="total,prev, pager, next"
                             :total="total"
                             align="right">
              </el-pagination>
            </el-row>
          </el-col>
        </div>
      </div><!-- 页面内容区end-->
    </div><!-- 页面表格end -->
    <!--&lt;!&ndash;新增界面&ndash;&gt;-->
    <!--<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">-->
    <!--<el-form :inline="true" :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">-->
    <!--<el-form-item label="姓名" prop="name">-->
    <!--<el-input v-model="addForm.name" auto-complete="off"></el-input>-->
    <!--</el-form-item>-->
    <!--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;-->
    <!--<el-form-item label="imsi" prop="imsi">-->
    <!--<el-input v-model="addForm.imsi" auto-complete="off"></el-input>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="imei" prop="imei">-->
    <!--<el-input v-model="addForm.imei" auto-complete="off"></el-input>-->
    <!--</el-form-item>-->
    <!--&nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;-->
    <!--<el-form-item label="备注" prop="detail">-->
    <!--<el-input v-model="addForm.detail" auto-complete="off"></el-input>-->
    <!--</el-form-item>-->
    <!--</el-form>-->
    <!--<div slot="footer" class="dialog-footer">-->
    <!--<el-button @click="addFormVisible = false">取消</el-button>-->
    <!--<el-button type="primary" @click="addSubmit" :loading="addLoading">提交</el-button>-->
    <!--</div>-->
    <!--</el-dialog>-->
    <!--详细界面-->
    <!--<el-dialog title="详细信息" :visible.sync="selectFormVisible" :close-on-click-modal="false">-->
    <!--<el-form :inline="true" :model="selectForm" label-width="80px" ref="selectForm">-->
    <!--<el-form-item label="设备" prop="name">-->
    <!--<el-input v-model="selectForm.devId" auto-complete="off" :disabled="true"></el-input>-->
    <!--</el-form-item>-->
    <!--&nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;-->
    <!--<el-form-item label="姓名" prop="name">-->
    <!--<el-input v-model="selectForm.name" auto-complete="off" :disabled="true"></el-input>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="imsi" prop="imsi">-->
    <!--<el-input v-model="selectForm.imsi" auto-complete="off" :disabled="true"></el-input>-->
    <!--</el-form-item>-->
    <!--&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;-->
    <!--<el-form-item label="imei" prop="imei">-->
    <!--<el-input v-model="selectForm.imei" auto-complete="off" :disabled="true"></el-input>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="备注" prop="detail">-->
    <!--<el-input v-model="selectForm.detail" auto-complete="off" :disabled="true"></el-input>-->
    <!--</el-form-item>-->
    <!--</el-form>-->
    <!--<div slot="footer" class="dialog-footer">-->
    <!--<el-button @click="selectFormVisible = false">取消</el-button>-->
    <!--</div>-->
    <!--</el-dialog>-->
    <!--&lt;!&ndash;编辑界面&ndash;&gt;-->
    <!--<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">-->
    <!--<el-form :inline="true" :model="editForm" label-width="80px" :rules="addFormRules" ref="editForm">-->
    <!--<el-form-item label="姓名" prop="name">-->
    <!--<el-input v-model="editForm.name" auto-complete="off"></el-input>-->
    <!--</el-form-item>-->
    <!--&nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;-->
    <!--<el-form-item label="imsi" prop="imsi">-->
    <!--<el-input v-model="editForm.imsi" auto-complete="off"></el-input>-->
    <!--</el-form-item>-->
    <!--&nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;-->
    <!--<el-form-item label="imei" prop="imei">-->
    <!--<el-input v-model="editForm.imei" auto-complete="off"></el-input>-->
    <!--</el-form-item>-->
    <!--&nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;-->
    <!--<el-form-item label="备注" prop="detail">-->
    <!--<el-input v-model="editForm.detail" auto-complete="off"></el-input>-->
    <!--</el-form-item>-->
    <!--</el-form>-->
    <!--<div slot="footer" class="dialog-footer">-->
    <!--<el-button @click="editFormVisible = false">取消</el-button>-->
    <!--<el-button type="primary" @click="editSubmit" :loading="editLoading">提交</el-button>-->
    <!--</div>-->
    <!--</el-dialog>-->
  </section>
</template>
<style lang="scss">
  // 设置输入框的宽度
  .form01 {
    .el-form-item__content {
      width: 220px;

      .el-select {
        width: 220px;
      }
    }
  }

  .el-checkbox-group .el-checkbox {
    margin-left: 0;
    padding-right: 30px;
  }

  .el-table--border, .el-table--group {
    border: none;
  }

  .el-table__header-wrapper th:nth-last-of-type(2) {
    border-right: none;
  }

  .el-table--border td:nth-last-of-type(1) {
    border-right: none;
  }

  .el-table--border::after, .el-table--group::after {
    width: 0;
  }

  .form02 {
    .el-form-item__content {
      width: 430px;

      .el-select {
        width: 430px;
      }
    }
  }

  .form03 {
    .el-form-item__content {
      width: 220px;

      .el-select {
        width: 220px;
      }
    }
  }

  .tip {
    width: 6px;
    height: 6px;
    background: red;
    border-radius: 50%;
    left: -8px;
  }

  .tips {
    background: #ffffff;
    width: 8px;
    height: 8px;
    left: -8px;
  }

</style>
<script>
  import cpmessage from "../../utils/api";

  export default {
    name: "searchinput",
    data() {
      return {
        //搜索区域参数
        tableDatas: [],
        filters: {
          id: "",
          user_id: '',
          devId: '',
          name: "",
          imsi: "",
          imei: "",
          detail: "",
          createTime: "",
          location: ""
        },
        activeName: '1',
        //table返回的数据
        tableData: [{}],
        //列表Loading加载
        listLoading: false,
        //批量选中data
        selectList: [],
        //分页
        currentPage: 1,
        pageSize: 7,
        //角色信息
        roleData: [],
        //新增界面是否显示
        addFormVisible: false,
        //添加按钮Loading加载
        addLoading: false,
        //输入框验证
        addFormRules: {
          name: [{required: true, message: "请输入姓名", trigger: "blur"}],
        },
        //新增界面数据
        addForm: {
          name: "",
          imsi: "",
          imei: "",
          detail: ""
        },
        //查看详细
        selectForm: {
          devId: '',
          name: "",
          imsi: "",
          imei: "",
          detail: "",
          createTime: null
        },
        //详细界面是否显示
        selectFormVisible: false,
        //编辑界面是否显示
        editFormVisible: false,
        //编辑按钮Loading加载
        editLoading: false,
        //编辑界面数据
        editForm: {
          name: "",
          imsi: "",
          imei: "",
          detail: ""
        },
        //结构树Loading
        treeLoading: false,
        total: 10
      };
    },
    methods: {
      Appendzero(obj) {
        if (obj < 10) return "0" + "" + obj;
        else return obj;
      },
      changeCollapse(activeNames) {
        if (!(typeof activeNames  === 'string')) {
          this.tableDatas = []
          let param = Object.assign({}, this.tableData[activeNames]);
          this.tableDatas.push(this.tableData[activeNames])
          if (this.tableData[activeNames].state == 0) {
            apis.cpmessageApi.setState(param).then((data) => {
              if (data.data.sucess) {
                this.$message({
                  type: "success",
                  message: "更新成功!"
                });
                let count = this.$store.getters.getCount;
                if(count != 0){
                  this.$store.commit("setCount", count-1);
                }
                this.tableDatas[0].state=1
              } else {
                this.$message({
                  message: '读取状态更新失败!',
                  type: 'error'
                })
              }
            }).catch(err => {
              this.$message({
                type: "error",
                message: "系统接口异常!"
              });
            });
          }
        }
      },
      dateFormats: function (row, column) {
        var t = new Date(row.createTime);//row 表示一行数据, updateTime 表示要格式化的字段名称
        return this.Appendzero(t.getFullYear()) + "-" + this.Appendzero((t.getMonth() + 1)) + "-" + this.Appendzero(t.getDate()) + " " + this.Appendzero(t.getHours()) + ":" + this.Appendzero(t.getMinutes()) + ":" + this.Appendzero(t.getSeconds());
      },
      dateFormat: function (createTime) {
        var t = new Date(createTime);//row 表示一行数据, updateTime 表示要格式化的字段名称
        return this.Appendzero(t.getFullYear()) + "-" + this.Appendzero((t.getMonth() + 1)) + "-" + this.Appendzero(t.getDate()) + " " + this.Appendzero(t.getHours()) + ":" + this.Appendzero(t.getMinutes()) + ":" + this.Appendzero(t.getSeconds());
      },
      //查看详细信息
      handleSelect: function (index, row) {
        this.selectFormVisible = true;
        this.selectForm = Object.assign({}, row);
      },
      //批量选中
      selectChange: function (val) {
        this.selectList = val;
      },
      /**
       * 批量删除
       */
      handleReadList: function () {
        this.$confirm("确认全部消息已读吗?", "提示", {
          type: "warning"
        }).then(() => {
          this.listLoading = true;
          apis.cpmessageApi.ReadCpmessage().then((data) => {
            this.listLoading = false;
            this.$message({
              message: "更新成功",
              type: "success"
            });
            this.selectList = [];
            this.$store.commit("setCount",0);
            this.getResult(this.currentPage);
          });
        }).catch(() => {
          this.$message({type: 'info', message: '已取消更新'});
        });
      },
      indexMethod(index) {
        return (this.currentPage - 1) * this.pageSize + index + 1;
      },
      /**
       * 删除
       */
      handleDelete(index, rowData) {
        var id = [];
        id.push(rowData.id);
        this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          apis.cpmessageApi.deleteCpmessage(id).then((data) => {
            if (data.data.sucess) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getResult(this.currentPage);
            } else {
              this.$message({
                message: '删除失败!',
                type: 'error'
              })
            }
          }).catch(err => {
            this.$message({
              type: "error",
              message: "系统接口异常!"
            });
          });
        }).catch(() => {
          this.$message({type: 'info', message: '已取消删除'});
        });
      },
      /**
       *刷新
       */
      getResult: function () {
        var _this = this;
        // this.listLoading = true;
        let param = Object.assign(
          {},
          {
            devId: this.filters.devId,
            currentPage: this.currentPage,
            pageSize: this.pageSize,
            name: this.filters.name,
            imsi: this.filters.imsi,
            imei: this.filters.imei,
            detail: this.filters.detail,
          }
        );
        apis.cpmessageApi.getCpmessage(param).then((data) => {
          this.activeName='';
          this.tableData = data.data.pageResult.rows;
          this.total = data.data.pageResult.total;
          this.listLoading = false;
        })
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.getResult();
      },
    },
    mounted() {
      this.getResult();
    }
  };
</script>
