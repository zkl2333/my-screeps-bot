const util = require("../utils/util");

var roleBuilder = {
  /** @param {Creep} creep **/
  run: function(creep) {
    if (creep.memory.building && creep.carry.energy == 0) {
      creep.memory.building = false;
      creep.memory.targetId = undefined;
      creep.say("获取能量");
    }
    if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
      try {
        creep.memory.building = true;
        let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        creep.memory.targetId = target.id;
        creep.say("建造");
      } catch {
        creep.memory.building = false;
      }
    }

    if (creep.memory.building) {
      let target = Game.getObjectById(creep.memory.targetId) || creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
      if (creep.build(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {
          visualizePathStyle: { stroke: "#ffffff" }
        });
      }
    } else {
      let targets = creep.room.find(FIND_STRUCTURES, {
        filter: structure => {
          return (
            (structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_CONTAINER) &&
            structure.store.getUsedCapacity(RESOURCE_ENERGY) > 300
          );
        }
      });
      // console.log(targets)
      if (targets.length > 0) {
        let target = creep.pos.findClosestByPath(targets);
        if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target, {
            visualizePathStyle: { stroke: "#ffaa00" }
          });
        }
      } else {
        let target = creep.pos.findClosestByPath(FIND_SOURCES);
        if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target, {
            visualizePathStyle: { stroke: "#ffaa00" }
          });
        }
      }
    }
  }
};

module.exports = roleBuilder;
