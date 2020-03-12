<template>
  <div>
    <el-container>
      <el-header style="text-align: left;padding-left: 0px;background:white">
        <el-button type="success" size="mini" plain icon="el-icon-success" @click="allRead">全部标为已读</el-button>
      </el-header>
      <el-main style="padding: 0px;">
        <el-collapse accordion style="width: 90%" @change="handleChange" v-model="id">
          <el-collapse-item
            v-for="(notification,index) in notifications"
            :key="index"
            :name="notification.id"
            @click="showDialog(notification)"
          >
            <template slot="title">
              <div style="display: flex;justify-content: flex-start;align-items: center;">
                <div
                  style="display: flex;justify-content: center;align-items: center;width: 25px;height: 25px"
                >
                  <div
                    style="width: 8px;height: 8px;background-color: #ea0206;border-radius: 8px;"
                    v-if="notification.state==0"
                  ></div>
                </div>
                <span style="width: 600px;text-align: left">{{notification.caseName}}</span>
                <el-tag>{{notification.catchTime|formatDate}}</el-tag>
              </div>
            </template>

            <div
            >
    
              <table class="layui-table" border="1" >
               
                <thead>
                  <tr>
                    <th >PLMN</th>
                    <th>IMSI</th>
                    <th>IMEI</th>
                    <th>电话号码</th>
                    <th>归属地</th>
                    <th>Name</th>
                    <th>mode</th>
                    <th>catchTime</th>
                    <th>catchArea</th>
                    <th>描述</th>
                    <th>记录名</th>
                    <th>案件名</th>
                    <th>目标来源</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{{notification.plmn}}</td>
                    <td>{{notification.imsi}}</td>
                    <td>{{notification.imei}}</td>
                    <td>{{notification.isdn}}</td>
                    <td>{{notification.area}}</td>
                    <td>{{notification.name}}</td>
                    <td>{{notification.mode}}</td>
                    <td>{{notification.catchTime}}</td>
                    <td>{{notification.catchArea}}</td>
                    <td>{{notification.desc}}</td>
                    <td>{{notification.recordName}}</td>
                    <td>{{notification.caseName}}</td>
                    <td>{{notification.from}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </el-collapse-item>
          <el-pagination
            background
            :page-size="10"
            :current-page="currentPage"
            @current-change="currentChange"
            layout="prev, pager, next"
            :total="totalCount"
          ></el-pagination>
        </el-collapse>
        <div
          style="color: #ea0206;font-size: 18px;text-align: center"
          v-if="notifications.length==0"
        >暂无通知</div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      title: "",
      totalCount: -1,
      currentPage: 1,
      dialogTableVisible: false,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      message: "",

      id: -1,
      notifications: [],
      notification: {
        id: "",
        imsi: "",
        mode: "", //制式
        area: "", //归属地
        plmn: "", //运营商
        imei: "",
        isdn: "",
        catchTime: "",
        catchArea: "",
        lat: "",
        lng: "",
        state: "",
        desc: "",
        frtDevId: ""
      }
    };
  },
  mounted() {
    this.initSysMsgs();
  },

  methods: {
    currentChange(currentChange) {
      this.currentPage = currentChange;
      this.initSysMsgs();
    },

    handleChange(newVal) {
      if (newVal == "") {
        return;
      }
      this.dialogTableVisible = true;
      this.dialogFormVisible = true;
      var _this = this;
      this.putRequest("/sysmsgs/markread", { flag: this.id }).then(resp => {
        if (resp && resp.status == 200) {
          _this.dialogVisible = false;
          _this.initSysMsgs();
        }
      });
    },
    initSysMsgs() {
      var _this = this;
      this.getRequest(
        "/sysmsgs/notification?page=" + this.currentPage + "&size=10"
      ).then(resp => {
        var data = resp.data;
        _this.notifications = data.notifications;
        _this.totalCount = data.count;
        var isDot = false;
        _this.notifications.forEach(notification => {
          if (notification.state == 0) {
            isDot = true;
          }
        });
        _this.$store.commit("toggleNFDot", isDot);
      });
    },
    allRead() {
      var _this = this;
      this.putRequest("/sysmsgs/markread", { flag: -1 }).then(resp => {
        if (resp && resp.status == 200) {
          _this.$store.commit("toggleNFDot", false);
          _this.initSysMsgs();
        }
      });
    }
  }
};
</script>

<style scoped>
.layui-table {
  width: 100%;
  background-color: #fff;
  color: #666;
}

td th{
    width: 100px;

}

.layui-table,
.layui-table-view {
  margin: 10px 0;
}
table {
  border-collapse: collapse;
  border-spacing: 0;

}
</style>
