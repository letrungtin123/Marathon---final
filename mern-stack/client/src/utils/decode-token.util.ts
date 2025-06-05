import { jwtDecode } from "jwt-decode";

// Payload trả về từ backend có `_id`, không phải `userId`
interface JwtPayload {
  _id: string;
  email?: string;
  role?: "admin" | "staff" | "customer";
  exp: number;
  iat: number;
}

export const getUserIdFromToken = (): string | null => {
  const token = localStorage.getItem("accessToken");
  console.log("✅ [DEBUG] Raw accessToken:", token);

  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);
    console.log("✅ [DEBUG] Decoded:", decoded);
    return decoded._id || null;
  } catch (err) {
    console.error("❌ Token decode error:", err);
    return null;
  }
};

export const getUserInfoFromToken = (): JwtPayload | null => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  try {
    return jwtDecode<JwtPayload>(token);
  } catch (err) {
    console.error("❌ Token decode error:", err);
    return null;
  }
};
