const util = require("../utils/util");

var roleBuilder = {
  /** @param {Creep} creep **/
  run: function(creep) {
    if (creep.memory.building && creep.carry.energy == 0) {
      creep.memory.building = false;
      let saveTarget = util.findCanSaveEnergyStructure(creep);
      creep.memory.targetId = saveTarget;
      creep.say("获取能量");
    }
    if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
      try {
        let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if (target) {
          creep.memory.building = true;
          creep.say("建造");
        }
      } catch {
        creep.memory.building = false;
      }
    }

    if (creep.memory.building) {
      // let target = Game.getObjectById(creep.memory.targetId) || creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
      let target;
      let targets = creep.room.find(FIND_CONSTRUCTION_SITES, {
        filter: { structureType: STRUCTURE_EXTENSION }
      });
      if (targets.length > 0) {
        target = creep.pos.findClosestByPath(targets);
      } else {
        let con = creep.room.find(FIND_CONSTRUCTION_SITES, {
          filter: { structureType: STRUCTURE_CONTAINER }
        });
        if (con.length > 0) {
          target = creep.pos.findClosestByPath(con);
        } else {
          target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        }
      }
      if (creep.build(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {
          visualizePathStyle: { stroke: "#ffffff" }
        });
      }
    } else {
      let target = Game.getObjectById(creep.memory.targetId);
      // 建筑
      if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        creep.travelTo(target, options);
      } else {
        creep.memory.work = undefined;
      }
    }
  }
};

module.exports = roleBuilder;
