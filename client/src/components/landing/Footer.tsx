import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Leaf, Mail, Phone, MapPin, Facebook, Instagram, Youtube } from "lucide-react"

const Footer = (
  { companyInfo }: {
    companyInfo: CompanyInfo
  }
) => {
  return (
    <footer id="lien-he" className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <img src="/logo.png" alt="Trà Việt" className="h-10 w-10" />
              <img src="/name-web.png" alt="Trà Việt" className="h-[40px] w-15" />
            </div>
            <p className="font-elegant leading-relaxed opacity-90">
              Mang đến cho bạn những hương vị trà tinh túy nhất từ những vùng đất trà nổi tiếng,
              với chất lượng cao cấp và dịch vụ tận tâm.
            </p>
            <div className="grid grid-cols-3 ">

              {
                companyInfo.company_facebook && companyInfo.company_facebook.isActive && (
                  <Button
                    onClick={() => window.open(companyInfo.company_facebook.url)}
                    size="sm" variant="ghost" className="text-primary-foreground hover:text-tea-gold hover:bg-primary-foreground/10">
                    <img src="/icon/facebook.png" alt="Cart" className="w-6 h-6" />
                  </Button>
                )
              }
              {
                companyInfo.company_instagram && companyInfo.company_instagram.isActive && (
                  <Button size="sm"
                    onClick={() => window.open(companyInfo.company_instagram.url)}

                    variant="ghost" className="text-primary-foreground hover:text-tea-gold hover:bg-primary-foreground/10">
                    <img src="/icon/instagram.png" alt="Cart" className="w-6 h-6" />
                  </Button>
                )
              }
              {
                companyInfo.company_youtube && companyInfo.company_youtube.isActive && (
                  <Button
                    onClick={() => window.open(companyInfo.company_youtube.url)}
                    size="sm" variant="ghost" className="text-primary-foreground hover:text-tea-gold hover:bg-primary-foreground/10">
                    <img src="/icon/youtube.png" alt="Cart" className="w-6 h-6" />
                  </Button>
                )
              }
              {
                companyInfo.company_tiktok && companyInfo.company_tiktok.isActive && (
                  <Button
                    onClick={() => window.open(companyInfo.company_tiktok.url)}
                    size="sm" variant="ghost" className="text-primary-foreground hover:text-tea-gold hover:bg-primary-foreground/10">
                    <img src="/icon/tik-tok.png" alt="Cart" className="w-6 h-6" />
                  </Button>
                )
              }

              {
                companyInfo.company_twitter && companyInfo.company_twitter.isActive && (
                  <Button
                    onClick={() => window.open(companyInfo.company_twitter.url)}
                    size="sm" variant="ghost" className="text-primary-foreground hover:text-tea-gold hover:bg-primary-foreground/10">
                    <img src="/icon/twitter.png" alt="Cart" className="w-6 h-6" />
                  </Button>
                )
              }
              {companyInfo.company_linkedin && companyInfo.company_linkedin.isActive && (
                <Button
                  onClick={() => window.open(companyInfo.company_linkedin.url)}
                  size="sm" variant="ghost" className="text-primary-foreground hover:text-tea-gold hover:bg-primary-foreground/10">
                  <img src="/icon/linkedin.png" alt="Cart" className="w-6 h-6" />
                </Button>
              )}


            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-xl font-serif font-bold">Liên Kết Nhanh</h3>
            <nav className="space-y-3">
              <a href="/" className="block font-elegant opacity-90 hover:opacity-100 hover:text-tea-gold transition-all">
                Giới Thiệu
              </a>
              <a href="#loai-tra" className="block font-elegant opacity-90 hover:opacity-100 hover:text-tea-gold transition-all">
                Loại Trà
              </a>
              <a href="/blog" className="block font-elegant opacity-90 hover:opacity-100 hover:text-tea-gold transition-all">
                Blog
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
                  {companyInfo.company_address}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-tea-gold" />
                <span className="font-elegant opacity-90"> {companyInfo.company_phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-tea-gold" />
                <span className="font-elegant opacity-90">{companyInfo.company_email}</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-6">
            <h3 className="text-xl font-serif font-bold">Đăng Ký Nhận Tin</h3>
            <p className="font-elegant opacity-90">
              Nhận những bài viết mới nhất và ưu đãi đặc biệt từ chúng tôi
            </p>

          </div>
        </div>


      </div>
    </footer>
  )
}

export default Footer