
export class Sponsor {
    id;
    companyUsername;
    avatarUrl;
    companyName;
    companyPhoneNumberContact;
    companyEmailContact;
    companyAddress;
    businessDescription;
    companyDirectorName;
    companyTaxNumber;
    companyPoints;
    constructor(id, companyUsername, avatarUrl, companyName, companyPhoneNumberContact, companyEmailContact, companyAddress, businessDescription, companyDirectorName, companyTaxNumber, companyPoints) {
        this.id = id;
        this.companyUsername = companyUsername;
        this.avatarUrl = avatarUrl;
        this.companyName = companyName;
        this.companyPhoneNumberContact = companyPhoneNumberContact;
        this.companyEmailContact = companyEmailContact;
        this.companyAddress = companyAddress;
        this.businessDescription = businessDescription;
        this.companyDirectorName = companyDirectorName;
        this.companyTaxNumber = companyTaxNumber;
        this.companyPoints = companyPoints;
    }
}