module.exports.loop = () => {
    let homeSpawn = Game.spawns['Spawn1'];

    // console.log(homeSpawn.name + ' has energy: ' + homeSpawn.energy);

    for(let name in Memory.creeps) {
        if(typeof Game.creeps[name] === 'undefined') {
            delete Memory.creeps[name];
        }
    }

    let workerCount = 0;
    let upgraderCount = 0;
    for(let creep in Game.creeps) {
        const type = CreepStatus.from(Game.creeps[creep].memory).type;
        if(type === CreepType.WORKER) {
            workerCount++;
        } else if(type === CreepType.UPGRADER) {
            upgraderCount++;
        }
    }

    console.log('You currently have ' + workerCount + ' workers');
    console.log('You currently have ' + upgraderCount + ' upgraders');

    if(workerCount < 16) {
        const worker = WorkerManager.create(homeSpawn);
    } else if(workerCount > 16) {
        for(let creep in Game.creeps) {
            if(workerCount > 16 && CreepStatus.from(Game.creeps[creep].memory).type === CreepType.WORKER) {
                Game.creeps[creep].suicide();
                workerCount--;
            }
        }
    } else if(upgraderCount < 32) {
        const upgrader = UpgraderManager.create(homeSpawn);
    } else if(upgraderCount > 32) {
        for(let creep in Game.creeps) {
            if(upgraderCount > 32 && CreepStatus.from(Game.creeps[creep].memory).type === CreepType.UPGRADER) {
                Game.creeps[creep].suicide();
                upgraderCount--;
            }
        }
    }
    WorkerManager.tick(homeSpawn);
    if(typeof homeSpawn.room.controller !== 'undefined') {
        UpgraderManager.tick(homeSpawn.room.controller);
    }
};