import config from "../config";
const util = {
  creepsArray: _.values(Game.creeps),
  spawnsArray: _.values(Game.spawns),
  HowManyCreep: function HowManyCreep(WorkType) {
    let creeps = _.filter(Game.creeps, creep => creep.memory.role == WorkType);
    return creeps.length;
  },
  // 检查creeps数量
  checkCreeps: function checkCreeps() {
    if (this.spawnsArray[0].memory.spawnList.length < 3) {
      for (let k in config.worker) {
        let worker = config.worker[k];
        worker.realNumber =
          util.HowManyCreep(worker.WorkType) +
          _.filter(this.spawnsArray[0].memory.spawnList, spawnTaks => spawnTaks == worker.WorkType).length;
        if (worker.realNumber < worker.PlanNumber) {
          // 推产卵任务到母巢
          // todo：动态数量控制
          console.log("推产卵任务到母巢", worker.WorkType);
          this.spawnsArray[0].addTask(worker.WorkType);
        }
      }
    }
  }
};

export default util;
