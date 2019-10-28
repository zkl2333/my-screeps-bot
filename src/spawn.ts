import config from "./config";

/**
 * 获取当前房间所有可供生产的Energy
 * @param {StructureSpawn} Spawn
 */
function usedEnergy(Spawn: StructureSpawn) {
  let allEnergy = 0;
  let usedEnergy = 0;
  let room = Spawn.room;
  let structures = room.find(FIND_STRUCTURES, {
    filter: structure => {
      return structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN;
    }
  });
  structures.forEach(t => {
    usedEnergy += t.store.getUsedCapacity(RESOURCE_ENERGY);
    allEnergy += t.store.getCapacity(RESOURCE_ENERGY);
  });
  return usedEnergy;
}

// let spawnsArray = _.values(Game.spawns);
// 检查任务队列
Spawn.prototype.work = function() {
  // 自己已经在生成了 / 内存里没有生成队列 / 生产队列为空 就啥都不干
  if (this.spawning || !this.memory.spawnList || this.memory.spawnList.length == 0) return;
  // 进行生成
  const spawnSuccess = this.mainSpawn(this.memory.spawnList[0]);
  // 生成成功后移除任务
  if (spawnSuccess) {
    this.memory.spawnList.shift();
  }
};

// 将生成任务推入队列
Spawn.prototype.addTask = function(taskName: any) {
  console.log("母巢收到推送，加入孵化队列", taskName);
  // 任务加入队列
  this.memory.spawnList.push(taskName);
  return this.memory.spawnList.length;
};

/**
 * creep 生成主要实现
 * @taskName 任务名
 */
Spawn.prototype.mainSpawn = function(taskName: string) {
  // 保证队列存在
  if (!this.memory.spawnList) {
    // 初始化队列
    this.memory.spawnList = [];
  }
  // 初始化孵化参数
  let newName = config.worker[taskName].lable + "_" + (Game.time % 1000);
  let body = config.worker[taskName].baseBody;
  let baseEnergy = config.worker[taskName].baseEnergy;
  let ComponentEnergy = config.worker[taskName].ComponentEnergy;
  let Component = config.worker[taskName].Component;

  // 紧急模式！！
  let harvesters = _.filter(Game.creeps, creep => creep.memory.role == "harvester" || creep.memory.role == "miner");
  if (harvesters.length < 1 && _.filter(this.memory.spawnList, spawnTaks => spawnTaks == "harvester").length < 2) {
    console.log(harvesters.length, "紧急模式");
    this.addTask("harvester");
    this.addTask("miner");
    this.memory.spawnList.sort((a: any, b: string) => {
      if (b == "harvester" || b == "miner") {
        return true;
      }
      return false;
    });
  }
  // 动态调整孵化参数
  let Energy = usedEnergy(this) - baseEnergy;
  let i = 0;
  while (Energy >= ComponentEnergy) {
    if (i % 2 == 1 || i < 2) {
      body.push(MOVE);
      Energy = Energy - 50;
    }
    body = body.concat(Component);
    Energy = Energy - ComponentEnergy;
    i++;
  }
  let res = this.spawnCreep(body, newName, {
    memory: {
      role: taskName,
      home: this.id
    }
  });
  if (res == OK) console.log("开始孵化", this.memory.spawnList[0], body);
  return res == OK;
};

export default Spawn;
