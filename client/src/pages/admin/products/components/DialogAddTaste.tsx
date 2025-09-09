import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export interface Taste {
    _id: string;
    taste_name: string;
    taste_slug: string;
    taste_description: string;
}

interface TasteSelectorProps {
    tastes: Taste[]; // danh sách truyền từ cha
    onSelect: (selected: Taste[]) => void; // callback khi chọn
}

const TasteSelector: React.FC<TasteSelectorProps> = ({ tastes, onSelect }) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [open, setOpen] = useState(false)

    const handleToggle = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleConfirm = () => {
        const selectedTastes = tastes.filter((t) => selectedIds.includes(t._id));
        onSelect(selectedTastes);
        setOpen(false)
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">+ Thêm hương vị</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Hương vị : </DialogTitle>
                </DialogHeader>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {tastes.map((taste) => (
                        <div
                            key={taste._id}
                            className="flex items-center gap-2 border rounded-lg p-2 cursor-pointer"
                            onClick={() => handleToggle(taste._id)} // khi bấm vào div thì toggle
                        >
                            <Checkbox
                                checked={selectedIds.includes(taste._id)}
                                onCheckedChange={() => handleToggle(taste._id)} // khi bấm vào checkbox thì cũng toggle
                                onClick={(e) => e.stopPropagation()} // chặn việc bấm checkbox bị gọi 2 lần
                            />
                            <div>
                                <p className="font-medium">{taste.taste_name}</p>
                                <p className="text-sm text-gray-500">{taste.taste_description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <DialogFooter>
                    <Button onClick={handleConfirm}>Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default TasteSelector;
