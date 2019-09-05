<template>
  <div>
    <el-container>
      <el-header style="padding: 0px;display:flex;justify-content:space-between;align-items: center;background-color:white">
        <div style="display: inline">
          <el-input
            placeholder="输入电话号码查询"
            clearable
            @change="keywordsChange"
            style="width: 300px;margin: 0px;padding: 0px;"
            size="mini"
            :disabled="advanceSearchViewVisible"
            @keyup.enter.native="searchBlackList"
            prefix-icon="el-icon-search"
            v-model="blackList.isdn">
          </el-input>
           <el-input
            placeholder="输入标签查询"
            clearable
            @change="keywordsChange"
            style="width: 300px;margin: 0px;padding: 0px;"
            size="mini"
            :disabled="advanceSearchViewVisible"
            @keyup.enter.native="searchBlackList"
            prefix-icon="el-icon-search"
            v-model="blackList.tag">
          </el-input>
          <el-button type="primary" size="mini" style="margin-left: 5px" icon="el-icon-search" @click="searchBlackList">搜索
          </el-button>
        
        </div>
        <el-button type="primary" size="mini" style="margin-left: 5px;margin-right: 20px" icon="el-icon-plus"
                   @click="showAddView">
          添加黑名单
        </el-button>
      </el-header>
      <el-main style="padding-left: 0px;padding-top: 0px">
        <div>
        
          <el-table
            :data="blackLists"
            v-loading="tableLoading"
            border
            stripe
            @selection-change="handleSelectionChange"
            size="mini"
            style="width: 100%">
            <el-table-column
              type="selection"
              align="left"
              width="30">
            </el-table-column>
            <el-table-column
              prop="id"
              align="left"
              fixed
              label="ID"
              width="105">
            </el-table-column>
            <el-table-column
              prop="imsi"
              width="180"
              align="left"
              label="IMSI">
            </el-table-column>
            <el-table-column
              prop="imei"
              label="IMEI"
              width="180">
            </el-table-column>

            <el-table-column
              prop="isdn"
              label="ISDN"
              width="190">
            </el-table-column>
          
            <el-table-column
              prop="tag"
              width="220"
              align="left"
              label="TAG">
            </el-table-column>

         
            <el-table-column
              fixed="right"
              label="操作"
              width="200">
              <template slot-scope="scope">
                <el-button @click="showEditView(scope.row)" style="padding: 3px 4px 3px 4px;margin: 2px"
                           size="mini">编辑
                </el-button>
            
                <el-button type="danger" style="padding: 3px 4px 3px 4px;margin: 2px" size="mini"
                           @click="deleteList(scope.row)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="display: flex;justify-content: space-between;margin: 2px">
            <el-button type="danger" size="mini" v-if="blackLists.length>0" :disabled="multipleSelection.length==0"
                       @click="deleteManyLists">批量删除
            </el-button>
            <el-pagination
              background
              :page-size="10"
              :current-page="currentPage"
              @current-change="currentChange"
              layout="prev, pager, next"
              :total="totalCount">
            </el-pagination>
          </div>
        </div>
      </el-main>
    </el-container>
    <el-form :model="blackList" :rules="rules" ref="paper" style="margin: 0px;padding: 0px;">
      <div style="text-align: left">
        <el-dialog
          :show-close="false"
          :title="dialogTitle"
          style="padding: 0px;"
          :close-on-click-modal="false"
          :visible.sync="dialogVisible"
          width="77%">
          <el-row>
            <el-col :span="6">
              <div>
                <el-form-item label="IMSI:" prop="imsi">
                  <el-input prefix-icon="el-icon-edit" v-model="blackList.imsi" size="mini" style="width: 150px"
                            placeholder="请输入IMSI"></el-input>
                </el-form-item>
              </div>
            </el-col>

             <el-col :span="6">
              <div>
                <el-form-item label="IMEI:" prop="imei">
                  <el-input prefix-icon="el-icon-edit" v-model="blackList.imei" size="mini" style="width: 150px"
                            placeholder="请输入IMEI"></el-input>
                </el-form-item>
              </div>
            </el-col>

          

         
       
             <el-col :span="6">
              <div>
                <el-form-item label="电话号码:" prop="isdn">
                  <el-input prefix-icon="el-icon-message" v-model="blackList.isdn" size="mini" style="width: 150px"
                            placeholder="电话号码..."></el-input>
                </el-form-item>
              </div>
             </el-col>
            
            
              <el-col :span="6">
              <div>
                <el-form-item label="标签:" prop="tag">
                  <el-input prefix-icon="el-icon-message" v-model="blackList.tag" size="mini" style="width: 150px"
                            placeholder="标签..."></el-input>
                </el-form-item>
              </div>
             </el-col>

         </el-row>
         
          <span slot="footer" class="dialog-footer">
    <el-button size="mini" @click="cancelEidt">取 消</el-button>
    <el-button size="mini" type="primary" @click="addList('addListForm')">确 定</el-button>
  </span>
        </el-dialog>
      </div>
    </el-form>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        blackLists: [],
        faangledoubleup: 'fa-angle-double-up',
        faangledoubledown: 'fa-angle-double-down',
        dialogTitle: '',
        multipleSelection: [],
        depTextColor: '#c0c4cc',
        nations: [],
        politics: [],
        positions: [],
        joblevels: [],
        totalCount: -1,
        currentPage: 1,
      
        dialogVisible: false,
        tableLoading: false,
        advanceSearchViewVisible: false,
        showOrHidePop: false,
        blackList: {
          id: '',
          imsi: '',
          imei: '',
          isdn: '',
          tag:'',
        },
        rules: {
          imsi: [{required: true, message: '必填:imsi', trigger: 'blur'}],
          imei: [{required: true, message: '必填:imei', trigger: 'blur'}],
          isdn: [{required: true, message: '必填:电话号码', trigger: 'blur'}, {
            pattern:/^[1]([3-9])[0-9]{9}$/,
            message: '号码格式不正确',
            trigger: 'blur'
          }],
        }
      };
    },
    mounted: function () {
      this.loadBlackLists();
    },
   
    methods: {
      cancelSearch(){
        this.advanceSearchViewVisible = false;
        this.emptyListData();
        this.beginDateScope = '';
        this.loadBlackLists();
      },
   
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      deleteManyLists(){
        this.$confirm('此操作将删除[' + this.multipleSelection.length + ']条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          var ids = '';
          for (var i = 0; i < this.multipleSelection.length; i++) {
            ids += this.multipleSelection[i].id + ",";
          }
          this.doDelete(ids);
        }).catch(() => {
        });
      },
      deleteList(row){
        this.$confirm('此操作将永久删除[' + row.tag+ '], 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.doDelete(row.id);
        }).catch(() => {
        });
      },
      doDelete(ids){
        this.tableLoading = true;
        var _this = this;
        this.deleteRequest("/dataQuery/blackList/" + ids).then(resp=> {
          _this.tableLoading = false;
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.$message({type: data.status, message: data.msg});
            _this.loadBlackLists();
          }
        })
      },
      keywordsChange(val){
        if (val == '') {
          this.loadBlackLists();
        }
      },
      searchBlackList(){
        this.loadBlackLists();
      },
      currentChange(currentChange){
        this.currentPage = currentChange;
        this.loadBlackLists();
      },
      loadBlackLists(){
        var _this = this;
        this.tableLoading = true;
        this.getRequest("/dataQuery/blackList?page=" + this.currentPage + "&size=10&isdn=" + this.blackList.isdn + "&tag=" + this.blackList.tag ).then(resp=> {
          this.tableLoading = false;
          if (resp && resp.status == 200) {
            var data = resp.data;
            _this.blackLists = data.blackLists;
            _this.totalCount = data.count;
//            _this.emptyListData();
          }
        })
      },
      addList(formName){
        var _this = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (this.blackList.id) {
              //更新
              this.tableLoading = true;
              this.putRequest("/dataQuery/blackList", this.blackList).then(resp=> {
                _this.tableLoading = false;
                if (resp && resp.status == 200) {
                  var data = resp.data;
                  _this.$message({type: data.status, message: data.msg});
                  _this.dialogVisible = false;
                  _this.loadBlackLists();
                  _this.emptyListData();
                }
              })
            } else {
              //添加
              this.tableLoading = true;
              this.postRequest("/dataQuery/blackList", this.blackList).then(resp=> {
                _this.tableLoading = false;
                if (resp && resp.status == 200) {
                  var data = resp.data;
                  _this.$message({type: data.status, message: data.msg});
                  _this.dialogVisible = false;
                  _this.emptyListData();
                  _this.loadBlackLists();
                }
              })
            }
          } else {
            return false;
          }
        });
      },
      cancelEidt(){
        this.$refs.paper.clearValidate();
        this.$refs.paper.resetFields();
        this.dialogVisible = false;
        this.emptyListData();
      },
    
   
    
      showEditView(row){
        this.dialogTitle = "编辑黑名单";
        this.blackList = row;
        this.blackList.imsi = row.imsi;
        this.blackList.imei=row.imei;
        this.blackList.isdn=row.isdn;
        this.blackList.tag=row.tag

        this.dialogVisible = true;
      },
      showAddView(){
        this.dialogTitle = "添加黑名单";
        this.dialogVisible = true;
        var _this = this;
        // this.getRequest("/dataQuery/blackList").then(resp=> {
        //   if (resp && resp.status == 200) {
        //        var data = resp.data;
        //     _this.$message({type: data.status, message: data.msg});
        //   }
        // })
      },
      emptyListData(){
        this.blackList = {
          id: '',
          imsi: '',
          imei: '',
          isdn: '',
          tag:'',
        }
      }
    }
  };
</script>
<style>
  .el-dialog__body {
    padding-top: 0px;
    padding-bottom: 0px;
  }

  .slide-fade-enter-active {
    transition: all .8s ease;
  }

  .slide-fade-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }

  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateX(10px);
    opacity: 0;
  }
</style>
