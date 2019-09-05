<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick" style="margin-top: 10px">
      <el-tab-pane label="系统通知" name="notification"><nf></nf></el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import Notification from '@/components/chat/Notification'
  export default {
    data() {
      return {
        activeName: 'notification'
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    },
    components:{
      'nf':Notification
    }
  };
</script>
