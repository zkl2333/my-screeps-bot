import { ErrorMapper } from "utils/ErrorMapper";

import roleHarvester from "./rolo/role.harvester1";
import roleUpgrader from "./rolo/role.upgrader";
import roleBuilder from "./rolo/role.builder1";
import roleRepairer from "./rolo/role.repairer";

// let roleHarvester = require("./rolo/role.harvester1");
// let roleUpgrader = require("./rolo/role.upgrader");
// let roleBuilder = require("./rolo/role.builder1");
// let roleRepairer = require("./rolo/role.repairer");

// let Traveler = require("Traveler")
// import roleRepairer from "role.repairer"
// let Tasks = require('creep-tasks')

import cleanMemory from "./utils/clean-memory"

let home = Game.spawns[Object.keys(Game.spawns)[0]];

let config = {
  worker: {
    harvester: {
      WorkType: "harvester",
      lable: "W",
      PlanNumber: 4,
      body: [WORK, CARRY, MOVE]
    },
    builder: {
      WorkType: "builder",
      lable: "Z",
      PlanNumber: 8,
      body: [WORK, CARRY, CARRY, MOVE]
    },
    upgrader: {
      WorkType: "upgrader",
      lable: "S",
      PlanNumber: 3,
      body: [WORK, CARRY, CARRY, MOVE]
    },
    repairer: {
      WorkType: "repairer",
      lable: "X",
      PlanNumber: 2,
      body: [WORK, CARRY, MOVE]
    }
  },
  allPlanNum: function() {
    return (
      config.worker.builder.PlanNumber +
      config.worker.upgrader.PlanNumber +
      config.worker.harvester.PlanNumber +
      config.worker.repairer.PlanNumber
    );
  }
};
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
  if (targets.length > 3) {
    targets.sort((a, b) => (a.hits / a.hitsMax - b.hits / b.hitsMax) * -1);
    towers.forEach(tower => tower.repair(targets[2]));
    // console.log(JSON.stringify(targets[0].hits / targets[0].hitsMax))
  }
}

// 计算工种数量
function HowManyCreep(WorkType) {
  let creeps = _.filter(Game.creeps, creep => creep.memory.role == WorkType);
  return creeps.length;
}
// 按工种产生新的工人
function spawnCreeps(WorkType) {
  let newName = config.worker[WorkType].lable + "·" + Game.time;
  if (home.spawning == null) {
    let res = home.spawnCreep(config.worker[WorkType].body, newName, {
      memory: {
        role: WorkType
      }
    });
    if (res == OK) {
      console.log("新任务：产生新" + WorkType + ": " + newName);
    } else if (res == ERR_BUSY) {
      console.log("创建" + WorkType + "失败: 已经有任务");
    } else if (res == ERR_NOT_ENOUGH_RESOURCES) {
      console.log("创建" + WorkType + "失败: 资源不足");
    } else {
      console.log(res);
      return res;
    }
  }
  return 0;
}

function checkCreeps() {
  for (let k in config.worker) {
    let worker = config.worker[k];
    worker.realNumber = HowManyCreep(worker.WorkType);
    if (worker.realNumber < worker.PlanNumber) {
      // if(spawnCreeps(worker.WorkType)!==OK){
      spawnCreeps(worker.WorkType);
      // break
      // }
    }
  }
}

module.exports.loop = ErrorMapper.wrapLoop(() => {
  // console.log("=========startLoop=========")
  defendRoom(home.room.name);
  checkCreeps();
  if (
    Object.keys(Memory.creeps).length !== Object.keys(Game.creeps).length ||
    Object.keys(Memory.creeps).length < config.allPlanNum()
  ) {
    // console.log("creeps不足")
    // 清理内存
    cleanMemory.cleanDeadCreeps();
  }

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
  }
});
