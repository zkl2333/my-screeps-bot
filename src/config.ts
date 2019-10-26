const config: any = {
  worker: {
    harvester: {
      WorkType: "harvester",
      lable: "W",
      PlanNumber: 2,
      body: [WORK, CARRY, MOVE]
    },
    builder: {
      WorkType: "builder",
      lable: "Z",
      PlanNumber: 2,
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
    },
    miner: {
      WorkType: "miner",
      lable: "M",
      PlanNumber: 2,
      body: [WORK, CARRY, MOVE]
    },
    transporter: {
      WorkType: "transporter",
      lable: "T",
      PlanNumber: 2,
      body: [CARRY, MOVE, CARRY, MOVE]
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
