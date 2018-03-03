class CreepStatus {
    constructor(public type: CreepType, public working: boolean) {}
    public static from(status: any) : CreepStatus {
        return new CreepStatus(status.type, status.working);
    }
    public static set(creep: string, status: CreepStatus) {
        Game.creeps[creep].memory = status;
    }
}