const util = require("util")
var roleBuilder = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false
            creep.memory.targetId = undefined
            creep.say("🔄 harvest")
        }
        if (
            !creep.memory.building &&
            creep.carry.energy == creep.carryCapacity
        ) {
            creep.memory.building = true
            // let targets = creep.room.find(FIND_CONSTRUCTION_SITES)
            //  let target = util.ClosestTarget(creep, targets)
            let target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES)
            creep.memory.targetId = target.id
            // creep.target = Game.getObjectById
            creep.say("🚧 build")
        }

        if (creep.memory.building) {
            // let targets = creep.room.find(FIND_CONSTRUCTION_SITES)
            let target =
                Game.getObjectById(creep.memory.targetId) ||
                creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES)
            // if (targets.length > 0) {
            if (creep.build(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {
                    visualizePathStyle: { stroke: "#ffffff" }
                })
                // }
            }
        } else {
            // let sources = creep.room.find(FIND_SOURCES)
            // let target = util.ClosestTarget(creep, sources)
            let target = creep.pos.findClosestByPath(FIND_SOURCES)
            // console.log(creep.id,"to",target.id)
            if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {
                    visualizePathStyle: { stroke: "#ffaa00" }
                })
            }
        }
    }
}

module.exports = roleBuilder
