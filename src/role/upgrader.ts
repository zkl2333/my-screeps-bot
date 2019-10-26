import Tasks from "creep-tasks";
export class RoleUpgrader {
  /** @param creep 分配任务*/
  static newTask(creep: Creep): void {
    // 如果有一个空来源，则从一个空来源中收获，否则选择任何一个来源
    if (creep.carry.energy < creep.carryCapacity) {
      let sources = creep.room.find(FIND_DROPPED_RESOURCES);
      if (creep.carry.energy < creep.carryCapacity || sources.length > 0) {
        // 如果有一个空来源，则从一个空来源中收获，否则选择任何一个来源
        let unattendedSource = _.filter(sources, source => source.targetedBy.length == 0)[0];
        if (unattendedSource) {
          creep.task = Tasks.pickup(unattendedSource);
        } else {
          creep.task = Tasks.pickup(sources[0]);
        }
      }
    } else {
      creep.task = Tasks.upgrade(creep.room.controller!);
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

export default RoleUpgrader;
