import Dashboard from "@/pages/admin/dashboard";
import { Router } from "@/types/router";

export const adminRouter: Router[] = [
    {
        path: "/dashboard",
        element: <Dashboard />
    }
]