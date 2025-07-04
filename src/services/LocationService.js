import axios from 'axios';
import {Location} from '../models/Location'
import { BASE_API_URL } from '../constants/APIConstants';

export const getAllLocations = async () => {
    try {
        const response = await axios.get(`${BASE_API_URL}/location/get-all`);

        console.log(response.data);

        const locations = response.data.map(location => new Location(
            location.id,
            location.locationName,
            location.description,
            location.typeOfLocation,
            location.latitude,
            location.longitude,
            location.backGroundImgUrl,
            location.imgDetailsUrl,
        ))
        return locations
    } catch (e) {
        console.error('Error fetching:', e);
        throw e;
    }
}


export const createLocation = async (locationName, description, address, latitude, longitude, formData) => {
    try {

        const response = await axios.post(`${BASE_API_URL}/location/create-new-location?locationName=${locationName}&description=${description}&address=${address}&latitude=${latitude}&longitude=${longitude}`, formData,
           );
        console.log(response.data);
        console.log(response.status);

        if (response.status === 200) {
            return true
        }
        console.log('post API')

        return false

    } catch (e) {
        console.error('Error fetching:', e);
        return false;


    }
}

export const updateLocation = async (
  id,
  locationName,
  description,
  address,
  latitude,
  longitude,
  formData
) => {
  try {
    const response = await axios.put(
      `${BASE_API_URL}/location/update-location?locationId=${id}&locationName=${locationName}&description=${description}&address=${address}&latitude=${latitude}&longitude=${longitude}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.status === 200;
  } catch (e) {
    console.error("Error updating location:", e);
    return false;
  }
};
