export class Reward {
    constructor({
        id = null,
        rewardItemUrl = [],
        pointCharge = 0.0,
        itemName = "",
        itemDescription = "",
    } = {}) {
        this.id = id;
        this.rewardItemUrl = rewardItemUrl;
        this.pointCharge = pointCharge;
        this.itemName = itemName;
        this.itemDescription = itemDescription;
    }
}
