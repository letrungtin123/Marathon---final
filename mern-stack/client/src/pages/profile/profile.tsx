import React, { useState, useEffect } from "react";
import { Card, Avatar, Descriptions, Input, Button, message } from "antd";
import { cn } from "@/lib/utils";
import { format, isValid } from "date-fns";
import { TProfile } from "@/types/user.type";
import { userApi } from "@/api/user.api";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import path from "@/configs/path.config";

interface ProfileCardProps {
  token: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ token }) => {
  const [formData, setFormData] = useState<TProfile>({
    _id: "",
    fullname: "",
    email: "",
    phone: "",
    address: "",
    updatedAt: new Date(),
    status: "",
    avatar: "",
  });

  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await userApi.getProfileDetail();
        setFormData(data);
        setUpdatedAt(data.updatedAt ? new Date(data.updatedAt) : null);
      } catch (error) {
        message.error("Không thể tải thông tin người dùng.");
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdate = async () => {
    try {
      await userApi.updateProfile(formData, token);
      setUpdatedAt(new Date());
      message.success("Cập nhật thành công!");
      navigate(path.home); 
    } catch (error) {
      message.error("Đã xảy ra lỗi khi cập nhật!");
      console.error("Update failed:", error);
    }
  };

  const formattedUpdatedAt =
    updatedAt && isValid(updatedAt)
      ? format(updatedAt, "dd/MM/yyyy")
      : "Chưa cập nhật";

  return (
    <Card
      className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden"
      cover={
        <div className="bg-gray-200 flex justify-center items-center p-4">
          <Avatar
            src={formData.avatar || "https://picsum.photos/536/354"}
            size={128}
            className={cn("rounded-full shadow-md")}
            alt="User Avatar"
          />
        </div>
      }
    >
      <div className="p-4 text-center">
        <h2 className="text-xl font-semibold">
          <Input
            name="fullname"
            value={formData.fullname}
            onChange={handleInputChange}
            placeholder="Họ tên"
          />
        </h2>
      </div>
      <Descriptions column={1} bordered className="mb-4">
        <Descriptions.Item label="Email">
          <Input
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="text-blue-600"
          />
        </Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">
          <Input
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Số điện thoại"
          />
        </Descriptions.Item>
        <Descriptions.Item label="Địa chỉ">
          <Input
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Địa chỉ"
          />
        </Descriptions.Item>
        <Descriptions.Item label="Cập nhật vào lúc">
          <span>{formattedUpdatedAt}</span>
        </Descriptions.Item>
      </Descriptions>
      <div className="flex justify-center">
        <Button type="primary" onClick={handleUpdate}>
          Cập nhật
        </Button>
      </div>
    </Card>
  );
};

export default ProfileCard;
