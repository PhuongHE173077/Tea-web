import React, { useEffect, useState } from "react";
import { ProductAdd } from "../types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function DialogAddStep({
    open,
    setOpen,
    setProduct,
    product,
}: {
    open: boolean;
    setOpen: (state: boolean) => void;
    setProduct: (product: ProductAdd) => void;
    product: ProductAdd;
}) {
    const [stepNumber, setStepNumber] = useState<number>(product.product_brewing.length + 1 || 1);
    const [description, setDescription] = useState<string>("");
    useEffect(() => {
        setStepNumber(product.product_brewing.length + 1 || 1)
    }, [open])

    const handleAddStep = () => {
        if (!description.trim()) return;

        const updated = [...product.product_brewing];

        if (stepNumber <= 0) {
            updated.unshift(description);
        } else if (stepNumber > updated.length) {
            updated.push(description);
        } else {
            updated.splice(stepNumber - 1, 0, description);
        }
        setProduct({
            ...product,
            product_brewing: updated,
        });

        // reset form
        setStepNumber(updated.length + 1);
        setDescription("");
        setOpen(false);
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add Brewing Step</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="step">Step number</Label>
                        <Input
                            id="step"
                            type="number"
                            min={1}
                            value={stepNumber}
                            onChange={(e) => setStepNumber(parseInt(e.target.value) || 1)}
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            placeholder="Enter step description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleAddStep}>Add Step</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
