import axios from 'axios';
import { Reward } from '../models/Reward';
import { BASE_API_URL } from '../constants/APIConstants';

// ==============================
// CRUD REWARD ITEM
// ==============================

export const getAllRewardItem = async () => {
  try {
    const response = await axios.get(`${BASE_API_URL}/reward/get-all-reward`);
    const rewards = response.data.map(reward => new Reward(reward));
    return rewards;
  } catch (e) {
    console.error('Error fetching rewards:', e);
    throw e;
  }
};

export const addNewRewardItem = async (rewardItem) => {
  try {
    const response = await axios.post(`${BASE_API_URL}/reward/add-new-reward`, rewardItem);
    return response.data;
  } catch (error) {
    console.error('Error adding reward item:', error);
    return false;
  }
};

export const updateRewardItem = async (id, formData) => {
  try {
    const response = await axios.put(`${BASE_API_URL}/reward/update-reward/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating reward item:', error);
    return false;
  }
};

export const deleteRewardItem = async (id) => {
  try {
    const response = await axios.delete(`${BASE_API_URL}/reward/delete-reward/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting reward item:', error);
    return false;
  }
};

// ==============================
// STOCK & LOCATION OPERATIONS
// ==============================

export const getLowStockItems = async (locationId, threshold = 3) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/reward/location/low-stock`, {
      params: { locationId, threshold },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching low stock items:', error);
    return [];
  }
};

export const getStockByLocation = async (locationId) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/reward/stock/location`, {
      params: { locationId },
    });
    return response.data;
  } catch (e) {
    console.error("Error fetching stock by location", e);
    return [];
  }
};

export const getStockByRewardItemId = async (rewardId) => {
  try {
    const response = await axios.get(`${BASE_API_URL}/reward/stock/by-reward`, {
      params: { rewardItemId: rewardId },
    });
    return response.data;
  } catch (e) {
    console.error("Error fetching stock by reward item", e);
    return [];
  }
};

// ==============================
// IMPORT REQUEST
// ==============================

export const createImportRequest = async (locationId, itemDetails) => {
  try {
    const payload = {
      locationId,
      itemDetails,
    };
    const response = await axios.post(`${BASE_API_URL}/reward/import/admin/request`, payload);
    return response.status === 200;
  } catch (e) {
    console.error("Error creating import request", e);
    return false;
  }
};

export const requestRewardImport = async (payload) => {
  try {
    const response = await axios.post(`${BASE_API_URL}/reward/import/admin/request`, payload);
    return response.data;
  } catch (error) {
    console.error('Error sending import request:', error);
    return false;
  }
};
