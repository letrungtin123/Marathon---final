import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { SchemaType, schema } from "@/utils/rules.util";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import authApi from "@/api/auth.api";
import path from "@/configs/path.config";
import { useAuth } from "@/contexts/auth.context";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";

type LoginFormType = Pick<SchemaType, "email" | "password">;
const loginSchema = schema.pick(["email", "password"]);

export default function LoginPage() {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType>({
    resolver: yupResolver(loginSchema),
  });

  // đăng nhập
  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: (body: LoginFormType) => authApi.login(body),
    onSuccess: () => {
      setIsAuthenticated(true);
      navigate(path.home);
    },
    onError: () => {
      setIsAuthenticated(false);
      navigate(path.login);
    },
  });

  const onSubmit = (values: LoginFormType) => {
    loginMutation.mutate(values);
  };
  return (
    <div
      className="flex flex-col justify-center min-h-screen py-12 bg-cover bg-center"
      style={{
        backgroundImage:
          "url(https://captionstags.com/wp-content/uploads/2024/05/flower-shop-captions-slogans-and-taglines.webp)",
      }}
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white bg-opacity-80 rounded-lg shadow-lg">
        <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
          Đăng nhập
        </h2>
        <section className="flex items-center justify-center w-full h-header mt-3">
          <p className="text-xl font-extrabold font-nunito-sans">
            <span className="text-primary">Dash</span>
            <span className="">Stack</span>
          </p>
        </section>

        <div className="mt-8 sm:px-10">
          <div className="px-4 py-8">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  {...register("email")}
                  type="text"
                  autoComplete="email"
                  className="mt-1"
				  placeholder="Vui lòng nhập email"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className="pr-10"
					placeholder="Vui lòng nhập mật khẩu"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div></div>
                <div className="text-sm">
                  <Link
                    to={path.forgotPassword}
                    className="font-medium text-primary"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
              </div>

              <div>
                <Button type="submit" className="w-full bg-primary">
                  Đăng nhập
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 text-black ">Hoặc đăng nhập bằng</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-4 space-x-4">
              <a href="#" className="inline-block">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                  alt="Facebook logo"
                  className="w-8 h-8"
                />
              </a>
              <a href="#" className="inline-block">
                <img
                  src="https://cdn.iconscout.com/icon/free/png-256/free-gmail-logo-icon-download-in-svg-png-gif-file-formats--mail-email-logos-icons-2416660.png?f=webp"
                  alt="Gmail logo"
                  className="w-8 h-8"
                />
              </a>
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Bạn chưa có tài khoản?{" "}
                <a href="#" className="font-medium text-primary">
                  Đăng ký ngay
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
