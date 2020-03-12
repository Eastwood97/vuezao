<template>
  <div>
    <el-container>
            <div>
    <!-- 注意需要给 el-scrollbar 设置高度，判断是否滚动是看它的height判断的 -->
    <el-scrollbar style="height: 100%;"> <!-- 滚动条 -->
    </el-scrollbar><!-- /滚动条 -->
</div>
      <el-header
        style="padding: 0px;display:flex;justify-content:space-between;align-items: center;background-color:white"
      >
        <div style="display: inline">
          <el-input
            placeholder="输入电话号码查询"
            clearable
            @change="keywordsChange"
            style="width: 300px;margin: 0px;padding: 0px;"
            size="mini"
            :disabled="advanceSearchViewVisible"
            @keyup.enter.native="searchtarget"
            prefix-icon="el-icon-search"
            v-model="target.isdn"
          ></el-input>

          <el-button
            type="primary"
            size="mini"
            style="margin-left: 5px"
            icon="el-icon-search"
            @click="searchtarget"
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

          <el-button type="success" size="mini" @click="exportTargets">
            <i class="fa fa-lg fa-level-down" style="margin-right: 5px"></i>导出数据
          </el-button>

          <el-button type="success" size="mini" @click="dialogFormVisible=true">
            <i class="fa fa-lg fa-level-up" style="margin-right: 5px"></i>批量导入
          </el-button>
        </div>
        <el-button
          type="primary"
          size="mini"
          style="margin-left: 5px;margin-right: 20px"
          icon="el-icon-plus"
          @click="showAddView"
        >添加布控目标</el-button>
      </el-header>
      <el-main style="padding-left: 0px;padding-top: 0px">
        <div>
          <transition name="slide-fade">
            <div
              style="margin-bottom: 10px;border: 1px;border-radius: 5px;border-style: solid;padding: 5px 0px 5px 0px;box-sizing:border-box;border-color: #20a0ff"
              v-show="advanceSearchViewVisible"
            >
              <el-row>
                <el-col :span="5">
                  IMSI:
                  <el-input
                    v-model="target.imsi"
                    style="width: 130px"
                    size="mini"
                    placeholder="请输入IMSI"
                  ></el-input>
                </el-col>
                <el-col :span="5">
                  IMEI:
                  <el-input
                    v-model="target.imei"
                    style="width: 130px"
                    size="mini"
                    placeholder="请输入IMEI"
                  ></el-input>
                </el-col>

                <el-col :span="5">
                  目标名称:
                  <el-input
                    v-model="target.name"
                    style="width: 130px"
                    size="mini"
                    placeholder="请输入名称"
                  ></el-input>
                </el-col>
                <el-col :span="5">
                  案件名:
                  <el-input
                    v-model="target.caseName"
                    style="width: 130px"
                    size="mini"
                    placeholder="请输入案件名"
                  ></el-input>
                </el-col>

                <el-col :span="4" :offset="0">
                  <el-button size="mini" @click="cancelSearch">取消</el-button>
                  <el-button
                    icon="el-icon-search"
                    type="primary"
                    size="mini"
                    @click="searchtarget"
                  >搜索</el-button>
                </el-col>
              </el-row>
            </div>
          </transition>
          <el-table
            :data="targets"
            v-loading="tableLoading"
            border
            stripe
            @selection-change="handleSelectionChange"
            size="mini"
            style="width: 100%"
            max-height="700"
          >
            <el-table-column type="selection" align="left" width="30"></el-table-column>
            <el-table-column prop="id" align="left" fixed label="ID" width="50"></el-table-column>
            <el-table-column prop="imsi" width="125" align="left" label="IMSI"></el-table-column>
            <el-table-column prop="imei" label="IMEI" width="125"></el-table-column>

            <el-table-column prop="isdn" label="ISDN" width="110"></el-table-column>

            <el-table-column prop="name" width="120" align="left" label="NAME"></el-table-column>
            <el-table-column prop="caseName" label="案件名" width="150"></el-table-column>
            <el-table-column prop="from" label="目标来源" width="100"></el-table-column>
            <el-table-column prop="desc" label="描述" width="130"></el-table-column>
            <el-table-column fixed="right" label="操作" width="150" align="center">
              <template slot-scope="scope">
                <el-button
                  @click="showEditView(scope.row)"
                  style="padding: 3px 4px 3px 4px;margin: 2px"
                  size="mini"
                >编辑</el-button>

                <el-button
                  type="danger"
                  style="padding: 3px 4px 3px 4px;margin: 2px"
                  size="mini"
                  @click="deleteList(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="display: flex;justify-content: space-between;margin: 2px">
            <el-button
              type="danger"
              size="mini"
              v-if="targets.length>0"
              :disabled="multipleSelection.length==0"
              @click="deleteManyLists"
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
    <el-form :model="target" :rules="rules" ref="paper" style="margin: 0px;padding: 0px;">
      <div style="text-align: left">
        <el-dialog
          :show-close="false"
          :title="dialogTitle"
          style="padding: 0px;"
          :close-on-click-modal="false"
          :visible.sync="dialogVisible"
          width="77%"
        >
          <el-row>
            <el-col :span="6">
              <div>
                <el-form-item label="IMSI:" prop="imsi">
                  <el-input
                    prefix-icon="el-icon-edit"
                    v-model="target.imsi"
                    size="mini"
                    style="width: 150px"
                    placeholder="请输入IMSI"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>

            <el-col :span="6">
              <div>
                <el-form-item label="IMEI:" prop="imei">
                  <el-input
                    prefix-icon="el-icon-edit"
                    v-model="target.imei"
                    size="mini"
                    style="width: 150px"
                    placeholder="请输入IMEI"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>

            <el-col :span="6">
              <div>
                <el-form-item label="电话号码:" prop="isdn">
                  <el-input
                    prefix-icon="el-icon-message"
                    v-model="target.isdn"
                    size="mini"
                    style="width: 150px"
                    placeholder="电话号码..."
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <div>
                <el-form-item label="名称:" prop="name">
                  <el-input
                    prefix-icon="el-icon-message"
                    v-model="target.name"
                    size="mini"
                    style="width: 150px"
                    placeholder="目标名称..."
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>

            <el-col :span="6">
              <div>
                <el-form-item label="案件名称:" prop="caseName">
                  <el-input
                    prefix-icon="el-icon-message"
                    v-model="target.caseName"
                    size="mini"
                    style="width: 150px"
                    placeholder="案件名称"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>

            <el-col :span="6">
              <div>
                <el-form-item label="描述:" prop="desc">
                  <el-input
                    prefix-icon="el-icon-message"
                    v-model="target.desc"
                    size="mini"
                    style="width: 150px"
                    placeholder="描述"
                  ></el-input>
                </el-form-item>
              </div>
            </el-col>
          </el-row>

          <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click="cancelEidt">取 消</el-button>
            <el-button size="mini" type="primary" @click="addTarget('addTargetForm')">确 定</el-button>
          </span>
        </el-dialog>
            <!--导入界面-->
    <el-dialog title="导入excel表格" :visible.sync="dialogFormVisible" width="30%" v-loading="listLoading"
               element-loading-text="上传中....." :before-close="dialogFormVisibles" :destroy-on-close="true">
      <el-form :model="form">
        <el-form-item style="text-align: center">
          <el-upload
            ref="upload"
            class="upload-demo"
            :limit="1"
            :on-error="onError"
            action="/basicdata/upload"
            :on-change="fileChange"
            :on-success="handleImageSuccess"
            :on-exceed="exceed"
            :auto-upload="false"
            :on-remove="onRemove"
            :before-upload="beforeUpload"
            :show-file-list="false"
            :file-list="file"
            :on-progress="processLoading"
          >
            <i class="el-icon-upload"/>
            <div class="el-upload__text">
              <em>点击上传</em>
            </div>
            <!--<div class="el-upload__tip" slot="tip">只能上传xls/xlsx文件，且不超过200M</div>-->
          </el-upload>
        </el-form-item>
        <ul class="el-upload-list el-upload-list--text" style="background: #F6F7FB">
          <li tabindex="0" class="el-upload-list__item is-ready div-1">
            <a class="el-upload-list__item-name " v-for="index in files">
              文件名：
              <i class="el-icon-document">
              </i>
              {{index.name}}
            </a>
            <label class="el-upload-list__item-status-label">
              <i class="el-icon-upload-success el-icon-circle-check"></i>
            </label>
            <i class="el-icon-close" @click="removeFiles" v-if="files.length>0"></i>
          </li>
        </ul>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibles">取 消</el-button>
        <el-button type="primary" @click="upload" plain :disabled="!files.length>0">确 定</el-button>
      </div>
    </el-dialog>
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
       peopleid:'',
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
      //文件上传完展示
      listLoading:false,
      dialogFormVisible: false,
      files: [], //要上传的文件对象
      targets: [],
       file:[],
      faangledoubleup: "fa-angle-double-up",
      faangledoubledown: "fa-angle-double-down",
      dialogTitle: "",
      multipleSelection: [],
      depTextColor: "#c0c4cc",
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
      target: {
        imsi: "",
        imei: "",
        isdn: "",
        name: "",
        from: "pc",
        caseName: "",
        desc: ""
      },
      rules: {
        isdn: [
          {
            pattern: /^[1]([3-9])[0-9]{9}$/,
            message: "号码格式不正确",
            trigger: "blur"
          }
        ]
      }
    };
  },
  mounted: function() {
    this.loadtargets();
  },

  methods: {

       processLoading(event, file, fileList){

      },
       dialogFormVisibles(){
        this.onRemove()
        this.dialogFormVisible=false
      },
      onError(){
        this.listLoading = false;
        this.$notify({
          title: '错误',
          message: '文件上传失败！',
          type: 'error'
        });
        this.$refs.upload.clearFiles();
        this.files=[]
      },
      onRemove(){
        this.$refs.upload.clearFiles();
        this.files=[]

      },
      removeFiles(){
        this.onRemove()
      },
      fileChange(file,fileList) {
        if(fileList.length>0){
          this.process=fileList[0].progress
          this.files.push(fileList[0].raw)
        }
      },
      upload() {
        this.listLoading = true;
        let formData = new FormData();
        formData.append('file', this.files);
        this.$refs.upload.submit()
      },
      beforeUpload(file) {
        this.process=null
        var testmsg = file.name.substring(file.name.lastIndexOf('.') + 1)
        const extension = testmsg === 'xls'
        const extension2 = testmsg === 'xlsx'
        const isLt2M = file.size / 1024 / 1024 < 100
        if (!extension && !extension2) {
          this.$message({
            message: '上传文件只能是 xls、xlsx格式!',
            type: 'warning'
          });
          this.listLoading = false;
        }
        if (!isLt2M) {
          this.$message({
            message: '上传文件大小不能超过 100MB!',
            type: 'warning'
          });
          this.listLoading = false;
        }
        return extension || extension2 && isLt2M

      },
      exceed() {
        this.$notify({
          title: '错误',
          message: '最多只能上传一个文件！',
          type: 'error'
        });

      },
      handleImageSuccess(response, file, fileList) {
         this.onRemove()
        this.dialogFormVisible=false
        this.listLoading = false;
       if(response.status=="success"){
          this.$notify({
          title: '成功',
          message: '文件上传成功！',
          type: 'success'
        });
       }else if(response.status==501){
           this.$notify({
          title: '失败',
          message: 'imsi,imei,isdn不能都为空',
          type: 'error'
        });
       }
       else{
            this.$notify({
          title: '失败',
          message: '文件上传失败！',
          type: 'error'
        });
       }
        this.loadtargets();
      },










    
    cancelSearch() {
      this.advanceSearchViewVisible = false;
      this.emptyListData();
      this.beginDateScope = "";
      this.loadtargets();
    },

    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deleteManyLists() {
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
    deleteList(row) {
      this.$confirm("此操作将永久删除[" + row.name + "], 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.doDelete(row.id);
        })
        .catch(() => {});
    },
    doDelete(ids) {
      this.tableLoading = true;
      var _this = this;
      this.deleteRequest("/basicdata/target/" + ids).then(resp => {
        _this.tableLoading = false;
        if (resp && resp.status == 200) {
          var data = resp.data;
          _this.$message({ type: data.status, message: data.msg });
          _this.loadtargets();
        }
      });
    },
    keywordsChange(val) {
      if (val == "") {
        this.loadtargets();
      }
    },
    searchtarget() {
      this.loadtargets();
    },
    currentChange(currentChange) {
      this.currentPage = currentChange;
      this.loadtargets();
    },
    loadtargets() {
      var _this = this;
      this.tableLoading = true;
      this.getRequest(
        "/basicdata/target?page=" +
          this.currentPage +
          "&size=10&isdn=" +
          this.target.isdn +
          "&name=" +
          this.target.name +
          "&imsi=" +
          this.target.imsi +
          "&imei=" +
          this.target.imei +
          "&caseName=" +
          this.target.caseName
      ).then(resp => {
        this.tableLoading = false;
        if (resp && resp.status == 200) {
          var data = resp.data;
          _this.targets = data.targets;
          _this.totalCount = data.count;
          //            _this.emptyListData();
        }
      });
    },
    addTarget(formName) {
      var _this = this;
      this.$refs.paper.validate(valid => {
        if (valid) {
          if (this.target.id) {
            //更新
            this.tableLoading = true;
            if (
              this.target.imsi == "" &&
              this.target.imei == "" &&
              this.target.isdn == ""
            ) {
              alert("IMEI,IMEI,ISDN不能都为空");
              this.tableLoading = false;
              return;
            }
            this.putRequest("/basicdata/target", this.target).then(resp => {
              _this.tableLoading = false;
              if (resp && resp.status == 200) {
                var data = resp.data;
                _this.$message({ type: data.status, message: data.msg });
                _this.dialogVisible = false;
                _this.emptyListData();
                _this.loadtargets();
              }
            });
          } else {
            //添加
            this.tableLoading = true;
            if (
              this.target.imsi == "" &&
              this.target.imei == "" &&
              this.target.isdn == ""
            ) {
              alert("IMEI,IMEI,ISDN不能都为空");
              this.tableLoading = false;
              return;
            }
            this.postRequest("/basicdata/target", this.target).then(resp => {
              _this.tableLoading = false;
              if (resp && resp.status == 200) {
                var data = resp.data;
                _this.$message({ type: data.status, message: data.msg });
                _this.dialogVisible = false;
                _this.emptyListData();
                _this.loadtargets();
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    cancelEidt() {
      this.$refs.paper.clearValidate();
      this.$refs.paper.resetFields();
      this.dialogVisible = false;
      this.emptyListData();
    },

    //展示高级搜索窗口
    showAdvanceSearchView() {
      this.advanceSearchViewVisible = !this.advanceSearchViewVisible;
      this.emptyListData();
      if (!this.advanceSearchViewVisible) {
        this.emptyListData();
        this.loadtargets();
      }
    },

    showEditView(row) {
      this.dialogTitle = "编辑黑名单";
      this.target = row;
      this.target.imsi = row.imsi;
      this.target.imei = row.imei;
      this.target.isdn = row.isdn;
      this.target.name = row.name;

      this.dialogVisible = true;
    },
    showAddView() {
      this.dialogTitle = "添加黑名单";
      this.dialogVisible = true;
      var _this = this;
      // this.getRequest("/basicdata/target").then(resp=> {
      //   if (resp && resp.status == 200) {
      //        var data = resp.data;
      //     _this.$message({type: data.status, message: data.msg});
      //   }
      // })
    },

    exportTargets() {
      window.open("/basicdata/target/exportTarget", "_parent");
    },

    emptyListData() {
      this.target = {
        imsi: "",
        imei: "",
        isdn: "",
        name: "",
        caseName: "",
        from: "PC",
        desc: ""
      };
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
