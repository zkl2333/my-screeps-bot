// 类型“CreepMemory”上不存在属性“role”。
declare class CreepMemory {
  [x: string]: any;
  /** role是Creep的分类 */
  role: string;
}

declare class SpawnMemory {
  [x: string]: any;
  /** role是Creep的分类 */
  role: string;
}

interface Structure {
  store: any;
}

interface StructureSpawn {
  addTask(type: string): void;
  work(): void;
  mainSpawn(taskName: string): boolean;
  store: any;
}
