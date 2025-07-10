
export class SponsorPending {
    id;
    companyName;
    natureOfBusiness;
    address;
    contactName;
    postcode;
    contactPhone;
    email;
    taxNumber;
    idea;
    additionalFileUrl;
    status;
    createdAt;
    updatedAt;
    constructor(id, companyName, natureOfBusiness, address, contactName, postcode, contactPhone, email, taxNumber, idea, additionalFileUrl, status, createdAt, updatedAt) {
        this.id = id;
        this.companyName = companyName;
        this.natureOfBusiness = natureOfBusiness;
        this.address = address;
        this.contactName = contactName;
        this.postcode = postcode;
        this.contactPhone = contactPhone;
        this.email = email;
        this.taxNumber = taxNumber;
        this.idea = idea;
        this.additionalFileUrl = additionalFileUrl;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}