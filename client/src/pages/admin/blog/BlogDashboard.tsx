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
        } catch (error) {
            console.error('Error deleting blog:', error);
            toast.error('Có lỗi xảy ra khi xóa blog');
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
                return <Badge variant="default">Đã xuất bản</Badge>;
            case 'draft':
                return <Badge variant="secondary">Bản nháp</Badge>;
            case 'archived':
                return <Badge variant="outline">Lưu trữ</Badge>;
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
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle className="text-lg">Bộ lọc</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        {/* Search */}
                        <form onSubmit={handleSearch} className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                type="text"
                                placeholder="Tìm kiếm blog..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </form>

                        {/* Status Filter */}
                        <Select value={selectedStatus} onValueChange={handleStatusFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                <SelectItem value="published">Đã xuất bản</SelectItem>
                                <SelectItem value="draft">Bản nháp</SelectItem>
                                <SelectItem value="archived">Lưu trữ</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Category Filter */}
                        <Select value={selectedCategory} onValueChange={handleCategoryFilter}>
                            <SelectTrigger>
                                <SelectValue placeholder="Danh mục" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả danh mục</SelectItem>
                                {categories?.map((category) => (
                                    <SelectItem key={category._id} value={category._id}>
                                        {category.category_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Sort */}
                        <Select 
                            value={`${filters.sortBy}-${filters.sortOrder}`} 
                            onValueChange={(value) => {
                                const [sortBy, sortOrder] = value.split('-');
                                setFilters(prev => ({ ...prev, sortBy: sortBy as any, sortOrder: sortOrder as any }));
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sắp xếp" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="createdAt-desc">Mới nhất</SelectItem>
                                <SelectItem value="createdAt-asc">Cũ nhất</SelectItem>
                                <SelectItem value="blog_title-asc">Tiêu đề A-Z</SelectItem>
                                <SelectItem value="blog_title-desc">Tiêu đề Z-A</SelectItem>
                                <SelectItem value="blog_views-desc">Lượt xem cao</SelectItem>
                                <SelectItem value="blog_views-asc">Lượt xem thấp</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                            <Button type="submit" onClick={handleSearch}>
                                <Search className="h-4 w-4 mr-2" />
                                Tìm kiếm
                            </Button>
                            <Button variant="outline" onClick={clearFilters}>
                                Xóa bộ lọc
                            </Button>
                        </div>
                        {pagination && (
                            <p className="text-sm text-gray-600">
                                Hiển thị {pagination.totalItems} kết quả
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

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
                                <div className="flex justify-center items-center gap-2 mt-6">
                                    <Button
                                        variant="outline"
                                        disabled={!pagination.hasPrevPage}
                                        onClick={() => handlePageChange(filters.page! - 1)}
                                    >
                                        Trước
                                    </Button>
                                    
                                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                        const page = i + 1;
                                        return (
                                            <Button
                                                key={page}
                                                variant={page === filters.page ? "default" : "outline"}
                                                onClick={() => handlePageChange(page)}
                                            >
                                                {page}
                                            </Button>
                                        );
                                    })}

                                    <Button
                                        variant="outline"
                                        disabled={!pagination.hasNextPage}
                                        onClick={() => handlePageChange(filters.page! + 1)}
                                    >
                                        Sau
                                    </Button>
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
