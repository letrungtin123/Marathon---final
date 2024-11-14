import React, { useState, useEffect } from "react";
import { Card, Avatar, Descriptions, Input, Button, message } from "antd";
import { cn } from "@/lib/utils";
import { format, isValid } from "date-fns";
import { TProfile } from "@/types/user.type";
import { userApi } from "@/api/user.api";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import path from "@/configs/path.config";
import authApi from "@/api/auth.api";
import { getAccessTokenFromLS } from "@/utils/auth.util";

const ProfileCard: React.FC = () => {
  const token = getAccessTokenFromLS();
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
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

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
  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      message.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    try {
      await authApi.resetPassword(token, { newPassword, confirmPassword });
      message.success("Đổi mật khẩu thành công!");
      setShowPasswordFields(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      message.error("Đổi mật khẩu thất bại!");
      console.error("Updated password failed!", error);
    }
  };

  const formattedUpdatedAt =
    updatedAt && isValid(updatedAt)
      ? format(updatedAt, "dd/MM/yyyy")
      : "Chưa cập nhật";

  return (
    <Card
      className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden "
      cover={
        <div
          className="flex justify-center items-center p-4 "
          style={{
            backgroundImage:
              'url("https://marketplace.canva.com/EAFUFiGX5ek/1/0/1600w/canva-colorful-watercolor-floral-linktree-background-qRHfsd-4Nmc.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Avatar
            src={formData.avatar || "https://picsum.photos/536/354"}
            size={128}
            className={cn("rounded-full shadow-md")}
            alt="User Avatar"
          />
          <span className="from-neutral-300 justify-center items-center text-green-900 px-10 font-semibold">
            Hồ sơ người dùng
          </span>
        </div>
      }
    >
      <div
        className="p-4 text-center flex"
        style={{
          backgroundImage:
            'url("https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA1L3JtNDI4LTAwNTRfMS5qcGc.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
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
        <Button onClick={handleUpdate} className="bg-green-800 text-white">
          Cập nhật hồ sơ
        </Button>
      </div>
      <div className="flex justify-center pt-4">
        <Button
          className="bg-green-800 text-white"
          onClick={() => setShowPasswordFields(!showPasswordFields)}
        >
          {showPasswordFields ? "Hủy" : "Đổi mật khẩu"}
        </Button>
      </div>

      {showPasswordFields && (
        <div className="mt-4">
          <Input.Password
            placeholder="Mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mb-2"
          />
          <Input.Password
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mb-4"
          />
          <div className="flex justify-center">
            <Button
              type="primary"
              onClick={handleResetPassword}
              className="bg-green-500 text-white"
            >
              Xác nhận
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ProfileCard;
