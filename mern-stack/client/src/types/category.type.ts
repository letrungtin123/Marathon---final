export type TCategory = {
  _id: string;
  nameCategory: string;
  image: string;
  status: "active" | "inactive";
  desc: string;
  products: string[];
  createdAt: string;
  updatedAt: string;
};
export type TFormCategory = Pick<TCategory, "nameCategory" | "image" | "desc">;
