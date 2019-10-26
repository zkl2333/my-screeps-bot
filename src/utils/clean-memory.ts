const cleanMemory = {
  cleanDeadCreeps: function cleanDeadCreeps() {
    // 清理内存
    for (const name in Memory.creeps) {
      if (!(name in Game.creeps)) {
        delete Memory.creeps[name];
      }
    }
  }
};

// console.log(JSON.stringify(Memory.creeps))
export default cleanMemory;
