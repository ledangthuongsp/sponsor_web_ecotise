import axios from 'axios';
import { BASE_API_URL } from '../constants/APIConstants'; // Đảm bảo rằng BASE_API_URL đã được định nghĩa đúng

// Tạo Donation
// Hàm này giờ chỉ nhận một đối tượng FormData đã được chuẩn bị đầy đủ
export const createDonation = async (formData) => {
    try {
        const response = await axios.post(`${BASE_API_URL}/donate/sponsor/create`, formData, {
            // Khi gửi FormData qua Axios, trình duyệt sẽ tự động đặt 'Content-Type' và 'boundary'.
            // Việc đặt thủ công 'Content-Type': 'multipart/form-data' ở đây thường là không cần thiết và có thể gây lỗi.
            // Do đó, chúng ta sẽ bỏ dòng headers này đi.
            // headers: {
            //     'Content-Type': 'multipart/form-data',
            // },
        });
        return response.data; // Trả về dữ liệu phản hồi từ server
    } catch (error) {
        console.error("Error creating donation:", error.response ? error.response.data : error.message);
        throw error; // Ném lỗi để component có thể bắt và hiển thị thông báo
    }
};

// Cập nhật Donation
// Hàm này giờ chỉ nhận id (nếu cần cho URL) và một đối tượng FormData đã được chuẩn bị
export const updateDonation = async (id, formData) => {
    try {
        const response = await axios.put(`${BASE_API_URL}/donate/sponsor/update`, formData, {
            // Tương tự, bỏ dòng headers này đi.
            // headers: {
            //     'Content-Type': 'multipart/form-data',
            // },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating donation:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// Xóa Donation (Không cần thay đổi, vì nó không liên quan đến FormData)
export const deleteDonation = async (donationId) => {
    try {
        const response = await axios.delete(`${BASE_API_URL}/donate/sponsor/delete-donation-by-id`, {
            params: { donationId },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting donation:", error);
        throw error;
    }
};

// Lấy danh sách donations của sponsor (Không cần thay đổi)
export const getDonationsBySponsorId = async (sponsorId) => {
    try {
        const response = await axios.get(`${BASE_API_URL}/donate/sponsor/${sponsorId}/donations`);
        return response.data;
    } catch (error) {
        console.error("Error fetching donations:", error);
        throw error;
    }
};