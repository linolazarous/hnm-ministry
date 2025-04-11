export const fetchUserProfile = async (userId) => {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch profile');
  return await response.json();
};

export const updateUserProfile = async (userId, profileData) => {
  const response = await fetch(`/api/users/${userId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(profileData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update profile');
  }
  
  return await response.json();
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  const response = await fetch(`/api/users/${userId}/password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ currentPassword, newPassword })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Password change failed');
  }
  
  return await response.json();
};