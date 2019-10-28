import Tasks from "../lib/creep-tasks";

let roleWorker = {
  // roleWorker will harvest to get energy, then upgrade the controller

  newTask: function(creep) {
    if (creep.carry.energy > 0) {
      creep.task = Tasks.upgrade(creep.room.controller);
    } else {
      creep.task = Tasks.harvest(creep.room.find(FIND_SOURCES)[0]);
    }
  }
};

export default roleWorker;
