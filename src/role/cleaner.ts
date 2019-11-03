import Tasks from "../lib/creep-tasks/index";
import utils from "../utils/util";
export class cleaner {
  /**
   *
   * @param creep 分配任务
   */
  static newTask(creep: Creep): void {
    if (creep.store.getUsedCapacity() == 0) {
      let rains: any = creep.room.find(FIND_RUINS, {
        filter: rain => {
          return rain.store.getUsedCapacity() > 0;
        }
      });
      rains = _.filter(rains, (rain: any) => rain.targetedBy.length == 0);
      let rain: any = creep.pos.findClosestByPath(rains);
      if (rain) {
        creep.task = Tasks.withdrawAll(rain);
      }
      // 储存
    } else {
      let storage: any = creep.room.find(FIND_STRUCTURES, {
        filter: s => {
          return s.structureType == STRUCTURE_STORAGE;
        }
      });
      if (storage.length > 0) {
        // creep.transfer(storage[0], k);
        creep.task = Tasks.transferAll(storage[0]);
      } else {
        creep.task = Tasks.goToRoom((_.values(Game.spawns)[0] as StructureSpawn).room.name);
      }
    }
  }
  /**
   *
   * @param creep 分配并执行任务
   */
  static run(creep: Creep): void {
    // 如果没有任务
    if (creep.isIdle) {
      this.newTask(creep);
    } else {
      // 执行任务
      creep.run();
    }
  }
}

export default cleaner;
