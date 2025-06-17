
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };
  console.log(import.meta.env )
  const response = await fetch(`${import.meta.env.VITE_SERVER}/api${endpoint}`, config);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An error occurred');
  }

  return response.json();
};
