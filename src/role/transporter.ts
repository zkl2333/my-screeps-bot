import Tasks from "../lib/creep-tasks/index";
import utils from "../utils/util";
export class roleTransporter {
  /**
   *
   * @param creep 分配任务
   */
  static newTask(creep: Creep): void {
    let sources = creep.room.find(FIND_DROPPED_RESOURCES);
    let getTarget: any = utils.findCanGetEnergyStructure(creep);
    let saveTarget = utils.findCanSaveEnergyStructure(creep);
    // 提取
    if (creep.carry.energy == 0) {
      let source = _.filter(sources, source => source.targetedBy.length == 0)[0];
      // let source = sources[0]
      let rains: any = creep.room.find(FIND_RUINS, {
        filter: rain => {
          return rain.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
        }
      });
      rains = _.filter(rains, (rain: any) => rain.targetedBy.length == 0);
      let rain: any = creep.pos.findClosestByPath(rains);
      if (source) {
        // let unattendedSource = _.filter(sources, source => source.targetedBy.length == 0)[0];
        // if (unattendedSource) {
        // creep.task = Tasks.harvest(unattendedSource);
        creep.task = Tasks.pickup(source);
        // }
      } else if (rain) {
        creep.task = Tasks.withdraw(rain);
        // } else if (getTarget) {
      } else if (getTarget && getTarget.store.getFreeCapacity() == 0) {
        if (getTarget.structureType == STRUCTURE_CONTAINER) {
          creep.memory.fromC = true;
        }
        creep.task = Tasks.withdraw(getTarget);
      } else if ((_.values(Game.spawns)[0] as any).room == creep.room.name) {
        creep.task = Tasks.goToRoom((_.values(Game.spawns)[0] as any).room);
      }
      // 储存
    } else {
      if (saveTarget && getTarget.store.getFreeCapacity()) {
        let storage:any = creep.room.find(FIND_STRUCTURES, {
          filter: s => {
            return s.structureType == STRUCTURE_STORAGE;
          }
        });
        if (creep.memory.fromC && storage.length > 0) {
          creep.memory.fromC = null;
          saveTarget = storage[0];
        }
        creep.task = Tasks.transfer(saveTarget!);
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

export default roleTransporter;
