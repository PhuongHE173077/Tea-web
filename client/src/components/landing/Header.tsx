import { Button } from "@/components/ui/button"
import { Leaf, Menu } from "lucide-react"
import { useState } from "react"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-card/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-tea-green" />
            <span className="text-2xl font-serif font-bold bg-gradient-tea bg-clip-text ">
              Trà Sang Trọng
            </span>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a href="#gioi-thieu" className="text-foreground hover:text-tea-green transition-colors duration-300">
              Giới Thiệu
            </a>
            <a href="#loai-tra" className="text-foreground hover:text-tea-green transition-colors duration-300">
              Loại Trà
            </a>
            <a href="#blog" className="text-foreground hover:text-tea-green transition-colors duration-300">
              Blog
            </a>
            <a href="#lien-he" className="text-foreground hover:text-tea-green transition-colors duration-300">
              Liên Hệ
            </a>
            <Button className="bg-gradient-tea hover:shadow-elegant transition-all duration-300">
              Khám Phá Ngay
            </Button>
          </nav>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden mt-4 py-4 border-t border-border/50">
            <div className="flex flex-col space-y-4">
              <a href="#gioi-thieu" className="text-foreground hover:text-tea-green transition-colors">
                Giới Thiệu
              </a>
              <a href="#loai-tra" className="text-foreground hover:text-tea-green transition-colors">
                Loại Trà
              </a>
              <a href="#blog" className="text-foreground hover:text-tea-green transition-colors">
                Blog
              </a>
              <a href="#lien-he" className="text-foreground hover:text-tea-green transition-colors">
                Liên Hệ
              </a>
              <Button className="bg-gradient-tea w-fit">
                Khám Phá Ngay
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header