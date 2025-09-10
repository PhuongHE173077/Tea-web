import CartPage from "@/pages/public/cart"
import LandingPage from "@/pages/public/landing-page/Index"
import { TeaProductDetail } from "@/pages/public/product-detail"
import { Products } from "@/pages/public/products"
import { Router } from "@/types/router"

export const publicRouter: Router[] = [
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/san-pham",
    element: <Products />,
  },
  {
    path: "/san-pham/:slug",
    element: <TeaProductDetail />,
  },
  {
    path: "/cart",
    element: <CartPage />,
  },
  {
    path: "/gio-hang",
    element: <CartPage />,
  },
]
