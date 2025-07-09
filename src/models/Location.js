export class Location {
  id;
  locationName;
  description;
  typeOfLocation;
  latitude;
  longitude;
  backGroundImgUrl;
  imgDetailsUrl;
  sponsor;
  materials;
  openingSchedules;

  constructor(
    id,
    locationName,
    description,
    typeOfLocation,
    latitude,
    longitude,
    backGroundImgUrl,
    imgDetailsUrl,
    sponsor,
    materials,
    openingSchedules
  ) {
    this.id = id;
    this.locationName = locationName;
    this.description = description;
    this.typeOfLocation = typeOfLocation;
    this.latitude = latitude;
    this.longitude = longitude;
    this.backGroundImgUrl = backGroundImgUrl;
    this.imgDetailsUrl = imgDetailsUrl;
    this.sponsor = sponsor;
    this.materials = materials;
    this.openingSchedules = openingSchedules.map(schedule => ({
      ...schedule,
      dayOfWeek: this.translateDayOfWeek(schedule.dayOfWeek)
    }));
  }

  // Ánh xạ ngày từ tiếng Anh sang tiếng Việt
  translateDayOfWeek(day) {
    const dayMap = {
      MONDAY: "Thứ Hai",
      TUESDAY: "Thứ Ba",
      WEDNESDAY: "Thứ Tư",
      THURSDAY: "Thứ Năm",
      FRIDAY: "Thứ Sáu",
      SATURDAY: "Thứ Bảy",
      SUNDAY: "Chủ Nhật"
    };
    return dayMap[day] || day;
  }
}
