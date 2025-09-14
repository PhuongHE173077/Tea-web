import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { AppSidebar } from "./components/app-sidebar"
import { routerNavBar } from "@/routers/router.navbar"
import { Bell } from "lucide-react"
import { useSelector } from "react-redux"
import { fetchUserAPIs, selectCurrentUser } from "@/store/slice/userSlice"
import { useAppDispatch } from "@/hooks/useDispatch"
import { useEffect } from "react"

export default function DashboardLayout() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchUserAPIs()).then((response) => {
            if (response.meta.requestStatus === 'rejected' || response.payload.usr_role !== 'admin') {
                navigate("/dang-nhap")
            }
        })
    }, [dispatch])
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-4"
                    />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink >
                                    Quản trị hệ thống
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <Bell className="mr-5 ml-auto" size={20} />
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    <Outlet />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
