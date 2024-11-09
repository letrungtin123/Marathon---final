import { Facebook, Instagram, Twitter, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-12" style={{ backgroundColor: "#F5F6FA" }}>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
        {/* About Section */}
        <div>
          <h4 className="text-xl font-semibold mb-4 text-black">Về cửa hàng</h4>
          <Link
            to={`/`}
            className="text-2xl font-extrabold font-nunito-sans text-green-900"
          >
            Dash<span className="text-black">Stack</span>
          </Link>
          <p className="text-sm text-gray-700 mt-4">
            Chúng tôi là cửa hàng bán hoa nổi tiếng, cung cấp những bó hoa tươi
            đẹp nhất cho các dịp đặc biệt của bạn. Hãy đến với chúng tôi để trải
            nghiệm sự tinh tế và tươi mới trong từng cánh hoa.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xl font-semibold mb-4 text-black">
            Liên kết nhanh
          </h4>
          <ul className="space-y-2">
            <li>
              <Link
                to={`/`}
                className="text-sm text-gray-700 hover:text-green-800 transition-colors duration-200"
              >
                Trang chủ
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-sm text-gray-700 hover:text-green-800 transition-colors duration-200"
              >
                Về chúng tôi
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="text-sm text-gray-700 hover:text-green-800 transition-colors duration-200"
              >
                Sản phẩm
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-sm text-gray-700 hover:text-green-800 transition-colors duration-200"
              >
                Liên hệ
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact and Social Media */}
        <div>
          <h4 className="text-xl font-semibold mb-4 text-black">Liên hệ</h4>
          <ul className="space-y-2">
            <li className="text-sm text-gray-700">
              Địa chỉ: 123 Đường Hoa, Quận 1, TP.HCM
            </li>
            <li className="text-sm text-gray-700">SĐT: +84 123 456 789</li>
            <li className="text-sm text-gray-700">
              Email: info@cuahanghoa.com
            </li>
          </ul>
          <div className="mt-6 flex space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-blue-100 transition-all duration-200"
            >
              <Facebook className="w-6 h-6 text-blue-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-pink-100 transition-all duration-200"
            >
              <Instagram className="w-6 h-6 text-pink-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-blue-100 transition-all duration-200"
            >
              <Twitter className="w-6 h-6 text-blue-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-yellow-100 transition-all duration-200"
            >
              <Mail className="w-6 h-6 text-yellow-600" />
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t mt-10 pt-6 text-center">
        <p className="text-sm text-gray-700">
          &copy; 2024 Cửa hàng Hoa. Tất cả quyền được bảo lưu.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
