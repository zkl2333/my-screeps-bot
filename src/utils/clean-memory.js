const cleanMemory = {
    cleanDeadCreeps: function cleanDeadCreeps() {
        for (let i in Memory.creeps) {
            if (Game.creeps[i] === undefined) {
                delete Memory.creeps[i]
            }
        }
    }
}

// console.log(JSON.stringify(Memory.creeps))
module.exports = cleanMemory
