"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Check, Plus } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import {
    createTeaCategoryAPIs,
    deleteTeaCategoryAPIs,
    fetchTeaCategoryAPIs,
    updateTeaCategoryAPIs
} from "@/apis/tea.category.apis"
import UpdateTeaCategoryDialog from "./components/UpdateTeaCategoryDialog"
import { toast } from "react-toastify"
import AddTeaCategoryDialog from "./components/AddTeaCategoryDialog"

export default function TeaCategoryManage() {
    const isMobile = useIsMobile()
    const [teaCategories, setTeaCategories] = useState<TeaCategory[]>([])
    const [activeTeaCategory, setActiveTeaCategory] = useState<TeaCategory | null>(null)
    const [open, setOpen] = useState(false)
    const [openAdd, setOpenAdd] = useState(false)

    useEffect(() => {
        fetchTeaCategoryAPIs().then(res => {
            setTeaCategories(res.data)
        })
    }, [])

    const handleAddTeaCategory = (teaCategory) => {
        createTeaCategoryAPIs({
            tea_category_name: teaCategory.tea_category_name,
            tea_category_description: teaCategory.tea_category_description,
            status: teaCategory.status
        }).then(res => {
            setTeaCategories(prev => [res.data, ...prev])
            setOpenAdd(false)
            toast.success("Thêm loại trà thành công!")
        }).catch(() => {
            toast.error("Có lỗi xảy ra khi thêm loại trà!")
        })
    }

    const handleDeleteTeaCategory = (teaCategoryId: string, teaCategoryName: string) => {
        deleteTeaCategoryAPIs(teaCategoryId).then(() => {
            toast.success("Xóa loại trà thành công!")
            setTeaCategories(prev => prev.filter(cat => cat._id !== teaCategoryId))
        }).catch(() => {
            toast.error("Có lỗi xảy ra khi xóa loại trà!")
        })
    }

    const handleUpdateTeaCategory = (updated: TeaCategory) => {
        updateTeaCategoryAPIs(updated._id, {
            tea_category_name: updated.tea_category_name,
            tea_category_description: updated.tea_category_description,
            status: updated.status
        }).then(res => {
            setTeaCategories(prev => prev.map(cat => cat._id === updated._id ? res.data : cat))
            toast.success("Cập nhật loại trà thành công!")
        }).catch(() => {
            toast.error("Có lỗi xảy ra khi cập nhật loại trà!")
        })
    }

    if (isMobile) {
        return (
            <div className="space-y-6 p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Quản lý loại trà</h1>
                        <p className="text-muted-foreground text-sm">Quản lý các loại trà trong cửa hàng</p>
                    </div>
                    <Button onClick={() => {
                        setOpenAdd(true)
                    }} className="rounded-xl">
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm
                    </Button>
                </div>

                <div className="grid gap-4">
                    {teaCategories.map((teaCat) => (
                        <Card key={teaCat._id} className="rounded-2xl shadow-md">
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center text-lg">
                                    <div className="flex items-center gap-2">
                                        <Plus className="w-5 h-5 text-green-600" />
                                        {teaCat.tea_category_name}
                                    </div>
                                    <Badge variant={teaCat.status === "active" ? "default" : "secondary"}>
                                        {teaCat.status === "active" ? "Hoạt động" : "Không hoạt động"}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <p><span className="font-medium">Slug:</span> <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{teaCat.tea_category_slug}</span></p>
                                <p className="line-clamp-3 text-muted-foreground">{teaCat.tea_category_description}</p>
                                <p className="text-xs text-muted-foreground">Tạo: {new Date(teaCat.createdAt).toLocaleDateString('vi-VN')}</p>
                                <div className="flex justify-end gap-2 pt-2">
                                    <Button size="sm" onClick={() => {
                                        setActiveTeaCategory(teaCat)
                                        setOpen(true)
                                    }} className="rounded-xl">
                                        Sửa
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button size="sm" variant="destructive" className="rounded-xl">
                                                Xóa
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className="rounded-2xl mx-4">
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Xác nhận xóa loại trà</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Bạn có chắc chắn muốn xóa loại trà <strong>"{teaCat.tea_category_name}"</strong>?
                                                    Hành động này không thể hoàn tác.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel className="rounded-xl">Hủy</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDeleteTeaCategory(teaCat._id, teaCat.tea_category_name)}
                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
                                                >
                                                    Xóa
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {open && activeTeaCategory && <UpdateTeaCategoryDialog open={open} setOpen={setOpen} teaCategory={activeTeaCategory} onUpdate={handleUpdateTeaCategory} />}
                </div>
                {openAdd && <AddTeaCategoryDialog open={openAdd} setOpen={setOpenAdd} onAdd={handleAddTeaCategory} />}
            </div>
        )
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý loại trà</h1>
                    <p className="text-muted-foreground">Quản lý các loại trà trong cửa hàng của bạn</p>
                </div>
                <Button onClick={() => {
                    setOpenAdd(true)
                }} className="rounded-xl">
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm loại trà
                </Button>
            </div>

            <div className="rounded-2xl border shadow-sm bg-white/85">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[200px]">
                                    Tên loại trà
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Slug
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Mô tả
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Trạng thái
                                </th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                    Ngày tạo
                                </th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                                    Thao tác
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {teaCategories.map((teaCat) => (
                                <tr key={teaCat._id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle font-medium">
                                        <div className="flex items-center gap-2">
                                            {teaCat.tea_category_name}
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                                            {teaCat.tea_category_slug}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle max-w-xs">
                                        <div className="truncate" title={teaCat.tea_category_description}>
                                            {teaCat.tea_category_description}
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <Badge variant={teaCat.status === "active" ? "default" : "secondary"}>
                                            {teaCat.status === "active" ? "Hoạt động" : "Không hoạt động"}
                                        </Badge>
                                    </td>
                                    <td className="p-4 align-middle text-sm text-muted-foreground">
                                        {new Date(teaCat.createdAt).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button size="sm" variant="outline" className="rounded-xl"
                                                onClick={() => {
                                                    setActiveTeaCategory(teaCat)
                                                    setOpen(true)
                                                }}
                                            >
                                                Sửa
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button size="sm" variant="destructive" className="rounded-xl">
                                                        Xóa
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="rounded-2xl">
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Xác nhận xóa loại trà</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Bạn có chắc chắn muốn xóa loại trà <strong>"{teaCat.tea_category_name}"</strong>?
                                                            Hành động này không thể hoàn tác và có thể ảnh hưởng đến các sản phẩm liên quan.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel className="rounded-xl">Hủy</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDeleteTeaCategory(teaCat._id, teaCat.tea_category_name)}
                                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
                                                        >
                                                            Xóa
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {open && activeTeaCategory && <UpdateTeaCategoryDialog open={open} setOpen={setOpen} teaCategory={activeTeaCategory} onUpdate={handleUpdateTeaCategory} />}
            {openAdd && <AddTeaCategoryDialog open={openAdd} setOpen={setOpenAdd} onAdd={handleAddTeaCategory} />}
        </div>
    )
}
