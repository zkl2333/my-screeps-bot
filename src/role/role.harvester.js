// let Tasks = require("creep-tasks");
import Tasks from "../lib/creep-tasks";

let roleHarvester = {
  // Harvesters harvest from sources, preferring unattended ones and deposit to Spawn1
  // This module demonstrates the RoomObject.targetedBy functionality

  newTask: function(creep) {
    let spawns = _.values(Game.spawns);
    if (creep.carry.energy < creep.carryCapacity) {
      // Harvest from an empty source if there is one, else pick any source
      let sources = creep.room.find(FIND_SOURCES);
      let unattendedSource = _.filter(sources, source => source.targetedBy.length == 0)[0];
      if (unattendedSource) {
        creep.task = Tasks.harvest(unattendedSource);
      } else {
        creep.task = Tasks.harvest(sources[0]);
      }
    } else {
      // let spawn = spawns[0];
      let targets = creep.room.find(FIND_STRUCTURES, {
        filter: structure => {
          return structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_CONTAINER;
        }
      });
      let target = creep.pos.findClosestByPath(targets);
      creep.task = Tasks.transfer(target);
    }
  }
};

export default roleHarvester;
