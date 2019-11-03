import Tasks from "../lib/creep-tasks";
import utils from "../utils/util";
export class roleBuilder {
  /** @param creep 分配任务*/
  static newTask(creep: Creep): void {
    // 如果有一个空来源，则从一个空来源中收获，否则选择任何一个来源
    if (creep.carry.energy == 0) {
      let rains: any = creep.room.find(FIND_RUINS, {
        filter: rain => {
          return rain.store.getUsedCapacity(RESOURCE_ENERGY);
        }
      });
      let getTarget = utils.findCanGetEnergyStructure(creep);
      let target: any = creep.pos.findClosestByPath([...rains, getTarget]);
      if (target) {
        creep.task = Tasks.withdraw(target);
        // } else {
        //   creep.task = null;
      }
    } else {
      let target: any;
      // const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      // let targets: any = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
      let con = creep.room.find(FIND_CONSTRUCTION_SITES, {
        filter: con => {
          return con.structureType == STRUCTURE_EXTENSION || con.structureType == STRUCTURE_CONTAINER;
        }
      });
      if (con.length > 0) {
        // console.log(con)
        target = creep.pos.findClosestByPath(con);
      } else {
        target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
      }
      if (target) creep.task = Tasks.build(target);

      // if (targets.length > 0) {
      //   // let unattendedSource = _.filter(targets, target => target.targetedBy.length == 0)[0];
      //   let target = creep.pos.findClosestByPath(targets);
      //   if (target) {
      //     creep.task = Tasks.build(target);
      //   }
      // }
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

export default roleBuilder;
