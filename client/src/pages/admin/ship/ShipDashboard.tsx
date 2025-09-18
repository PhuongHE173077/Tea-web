import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Edit, Trash2, Eye, MoreHorizontal, Truck, Settings, Power, PowerOff } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { toast } from 'react-toastify';
import { shipService } from '@/services/ship.service';
import { ShipConfig, GetShipConfigsParams } from '@/types/ship';

const ShipDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [shipConfigs, setShipConfigs] = useState<ShipConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; config?: ShipConfig }>({ isOpen: false });
    const [toggleLoading, setToggleLoading] = useState<string | null>(null);

    const itemsPerPage = 10;

    // Fetch ship configurations
    const fetchShipConfigs = async () => {
        try {
            setLoading(true);
            const params: GetShipConfigsParams = {
                page: currentPage,
                limit: itemsPerPage,
                search: searchTerm || undefined,
                sort_by: sortBy as any,
                sort_order: sortOrder,
            };

            if (statusFilter !== 'all') {
                params.isActive = statusFilter === 'active';
            }

            const response = await shipService.getShipConfigs(params);
            setShipConfigs(response.data);
            setTotalPages(response.pagination.total_pages);
            setTotalItems(response.pagination.total_items);
        } catch (error) {
            console.error('Error fetching ship configs:', error);
            toast.error('Không thể tải danh sách cấu hình phí ship');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShipConfigs();
    }, [currentPage, searchTerm, statusFilter, sortBy, sortOrder]);

    // Handle search
    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    // Handle filter change
    const handleFilterChange = (value: string) => {
        setStatusFilter(value);
        setCurrentPage(1);
    };

    // Handle sort change
    const handleSortChange = (field: string) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
        setCurrentPage(1);
    };

    // Handle toggle status
    const handleToggleStatus = async (config: ShipConfig) => {
        try {
            setToggleLoading(config._id);
            await shipService.toggleShipConfigStatus(config._id, { isActive: !config.isActive });
            toast.success(`Đã ${!config.isActive ? 'kích hoạt' : 'vô hiệu hóa'} cấu hình phí ship`);
            fetchShipConfigs();
        } catch (error) {
            console.error('Error toggling status:', error);
            toast.error('Không thể thay đổi trạng thái cấu hình');
        } finally {
            setToggleLoading(null);
        }
    };

    // Handle delete
    const handleDelete = async () => {
        if (!deleteDialog.config) return;

        try {
            await shipService.deleteShipConfig(deleteDialog.config._id);
            toast.success('Đã xóa cấu hình phí ship thành công');
            setDeleteDialog({ isOpen: false });
            fetchShipConfigs();
        } catch (error) {
            console.error('Error deleting config:', error);
            toast.error('Không thể xóa cấu hình phí ship');
        }
    };

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

    return (
        <div className="space-y-6">
            

            {/* Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Danh sách cấu hình phí ship ({totalItems} cấu hình)</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : shipConfigs.length > 0 ? (
                        <>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Ngưỡng miễn phí</TableHead>
                                            <TableHead>Phí ship</TableHead>
                                            <TableHead>Mô tả</TableHead>
                                            <TableHead>Trạng thái</TableHead>
                                            <TableHead>Người tạo</TableHead>
                                            <TableHead>Ngày tạo</TableHead>
                                            <TableHead className="text-right">Thao tác</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {shipConfigs.map((config) => (
                                            <TableRow key={config._id}>
                                                <TableCell className="font-medium">
                                                    {formatCurrency(config.freeShippingThreshold)}
                                                </TableCell>
                                                <TableCell>
                                                    {formatCurrency(config.shippingFee)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="max-w-xs truncate">
                                                        {config.description || 'Không có mô tả'}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Switch
                                                            checked={config.isActive}
                                                            onCheckedChange={() => handleToggleStatus(config)}
                                                            disabled={toggleLoading === config._id}
                                                        />
                                                        <Badge variant={config.isActive ? "default" : "secondary"}>
                                                            {config.isActive ? 'Hoạt động' : 'Tạm dừng'}
                                                        </Badge>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{config.createdBy.usr_name}</div>
                                                        <div className="text-sm text-gray-500">{config.createdBy.usr_email}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(config.createdAt)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                onClick={() => navigate(`/admin/ship/edit/${config._id}`)}
                                                            >
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Chỉnh sửa
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => setDeleteDialog({ isOpen: true, config })}
                                                                className="text-red-600"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Xóa
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-6">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                    >
                                        Trước
                                    </Button>
                                    <span className="text-sm text-gray-600">
                                        Trang {currentPage} / {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                    >
                                        Sau
                                    </Button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <Truck className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có cấu hình phí ship</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Bắt đầu bằng cách tạo cấu hình phí ship đầu tiên.
                            </p>
                            <div className="mt-6">
                                <Button onClick={() => navigate('/admin/ship/create')}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Tạo cấu hình mới
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialog.isOpen} onOpenChange={(open) => setDeleteDialog({ isOpen: open })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Xác nhận xóa cấu hình</DialogTitle>
                        <DialogDescription>
                            Bạn có chắc chắn muốn xóa cấu hình phí ship này không? Hành động này không thể hoàn tác.
                        </DialogDescription>
                    </DialogHeader>
                    {deleteDialog.config && (
                        <div className="py-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p><strong>Ngưỡng miễn phí:</strong> {formatCurrency(deleteDialog.config.freeShippingThreshold)}</p>
                                <p><strong>Phí ship:</strong> {formatCurrency(deleteDialog.config.shippingFee)}</p>
                                <p><strong>Mô tả:</strong> {deleteDialog.config.description || 'Không có mô tả'}</p>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialog({ isOpen: false })}
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
        </div>
    );
};

export default ShipDashboard;
