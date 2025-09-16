import React, { useState } from 'react';
import { Edit, Trash2, Power, PowerOff, User, Calendar, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'react-toastify';
import { ShipConfig } from '@/types/ship';
import { shipService } from '@/services/ship.service';

interface ShipConfigCardProps {
    config: ShipConfig;
    onEdit: (config: ShipConfig) => void;
    onDelete: (config: ShipConfig) => void;
    onToggleStatus: (config: ShipConfig) => void;
    className?: string;
}

const ShipConfigCard: React.FC<ShipConfigCardProps> = ({
    config,
    onEdit,
    onDelete,
    onToggleStatus,
    className = ''
}) => {
    const [toggleLoading, setToggleLoading] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);

    // Format currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Handle toggle status
    const handleToggleStatus = async () => {
        try {
            setToggleLoading(true);
            await shipService.toggleShipConfigStatus(config._id, { isActive: !config.isActive });
            toast.success(`Đã ${!config.isActive ? 'kích hoạt' : 'vô hiệu hóa'} cấu hình phí ship`);
            onToggleStatus(config);
        } catch (error) {
            console.error('Error toggling status:', error);
            toast.error('Không thể thay đổi trạng thái cấu hình');
        } finally {
            setToggleLoading(false);
        }
    };

    // Handle delete
    const handleDelete = async () => {
        try {
            await shipService.deleteShipConfig(config._id);
            toast.success('Đã xóa cấu hình phí ship thành công');
            setDeleteDialog(false);
            onDelete(config);
        } catch (error) {
            console.error('Error deleting config:', error);
            toast.error('Không thể xóa cấu hình phí ship');
        }
    };

    return (
        <>
            <Card className={`hover:shadow-lg transition-shadow duration-200 ${className}`}>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                            Cấu hình phí ship
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <Badge variant={config.isActive ? "default" : "secondary"}>
                                {config.isActive ? 'Hoạt động' : 'Tạm dừng'}
                            </Badge>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => onEdit(config)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Chỉnh sửa
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => setDeleteDialog(true)}
                                        className="text-red-600"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Xóa
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Main Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <div className="text-sm text-gray-600">Ngưỡng miễn phí ship</div>
                            <div className="text-xl font-bold text-green-600">
                                {formatCurrency(config.freeShippingThreshold)}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-sm text-gray-600">Phí ship</div>
                            <div className="text-xl font-bold text-blue-600">
                                {formatCurrency(config.shippingFee)}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    {config.description && (
                        <div className="space-y-2">
                            <div className="text-sm text-gray-600">Mô tả</div>
                            <div className="text-sm bg-gray-50 p-3 rounded-lg">
                                {config.description}
                            </div>
                        </div>
                    )}

                    {/* Creator Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 pt-2 border-t">
                        <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>{config.createdBy.usr_name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(config.createdAt)}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                        <div className="flex items-center gap-2">
                            <Switch
                                checked={config.isActive}
                                onCheckedChange={handleToggleStatus}
                                disabled={toggleLoading}
                            />
                            <span className="text-sm text-gray-600">
                                {config.isActive ? 'Đang hoạt động' : 'Tạm dừng'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(config)}
                            >
                                <Edit className="w-4 h-4 mr-1" />
                                Sửa
                            </Button>
                        </div>
                    </div>

                    {/* Status Warning */}
                    {!config.isActive && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                                <PowerOff className="w-4 h-4 text-yellow-600" />
                                <span className="text-sm text-yellow-800">
                                    Cấu hình này đang tạm dừng và không được áp dụng
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Active Status Info */}
                    {config.isActive && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                                <Power className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-green-800">
                                    Cấu hình này đang được áp dụng cho tất cả đơn hàng
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Example Calculation */}
                    <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm font-medium text-gray-700 mb-2">Ví dụ tính phí:</div>
                        <div className="space-y-1 text-xs">
                            <div className="flex justify-between">
                                <span>Đơn hàng 200,000 VNĐ:</span>
                                <span className="font-medium">
                                    {config.freeShippingThreshold > 200000 
                                        ? `+${formatCurrency(config.shippingFee)}`
                                        : 'Miễn phí'
                                    }
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span>Đơn hàng {formatCurrency(config.freeShippingThreshold)}:</span>
                                <span className="font-medium text-green-600">Miễn phí</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận xóa cấu hình</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa cấu hình phí ship này không? Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p><strong>Ngưỡng miễn phí:</strong> {formatCurrency(config.freeShippingThreshold)}</p>
                            <p><strong>Phí ship:</strong> {formatCurrency(config.shippingFee)}</p>
                            <p><strong>Mô tả:</strong> {config.description || 'Không có mô tả'}</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialog(false)}
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                        >
                            Xóa
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ShipConfigCard;
