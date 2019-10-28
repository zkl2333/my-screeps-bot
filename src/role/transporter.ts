import Tasks from "../lib/creep-tasks/index";
import utils from "../utils/util"
export class roleTransporter {
  /**
   *
   * @param creep 分配任务
   */
  static newTask(creep: Creep): void {
    let sources = creep.room.find(FIND_DROPPED_RESOURCES);
    let getTarget = utils.findCanGetEnergyStructure(creep)
    let saveTarget = utils.findCanSaveEnergyStructure(creep);
    if (creep.carry.energy == 0 && sources.length > 0) {
      let source = _.filter(sources, source => source.targetedBy.length == 0)[0];
      if (source) {
        creep.task = Tasks.pickup(source);
      } else if (getTarget) {
        creep.task = Tasks.withdraw(getTarget);
      }
    } else {
      if(saveTarget){
        creep.task = Tasks.transfer(saveTarget);
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
