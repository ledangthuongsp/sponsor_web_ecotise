import axios from 'axios';
import { BASE_API_URL } from '../constants/APIConstants';
const API_URL = `${BASE_API_URL}/api/quiz-topics`;

export const getAllQuizTopics = async () => {
    try {
        const response = await axios.get(`${API_URL}/get-all`);
        return response.data;
    } catch (error) {
        console.error('Error fetching quiz topics:', error);
        return [];
    }
};

export const addNewQuizTopic = async (topicName, description, file) => {
    try {
        const formData = new FormData();
        formData.append('multipartFile', file);

        console.log(file)

        const response = await axios.post(`${API_URL}/add-new`, formData, {
            params: {
                topicName,
                description
            },
            headers: {
                'Content-Type': 'multipart/form-data',
                // Add authorization header if needed
                // 'Authorization': 'Bearer your_api_key_or_token'
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error adding new quiz topic:', error);
        return false;
    }
};

export const updateQuizTopic = async (id, topicName, description, file) => {
    try {
        const formData = new FormData();
        if (file) {
            formData.append('multipartFile', file);
        }

        const response = await axios.put(`${API_URL}/update/${id}`, formData, {
            params: {
                topicName,
                description
            },
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error updating quiz topic:', error);
        return false;
    }
};


export const deleteQuizTopic = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting quiz topic:', error);
        return false;
    }
};
