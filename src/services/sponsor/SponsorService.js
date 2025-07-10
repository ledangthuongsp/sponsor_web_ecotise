import { BASE_API_URL } from '../constants/APIConstants';

export const getAllSponsors = async () => {
    try {
        const response = await fetch(`${BASE_API_URL}/sponsor/get-all-sponsors`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const sponsors = await response.json();
        console.log(sponsors);
        return sponsors;
    } catch (e) {
        console.error('Error fetching:', e);
        throw e;
    }
}

export const getSponsorById = async (sponsorId) => {
    try {
        const response = await fetch(`${BASE_API_URL}/sponsor/get-sponsor-by-id/${sponsorId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const sponsor = await response.json();
        console.log(sponsor);
        return sponsor;
    } catch (e) {
        console.error('Error fetching:', e);
        throw e;
    }
}

export const updateSponsor = async (sponsorId, formData) => {
    try {
        const response = await fetch(`${BASE_API_URL}/sponsor/update-sponsor/${sponsorId}`, {
            method: 'PUT',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const updatedSponsor = await response.json();
        console.log(updatedSponsor);
        return updatedSponsor;
    } catch (e) {
        console.error('Error updating sponsor:', e);
        throw e;
    }
}

export const deleteSponsor = async (sponsorId) => {
    try {
        const response = await fetch(`${BASE_API_URL}/sponsor/delete-sponsor/${sponsorId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log(result);
        return result;
    } catch (e) {
        console.error('Error deleting sponsor:', e);
        throw e;
    }
}

export const confirmNewSponsor = async (sponsorId) => {
    try {
        const response = await fetch(`${BASE_API_URL}/sponsor/confirm-new-sponsor/${sponsorId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const confirmedSponsor = await response.json();
        console.log(confirmedSponsor);
        return confirmedSponsor;
    } catch (e) {
        console.error('Error confirming new sponsor:', e);
        throw e;
    }
}