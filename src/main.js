import util from "./utils/util";
import { ErrorMapper } from "utils/ErrorMapper";

import roleHarvester from "./role/role.harvester1";
import roleUpgrader from "./role/upgrader";
import roleBuilder from "./role/role.builder1";
import roleRepairer from "./role/role.repairer1";
import roleMiner from "./role/miner";
import roleTransporter from "./role/transporter";
// import roleWorker from "./rolo/worker.js";

import "./creep";
import "./spawn";

// 导入工具
import "./utils/Traveler";
import cleanMemory from "./utils/clean-memory";
import "creep-tasks";
// import "./task";

// 防御
function defendRoom(roomName) {
  let hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
  let towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {
    filter: { structureType: STRUCTURE_TOWER }
  });
  if (hostiles.length > 0) {
    var username = hostiles[0].owner.username;
    Game.notify(`User ${username} spotted in room ${roomName}`);
    towers.forEach(tower => tower.attack(hostiles[0]));
  }
  let targets = Game.rooms[roomName].find(FIND_STRUCTURES, {
    filter: object => object.hits / object.hitsMax < 0.5
  });
}

module.exports.loop = ErrorMapper.wrapLoop(() => {
  // console.log("=========startLoop=========")
  let creepsArray = _.values(Game.creeps);
  let spawnsArray = _.values(Game.spawns);

  spawnsArray.forEach(function(spawn, index) {
    if (!spawn.memory.spawnList) {
      spawn.memory.spawnList = [];
    }
    spawn.work();
  });

  util.checkCreeps();
  defendRoom(spawnsArray[0].room.name);

  // 清理内存
  cleanMemory.cleanDeadCreeps();

  // let harvesters = _.filter(creepsArray, creep => creep.memory.role == "harvester" || creep.name.includes("W"));
  // let upgraders = _.filter(creepsArray, creep => creep.memory.role == "Upgrader");
  // let builders = _.filter(creepsArray, creep => creep.memory.role == "Upgrader");
  // let repairers = _.filter(creepsArray, creep => creep.memory.role.includes("Upgrader"));
  // let workers = _.filter(creepsArray, creep => creep.name == "worker");

  // Handle all roles, assigning each creep a new task if they are currently idle
  // if (creepsArray.length > 2) {
  //   for (let creep of harvesters) {
  //     // console.log(creep);
  //     roleHarvester.run(creep);
  //     // if (harvester.isIdle) {
  //     //   roleHarvester.newTask(creep);
  //     // }
  //   }
  // } else {
  //   for (let creep of creepsArray) {
  //     roleHarvester.run(creep);
  //   }
  // }
  // for (let creep of harvesters) {
  //   // console.log(creep);
  //   roleHarvester.run(creep);
  //   // if (harvester.isIdle) {
  //   //   roleHarvester.newTask(creep);
  //   // }
  // }
  // for (let creep of upgraders) {
  //   roleUpgrader.run(creep);
  //   // if (upgrader.isIdle) {
  //   //   roleUpgrader.newTask(creep);
  //   // }
  // }
  // for (let worker of workers) {
  //   if (worker.isIdle) {
  //     roleWorker.newTask(worker);
  //   }
  // }
  // for (let builder of builders) {
  //   if (builder.isIdle) {
  //     roleBuilder.newTask(patroller);
  //   }
  // }
  // for (let repairer of repairers) {
  //   if (builder.isIdle) {
  //     roleRepairer.newTask(patroller);
  //   }
  // }
  // Now that all creeps have their tasks, execute everything
  // for (let creep of creepsArray) {
  //   creep.run();
  // }
  if (creepsArray.length > 4) {
    for (let name in Game.creeps) {
      let creep = Game.creeps[name];
      if (creep.memory.role == "harvester") {
        roleHarvester.run(creep);
      }
      if (creep.memory.role == "upgrader") {
        roleUpgrader.run(creep);
      }
      if (creep.memory.role == "builder") {
        roleBuilder.run(creep);
      }
      if (creep.memory.role == "repairer") {
        roleRepairer.run(creep);
      }
      if (creep.memory.role == "miner") {
        roleMiner.run(creep);
      }
      if (creep.memory.role == "transporter") {
        roleTransporter.run(creep);
      }
    }
  } else {
    for (let creep of creepsArray) {
      if (
        creep.memory.role == "harvester" ||
        creep.memory.role == "upgrader" ||
        creep.memory.role == "builder" ||
        creep.memory.role == "repairer"
      ) {
        roleHarvester.run(creep);
      }
      if (creep.memory.role == "miner") {
        roleMiner.run(creep);
      }
      if (creep.memory.role == "transporter") {
        roleTransporter.run(creep);
      }
    }
    // if (creep.memory.role == "repairer") {
    //   roleRepairer.run(creep);
    // }
  }
});
