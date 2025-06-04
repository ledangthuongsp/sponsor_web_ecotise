import axios from 'axios';
import { BASE_API_URL } from '../constants/APIConstants';

export const getAllQuizQuestions = async (topicId) => {
    try {
        const response = await axios.get(`${BASE_API_URL}/api/quiz-questions/get-all-question-by-topic`, {
            params: { id: topicId },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching quiz questions:', error);
        return [];
    }
};

export const addNewQuizQuestion = async (topicId, questionText, correctAnswer, incorrectAnswer1, incorrectAnswer2) => {
    try {
        const response = await axios.post(`${BASE_API_URL}/api/quiz-questions/add-new-question-to-topic`, {
            questionText,
            correctAnswer,
            incorrectAnswer1,
            incorrectAnswer2,
        }, {
            params: { topicId }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding new quiz question:', error);
        return false;
    }
};

export const updateQuizQuestion = async (id, questionText, correctAnswer, incorrectAnswer1, incorrectAnswer2) => {
    try {
        const response = await axios.put(`${BASE_API_URL}/api/quiz-questions/update/${id}`, {
            questionText,
            correctAnswer,
            incorrectAnswer1,
            incorrectAnswer2,
        }, {
            headers: {
                'Content-Type': 'application/json',
                // Add authorization header if needed
                // 'Authorization': 'Bearer your_api_key_or_token'
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating quiz question:', error);
        return false;
    }
};

export const deleteQuizQuestion = async (id) => {
    try {
        const response = await axios.delete(`${BASE_API_URL}/api/quiz-questions/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting quiz question:', error);
        return false;
    }
};
