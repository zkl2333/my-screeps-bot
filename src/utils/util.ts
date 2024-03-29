import config from "../config";
class util {
  // creepsArray: _.values(Game.creeps),
  // spawnsArray: _.values(Game.spawns),
  static HowManyCreep(WorkType: string) {
    let creeps = _.filter(Game.creeps, creep => creep.memory.role == WorkType);
    return creeps.length;
  }
  // 检查creeps数量
  static checkCreeps(spawn: StructureSpawn) {
    if (!spawn.memory.spawnList || spawn.memory.spawnList.length < 3) {
      for (let k in config.worker) {
        let worker = config.worker[k];
        if (worker.WorkType == "builder") {
          let targets = spawn.pos.findInRange(FIND_CONSTRUCTION_SITES, 15);
          if (targets.length == 0) {
            spawn.memory.spawnList.splice(spawn.memory.spawnList.indexOf("builder"), 1);
            break;
          }
        }
        worker.realNumber =
          util.HowManyCreep(worker.WorkType) +
          _.filter(spawn.memory.spawnList, spawnTaks => spawnTaks == worker.WorkType).length;
        if (worker.realNumber < worker.PlanNumber) {
          // 推产卵任务到母巢
          // todo：动态数量控制
          spawn.addTask(worker.WorkType);
        }
      }
    }
  }
  // 查找能量建筑
  static findEnergyStructures(creep: Creep, methods: string) {
    let structures = creep.room.find(FIND_STRUCTURES, {
      filter: (structure: Structure) => {
        return (
          structure.structureType == STRUCTURE_EXTENSION ||
          structure.structureType == STRUCTURE_SPAWN ||
          structure.structureType == STRUCTURE_CONTAINER ||
          structure.structureType == STRUCTURE_TOWER ||
          structure.structureType == STRUCTURE_STORAGE
        );
      }
    });
    let arr: any[] = [];
    if (methods == "save") {
      arr = _.filter(_.values(structures), target => target.store.getFreeCapacity(RESOURCE_ENERGY) > 0);
    } else if (methods == "get") {
      arr = _.filter(_.values(structures), target => target.store.getUsedCapacity(RESOURCE_ENERGY) == 0);
    }
    let extension: StructureExtension[] = [];
    let spawn: StructureSpawn[] = [];
    let contatner: StructureContainer[] = [];
    let store: StructureStorage[] = [];
    let tower: StructureTower[] = [];
    for (let i = 0; i < arr.length; i++) {
      let target = arr[i];
      if (target) {
        if (target.structureType == STRUCTURE_EXTENSION) {
          extension.push(target);
        }
        if (target.structureType == STRUCTURE_TOWER) {
          tower.push(target);
        }
        if (target.structureType == STRUCTURE_SPAWN) {
          spawn.push(target);
        }
        if (target.structureType == STRUCTURE_CONTAINER) {
          contatner.push(target);
        }
        if (target.structureType == STRUCTURE_STORAGE) {
          store.push(target);
        }
      }
    }
    return { extension, spawn, contatner, store, tower };
  }
  /**
   *  按优先级查早储存点
   * e > s > c > st
   */
  static findCanSaveEnergyStructure(creep: Creep) {
    let targets = this.findEnergyStructures(creep, "save");
    if (targets.extension.length > 0) {
      return creep.pos.findClosestByPath(targets.extension);
    } else if (targets.spawn.length > 0) {
      return creep.pos.findClosestByPath(targets.spawn);
    } else if (targets.tower.length > 0) {
      return creep.pos.findClosestByPath(targets.tower);
    } else if (targets.contatner.length > 0) {
      return creep.pos.findClosestByPath(targets.contatner);
    } else if (targets.store.length > 0) {
      return creep.pos.findClosestByPath(targets.store);
    } else {
      return null;
    }
  }
  /**
   *  按优先级查早提取点
   */
  static findCanGetEnergyStructure(creep: Creep) {
    let targets = this.findEnergyStructures(creep, "get");
    if (targets.store.length > 0) {
      return creep.pos.findClosestByPath(targets.store);
    } else if (targets.contatner.length > 0) {
      return creep.pos.findClosestByPath(targets.contatner);
    } else if (targets.spawn.length > 0) {
      return creep.pos.findClosestByPath(targets.spawn);
    } else if (targets.extension.length > 0) {
      return creep.pos.findClosestByPath(targets.extension);
    } else {
      return null;
    }
  }
}

export default util;
