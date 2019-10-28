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
      // let target = Game.getObjectById(creep.memory.targetId) || creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
      let targets = creep.room.find(FIND_CONSTRUCTION_SITES, {
        filter: { structureType: STRUCTURE_EXTENSION }
      });
      let target;
      if (targets.length > 0) {
        target = creep.pos.findClosestByPath(targets);
      } else {
        let targets = creep.room.find(FIND_CONSTRUCTION_SITES, {
          filter: { structureType: STRUCTURE_CONTAINER }
        });
        if (targets.length > 0) {
          target = creep.pos.findClosestByPath(targets);
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
      let targets1 = creep.room.find(FIND_STRUCTURES, {
        filter: structure => {
          return (
            (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_STORAGE) &&
            structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
          );
        }
      });
      let target2 = creep.room.find(FIND_SOURCES);
      let target3 = creep.room.find(FIND_DROPPED_RESOURCES);
      let targets = _.values(targets1).concat(_.values(target2).concat(_.values(target3)));
      if (targets.length > 0) {
        let target = creep.pos.findClosestByPath(targets);
        let options = {
          visualizePathStyle: { stroke: "#ffaa00" }
        };
        // 建筑
        if (target.structureType !== undefined) {
          if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.travelTo(target, options);
          }
          // 掉落的资源
        } else if (target.resourceType !== undefined) {
          if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
            creep.travelTo(target, options);
          }
        } else {
          // 矿
          if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
            creep.travelTo(target, options);
          }
        }
      }
    }
  }
};

module.exports = roleBuilder;
