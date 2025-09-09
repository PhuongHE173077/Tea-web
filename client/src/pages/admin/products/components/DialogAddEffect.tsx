import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Effect, Taste } from "../../attribute/types";


interface EffectSelectorProps {
    effects: Effect[];
    onSelect: (selected: string[]) => void;
}

const EffectSelector: React.FC<EffectSelectorProps> = ({ effects, onSelect }) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [open, setOpen] = useState(false)

    const handleToggle = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const handleConfirm = () => {
        onSelect(selectedIds);
        setOpen(false)
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">+ Thêm tác dụng</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Tác dụng đã chọn:</DialogTitle>
                </DialogHeader>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {effects.map((effect) => (
                        <div
                            key={effect._id}
                            className="flex items-center gap-2 border rounded-lg p-2 cursor-pointer"
                            onClick={() => handleToggle(effect._id)} // khi bấm vào div thì toggle
                        >
                            <Checkbox
                                checked={selectedIds.includes(effect._id)}
                                onCheckedChange={() => handleToggle(effect._id)} // khi bấm vào checkbox thì cũng toggle
                                onClick={(e) => e.stopPropagation()} // chặn việc bấm checkbox bị gọi 2 lần
                            />
                            <div>
                                <p className="font-medium">{effect.effect_name}</p>
                                <p className="text-sm text-gray-500">{effect.effect_name}</p>
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

export default EffectSelector;
