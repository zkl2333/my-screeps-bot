import Tasks from "creep-tasks";
export class roleMiner {
  /** @param creep 分配任务*/
  static newTask(creep: Creep): void {
    // 如果有一个空来源，则从一个空来源中收获，否则选择任何一个来源
    if (creep.carry.energy < creep.carryCapacity) {
      let sources = creep.room.find(FIND_SOURCES);
      let unattendedSource = _.filter(sources, source => source.targetedBy.length == 0)[0];
      if (unattendedSource) {
        creep.task = Tasks.harvest(unattendedSource);
      } else {
        creep.task = Tasks.harvest(sources[0]);
      }
    } else if ( // 如果没有搬运者，就自己回家
      _.filter(Game.creeps, creep => {
        creep.memory.role == "transporter";
      }).length > 0
    ) {
      let spawn = Game.spawns[creep.room.name];
      creep.task = Tasks.transfer(spawn);
    } else { // 如果有搬运者,丢在地上
      creep.task = Tasks.drop(creep.pos, RESOURCE_ENERGY);
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

export default roleMiner;
