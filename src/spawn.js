import config from "./config";

// let spawnsArray = _.values(Game.spawns);
// 检查任务队列
Spawn.prototype.work = function() {
  // 自己已经在生成了 / 内存里没有生成队列 / 生产队列为空 就啥都不干
  if (this.spawning || !this.memory.spawnList || this.memory.spawnList.length == 0) return;
  // 进行生成
  const spawnSuccess = this.mainSpawn(this.memory.spawnList[0]);
  // 生成成功后移除任务
  if (spawnSuccess) this.memory.spawnList.shift();
};

// 将生成任务推入队列
Spawn.prototype.addTask = function(taskName) {
  // 任务加入队列

  this.memory.spawnList.push(taskName);
  return this.memory.spawnList.length;
};

// creep 生成主要实现
Spawn.prototype.mainSpawn = function(taskName) {
  if (!this.memory.spawnList) {
    this.memory.spawnList = [];
  }
  let harvesters = _.filter(Game.creeps, creep => creep.memory.role == "harvester" || creep.memory.role == "miner");
  if (harvesters.length < 1) {
    console.log(harvesters.length,"紧急模式");
    this.memory.spawnList.sort((a, b) => {
      if (b == "harvester") {
        return true;
      }
      return false;
    });
  }
  let newName = config.worker[taskName].lable + "_" + Game.time;
  let res = this.spawnCreep(config.worker[taskName].body, newName, {
    memory: {
      role: taskName
    }
  });
  return res == OK;
};

export default Spawn;
