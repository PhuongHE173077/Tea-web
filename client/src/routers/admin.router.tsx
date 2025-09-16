import ProductAttribute from "@/pages/admin/attribute";
import CategoryManage from "@/pages/admin/category";
import CustomerManagement from "@/pages/admin/customer";
import Dashboard from "@/pages/admin/dashboard";
import DiscountManagement from "@/pages/admin/discount";
import OrderManagement from "@/pages/admin/order";
import ProductManagement from "@/pages/admin/products";
import AddProduct from "@/pages/admin/products/add.product";
import UpdateProduct from "@/pages/admin/products/update.product";
import TeaCategory from "@/pages/admin/tea-category";
import CompanyInfoManage from "@/pages/admin/web-ui/company-info";
import LandingPageManagement from "@/pages/admin/web-ui/landing-page";
import BlogDashboard from "@/pages/admin/blog/BlogDashboard";
import CreateBlog from "@/pages/admin/blog/CreateBlog";
import EditBlog from "@/pages/admin/blog/EditBlog";
import ShipDashboard from "@/pages/admin/ship/ShipDashboard";
import CreateShipConfig from "@/pages/admin/ship/CreateShipConfig";
import EditShipConfig from "@/pages/admin/ship/EditShipConfig";
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
        path: "/orders",
        element: <OrderManagement />
    },
    {
        path: "/customers",
        element: <CustomerManagement />
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
    }, {
        path: "/products/tea-category",
        element: <TeaCategory />
    }, {
        path: "/admin/blog",
        element: <BlogDashboard />
    }, {
        path: "/admin/blog/create",
        element: <CreateBlog />
    }, {
        path: "/admin/blog/edit/:id",
        element: <EditBlog />
    }, {
        path: "/admin/ship",
        element: <ShipDashboard />
    }, {
        path: "/admin/ship/create",
        element: <CreateShipConfig />
    }, {
        path: "/admin/ship/edit/:id",
        element: <EditShipConfig />
    }
]