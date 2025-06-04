
export class AchivementLevel {
    id;
    name;
    description;
    imgUrl;
    iconUrl;
    maxIndex;
    achivement ;

    constructor(id, name, description, imgUrl, iconUrl, maxIndex, achivement) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.imgUrl = imgUrl;
        this.iconUrl = iconUrl;
        this.maxIndex = maxIndex;
        this.achivement = achivement;
    }
}