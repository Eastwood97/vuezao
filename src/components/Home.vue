<template>
  <el-container class="home-container">
    <el-header class="home-header">
      <span class="home_title">涉稳人员多维感知管控系统后台</span>
      <div style="display: flex;align-items: center;margin-right: 7px">
        <el-link href="http://localhost:8081/screen.html" target="_blank" type="warning" >大屏展示&nbsp&nbsp</el-link>
        <el-badge style="margin-right: 30px" :is-dot="this.$store.state.nfDot">
          <i class="fa fa-bell-o" @click="goChat" style="cursor: pointer"></i>
        </el-badge>
        <el-dropdown @command="handleCommand">
          <span
            class="el-dropdown-link home_userinfo"
            style="display: flex;align-items: center"
          >{{currentUserName}}</span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="logout" divided>注销</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          default-active="0"
          class="el-menu-vertical-demo"
          style="background-color: #ECECEC"
          router
        >
          <template v-for="(item,index) in this.$router.options.routes" v-if="!item.hidden">
            <el-submenu :index="index+''" v-if="item.children.length>1" :key="index">
              <template slot="title">
                <i :class="item.iconCls"></i>
                <span>{{item.name}}</span>
              </template>
              <el-menu-item
                v-for="child in item.children"
                v-if="!child.hidden"
                :index="child.path"
                :key="child.path"
              >{{child.name}}</el-menu-item>
            </el-submenu>
            <template v-else>
              <el-menu-item :index="item.children[0].path">
                <i :class="item.children[0].iconCls"></i>
                <span slot="title">{{item.children[0].name}}</span>
              </el-menu-item>
            </template>
          </template>
        </el-menu>
      </el-aside>
      <el-container>
        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-text="this.$router.currentRoute.name"></el-breadcrumb-item>
          </el-breadcrumb>
          <keep-alive>
            <router-view v-if="this.$route.meta.keepAlive"></router-view>
          </keep-alive>
          <router-view v-if="!this.$route.meta.keepAlive"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>
<script>
import { getRequest } from "../utils/api";
export default {
  methods: {
     
     loadNF(){
      var _this = this;
      this.getRequest("/sysmsgs/notification").then(resp=> {
        var isDot = false;
        var data=resp.data.notifications;
        data.forEach(msg=> {
          if (msg.state == 0) {
            isDot = true;
          }
        })
        _this.$store.commit('toggleNFDot', isDot);
      })
    },

    open1() {
      this.$notify({
        title: "目标已上号",
        message: "点击右上角小铃铛查看详情",
        type: "success",
        duration: 0,
        
      });
    },
    goChat() {
      this.$router.push({ path: "/chat" });
    },

    handleCommand(command) {
      var _this = this;
      if (command == "logout") {
        this.$confirm("注销登录吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(
          function() {
            getRequest("/logout");
            _this.currentUserName = "游客";
            _this.$router.replace({ path: "/" });
          },
          function() {
            //取消
          }
        );
      }
    },
    
    initWebSocket: function() {
     var userno='admin';
      this.websock = new WebSocket("ws://localhost:8081/websocket/"+userno);
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen: function() {
      console.log("WebSocket连接成功");
    },
    websocketonerror: function(e) {
      console.log("WebSocket==连接发生错误");
    },
    websocketonmessage: function(e) {
        if (e.data) {
          console.log(e.data);
          var isDot = true;
          this.$store.commit("toggleNFDot", isDot);
          this.open1();
        }
    },
    websocketclose: function(e) {
      console.log("connection closed (" + e.code + ")");
    }
  },
  created() {
    // 连接webSocket，用于接收后台实时报警信息推送
  
    this.initWebSocket();
  },
  mounted: function() {
       this.loadNF();
    var _this = this;
    getRequest("/currentUserName").then(
      function(msg) {
        _this.currentUserName = msg.data;
      },
      function(msg) {
        _this.currentUserName = "游客";
        
      }
    );
  },
  data() {
    return {
      currentUserName: "",
      isDot: false,
      msg_data: [],
      
    };
  }
};
</script>
<style>
.home-container {
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
}

.home_title {
  color: #fff;
  font-size: 22px;
  display: inline;
  margin-left: 8px;
}

.home_userinfo {
  color: #fff;
  cursor: pointer;
}

.home_userinfoContainer {
  display: inline;
  margin-right: 20px;
}

.el-submenu .el-menu-item {
  width: 180px;
  min-width: 175px;
}

.el-header {
  background-color: #20a0ff;
  color: #333;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.el-aside {
  background-color: #ececec;
}

.el-main {
  background-color: #fff;
  color: #000;
  text-align: center;
}
</style>
