Creep.prototype.work = function() {
  // ...

  // 如果 creep 还没有发送重生信息的话，执行健康检查，保证只发送一次生成任务
  // 健康检查不通过则向 spawnList 发送自己的生成任务
  if (!this.memory.hasSendRebirth) {
    const health = this.isHealthy();
    if (!health) {
      // 向指定 spawn 推送生成任务
      // this.room
      this.memory.hasSendRebirth = true;
    }
  }
};

// creep 监控状态检查
Creep.prototype.isHealthy = function() {
  if (this.ticksToLive <= 10) return false;
  else return true;
};

export default Creep;
