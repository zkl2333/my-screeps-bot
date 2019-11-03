// import Tasks from "../lib/creep-tasks";
import Tasks from "../lib/creep-tasks/index";
export class roleMiner {
  /** @param creep 分配任务*/
  static newTask(creep: Creep): void {
    // 如果有一个空来源，则从一个空来源中收获，否则选择任何一个来源
    if (creep.carry.energy < creep.carryCapacity) {
      let sources: harvestTargetType[] = creep.room.find(FIND_SOURCES);
      if (sources) {
        let unattendedSource = _.filter(sources, source => source.targetedBy.length == 0)[0];
        if (unattendedSource) {
          creep.task = Tasks.harvest(unattendedSource);
        } else {
          let t = creep.pos.findClosestByPath(sources);
          if (t) {
            creep.task = Tasks.harvest(t);
          }
        }
      }
    } else if (
      // 如果没有搬运者，就自己回家
      _.filter(Game.creeps, creep => {
        creep.memory.role == "transporter";
      }).length > 0
    ) {
      let spawn = Game.spawns[creep.room.name];
      creep.task = Tasks.transfer(spawn);
    } else {
      // 如果有搬运者,丢在地上
      // 如果附近有container
      const con: any = creep.pos.findInRange(FIND_MY_STRUCTURES, 3, {
        filter: (s: any) => {
          return (
            s.structureType == STRUCTURE_CONTAINER ||
            s.structureType == STRUCTURE_SPAWN ||
            s.structureType == STRUCTURE_LINK
          );
        }
      });
      if (con.lenght > 0) {
        creep.task = Tasks.transfer(con[0]);
      } else {
        creep.task = Tasks.drop(creep.pos, RESOURCE_ENERGY);
      }
    }
  }
  /** @param creep 分配并执行任务*/
  static run(creep: Creep): void {
    // 执行任务
    if (creep.isIdle) {
      this.newTask(creep);
    }
    // creep.drop(RESOURCE_ENERGY);
    // 分配并执行任务
    creep.run();
  }
}

export default roleMiner;
