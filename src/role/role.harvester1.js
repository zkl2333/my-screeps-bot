var roleHarvester = {
  /** @param {Creep} creep **/
  run: function(creep) {
    // 分配任务
    if (creep.memory.work == undefined) {
      // 还能携带
      if (creep.carry.energy == 0) {
        // 如果有掉落的物资
        let target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
        // let target = false
        if (target) {
          // 拾取物资
          creep.memory.work = "pickup";
          creep.memory.targetId = target.id;
          creep.say("拾取物资");
        } else {
          // 挖矿
          creep.memory.work = "harvest";
          target = creep.pos.findClosestByPath(FIND_SOURCES);
          if (target) {
            creep.memory.targetId = target.id;
            creep.say("开采物资");
          }
        }
      } else {
        // 搬运
        creep.memory.work = "transfer";
        let targets = creep.room.find(FIND_STRUCTURES, {
          filter: structure => {
            return (
              (structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_SPAWN ||
                structure.structureType == STRUCTURE_TOWER) &&
              structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            );
          }
        });
        let target = creep.pos.findClosestByPath(targets);
        if (target) {
          creep.memory.targetId = target.id;
          creep.say("转移物资");
        } else {
          creep.memory.work = undefined;
        }
      }
    } else {
      // 执行任务
      let target = Game.getObjectById(creep.memory.targetId);
      if (creep.memory.work == "transfer") {
        if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.travelTo(target, {
            visualizePathStyle: { stroke: "#ffaaff" }
          });
        }
      } else {
        let code = creep[creep.memory.work](target);
        if (code == ERR_NOT_IN_RANGE) {
          creep.travelTo(target, {
            visualizePathStyle: { stroke: "#ffaa00" }
          });
        } else if (code !== OK) {
          // console.log("未知错误",code)
          creep.memory.work = undefined;
          creep.memory.targetId = undefined;
        }
      }
      // 更新任务
      if (
        target == null ||
        (creep.carry.energy == creep.carryCapacity && creep.memory.work !== "transfer") ||
        (creep.memory.work == "transfer" &&
          (creep.carry.energy == 0 || target.store.getFreeCapacity(RESOURCE_ENERGY) == 0))
      ) {
        creep.memory.work = undefined;
        creep.memory.targetId = undefined;
      }
    }
  }
};

module.exports = roleHarvester;
