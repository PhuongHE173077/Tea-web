import ProductAttribute from "@/pages/admin/attribute";
import CategoryManage from "@/pages/admin/category";
import Dashboard from "@/pages/admin/dashboard";
import DiscountManagement from "@/pages/admin/discount";
import ProductManagement from "@/pages/admin/products";
import AddProduct from "@/pages/admin/products/add.product";
import UpdateProduct from "@/pages/admin/products/update.product";
import CompanyInfoManage from "@/pages/admin/web-ui/company-info";
import LandingPageManagement from "@/pages/admin/web-ui/landing-page";
import { Router } from "@/types/router";

export const adminRouter: Router[] = [
    {
        path: "/dashboard",
        element: <Dashboard />
    },
    {
        path: "/products/category",
        element: <CategoryManage />,
    },
    {
        path: "/products/list",
        element: <ProductManagement />,
    },
    {
        path: "/products/:slug",
        element: <UpdateProduct />
    },
    {
        path: "/products/new",
        element: <AddProduct />
    },
    {
        path: "/products/attribute",
        element: <ProductAttribute />
    },
    {
        path: "/discount",
        element: <DiscountManagement />
    }, {
        path: "/web-ui/landing-page",
        element: <LandingPageManagement />
    }, {
        path: "/web-ui/company-info",
        element: <CompanyInfoManage />
    }
]