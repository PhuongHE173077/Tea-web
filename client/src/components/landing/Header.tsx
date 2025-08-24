"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
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

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Trà Việt" className="h-10 w-10" />
          <span className="font-bold text-lg">{import.meta.env.VITE_APP_NAME}</span>
        </div>

        <div className="hidden md:block flex-1 mx-8">
          <div className="relative">
            <Input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-1/2 rounded-full pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-700">
          <a href="#">Quà Doanh Nghiệp</a>
          <a href="#">Trà Cao Cấp</a>
          <a href="#">Tea Show</a>
          <div className="flex items-center gap-1">
            <ShoppingCart className="h-5 w-5" />
          </div>
        </nav>

        <div className="md:hidden">
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
                  <SheetTitle>TRÀ ABC</SheetTitle>
                </div>
                <SheetClose asChild>
                  <Button variant="ghost" size="icon">

                  </Button>
                </SheetClose>
              </SheetHeader>

              <div className=" mt-6 flex flex-col space-y-4 text-base ">
                <a href="#" className="flex items-center gap-2"><Leaf className="h-5 w-5" /> Trà</a>
                <a href="#" className="flex items-center gap-2"><Coffee className="h-5 w-5" /> Bộ Ấm Trà</a>
                <a href="#" className="flex items-center gap-2"><Phone className="h-5 w-5" /> Hạt</a>
                <a href="#" className="flex items-center gap-2"><Package className="h-5 w-5" /> Quà Tặng</a>
                <a href="#" className="flex items-center gap-2"><Moon className="h-5 w-5" /> Bánh Trung Thu 2025</a>
                <a href="#" className="flex items-center gap-2"><Cross className="h-5 w-5" /> Quà Tết 2026</a>
              </div>

              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <a href="#" className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  0903-037-017
                </a>
                <a href="#" className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" /> Hệ thống cửa hàng
                </a>
              </div>

              <div className="mt-auto pt-6 border-t text-sm space-y-2">
                <a href="#" className="block">Quà Doanh Nghiệp</a>
                <a href="#" className="block">Horeca Tea</a>
                <a href="#" className="block">Tea Show</a>
                <a href="#" className="block">Về Trà Việt</a>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="hidden md:block border-t text-sm text-gray-600">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between" >
            <nav className="flex items-center gap-6">
              <a href="#" className="flex items-center gap-1"><Leaf className="h-4 w-4" /> Trà</a>
              <a href="#" className="flex items-center gap-1"><Coffee className="h-4 w-4" /> Bộ Ấm Trà</a>
              <a href="#" className="flex items-center gap-1"><Phone className="h-4 w-4" /> Hạt</a>
              <a href="#" className="flex items-center gap-1"><Package className="h-4 w-4" /> Quà Tặng</a>
              <a href="#" className="flex items-center gap-1"><Moon className="h-4 w-4" /> Bánh Trung Thu 2025</a>
              <a href="#" className="flex items-center gap-1"><Cross className="h-4 w-4" /> Quà Tết 2026</a>
            </nav>
            <div className="flex items-center gap-6">
              <a href="#" className="flex items-center gap-1"><Phone className="h-4 w-4" /> 0903-037-017</a>
              <a href="#" className="flex items-center gap-1"><MapPin className="h-4 w-4" /> Hệ thống cửa hàng</a>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}