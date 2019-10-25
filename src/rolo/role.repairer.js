var roleRepairer = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.repairer && creep.carry.energy == 0) {
            creep.memory.repairer = false
            creep.say("挖矿")
        }
        if (
            !creep.memory.repairer &&
            creep.carry.energy == creep.carryCapacity
        ) {
            creep.memory.repairer = true
            creep.say("维修")
        }

        if (creep.memory.repairer) {
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax
            })
            if (targets.length > 0) {
                targets.sort((a, b) => (a.hits - b.hits) * 1)
                if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(targets[0], {
                        visualizePathStyle: { stroke: "#ff5555" }
                    })
                }
            }
        } else {
            let target = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES)
            if (target) {
                // 拾取物资
                if (creep.pickup(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.travelTo(target, {
                        visualizePathStyle: { stroke: "#ffaa00" }
                    })
                }
                // creep.say("拾取物资")
            } else {
                let targets = creep.room.find(FIND_STRUCTURES, {
                    filter: structure => {
                        return (
                            (structure.structureType == STRUCTURE_SPAWN ||
                                structure.structureType == STRUCTURE_CONTAINER) &&
                            structure.store.getUsedCapacity(RESOURCE_ENERGY) > 100
                        )
                    }
                })
                // console.log(targets)
                if (targets.length>0) {
                    let target = creep.pos.findClosestByPath(targets)
                    if (
                        creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
                    ) {
                        creep.travelTo(target, {
                            visualizePathStyle: { stroke: "#ffaa00" }
                        })
                    }
                } else {
                    let target = creep.pos.findClosestByPath(FIND_SOURCES)
                    if (creep.harvest(target) == ERR_NOT_IN_RANGE) {
                        creep.travelTo(target, {
                            visualizePathStyle: { stroke: "#ffaa00" }
                        })
                    }
                }
            }
        }
    }
}

module.exports = roleRepairer
