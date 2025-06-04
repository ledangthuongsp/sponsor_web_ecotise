export class Material {
    id;
    name;
    pointsPerKg;
    co2SavedPerKg;
    type;
    constructor(id, name, pointsPerKg, co2SavedPerKg, type) {
        this.id = id;
        this.name = name;
        this.pointsPerKg = pointsPerKg;
        this.co2SavedPerKg = co2SavedPerKg;
        this.type = type;
    }
}
