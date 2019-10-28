import Tasks from "../lib/creep-tasks";

var roleBuilder = {
  /** @param {Creep} creep **/
  newTask: function(creep) {
    if (creep.carry.energy < creep.carryCapacity) {
      let targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (
            (structure.structureType == STRUCTURE_EXTENSION ||
              structure.structureType == STRUCTURE_SPAWN ||
              structure.structureType == STRUCTURE_CONTAINER ||
              structure.structureType == STRUCTURE_TOWER) &&
            structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
          );
        }
      });
      let target = creep.pos.findClosestByPath(targets);
      creep.task = Tasks.withdraw(target);
    } else {
      let e = [];
      let targets = creep.pos.find(FIND_CONSTRUCTION_SITES);
      for (let s in targets) {
        if (s.structureType == STRUCTURE_EXTENSION) {
          e.push(s);
        }
      }
      let target;
      if (e.length > 0) {
        target = creep.pos.findClosestByPath(e);
      } else {
        target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
      }
      creep.task = Tasks.build(target);
    }
  }
};
export default roleBuilder;
