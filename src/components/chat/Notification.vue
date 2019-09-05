<template>
  <div>
    <el-container>
      <el-header style="text-align: left;padding-left: 0px;background:white">
        <el-button type="success" size="mini" plain icon="el-icon-success" @click="allRead">全部标为已读</el-button>
       
      </el-header>
      <el-main style="padding: 0px;">
        <el-collapse accordion style="width: 90%" @change="handleChange" v-model="mid">
          <el-collapse-item v-for="(msg,index) in sysmsgs" :key="index" :name="msg.msgContent.id">
            <template slot="title">
              <div style="display: flex;justify-content: flex-start;align-items: center;">
                <div style="display: flex;justify-content: center;align-items: center;width: 25px;height: 25px">
                  <div
                    style="width: 8px;height: 8px;background-color: #ea0206;border-radius: 8px;"
                    v-if="msg.state==0"></div>
                </div>
                <span style="width: 600px;text-align: left">{{msg.msgContent.title}}</span>
                <el-tag>{{msg.msgContent.createDate|formatDate}}</el-tag>
              </div>
            </template>
            <div
              style="display: flex;justify-content: flex-start;align-items: center;border-style: solid;border-width: 1px;border-color: #409eff;border-radius: 5px;padding: 4px 0px 4px 8px;box-sizing: border-box;height: 100%">
              {{msg.msgContent.message}}
            </div>
          </el-collapse-item>
        </el-collapse>
        <div style="color: #ea0206;font-size: 18px;text-align: center" v-if="sysmsgs.length==0">暂无通知</div>
      </el-main>
    </el-container>
    
  </div>
</template>
<script>
  export default{
    data(){
      return {
        message: '',
        mid: -1,
        sysmsgs: []
      }
    },
    mounted() {
      this.initSysMsgs();
    },
   
    methods: {
      handleChange(newVal){
        if (newVal == '') {
          return;
        }
        var _this = this;
        this.putRequest("/chat/markread", {flag: this.mid}).then(resp=> {
          if (resp && resp.status == 200) {
            _this.initSysMsgs();
          }
        })
      },
      initSysMsgs(){
        var _this = this;
        this.getRequest("/chat/sysmsgs").then(resp=> {
          _this.sysmsgs = resp.data;
          var isDot = false;
          _this.sysmsgs.forEach(msg=> {
            if (msg.state == 0) {
              isDot = true;
            }
          })
          _this.$store.commit('toggleNFDot', isDot);
        })
      },
      allRead(){
        var _this = this;
        this.putRequest("/chat/markread", {flag: -1}).then(resp=> {
          if (resp && resp.status == 200) {
            _this.$store.commit('toggleNFDot', false);
            _this.initSysMsgs();
          }
        })
      },
    
    }
  }
</script>
