export type TUser = {
  _id: string;
  email: string;
  role: string;
  updatedAt: string;
  createdAt: string;
};

export interface TProfile {
  _id?: string;
  fullname: string;
  email: string;
  phone: string | number;
  address: string;
  updatedAt?: Date;
  status?: string;
  avatar?: string;
}