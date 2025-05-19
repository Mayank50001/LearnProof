import API from './api';

export const loginUser = async (email , password) => {
    const res = await API.post('/login/', { email , password});
    return res.data;
};

export const signupUser = async (email , password) => {
    const res = await API.post({ email , password});
    return res.data;
};