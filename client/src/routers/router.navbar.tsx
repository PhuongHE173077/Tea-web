import { RouteNavBar } from "@/types/router";
import { LayoutDashboard, LeafyGreen, PencilIcon, ShoppingBag, Tickets, UserRoundCheck, UsersRound } from "lucide-react";

export const routerNavBar: RouteNavBar[] = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
        isActive: true,
    },
    {
        title: "Sản phẩm",
        url: "/products",
        icon: LeafyGreen,
        isActive: false,
        items: [
            {
                title: "Thể loại sản phẩm",
                url: "/products/category",
            },
            {
                title: "Danh sách sản phẩm",
                url: "/products/list",
            },
            {
                title: "Thuộc tính sản phẩm",
                url: "/products/attribute",
            },
        ],
    },
    {
        title: "Đơn hàng",
        url: "/orders",
        icon: ShoppingBag,
        isActive: false,
        items: [
            {
                title: "Danh sách sản phẩm",
                url: "/orders/list",
            },
            {
                title: "Thêm sản phẩm",
                url: "/orders/add",
            },
        ],
    },
    {
        title: "Customers",
        url: "/customers",
        icon: UserRoundCheck,
        isActive: false,
    },
    {
        title: "Phiếu giảm giá",
        url: "/discount",
        icon: Tickets,
        isActive: false,
    },
    {
        title: "Quản lý nhân viên",
        url: "/rbac",
        icon: UsersRound,
        isActive: false,
        items: [
            {
                title: "Quản lý quuyền ",
                url: "/rbac/role",
            },
            {
                title: "Quản lý nhân viên",
                url: "/rbac/staff",
            },
        ],
    }, {
        title: "Giao diện website",
        url: "/web-ui",
        icon: PencilIcon,
        isActive: false,
        items: [
            {
                title: "Landing page",
                url: "/web-ui/landing-page"
            },
            {
                title: "Thông tin công ty",
                url: "/web-ui/company-info"
            }
        ]
    }

]



