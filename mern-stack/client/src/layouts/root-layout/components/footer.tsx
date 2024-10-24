import { Facebook, Instagram, Twitter, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-200 text-white py-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Section */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-black">
            Về cửa hàng
            <Link to={`/`} className="text-xl font-extrabold font-nunito-sans">
              <span className="text-primary">  Dash</span>
              <span className="text-black">Stack</span>
            </Link>
          </h4>
          <p className="text-sm text-black">
            Chúng tôi là cửa hàng bán hoa nổi tiếng, cung cấp những bó hoa tươi
            đẹp nhất cho các dịp đặc biệt của bạn. Hãy đến với chúng tôi để trải
            nghiệm sự tinh tế và tươi mới trong từng cánh hoa.
          </p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4 text-black">Liên kết nhanh</h4>
          <ul className="space-y-2">
            <li>
              <Link to={`/`} className="text-sm hover:underline text-black">
                Trang chủ
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-sm hover:underline text-black">
                Về chúng tôi
              </Link>
            </li>
            <li>
              <Link to="/products" className="text-sm hover:underline text-black ">
                Sản phẩm
              </Link>
            </li>
            <li>
              <Link to="" className="text-sm hover:underline text-black">
                Liên hệ
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact and Social Media */}
        <div>
          <h4 className="text-lg font-semibold mb-4 text-black">Liên hệ</h4>
          <ul className="space-y-2">
            <li className="text-sm text-black">Địa chỉ: 123 Đường Hoa, Quận 1, TP.HCM</li>
            <li className="text-sm text-black">SĐT: +84 123 456 789</li>
            <li className="text-sm text-black">Email: info@cuahanghoa.com</li>
          </ul>
          <div className="mt-4 flex space-x-3">
            <Button variant="ghost" size="icon">
              <Facebook className="w-6 h-6 text-black" />
            </Button>
            <Button variant="ghost" size="icon">
              <Instagram className="w-6 h-6 text-black" />
            </Button>
            <Button variant="ghost" size="icon">
              <Twitter className="w-6 h-6 text-black" />
            </Button>
            <Button variant="ghost" size="icon">
              <Mail className="w-6 h-6 text-black" />
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-600 mt-8 pt-4 text-center">
        <p className="text-sm text-black">
          &copy; 2024 Cửa hàng Hoa. Tất cả quyền được bảo lưu.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
