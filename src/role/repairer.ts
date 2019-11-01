import Tasks from "../lib/creep-tasks";
import utils from "../utils/util";
export class roleRepairer {
  /** @param creep 分配任务*/
  static newTask(creep: Creep): void {
    // 提取能量
    if (creep.carry.energy == 0) {
      let getTarget = utils.findCanGetEnergyStructure(creep);
      if (getTarget) {
        creep.task = Tasks.withdraw(getTarget);
      }
    } else {
      // 工作
      const targets = creep.room.find(FIND_STRUCTURES, {
        filter: object => {
          return object.hits < object.hitsMax && object.structureType !== STRUCTURE_WALL;
        }
      });
      // console.log(targets);
      if (targets.length > 0) {
        targets.sort((a, b) => (a.hits / a.hitsMax - b.hits / b.hitsMax) * 1);
        creep.task = Tasks.repair(targets[0]);
      }
    }
  }
  /** @param creep 分配并执行任务*/
  static run(creep: Creep): void {
    // 执行任务
    if (creep.isIdle) {
      this.newTask(creep);
    }
    // 分配并执行任务
    creep.run();
  }
}

export default roleRepairer;
