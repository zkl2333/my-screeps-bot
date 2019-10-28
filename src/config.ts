const config: any = {
  worker: {
    harvester: {
      WorkType: "harvester",
      lable: "W",
      PlanNumber: 0,
      baseEnergy: 200,
      baseBody: [WORK, CARRY, MOVE],
      ComponentEnergy: 200,
      Component: [WORK, CARRY, MOVE]
    },
    builder: {
      WorkType: "builder",
      lable: "Z",
      PlanNumber: 1,
      baseEnergy: 200,
      baseBody: [WORK, CARRY, MOVE],
      ComponentEnergy: 200,
      Component: [WORK, CARRY, MOVE]
    },
    upgrader: {
      WorkType: "upgrader",
      lable: "S",
      PlanNumber: 1,
      baseEnergy: 200,
      baseBody: [WORK, CARRY, MOVE],
      ComponentEnergy: 200,
      Component: [WORK, CARRY, MOVE]
    },
    repairer: {
      WorkType: "repairer",
      lable: "X",
      PlanNumber: 1,
      baseEnergy: 200,
      baseBody: [WORK, CARRY, MOVE],
      ComponentEnergy: 200,
      Component: [WORK, CARRY, MOVE]
    },
    miner: {
      WorkType: "miner",
      lable: "M",
      PlanNumber: 2,
      baseEnergy: 200,
      baseBody: [WORK, MOVE, CARRY],
      ComponentEnergy: 100,
      Component: [WORK]
    },
    transporter: {
      WorkType: "transporter",
      lable: "T",
      PlanNumber: 2,
      baseEnergy: 100,
      baseBody: [CARRY, MOVE],
      ComponentEnergy: 100,
      Component: [CARRY, MOVE]
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
