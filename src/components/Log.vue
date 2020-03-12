<template>
  <el-container>
  
    <el-header class="cate_mana_header">
      <el-input
        placeholder="按用户名查询"
        v-model="username"
        style="width: 250px;margin: 0px;padding: 0px;"
        size="small"
        prefix-icon="el-icon-search"
        clearable>
      </el-input>
      &nbsp;&nbsp;
    
      <el-button type="primary" size="small" style="margin-left: 10px" @click="searchSysLog">搜索</el-button>
    </el-header>
    <el-main class="cate_mana_main">
      <el-table
        ref="multipleTable"
        :data="SysLogAll"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55" align="left">
        </el-table-column>
        <el-table-column
          label="编号"
          prop="id"
          width="120" align="left">
        </el-table-column>
        <el-table-column
          label="用户名"
          prop="username"
          width="120" align="left">
        </el-table-column>
        <el-table-column
          label="操作名称"
          prop="operation"
          width="120" align="left">
        </el-table-column>
        <el-table-column
          label="参数"
          prop="params"
          width="350" align="left">
        </el-table-column>
        <el-table-column
          prop="createDate"
          label="时间" align="left">
          <template slot-scope="scopeDate">{{ scopeDate.row.createDate | formatDate}}</template>
        </el-table-column>
        <el-table-column
          label="ip"
          prop="ip"
          width="120" align="left">
        </el-table-column>
        <el-table-column label="操作" align="left">
          <template slot-scope="scopeIndex">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scopeIndex.$index, scopeIndex.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex;justify-content: space-between;margin: 2px">
        <el-button size="mini" type="danger" style="margin-top: 0px;width: 100px;"
                   @click="deleteAll" v-if="selItems.length>0">批量删除
        </el-button>
        <el-pagination class="fy"
                       @current-change="current_change"
                       :current-page="currentPage"
                       :page-size="pageSize"
                       layout="total, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
      </div>
    </el-main>
  </el-container>
</template>
<script>
    import axios from 'axios'
    export default {
        data() {
            return {
                username: '',
                createDate: '',
                total: 1000,//默认数据总数
                pageSize: 10,//每页的数据条数
                currentPage: 1,//默认开始页面
                selItems: [],
                loading: false,
                SysLogAll: []
            }
        },
        methods: {
            searchSysLog() {
                let __this = this;
                __this.findByPage(__this.currentPage, __this.pageSize);
            },
            current_change: function (currentPage) {
                let __this = this;
                __this.findByPage(currentPage, __this.pageSize);
            },
            deleteAll() {
                let __this = this;
                let ids ="";
                __this.$confirm('确认删除这 ' + __this.selItems.length + ' 条数据?', '提示', {
                    type: 'warning',
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(() => {
                    let selItemsAll = __this.selItems;
                    for (var i = 0; i < selItemsAll.length; i++) {
                      ids += selItemsAll[i].id + ",";
                    }
                    __this.deleteCate(ids);
                }).catch(() => {
                    //取消
                    __this.loading = false;
                });
            },
            handleSelectionChange(val) {
                let __this = this;
                __this.selItems = val;
            },
            handleDelete(index, row) {
                let __this = this;
                __this.$confirm('确认删除该内容？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    __this.deleteCate(row.id);
                }).catch(() => {
                    //取消
                    __this.loading = false;
                });
            },
            deleteCate(ids) {
                let __this = this;
                __this.loading = true;
                //删除
                axios.delete("/log/delete/"+ids).then(resp => {
                    let json = resp.data;
                    __this.$message({
                        showClose: true,
                        type: json.type,
                        message: json.message
                    });
                    __this.searchSysLog();
                }, resp => {
                    __this.loading = false;
                    if (resp.response.status == 403) {
                        __this.$message({
                            showClose: true,
                            type: resp.type,
                            message: resp.response.data
                        });
                    } else if (resp.response.status == 500) {
                        __this.$message({
                            showClose: true,
                            type: resp.type,
                            message: '删除失败!'
                        });
                    }
                })
            },
            // pageCode当前页
            findByPage(pageCode, pageSize) {
                let __this = this;
                axios.get("/log/getSysLogAll", {
                    params: {
                        pageCode: pageCode,
                        pageSize: pageSize,
                        username: __this.username,
                        createDate: __this.createDate
                    }
                }).then(resp => {
                    __this.SysLogAll = resp.data.rows;
                    __this.total = resp.data.total;
                    __this.loading = false;
                }, resp => {
                    if (resp.response.status == 403) {
                        __this.$message({
                            type: resp.type,
                            message: resp.response.data
                        });
                    }
                    __this.loading = false;
                });
            }
        },
        mounted: function () {
            let __this = this;
            __this.loading = true;
            __this.searchSysLog(__this.currentPage, __this.pageSize);
        }
    }
</script>
<style>
  .cate_mana_header {
    background-color: #ececec;
    margin-top: 20px;
    padding-left: 5px;
    display: flex;
    justify-content: flex-start;
  }
  .cate_mana_main {
    display: flex;
    flex-direction: column;
    padding-left: 5px;
    background-color: #ececec;
    margin-top: 20px;
    padding-top: 10px;
  }
</style>
