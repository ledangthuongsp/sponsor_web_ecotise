import axios from 'axios';
import { BASE_API_URL } from '../constants/APIConstants';
import { Material } from '../models/Material';

// Lấy tất cả materials (trả về mảng các instance của Material)
export const getAllMaterials = async () => {
    try {
        const response = await axios.get(`${BASE_API_URL}/materials/get-all-materials`);
        const materials = response.data.map(material => new Material(
            material.id,
            material.name,
            material.pointsPerKg,
            material.co2SavedPerKg,
            material.type
        ));
        return materials;
    } catch (e) {
        console.error('Error fetching materials:', e);
        return [];
    }
};

// Gán/cập nhật danh sách material cho location
export const updateMaterialsForLocation = async (locationId, materialIds) => {
    try {
        const res = await axios.put(`${BASE_API_URL}/location/update-materials`, {
            locationId,
            materialIds,
        });
        return res.status === 200;
    } catch (e) {
        console.error("Error updating materials:", e);
        return false;
    }
};

// Xóa toàn bộ materials khỏi location
export const removeAllMaterials = async (locationId) => {
    try {
        const res = await axios.delete(`${BASE_API_URL}/location/${locationId}/remove-materials`);
        return res.status === 200;
    } catch (e) {
        console.error("Error removing all materials:", e);
        return false;
    }
};

// Thêm lịch mở cửa mới
export const addOpeningSchedule = async (locationId, dayOfWeek, timeSlots) => {
    try {
        const res = await axios.post(`${BASE_API_URL}/location/schedules`, {
            locationId,
            dayOfWeek,
            timeSlots,
        });
        return res.status === 200;
    } catch (e) {
        console.error("Error adding opening schedule:", e);
        return false;
    }
};

// Cập nhật dayOfWeek của schedule
export const updateScheduleDayOfWeek = async (scheduleId, locationId, newDayOfWeek) => {
    try {
        const res = await axios.put(`${BASE_API_URL}/location/schedules/dayOfWeek`, {
            scheduleId,
            locationId,
            newDayOfWeek,
        });
        return res.status === 200;
    } catch (e) {
        console.error("Error updating dayOfWeek:", e);
        return false;
    }
};

// Cập nhật danh sách timeSlot cho schedule
export const updateTimeSlotsInSchedule = async (scheduleId, locationId, timeSlots) => {
    try {
        const res = await axios.post(`${BASE_API_URL}/location/schedules/time-slots`, {
            scheduleId,
            locationId,
            timeSlots,
        });
        return res.status === 200;
    } catch (e) {
        console.error("Error updating time slots:", e);
        return false;
    }
};

// Xóa 1 schedule theo dayOfWeek
export const deleteOpeningSchedule = async (locationId, dayOfWeek) => {
    try {
        const res = await axios.delete(`${BASE_API_URL}/location/schedules/${locationId}/${dayOfWeek}`);
        return res.status === 200;
    } catch (e) {
        console.error("Error deleting opening schedule:", e);
        return false;
    }
};

// Các service location khác (giữ nguyên hoặc sửa path cho đúng backend của bạn)
export const getAllLocations = async (sponsorId) => {
    try {
        const response = await axios.get(`${BASE_API_URL}/location/sponsor/${sponsorId}`);
        return response.data;
    } catch (e) {
        console.error('Error fetching sponsor locations:', e);
        throw e;
    }
};

export const createLocation = async (locationName, description, address, latitude, longitude, formData, sponsorId) => {
    try {
        const response = await axios.post(
            `${BASE_API_URL}/location/sponsor/${sponsorId}`,
            formData, {
                params: { locationName, description, address, latitude, longitude },
                headers: { "Content-Type": "multipart/form-data" }
            }
        );
        return response.status === 200;
    } catch (e) {
        console.error('Error creating location:', e);
        return false;
    }
};

export const updateLocation = async (
    id, locationName, description, address, latitude, longitude, formData
) => {
    try {
        const response = await axios.put(
            `${BASE_API_URL}/location/${id}`,
            formData, {
                params: { locationName, description, address, latitude, longitude },
                headers: { "Content-Type": "multipart/form-data" }
            }
        );
        return response.status === 200;
    } catch (e) {
        console.error("Error updating location:", e);
        return false;
    }
};
