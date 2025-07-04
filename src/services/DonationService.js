import axios from 'axios';
import {  format } from "date-fns";
import {Donation} from '../models/Donation'
import { BASE_API_URL } from '../constants/APIConstants';
export const getAllDonations = async () => {
    try {
        const response = await axios.get(`${BASE_API_URL}/donate/get-all-donations`);
        console.log(response.data);

        const donations = response.data.map(donation => new Donation(
            donation.id,
            donation.title,
            donation.name,
            donation.description,
            donation.startDate,
            donation.endDate,
            donation.sponsorImages,
            donation.coverImageUrl,
            donation.totalDonations
        ))
        return donations
    } catch (e) {
        console.error('Error fetching:', e);
        throw e;
    }
}

export const createDonation = async (title, name, description, startDate, endDate, formData) => {

    console.log(title)
    console.log(name)
    console.log(description)
    console.log(startDate)
    console.log(endDate)
    console.log(formData)
    try {
        console.log('post API')
        const response = await axios.post(`${BASE_API_URL}/admin/donate/create-donation?title=${title}&name=${name}&description=${description}&startDate=${startDate}&endDate=${endDate}&totalDonations=0`, formData,
           );
        console.log(response.data);
        console.log(response.status);


        if (response.status === 200) {
            return true
        }

        return false

    } catch (e) {
        console.error('Error fetching:', e);
        return false;
    }
}

export const updateDonation = async (id, title, name, description, startDate, endDate, formData) => {
    try {
        const response = await axios.put(`${BASE_API_URL}/admin/donate/update-donation/${id}?title=${title}&name=${name}&description=${description}&startDate=${startDate}&endDate=${endDate}`, formData);
        console.log(response.data);
        console.log(response.status);
        if (response.status === 200 || response.status == 201) {
            return true
        }
        return false
    } catch (e) {
        console.error('Error fetching:', e);
        return false;
    }
}

export const deleteDonation = async (id) => {
    try {
        const response = await axios.delete(`${BASE_API_URL}/delete-donation-by-id?donationId=${id}`);
        console.log(response.data);
        console.log(response.status);
        if (response.status === 200 || response.status == 201) {
            return true
        }
        return false
    } catch (e) {
        console.error('Error fetching:', e);
        return false;
    }
}


