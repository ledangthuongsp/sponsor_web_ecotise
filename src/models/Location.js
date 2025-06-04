export class Location{
    id;
    locationName;
    description;
    typeOfLocation;
    latitude;
    longitude;
    backGroundImgUrl;
    imgDetailsUrl;

    constructor(id, locationName, description, typeOfLocation, latitude, longitude, backGroundImgUrl, imgDetailsUrl) {
        this.id = id;
        this.locationName = locationName;
        this.description = description;
        this.typeOfLocation = typeOfLocation;
        this.latitude = latitude;
        this.longitude = longitude;
        this.backGroundImgUrl = backGroundImgUrl;
        this.imgDetailsUrl = imgDetailsUrl;
    }

}