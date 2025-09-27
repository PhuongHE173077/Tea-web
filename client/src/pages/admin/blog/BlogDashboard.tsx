import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Edit, Trash2, Eye, Calendar, User, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { getAllBlogs, deleteBlog } from '@/apis/blog.apis';
import { getAllCategories } from '@/apis/category.apis';
import { formatDistanceToNow, format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'react-toastify';

const BlogDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState<any>(null);
    const [filters, setFilters] = useState<BlogFilters>({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchBlogs();
    }, [filters]);

    const fetchCategories = async () => {
        try {
            console.log('BlogDashboard: Fetching categories...');
            const response = await getAllCategories({ status: 'active' });
            console.log('BlogDashboard: Categories response:', response);

            if (Array.isArray(response)) {
                // getAllCategories returned array directly (expected)
                setCategories(response);
                console.log('BlogDashboard: Categories set from array response:', response);
            } else if (response && response.data && Array.isArray(response.data)) {
                // Somehow got full axios response (handle it)
                setCategories(response.data);
                console.log('BlogDashboard: Categories set from response.data:', response.data);
            } else {
                console.warn('BlogDashboard: Unexpected response format:', response);
                setCategories([]);
            }
        } catch (error) {
            console.error('BlogDashboard: Error fetching categories:', error);
            setCategories([]);
        }
    };

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const response = await getAllBlogs(filters);
            setBlogs(response.data);
            setPagination(response.pagination);
        } catch (error) {
            console.error('Error fetching blogs:', error);
            toast.error('Có lỗi xảy ra khi tải danh sách blog');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setFilters(prev => ({ ...prev, search: searchQuery, page: 1 }));
    };

    const handleStatusFilter = (status: string) => {
        setSelectedStatus(status);
        setFilters(prev => ({
            ...prev,
            status: status === 'all' ? undefined : status as any,
            page: 1
        }));
    };

    const handleCategoryFilter = (category: string) => {
        setSelectedCategory(category);
        setFilters(prev => ({
            ...prev,
            category: category === 'all' ? undefined : category,
            page: 1
        }));
    };

    const handlePageChange = (page: number) => {
        setFilters(prev => ({ ...prev, page }));
    };

    const handleDelete = async (blogId: string, blogTitle: string) => {
        try {
            await deleteBlog(blogId);
            toast.success(`Đã xóa blog "${blogTitle}" thành công`);
            fetchBlogs();
        } catch (error: any) {
            console.error('Error deleting blog:', error);
            const message = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra khi xóa blog';
            toast.error(message);
        }
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedStatus('all');
        setSelectedCategory('all');
        setFilters({
            page: 1,
            limit: 10,
            sortBy: 'createdAt',
            sortOrder: 'desc'
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'published':
                return <Badge variant="default">Public</Badge>;
            case 'draft':
                return <Badge variant="secondary">Draft</Badge>;
            case 'archived':
                return <Badge variant="outline">private</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Quản lý Blog</h1>
                    <p className="text-gray-600 mt-2">Quản lý tất cả bài viết blog của bạn</p>
                </div>
                <Button onClick={() => navigate('/admin/blog/create')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo blog mới
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng blog</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pagination?.totalItems || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đã xuất bản</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {blogs.filter(blog => blog.blog_status === 'published').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bản nháp</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">
                            {blogs.filter(blog => blog.blog_status === 'draft').length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Lưu trữ</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-600">
                            {blogs.filter(blog => blog.blog_status === 'archived').length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}

            {/* Blog Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Danh sách Blog</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <div key={index} className="flex items-center space-x-4">
                                    <Skeleton className="h-16 w-24" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-4 w-1/2" />
                                    </div>
                                    <Skeleton className="h-8 w-20" />
                                    <Skeleton className="h-8 w-8" />
                                </div>
                            ))}
                        </div>
                    ) : blogs.length > 0 ? (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Blog</TableHead>
                                        <TableHead>Trạng thái</TableHead>
                                        <TableHead>Danh mục</TableHead>
                                        <TableHead>Tác giả</TableHead>
                                        <TableHead>Lượt xem</TableHead>
                                        <TableHead>Ngày tạo</TableHead>
                                        <TableHead className="text-right">Thao tác</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {blogs.map((blog) => (
                                        <TableRow key={blog._id}>
                                            <TableCell>
                                                <div className="flex items-center space-x-3">
                                                    <img
                                                        src={blog.blog_thumbnail?.url || '/placeholder-image.jpg'}
                                                        alt={blog.blog_title}
                                                        className="w-16 h-12 object-cover rounded"
                                                    />
                                                    <div>
                                                        <p className="font-medium text-gray-900 line-clamp-1">
                                                            {blog.blog_title}
                                                        </p>
                                                        <p className="text-sm text-gray-500 line-clamp-1">
                                                            {blog.blog_excerpt}
                                                        </p>
                                                        {blog.blog_featured && (
                                                            <Badge variant="secondary" className="mt-1">
                                                                Nổi bật
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(blog.blog_status)}
                                            </TableCell>
                                            <TableCell>
                                                {blog.blog_category ? (
                                                    <Badge variant="outline">
                                                        {blog.blog_category.category_name}
                                                    </Badge>
                                                ) : (
                                                    <span className="text-gray-400">Không có</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    {blog.blog_author.usr_avatar && (
                                                        <img
                                                            src={blog.blog_author.usr_avatar}
                                                            alt={blog.blog_author.usr_name}
                                                            className="w-6 h-6 rounded-full"
                                                        />
                                                    )}
                                                    <span className="text-sm">
                                                        {blog.blog_author.usr_name}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-1">
                                                    <Eye className="h-4 w-4 text-gray-400" />
                                                    <span>{blog.blog_views}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    <div>{format(new Date(blog.createdAt), 'dd/MM/yyyy')}</div>
                                                    <div className="text-gray-500">
                                                        {formatDistanceToNow(new Date(blog.createdAt), {
                                                            addSuffix: true,
                                                            locale: vi
                                                        })}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link to={`/blog/${blog.blog_slug}`} target="_blank">
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                Xem
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link to={`/admin/blog/edit/${blog._id}`}>
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                Chỉnh sửa
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                                    Xóa
                                                                </DropdownMenuItem>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        Bạn có chắc chắn muốn xóa blog "{blog.blog_title}"?
                                                                        Hành động này không thể hoàn tác.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                                                                    <AlertDialogAction
                                                                        onClick={() => handleDelete(blog._id, blog.blog_title)}
                                                                        className="bg-red-600 hover:bg-red-700"
                                                                    >
                                                                        Xóa
                                                                    </AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Pagination */}
                            {pagination && pagination.totalPages > 1 && (
                                <div className="flex flex-col md:flex-row md:justify-between items-center gap-3 mt-6">
                                    <div className="text-sm text-gray-600">
                                        Trang {pagination.currentPage} / {pagination.totalPages} • Tổng: {pagination.totalItems}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            disabled={!pagination.hasPrevPage}
                                            onClick={() => handlePageChange(Math.max(1, (filters.page || 1) - 1))}
                                        >
                                            Trước
                                        </Button>

                                        {(() => {
                                            const current = filters.page || 1;
                                            const total = pagination.totalPages;
                                            let start = Math.max(1, current - 2);
                                            let end = Math.min(total, start + 4);
                                            if (end - start < 4) start = Math.max(1, end - 4);
                                            const pages = [] as number[];
                                            for (let p = start; p <= end; p++) pages.push(p);
                                            return pages.map((page) => (
                                                <Button
                                                    key={page}
                                                    variant={page === current ? 'default' : 'outline'}
                                                    onClick={() => handlePageChange(page)}
                                                >
                                                    {page}
                                                </Button>
                                            ));
                                        })()}

                                        <Button
                                            variant="outline"
                                            disabled={!pagination.hasNextPage}
                                            onClick={() => handlePageChange(Math.min(pagination.totalPages, (filters.page || 1) + 1))}
                                        >
                                            Sau
                                        </Button>

                                        {/* Page size */}
                                        <div className="ml-2 flex items-center gap-2">
                                            <span className="text-sm text-gray-600 hidden md:inline">Hiển thị</span>
                                            <Select
                                                value={(filters.limit || 10).toString()}
                                                onValueChange={(val) => setFilters(prev => ({ ...prev, limit: parseInt(val, 10), page: 1 }))}
                                            >
                                                <SelectTrigger className="w-[90px]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {[5, 10, 20, 50].map(size => (
                                                        <SelectItem key={size} value={size.toString()}>{size}/trang</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg mb-4">Chưa có blog nào</p>
                            <Button onClick={() => navigate('/admin/blog/create')}>
                                <Plus className="h-4 w-4 mr-2" />
                                Tạo blog đầu tiên
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default BlogDashboard;
