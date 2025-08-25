import { LucideIcon } from "lucide-react";

export interface Router {
    path: string;
    element: React.ReactNode;
}

export interface RouteNavBar {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
        title: string
        url: string
    }[]
}