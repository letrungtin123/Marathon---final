import { TProfile } from "./../types/user.type";
import { TResponseDetail } from "@/types/common.type";
import { TUser } from "@/types/user.type";
import http from "@/configs/instance.config";

export const userApi = {
  getProfile: async (): Promise<TResponseDetail<TUser>> => {
    const response = await http.get(`/me`);
    return response.data;
  },
  getProfileDetail: async (): Promise<TResponseDetail<TProfile>> => {
    const response = await http.get(`/me`);
    return response.data;
  },

  updateProfile: async (body: TProfile, token: string) => {
    const response = await http.patch(`/me`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};
