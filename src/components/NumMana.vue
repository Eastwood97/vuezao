<template>
  <div>
   
    <el-container>
      
      <el-header
        style="padding: 0px;display:flex;justify-content:space-between;align-items: center;background-color:white"
      >
        <div style="display: inline">
          <el-input
            placeholder="通过IMSI精准搜索,记得回车哦..."
            clearable
            @change="imsiChange"
            style="width: 300px;margin: 0px;padding: 0px;"
            size="mini"
            :disabled="advanceSearchViewVisible"
            @keyup.enter.native="searchNumber"
            prefix-icon="el-icon-search"
            v-model="number.imsi"
          ></el-input>
          <el-button
            type="primary"
            size="mini"
            style="margin-left: 5px"
            icon="el-icon-search"
            @click="searchNumber"
          >搜索</el-button>
          <el-button
            slot="reference"
            type="primary"
            size="mini"
            style="margin-left: 5px"
            @click="showAdvanceSearchView"
          >
            <i
              class="fa fa-lg"
              v-bind:class="[advanceSearchViewVisible ? faangledoubleup:faangledoubledown]"
              style="margin-right: 5px"
            ></i>高级搜索
          </el-button>

          <el-button type="success" size="mini" @click="exportNumbers">
            <i class="fa fa-lg fa-level-down" style="margin-right: 5px"></i>导出数据
          </el-button>
        </div>
      </el-header>
      <el-main style="padding-left: 0px;padding-top: 0px">
        <div>
          <transition name="slide-fade">
            <div
              style="margin-bottom: 10px;border: 1px;border-radius: 5px;border-style: solid;padding: 5px 0px 5px 0px;box-sizing:border-box;border-color: #20a0ff"
              v-show="advanceSearchViewVisible"
            >
              <el-row>
                <el-col :span="6">
                  号码性质:
                  <el-select
                    v-model="number.isTarget"
                    style="width: 130px"
                    size="mini"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in kind"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-col>
                <el-col :span="6">
                  电话号码:
                  <el-input
                    v-model="number.isdn"
                    style="width: 130px"
                    size="mini"
                    placeholder="请输入电话号码"
                  ></el-input>
                </el-col>
                <el-col :span="6">
                  归属地:
                  <el-input
                    v-model="number.area"
                    style="width: 130px"
                    size="mini"
                    placeholder="请输入归属地"
                  ></el-input>
                </el-col>
              </el-row>
              <el-row style="margin-top: 10px">
                <el-col :span="6">
                  抓取区域:
                  <el-input
                    v-model="number.catchArea"
                    style="width: 130px"
                    size="mini"
                    placeholder="请输入小区"
                  ></el-input>
                </el-col>
                <el-col :span="6">
                  案件名:
                  <el-input
                    v-model="number.caseName"
                    style="width: 130px"
                    size="mini"
                    placeholder="请输入案件名"
                  ></el-input>
                </el-col>

                <el-col :span="6">
                  IMEI:
                  <el-input
                    v-model="number.imei"
                    style="width: 130px"
                    size="mini"
                    placeholder="请输入imei号"
                  ></el-input>
                </el-col>

                <el-col :span="6" :offset="0">
                  <el-button size="mini" @click="cancelSearch">取消</el-button>
                  <el-button
                    icon="el-icon-search"
                    type="primary"
                    size="mini"
                    @click="searchNumber"
                  >搜索</el-button>
                </el-col>
              </el-row>
            </div>
          </transition>
          <el-table
            :data="numbers"
            v-loading="tableLoading"
            border
            stripe
            @selection-change="handleSelectionChange"
            size="mini"
            style="width: 100%"
            max-height="700"
          >
            <el-table-column type="selection" align="left" width="30"></el-table-column>
            <el-table-column prop="id" align="left" fixed label="id" width="70"></el-table-column>
            <el-table-column prop="plmn" align="left" label="PLMN" width="70"></el-table-column>

            <el-table-column prop="imsi" label="IMSI" width="145"></el-table-column>
            <el-table-column prop="imei" width="145" align="left" label="IMEI"></el-table-column>
            <el-table-column prop="isdn" width="145" align="left" label="电话号码"></el-table-column>
            <el-table-column width="80" align="left" label="号码性质">
              <template slot-scope="scope">
                <span v-if="scope.row.isTarget == 1">目标号</span>
                <span v-else>普通号</span>
              </template>
            </el-table-column>
            <el-table-column prop="area" width="75" label="归属地"></el-table-column>
            <el-table-column width="95" prop="lat" label="LAT"></el-table-column>
            <el-table-column prop="lng" width="95" label="LNG"></el-table-column>
            <el-table-column width="125" align="left" label="捕获时间">
              <template slot-scope="scope">{{ scope.row.catchTime | formatDateTime}}</template>
            </el-table-column>
            <el-table-column prop="catchArea" width="125" label="捕获地"></el-table-column>
            <el-table-column prop="desc" width="100" label="描述"></el-table-column>
            <el-table-column prop="recordName" width="100" label="记录名"></el-table-column>
            <el-table-column prop="caseName" width="100" label="案件名"></el-table-column>
            <el-table-column prop="frtDevId" width="100" label="前端设备ID"></el-table-column>
            <el-table-column fixed="right" align="center" label="操作" width="135">
              <template slot-scope="scope">
                <el-button
                  type="danger"
                  style="padding: 3px 4px 3px 4px;margin: 2px"
                  size="mini"
                  @click="deleteNumber(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="display: flex;justify-content: space-between;margin: 2px">
            <el-button
              type="danger"
              size="mini"
              v-if="numbers.length>0"
              :disabled="multipleSelection.length==0"
              @click="deleteManyNumbers"
            >批量删除</el-button>
            <el-pagination
              background
              :page-size="10"
              :current-page="currentPage"
              @current-change="currentChange"
              layout="prev, pager, next"
              :total="totalCount"
            ></el-pagination>
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      numbers: [],
      faangledoubleup: "fa-angle-double-up", //向上的小箭头
      faangledoubledown: "fa-angle-double-down", //向下的小箭头
      //dialogTitle: '',                             //对话框标题
      //dialogVisible: false,               //对话框是否出现
      multipleSelection: [],
      kind: [{ id: 1, name: "目标号" }, { id: 0, name: "普通号" }],
      totalCount: -1,
      currentPage: 1,

      tableLoading: false, //表格加载
      advanceSearchViewVisible: false, //高级搜索是否出现
      //dialogTitle: '',                             //对话框标题
      //dialogVisible: false,               //对话框是否出现
      number: {
        imsi: "",
        mode: "", //制式
        area: "", //归属地
        plmn: "", //运营商
        imei: "",
        esn: "",
        isdn: "",
        catchTime: "",
        catchArea: "",
        lat: "",
        lng: "",
        isTarget: "",
        caseName: ""
      },
      rules: {}
    };
  },
  mounted: function() {
    this.loadNumbers();
  },
  //即时搜索
  watch: {},
  methods: {
    //取消搜索
    cancelSearch() {
      this.advanceSearchViewVisible = false;
      this.emptyNumberData();
      this.beginDateScope = "";
      this.loadNumbers();
    },
    //展示高级搜索窗口
    showAdvanceSearchView() {
      this.advanceSearchViewVisible = !this.advanceSearchViewVisible;
      this.emptyNumberData();
      if (!this.advanceSearchViewVisible) {
        this.emptyNumberData();
        this.loadNumbers();
      }
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //批量删除
    deleteManyNumbers() {
      this.$confirm(
        "此操作将删除[" + this.multipleSelection.length + "]条数据, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          var ids = "";
          for (var i = 0; i < this.multipleSelection.length; i++) {
            ids += this.multipleSelection[i].id + ",";
          }
          this.doDelete(ids);
        })
        .catch(() => {});
    },
    //删除提示框
    deleteNumber(row) {
      this.$confirm("此操作将永久删除[" + row.isdn + "], 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.doDelete(row.id);
        })
        .catch(() => {});
    },
    //执行删除
    doDelete(ids) {
      this.tableLoading = true;
      var _this = this;
      this.deleteRequest("/basicdata/number/" + ids).then(resp => {
        _this.tableLoading = false;
        if (resp && resp.status == 200) {
          var data = resp.data;
          _this.$message({ type: data.status, message: data.msg });
          _this.loadNumbers();
        }
      });
    },
    imsiChange(val) {
      if (val == "") {
        this.loadNumbers();
      }
    },
    //搜索
    searchNumber() {
      this.loadNumbers();
    },
    currentChange(currentChange) {
      this.currentPage = currentChange;
      this.loadNumbers();
    },
    //加载取号信息
    loadNumbers() {
      var _this = this;
      this.tableLoading = true;
      this.getRequest(
        "/basicdata/number?page=" +
          this.currentPage +
          "&size=10&imsi=" +
          this.number.imsi +
          "&isTarget=" +
          this.number.isTarget +
          "&isdn=" +
          this.number.isdn +
          "&area=" +
          this.number.area +
          "&catchArea=" +
          this.number.catchArea +
          "&caseName=" +
          this.number.caseName +
          "&imei=" +
          this.number.imei
      ).then(resp => {
        this.tableLoading = false;
        if (resp && resp.status == 200) {
          var data = resp.data;
          _this.numbers = data.numbers;
          _this.totalCount = data.count;
          //    _this.emptyNumberData();
        } else if (resp && resp.status == 504) {
        }
      });
    },
    exportNumbers() {
      window.open("/basicdata/number/exportNumber", "_parent");
    },

    //清空参数
    emptyNumberData() {
      this.number = {
        imsi: "",
        mode: "", //制式
        area: "", //归属地
        plmn: "", //运营商
        imei: "",
        isdn: "",
        catchTime: "",
        catchArea: "",
        caseName: "",
        lat: "",
        lng: "",
        isTarget: ""
      };
    }
  }
};
</script>
<style>
body, html, .el-container {
        width: 100%;
        height: 100%;
        overflow: hidden;
        margin: 0;
    }
.el-dialog__body {
  padding-top: 0px;
  padding-bottom: 0px;
}

.slide-fade-enter-active {
  transition: all 0.8s ease;
}

.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
