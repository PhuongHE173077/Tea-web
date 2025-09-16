"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet"
import {
  Leaf, Coffee, Phone, Package, Moon, Cross,
  Menu, MapPin, User, Heart, ShoppingCart, Gift, Search, X
} from "lucide-react"
import { getCartItemCount } from "@/utils/cart"
import { fetchTeaCategoryAPIs } from "@/apis/tea.category.apis"
import { fetchCategoriesAPIs } from "@/apis/category.apis"
import { fetchCompanyInfosAPIs } from "@/apis/company-info.apis"

export default function Header() {
  const [cartItemCount, setCartItemCount] = useState(0)
  const [categories, setCategories] = useState<Category[]>([])
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null)

  const updateCartCount = () => {
    setCartItemCount(getCartItemCount())
  }

  useEffect(() => {

    fetchCategoriesAPIs().then(res => {
      setCategories(res.data)
    })

    fetchCompanyInfosAPIs().then(res => {
      setCompanyInfo(res.data[0])
    })

    updateCartCount()

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'tea_cart') {
        updateCartCount()
      }
    }

    const handleCartUpdate = () => {
      updateCartCount()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('cartUpdated', handleCartUpdate)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b" style={{ backgroundColor: 'hsl(85, 25%, 94%)' }}>
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2" onClick={() => window.location.href = "/"}>
          <img src="/logo.png" alt="Trà Việt" className="h-10 w-10" />
          <span className="font-bold text-lg" style={{ color: 'hsl(85, 30%, 25%)' }}>{import.meta.env.VITE_APP_NAME}</span>
        </div>

        <div className="hidden md:block flex-1 mx-8">
          <div className="relative">
            <Input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-1/2 rounded-full pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'hsl(85, 20%, 45%)' }} />
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm" >
          <Link to="/blog">Blog</Link>
          <Link to="/tra-cuu-don-hang">Tra cứu đơn hàng</Link>
          <a href="#">Tea Show</a>
          <a href="/gio-hang" className="flex items-center gap-1 relative cursor-pointer">
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {cartItemCount > 99 ? '99+' : cartItemCount}
              </Badge>
            )}
          </a>
        </nav>

        <div className="md:hidden flex items-center gap-2">
          {/* Icon giỏ hàng cho mobile */}
          <a href="/gio-hang" className="relative cursor-pointer">
            <ShoppingCart className="h-6 w-6" />
            {cartItemCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {cartItemCount > 99 ? '99+' : cartItemCount}
              </Badge>
            )}
          </a>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-3/4 sm:max-w-sm flex flex-col">
              <SheetHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src="/logo.png" alt="Trà Việt" className="h-10 w-10" />
                  <SheetTitle>{import.meta.env.VITE_APP_NAME}</SheetTitle>
                </div>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">

                  </Button>
                </SheetClose>
              </SheetHeader>

              <div className=" mt-6 flex flex-col space-y-4 text-base " style={{ color: 'hsl(85, 30%, 25%)' }}>
                {categories?.reverse()?.map((category) => (
                  <a key={category._id} href={"/" + category.category_slug} className="flex items-center gap-2"><img src={category.category_icon} alt={category.category_name} className="h-5 w-5" /> {category.category_name}</a>
                ))}
              </div>

              <div className="mt-6 space-y-3 text-sm" style={{ color: 'hsl(85, 20%, 45%)' }}>
                <a href="#" className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  {companyInfo?.company_phone}
                </a>
                <a href="#" className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" /> Hệ thống cửa hàng
                </a>
              </div>

              <div className="mt-auto pt-6 border-t text-sm space-y-2" style={{ color: 'hsl(85, 20%, 45%)' }}>
                <Link to="/blog" className="block">Quà Doanh Nghiệp</Link>
                <a href="#" className="block">Horeca Tea</a>
                <a href="#" className="block">Tea Show</a>
                <a href="#" className="block">Về Trà Việt</a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="hidden md:block border-t text-sm" >
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between" >
            <nav className="flex items-center gap-6">
              {
                categories?.map((category) => (
                  <a key={category._id} href={"/" + category.category_slug} className="flex items-center gap-2 text-lg  hover:text-red-500">
                    <img src={category.category_icon} alt={category.category_name} className="h-5 w-5" />  {category.category_name}
                  </a>
                ))
              }
            </nav>
            <div className="flex items-center gap-6">
              <a href="#" className="flex items-center gap-1"><Phone className="h-4 w-4" /> {companyInfo?.company_phone}</a>
              <a href="#" className=" items-center gap-1">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Hệ thống cửa hàng
                </div>
                <div className="structure ">
                  {companyInfo?.company_address.substring(0, 25) + '...'}
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}