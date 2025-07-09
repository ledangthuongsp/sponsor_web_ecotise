export class Donation {
    constructor(
        id,
        title,
        name,
        description,
        startDate,
        endDate,
        sponsorImages,
        coverImageUrl,
        totalDonations,
        sponsorId,
        sponsorName,
        createdAt,
        updatedAt
    ) {
        this.id = id;
        this.title = title;
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.sponsorImages = sponsorImages;
        this.coverImageUrl = coverImageUrl;
        this.totalDonations = totalDonations;
        this.sponsorId = sponsorId;
        this.sponsorName = sponsorName;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
