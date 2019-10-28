// import Role from "Role"
Creep.prototype.work = function() {
  // 如果 creep 还没有发送重生信息的话，执行健康检查，保证只发送一次生成任务
  // 健康检查不通过则向 spawnList 发送自己的生成任务
  if (!this.memory.hasSendRebirth) {
    const health = this.isHealthy();
    if (!health) {
      // 向指定 spawn 推送生成任务,孵化接班人
      this.say("rua~");
      let spawn = Game.getObjectById(this.memory.home) || Game.spawns["First"];
      spawn.addTask(this.memory.role);
      this.memory.hasSendRebirth = true;
    }
  } else {
    // say goodbye
    // this.say("啊啊啊啊啊啊啊我要死啦！！！！！！！");
  }
};

// creep 监控状态检查
Creep.prototype.isHealthy = function() {
  if (this.ticksToLive <= 20) return false;
  else return true;
};

export default Creep;
