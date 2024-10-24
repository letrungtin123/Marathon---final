export type TBrand = {
  _id: string;
  nameBrand: string;
  image: string;
  status: "active" | "inactive";
  country: string;
  desc: string;
  createdAt: string;
  updatedAt: string;
  products: string[];
};
