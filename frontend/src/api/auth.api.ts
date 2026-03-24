import {api} from './apiInstance.api'

export interface loginBody {
  authId: string;
  password: string;
}

export const loginAPI = (payload:loginBody) => api.post("/auth/login", payload).then(res => res.data);
export const fetchMeAPI = () => api.get("/auth/getMe").then(res => res.data);
export const logoutAPI = () => api.post("/auth/logout").then(() => true);
export const changePasswordAPI = (oldPass:string, newPass:string) =>
  api.post("/api/user/changePass", { oldPass, newPass }).then(res => res.data);