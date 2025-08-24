import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Leaf, Mail, Phone, MapPin, Facebook, Instagram, Youtube } from "lucide-react"

const Footer = () => {
  return (
    <footer id="lien-he" className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-tea-gold" />
              <span className="text-2xl font-serif font-bold">
                Trà Sang Trọng
              </span>
            </div>
            <p className="font-elegant leading-relaxed opacity-90">
              Mang đến cho bạn những hương vị trà tinh túy nhất từ những vùng đất trà nổi tiếng,
              với chất lượng cao cấp và dịch vụ tận tâm.
            </p>
            <div className="flex space-x-4">
              <Button size="sm" variant="ghost" className="text-primary-foreground hover:text-tea-gold hover:bg-primary-foreground/10">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button size="sm" variant="ghost" className="text-primary-foreground hover:text-tea-gold hover:bg-primary-foreground/10">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button size="sm" variant="ghost" className="text-primary-foreground hover:text-tea-gold hover:bg-primary-foreground/10">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-serif font-bold">Liên Kết Nhanh</h3>
            <nav className="space-y-3">
              <a href="#gioi-thieu" className="block font-elegant opacity-90 hover:opacity-100 hover:text-tea-gold transition-all">
                Giới Thiệu
              </a>
              <a href="#loai-tra" className="block font-elegant opacity-90 hover:opacity-100 hover:text-tea-gold transition-all">
                Loại Trà
              </a>
              <a href="#blog" className="block font-elegant opacity-90 hover:opacity-100 hover:text-tea-gold transition-all">
                Blog
              </a>
              <a href="#" className="block font-elegant opacity-90 hover:opacity-100 hover:text-tea-gold transition-all">
                Chính Sách Bảo Mật
              </a>
              <a href="#" className="block font-elegant opacity-90 hover:opacity-100 hover:text-tea-gold transition-all">
                Điều Khoản Sử Dụng
              </a>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-xl font-serif font-bold">Thông Tin Liên Hệ</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-tea-gold mt-0.5 flex-shrink-0" />
                <span className="font-elegant opacity-90">
                  123 Đường Trà Xanh, Quận 1, TP.HCM, Việt Nam
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-tea-gold" />
                <span className="font-elegant opacity-90">+84 123 456 789</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-tea-gold" />
                <span className="font-elegant opacity-90">info@trasangtronng.vn</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h3 className="text-xl font-serif font-bold">Đăng Ký Nhận Tin</h3>
            <p className="font-elegant opacity-90">
              Nhận những bài viết mới nhất và ưu đãi đặc biệt từ chúng tôi
            </p>
            <div className="space-y-3">
              <Input
                type="email"
                placeholder="Nhập email của bạn"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/70"
              />
              <Button className="w-full bg-tea-gold text-tea-brown hover:bg-tea-gold/90">
                Đăng Ký
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center">
          <p className="font-elegant opacity-70">
            © 2024 Trà Sang Trọng. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer