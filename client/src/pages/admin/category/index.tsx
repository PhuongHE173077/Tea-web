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
import { Plus } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { createCategoryAPIs, deleteCategoryAPIs, fetchCategoriesAPIs, updateCategoryAPIs } from "@/apis/category.apis"
import UpdateCategoryDialog from "./components/UpdateCategoryDialog"
import { toast } from "react-toastify"
import AddCategoryDialog from "./components/AddCategoryDialog"



export default function CategoryManage() {
    const isMobile = useIsMobile()
    const [categories, setCategories] = useState<Category[]>([])
    const [activeCategory, setActiveCategory] = useState<Category | null>(null)
    const [open, setOpen] = useState(false)
    const [openAdd, setOpenAdd] = useState(false)

    useEffect(() => {
        fetchCategoriesAPIs().then(res => {
            setCategories(res.data)
        })
    }, [])

    const handleAddCategory = (category) => {
        createCategoryAPIs({
            category_name: category.category_name,
            category_description: category.category_description
        }).then(res => {
            setCategories(prev => [res.data, ...prev])
            setOpenAdd(false)
        })
    }

    const handleDeleteCategory = (categoryId: string, categoryName: string) => {
        deleteCategoryAPIs(categoryId).then(() => {
            toast.success("Xóa thể loại thành công !")
            setCategories(prev => prev.filter(cat => cat._id !== categoryId))
        })
    }

    const handleUpdateCategory = (updated: Category) => {
        updateCategoryAPIs(updated._id, {
            category_name: updated.category_name,
            category_description: updated.category_description,
            status: updated.status
        }).then(res => {
            setCategories(prev => prev.map(cat => cat._id === updated._id ? res.data : cat))
            toast.success("Cập nhật thể loại thành công !")
        })
    }

    if (isMobile) {
        return (
            <div className="space-y-6 p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Quản lý thể loại</h1>
                        <p className="text-muted-foreground text-sm">Quản lý thể  phẩm trà</p>
                    </div>
                    <Button onClick={() => {
                        setOpenAdd(true)
                    }} className="rounded-xl">
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm
                    </Button>
                </div>

                <div className="grid gap-4">
                    {categories.map((cat) => (
                        <Card key={cat._id} className="rounded-2xl shadow-md">
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center text-lg">
                                    {cat.category_name}
                                    <Badge variant={cat.status === "active" ? "default" : "secondary"}>
                                        {cat.status === "active" ? "Hoạt động" : "Không hoạt động"}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <p><span className="font-medium">Slug:</span> <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{cat.category_slug}</span></p>
                                <p className="line-clamp-3 text-muted-foreground">{cat.category_description}</p>
                                <p className="text-xs text-muted-foreground">Tạo: {new Date(cat.createdAt).toLocaleDateString('vi-VN')}</p>
                                <div className="flex justify-end gap-2 pt-2">
                                    <Button size="sm" onClick={() => {
                                        setActiveCategory(cat)
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
                                                <AlertDialogTitle>Xác nhận xóa danh mục</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Bạn có chắc chắn muốn xóa danh mục <strong>"{cat.category_name}"</strong>?
                                                    Hành động này không thể hoàn tác.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel className="rounded-xl">Hủy</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => handleDeleteCategory(cat._id, cat.category_name)}
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
                    {open && activeCategory && <UpdateCategoryDialog open={open} setOpen={setOpen} category={activeCategory} onUpdate={handleUpdateCategory} />}
                </div>
                {openAdd && <AddCategoryDialog open={openAdd} setOpen={setOpenAdd} onAdd={handleAddCategory} />}

            </div>
        )
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý danh mục</h1>
                    <p className="text-muted-foreground">Quản lý các danh mục sản phẩm trà của cửa hàng</p>
                </div>
                <Button onClick={() => {
                    setOpenAdd(true)
                }} className="rounded-xl">
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm danh mục
                </Button>
            </div>

            <div className="rounded-2xl border shadow-sm bg-white/85">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b bg-muted/50">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[200px]">
                                    Tên danh mục
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
                            {categories.map((cat) => (
                                <tr key={cat._id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle font-medium">
                                        {cat.category_name}
                                    </td>
                                    <td className="p-4 align-middle">
                                        <span className="font-mono text-sm bg-muted px-2 py-1 rounded">
                                            {cat.category_slug}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle max-w-xs">
                                        <div className="truncate" title={cat.category_description}>
                                            {cat.category_description}
                                        </div>
                                    </td>
                                    <td className="p-4 align-middle">
                                        <Badge variant={cat.status === "active" ? "default" : "secondary"}>
                                            {cat.status === "active" ? "Hoạt động" : "Không hoạt động"}
                                        </Badge>
                                    </td>
                                    <td className="p-4 align-middle text-sm text-muted-foreground">
                                        {new Date(cat.createdAt).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button size="sm" variant="outline" className="rounded-xl"
                                                onClick={() => {
                                                    setActiveCategory(cat)
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
                                                        <AlertDialogTitle>Xác nhận xóa danh mục</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Bạn có chắc chắn muốn xóa danh mục <strong>"{cat.category_name}"</strong>?
                                                            Hành động này không thể hoàn tác và có thể ảnh hưởng đến các sản phẩm liên quan.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel className="rounded-xl">Hủy</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => handleDeleteCategory(cat._id, cat.category_name)}
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
            {open && activeCategory && <UpdateCategoryDialog open={open} setOpen={setOpen} category={activeCategory} onUpdate={handleUpdateCategory} />}
            {openAdd && <AddCategoryDialog open={openAdd} setOpen={setOpenAdd} onAdd={handleAddCategory} />}

        </div>
    )
}