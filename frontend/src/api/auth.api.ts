import {api} from './apiInstance '

export interface loginBody {
  authId: string;
  password: string;
}

export const loginAPI = (payload:loginBody) => api.post("/auth/login", payload).then(res => res.data);
export const fetchMeAPI = () => api.get("/auth/getMe").then(res => res.data);