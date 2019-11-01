import util from "./utils/util";
import { ErrorMapper } from "utils/ErrorMapper";

import roleHarvester from "./role/role.harvester1";
import roleUpgrader from "./role/upgrader";
import roleBuilder from "./role/builder";
import roleRepairer from "./role/repairer";
import roleMiner from "./role/miner";
import roleTransporter from "./role/transporter";

import "./creep";
import "./spawn";
// import "./RoomVisual";

// 导入工具
import "./lib/Traveler";
import cleanMemory from "./utils/clean-memory";
import "./lib/creep-tasks/index";
// import "./task";
// import { Visualizer } from "./lib//visuals/Visualizer";

// 防御
function defendRoom(roomName) {
  let others = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
  let hostiles = _.filter(others, target => target.owner.username !== "foreyes1001");
  if (others.length !== hostiles.length) {
    Game.notify(`你的朋友 ${username} 造访 ${roomName}`);
  }
  // 需要修理
  let towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES, {
    filter: { structureType: STRUCTURE_TOWER }
  });
  let targets = Game.rooms[roomName].find(FIND_STRUCTURES, {
    filter: object => object.hits / object.hitsMax < 0.1 && object.hits < 2000
  });
  if (hostiles.length > 0) {
    var username = hostiles[0].owner.username;
    Game.notify(`敌人 ${username} 造访 ${roomName}`);
    towers.forEach(tower => tower.attack(hostiles[0]));
  }
  if (targets.length > 0) {
    towers.forEach(tower => tower.repair(targets[0]));
  }
}

module.exports.loop = ErrorMapper.wrapLoop(() => {
  // const startCpu = Game.cpu.getUsed();
  // console.log("=========startLoop=========")
  let creepsArray = _.values(Game.creeps);
  let spawnsArray = _.values(Game.spawns);

  if (Game.time % 5 == 0) {
    spawnsArray.forEach(function(spawn, index) {
      if (!spawn.memory.spawnList) {
        spawn.memory.spawnList = [];
      }
      spawn.work();
      try {
        util.checkCreeps(spawn);
      } catch (error) {
        console.log("检查异常", error);
      }
    });
  }
  defendRoom(spawnsArray[0].room.name);

  // 清理内存
  cleanMemory.cleanDeadCreeps();
  if (!Memory.j) {
    for (let name in Game.creeps) {
      let creep = Game.creeps[name];
      creep.work();
      try {
        if (creep.memory.role == "harvester" || creep.name.includes("worker")) {
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
        if (creep.memory.role == "miner" || creep.name.includes("drone")) {
          roleMiner.run(creep);
        }
        if (creep.memory.role == "transporter" || creep.name.includes("transport")) {
          roleTransporter.run(creep);
        }
      } catch (error) {
        creep.task = null;
        console.log(creep, error);
      }
    }
  } else {
    if (Game.time % 10 == 0)
      console.log("紧急模式！！creep不足，除'miner、'transporter'全部转化为'harvester'挖矿恢复生产");
    for (let creep of creepsArray) {
      creep.work();
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
  }
  // const elapsed = Game.cpu.getUsed() - startCpu;
  // try {
  //   Visualizer.drawGraphs();

  // } catch (error) {
  //   console.log("绘图失败", error);
  // }
});
