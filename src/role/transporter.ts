import Tasks from "creep-tasks";
export class roleTransporter {
  /**
   *  按优先级查早储存点
   */
  static find(creep: Creep) {
    // 优先级： STRUCTURE_EXTENSION > STRUCTURE_SPAWN > STRUCTURE_CONTAINER
    let structures = creep.room.find(FIND_STRUCTURES, {
      filter: (structure: Structure) => {
        return (
          structure.structureType == STRUCTURE_EXTENSION ||
          structure.structureType == STRUCTURE_SPAWN ||
          structure.structureType == STRUCTURE_CONTAINER
        );
      }
    });
    let arr = _.values(structures);
    return arr;
  }
  /**
   *
   * @param creep 分配任务
   */
  static newTask(creep: Creep): void {
    let sources = creep.room.find(FIND_DROPPED_RESOURCES);
    if (creep.carry.energy < creep.carryCapacity || sources.length > 0) {
      // 如果有一个空来源，则从一个空来源中收获，否则选择任何一个来源
      let unattendedSource = _.filter(sources, source => source.targetedBy.length == 0)[0];
      if (unattendedSource) {
        creep.task = Tasks.pickup(unattendedSource);
      } else {
        creep.task = Tasks.pickup(sources[0]);
      }
    } else {
      // let target = Game.spawns[creep.room.name];
      let targets: any = this.find(creep);
      console.log(targets[0])
      // creep.task = Tasks.transfer(targets[0]);
    }
  }
  /**
   *
   * @param creep 分配并执行任务
   */
  static run(creep: Creep): void {
    // 执行任务
    if (creep.isIdle) {
      this.newTask(creep);
    }
    // 分配并执行任务
    creep.run();
  }
}

export default roleTransporter;
