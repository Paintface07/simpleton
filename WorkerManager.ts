class WorkerManager {

    /**
     * Creates a new worker if able and returns a handle containing the UUID of the created creep
     * @param {StructureSpawn} spawn - the spawn to create the worker creep at
     * @returns {string} - the UUID of the creep
     */
    public static create(spawn: StructureSpawn) {
        const creeps = Game.creeps;
        const uuid = UUIDGenerator.generate();
        const result = spawn.spawnCreep([WORK, MOVE, CARRY, MOVE], uuid);

        // console.log('Current Creeps:');
        // for(let creep in creeps) {
        //     console.log('   - ' + creeps[creep].name);
        // }

        if(result === OK) {
            creeps[uuid].memory = new CreepStatus(CreepType.WORKER, false);
        } /*else {
            let msg = 'DEFAULT';
            switch (result) {
                case -1: msg = 'ERR_NOT_OWNER'; break;
                case -3: msg = 'ERR_NAME_EXISTS'; break;
                case -4: msg = 'ERR_BUSY'; break;
                case -6: msg = 'ERR_NOT_ENOUGH_ENERGY'; break;
                case -10: msg = 'ERR_INVALID_ARGS'; break;
                case -14: msg = 'ERR_RCL_NOT_ENOUGH'; break;
            }
            console.log('Creep not created: ' + msg);
        }*/

        return uuid;
    }

    public static tick(spawn: StructureSpawn) {
        const creeps = Game.creeps;
        for(let creep in creeps) {
            const c = creeps[creep];
            const stat = CreepStatus.from(c.memory);
            if(stat.type === CreepType.WORKER) {
                if(stat.working === true && c.carry.energy == 0) {
                    CreepStatus.set(c.name, new CreepStatus(CreepType.WORKER, false));
                } else if(stat.working === false && c.carry.energy >= c.carryCapacity) {
                    CreepStatus.set(c.name, new CreepStatus(CreepType.WORKER, true));
                }

                if(stat.working === true) {
                    const tResult = c.transfer(spawn, RESOURCE_ENERGY);

                    if(tResult === ERR_NOT_IN_RANGE) {
                        c.moveTo(spawn);
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