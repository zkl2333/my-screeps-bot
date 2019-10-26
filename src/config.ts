const config: any = {
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
      PlanNumber: 4,
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

export default config;
