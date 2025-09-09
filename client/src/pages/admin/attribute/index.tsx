import React, { useEffect, useState } from "react";
import { Effect, Taste } from "./types";
import {
    createEffect,
    createTaste,
    deleteEffect,
    deleteTaste,
    fetchEffect,
    fetchTaste,
    updateEffect,
    updateTaste,
} from "@/apis/attribute.apis";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Plus } from "lucide-react";
import { slugify } from "@/lib/utils";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";

export default function ProductAttribute() {
    const [effects, setEffects] = useState<Effect[]>([]);
    const [tastes, setTastes] = useState<Taste[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Lấy tab từ query param
    const [searchParams, setSearchParams] = useSearchParams();
    const defaultTab = searchParams.get("tab") || "effects";
    const [activeTab, setActiveTab] = useState(defaultTab);

    // Dialog state
    const [openDialog, setOpenDialog] = useState(false);
    const [editItem, setEditItem] = useState<any>(null);
    const [formData, setFormData] = useState({
        _id: "",
        name: "",
        slug: "",
        description: "",
    });

    // Load dữ liệu
    useEffect(() => {
        setLoading(true);
        Promise.all([fetchEffect(), fetchTaste()]).then(([effectsRes, tastesRes]) => {
            setEffects(effectsRes.data);
            setTastes(tastesRes.data);
            setLoading(false);
        });
    }, []);

    // Cập nhật URL khi đổi tab
    useEffect(() => {
        setSearchParams({ tab: activeTab });
    }, [activeTab, setSearchParams]);

    const handleOpenDialog = (item?: any) => {
        if (item) {
            setEditItem(item);
            setFormData({
                _id: item.effect_id || item.taste_id || item._id,
                name: item.effect_name || item.taste_name,
                slug: item.effect_slug || item.taste_slug,
                description: item.effect_description || item.taste_description,
            });
        } else {
            setEditItem(null);
            setFormData({ _id: "", name: "", slug: "", description: "" });
        }
        setOpenDialog(true);
    };

    const handleSave = () => {
        if (activeTab === "effects") {
            if (editItem) {
                const dataUpdate = {
                    effect_name: formData.name,
                    effect_slug: slugify(formData.slug || formData.name),
                    effect_description: formData.description,
                };
                updateEffect(editItem._id, dataUpdate).then(() => {
                    setEffects((prev) =>
                        prev.map((ef) =>
                            ef._id === editItem._id
                                ? { ...ef, ...dataUpdate, _id: ef._id }
                                : ef
                        )
                    );
                    toast.success("Cập nhật thành công!");
                });
            } else {
                const newData = {
                    effect_name: formData.name,
                    effect_slug: slugify(formData.name),
                    effect_description: formData.description,
                };
                createEffect(newData).then((res) => {
                    setEffects((prev) => [
                        ...prev,
                        { _id: res.data._id, ...newData },
                    ]);
                    toast.success("Thêm thành công!");
                });
            }
        } else {
            if (editItem) {
                const dataUpdate = {
                    taste_name: formData.name,
                    taste_slug: slugify(formData.slug || formData.name),
                    taste_description: formData.description,
                };
                updateTaste(editItem._id, dataUpdate).then(() => {
                    setTastes((prev) =>
                        prev.map((ts) =>
                            ts._id === editItem._id
                                ? { ...ts, ...dataUpdate, _id: ts._id }
                                : ts
                        )
                    );
                    toast.success("Cập nhật thành công!");
                });
            } else {
                const newData = {
                    taste_name: formData.name,
                    taste_slug: slugify(formData.name),
                    taste_description: formData.description,
                };
                createTaste(newData).then((res) => {
                    setTastes((prev) => [
                        ...prev,
                        { _id: res.data._id, ...newData },
                    ]);
                    toast.success("Thêm thành công!");
                });
            }
        }
        setOpenDialog(false);
    };

    const handleDelete = (id: string) => {
        if (activeTab === "effects") {
            deleteEffect(id).then(() => {
                setEffects((prev) => prev.filter((ef) => ef._id !== id));
                toast.success("Xóa tác dụng!");
            });
        } else {
            deleteTaste(id).then(() => {
                setTastes((prev) => prev.filter((ts) => ts._id !== id));
                toast.success("Xóa khẩu vị!");
            });
        }
    };

    const renderTable = (data: any[], type: "effect" | "taste") => (
        <div className="overflow-x-auto">
            <table className="min-w-full border rounded-lg bg-white shadow">
                <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Slug</th>
                        <th className="px-4 py-2 text-left">Description</th>
                        <th className="px-4 py-2 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, idx) => (
                        <tr key={idx} className="border-t hover:bg-gray-50">
                            <td className="px-4 py-2">{item[`${type}_name`]}</td>
                            <td className="px-4 py-2">{item[`${type}_slug`]}</td>
                            <td className="px-4 py-2">{item[`${type}_description`]}</td>
                            <td className="px-4 py-2 flex gap-2 justify-center">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleOpenDialog(item)}
                                >
                                    <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(item._id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-4">
                <Button onClick={() => handleOpenDialog()}>
                    <Plus className="w-4 h-4 mr-2" /> Thêm{" "}
                    {type === "effect" ? "tác dụng" : "khẩu vị"}
                </Button>
            </div>
        </div>
    );

    return (
        <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                    <TabsTrigger value="effects">Tác dụng</TabsTrigger>
                    <TabsTrigger value="tastes">Khẩu vị</TabsTrigger>
                </TabsList>
                <TabsContent value="effects">
                    {renderTable(effects, "effect")}
                </TabsContent>
                <TabsContent value="tastes">
                    {renderTable(tastes, "taste")}
                </TabsContent>
            </Tabs>

            {/* Dialog Add/Edit */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editItem ? "Update" : "Add"}{" "}
                            {activeTab === "effects" ? "Effect" : "Taste"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-3 py-2">
                        <Input
                            placeholder="Name"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    name: e.target.value,
                                }))
                            }
                        />
                        <Input
                            placeholder="Description"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    description: e.target.value,
                                }))
                            }
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setOpenDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>
                            {editItem ? "Update" : "Save"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
