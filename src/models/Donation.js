export class Donation {
    id
    title
    name
    description
    startDate
    endDate
    sponsorImages
    coverImages
    totalDonations
    constructor(id, title, name, description, startDate, endDate, sponsorImages, coverImages, totalDonations) {
        this.id = id;
        this.title = title;
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.sponsorImages = sponsorImages;
        this.coverImages = coverImages;
        this.totalDonations = totalDonations
    }
}

