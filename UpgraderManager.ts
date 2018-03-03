class UpgraderManager {

    /**
     * Creates a new worker if able and returns a handle containing the UUID of the created creep
     * @param {StructureSpawn} spawn - the spawn to create the worker creep at
     * @returns {string} - the UUID of the creep
     */
    public static create(spawn: StructureSpawn) {
        const creeps = Game.creeps;
        const uuid = UUIDGenerator.generate();
        const result = spawn.spawnCreep([WORK, MOVE, CARRY, MOVE], uuid);

        if(result === OK) {
            creeps[uuid].memory = new CreepStatus(CreepType.UPGRADER, false);
        }

        return uuid;
    }

    public static tick(controller: StructureController) {
        const creeps = Game.creeps;
        for(let creep in creeps) {
            const c = creeps[creep];
            const stat = CreepStatus.from(c.memory);
            if(stat.type === CreepType.UPGRADER) {
                if(stat.working === true && c.carry.energy == 0) {
                    CreepStatus.set(c.name, new CreepStatus(CreepType.UPGRADER, false));
                } else if(stat.working === false && c.carry.energy >= c.carryCapacity) {
                    CreepStatus.set(c.name, new CreepStatus(CreepType.UPGRADER, true));
                }

                if(stat.working === true) {
                    const tResult = c.transfer(controller, RESOURCE_ENERGY);

                    if(tResult === ERR_NOT_IN_RANGE) {
                        c.moveTo(controller);
                    }
                } else {
                    const source = c.pos.findClosestByPath(FIND_SOURCES);
                    const hResult = c.harvest(source);
                    if(hResult === ERR_NOT_IN_RANGE) {
                        c.moveTo(source);
                    }
                }
            }
        }
    }
}