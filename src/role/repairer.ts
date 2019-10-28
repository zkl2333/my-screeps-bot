import Tasks from "../lib/creep-tasks";
export class roleRepairer {
  /** @param creep 分配任务*/
  static newTask(creep: Creep): void {
    // 如果有一个空来源，则从一个空来源中收获，否则选择任何一个来源
    if (creep.carry.energy > 0) {
      let sources = creep.room.find(FIND_DROPPED_RESOURCES);
      if (creep.carry.energy < creep.carryCapacity && sources.length > 0) {
        // 如果有一个空来源，则从一个空来源中收获，否则选择任何一个来源
        let unattendedSource = _.filter(sources, source => source.targetedBy.length == 0)[0];
        if (unattendedSource) {
          creep.task = Tasks.pickup(unattendedSource);
        } else {
          creep.task = Tasks.pickup(sources[0]);
        }
      }
    } else {
      const targets = creep.room.find(FIND_STRUCTURES, {
        filter: object => {
          object.hits < object.hitsMax || object.structureType !== STRUCTURE_WALL;
        }
      });
      if (targets.length > 0) {
        targets.sort((a, b) => (a.hits / a.hitsMax - b.hits / b.hitsMax) * 1);
        let unattendedSource = _.filter(targets, target => target.targetedBy.length == 0)[0];
        if (unattendedSource) {
          creep.task = Tasks.repair(unattendedSource);
        } else {
          creep.task = Tasks.repair(targets[0]);
        }
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
