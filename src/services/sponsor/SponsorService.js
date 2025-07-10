import { BASE_API_URL } from '../../constants/APIConstants';

// Create a new sponsor
export const createSponsor = async (formData) => {
  try {
    const response = await fetch(`${BASE_API_URL}/sponsor/create`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const newSponsor = await response.json();
    return newSponsor;
  } catch (e) {
    console.error('Error creating sponsor:', e);
    throw e;
  }
};

// Update an existing sponsor
export const updateSponsor = async (id, formData) => {
  try {
    const response = await fetch(`${BASE_API_URL}/sponsor/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const updatedSponsor = await response.json();
    return updatedSponsor;
  } catch (e) {
    console.error('Error updating sponsor:', e);
    throw e;
  }
};

// Get sponsor by ID
export const getSponsorById = async (id) => {
  try {
    const response = await fetch(`${BASE_API_URL}/sponsor/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const sponsor = await response.json();
    return sponsor;
  } catch (e) {
    console.error('Error fetching sponsor:', e);
    throw e;
  }
};

// Get all sponsors
export const getAllSponsors = async () => {
  try {
    const response = await fetch(`${BASE_API_URL}/sponsor/get-all-sponsors`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const sponsors = await response.json();
    return sponsors;
  } catch (e) {
    console.error('Error fetching all sponsors:', e);
    throw e;
  }
};

// Delete sponsor by ID
export const deleteSponsor = async (id) => {
  try {
    const response = await fetch(`${BASE_API_URL}/sponsor/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return { success: true };
  } catch (e) {
    console.error('Error deleting sponsor:', e);
    throw e;
  }
};

// Check if an email already exists
export const checkEmail = async (email) => {
  try {
    const response = await fetch(`${BASE_API_URL}/sponsor/check-email?email=${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const result = await response.json();
    return result.exists;
  } catch (e) {
    console.error('Error checking email:', e);
    throw e;
  }
};

export const getPendingSponsors = async () => {
  try {
    const response = await fetch(`${BASE_API_URL}/sponsor/admin/get-pending-sponsor`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (e) {
    console.error('Error checking email:', e);
    throw e;
  }
};

export const confirmSponsor = async (id) => {
  try {
    // Truyền id qua query string
    const response = await fetch(`${BASE_API_URL}/sponsor/admin/confirm?id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (e) {
    console.error('Error confirming sponsor:', e);
    throw e;
  }
}

export const changePassword = async (sponsorId, oldPassword, newPassword) => {
  try {
    // Use a URLSearchParams to encode query parameters
    const url = new URL(`${BASE_API_URL}/sponsor/sponsor/change-password`);
    const params = new URLSearchParams({
      sponsorId: sponsorId,
      oldPassword: oldPassword,
      newPassword: newPassword
    });

    const response = await fetch(`${url}?${params.toString()}`, {
      method: 'POST', // POST method
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      // If status is OK (200), assume success
      console.log("Password updated successfully");
      return { success: true };
    } else {
      // If status is not OK, log the error message
      const errorText = await response.text();
      console.error(`Error: ${response.status} - ${errorText}`);
      throw new Error(`Error: ${response.status} - ${errorText}`);
    }
  } catch (e) {
    console.error('Error changing password:', e);
    throw e;
  }
};

