import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Calendar, User, Eye, Clock, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getPublishedBlogs, searchBlogs, getBlogsByCategory } from '@/apis/blog.apis';
import { getAllCategories } from '@/apis/category.apis';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import blogTra from "@/assets/blog-tra.jpeg";



const BlogList: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [selectedCategory, setSelectedCategory] = useState(() => {
        const categoryParam = searchParams.get('category');
        return categoryParam || 'all';
    });
    const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt');
    const [sortOrder, setSortOrder] = useState(searchParams.get('sortOrder') || 'desc');

    const currentPage = parseInt(searchParams.get('page') || '1');

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchBlogs();
    }, [currentPage, selectedCategory, sortBy, sortOrder]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            updateSearchParams({ search: searchQuery, page: '1' });
            fetchBlogs();
        }, 500); // Gọi API sau 500ms khi gõ
        return () => clearTimeout(timeout);
    }, [searchQuery, selectedCategory, sortBy, sortOrder]);

    const fetchCategories = async () => {
        setCategoriesLoading(true);
        try {
            console.log('Fetching categories...');
            const response = await getAllCategories({ status: 'active' });
            console.log('Categories response:', response);
            if (response && Array.isArray(response)) {
                // Categories API returns array directly
                setCategories(response);
                console.log('Categories set:', response);
            } else if (response && response.data && Array.isArray(response.data)) {
                // Some APIs return {data: [...]}
                setCategories(response.data);
                console.log('Categories set:', response.data);
            } else {
                console.warn('No categories data in response');
                setCategories([]);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
        } finally {
            setCategoriesLoading(false);
        }
    };

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            let response: any;
            const filters = {
                page: currentPage,
                limit: 12,
                sortBy: sortBy as any,
                sortOrder: sortOrder as any
            };

            console.log('Fetching blogs with filters:', filters);
            console.log('Search query:', searchQuery);
            console.log('Selected category:', selectedCategory);

            if (searchQuery) {
                console.log('Using searchBlogs API');
                response = await searchBlogs(searchQuery, filters);
            } else if (selectedCategory && selectedCategory !== 'all') {
                console.log('Using getBlogsByCategory API');
                response = await getBlogsByCategory(selectedCategory, filters);
            } else {
                console.log('Using getPublishedBlogs API');
                response = await getPublishedBlogs(filters);
            }

            console.log('Blogs response:', response);
            if (response && response.data) {
                setBlogs(response.data);
                setPagination(response.pagination);
                setError(null);
                console.log('Blogs set:', response.data);
                console.log('Pagination set:', response.pagination);
            } else {
                console.warn('No blogs data in response');
                setBlogs([]);
                setPagination(null);
                setError('Không có dữ liệu blog');
            }
        } catch (error: any) {
            console.error('Error fetching blogs:', error);
            setBlogs([]);
            setPagination(null);
            setError(error?.message || 'Có lỗi xảy ra khi tải blog');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        updateSearchParams({ search: searchQuery, page: '1' });
        fetchBlogs();
    };

    const handleCategoryChange = (category: string) => {
        const categoryValue = category === 'all' ? '' : category;
        setSelectedCategory(category);
        updateSearchParams({ category: categoryValue, page: '1' });
    };

    const handleSortChange = (newSortBy: string) => {
        setSortBy(newSortBy);
        updateSearchParams({ sortBy: newSortBy, page: '1' });
    };

    const handleSortOrderChange = (newSortOrder: string) => {
        setSortOrder(newSortOrder);
        updateSearchParams({ sortOrder: newSortOrder, page: '1' });
    };

    const updateSearchParams = (params: Record<string, string>) => {
        const newSearchParams = new URLSearchParams(searchParams);
        Object.entries(params).forEach(([key, value]) => {
            if (value) {
                newSearchParams.set(key, value);
            } else {
                newSearchParams.delete(key);
            }
        });
        setSearchParams(newSearchParams);
    };

    const handlePageChange = (page: number) => {
        updateSearchParams({ page: page.toString() });
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCategory('all');
        setSortBy('createdAt');
        setSortOrder('desc');
        setSearchParams({});
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="relative text-center mb-12">
    {/* Ảnh nền */}
    <img
  src={blogTra}
  alt="Blog Tea Banner"
  className="w-full h-[320px] object-cover rounded-2xl shadow-md"
/>

    {/* Lớp mờ tối nhẹ để chữ nổi bật */}
    <div className="absolute inset-0 bg-black/40 rounded-2xl"></div>

    {/* Chữ nằm trên ảnh */}
    <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
        <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">Blog Tea</h1>
        <p className="text-lg max-w-2xl mx-auto drop-shadow-md">
            Khám phá thế giới trà qua những bài viết chuyên sâu về văn hóa, kỹ thuật pha chế và những câu chuyện thú vị
        </p>
    </div>
</div>



            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                <div className="flex flex-wrap lg:flex-nowrap items-center justify-between gap-4">
                    {/* Search */}
                    <div className="relative flex-shrink-0 flex-1 min-w-[180px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            type="text"
                            placeholder="Tìm kiếm bài viết..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 w-full"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="flex-shrink-0 min-w-[160px] flex-1">
                        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn danh mục" />
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
                    </div>

                    {/* Sort By */}
                    <div className="flex-shrink-0 min-w-[140px] flex-1">
                        <Select value={sortBy} onValueChange={handleSortChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Sắp xếp theo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="createdAt">Ngày tạo</SelectItem>
                                <SelectItem value="blog_views">Lượt xem</SelectItem>
                                <SelectItem value="blog_title">Tiêu đề</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Sort Order */}
                    <div className="flex-shrink-0 min-w-[120px] flex-1">
                        <Select value={sortOrder} onValueChange={handleSortOrderChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Thứ tự" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="desc">Giảm dần</SelectItem>
                                <SelectItem value="asc">Tăng dần</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Clear Filters */}
                    <div className="flex-shrink-0">
                        <Button
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={clearFilters}
                        >
                            Xóa bộ lọc
                        </Button>
                    </div>
                </div>

                {pagination && (
                    <div className="flex justify-end mt-2" style={{ marginRight: "13px", marginTop: "10px" }}>
                        <p className="text-sm text-gray-600">
                            Hiển thị {pagination.totalItems} kết quả
                        </p>
                    </div>
                )}


            </div>




            {/* Blog Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <Card key={index} className="overflow-hidden">
                            <Skeleton className="h-48 w-full" />
                            <CardHeader>
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            ) : blogs.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {blogs.map((blog) => (
                            <BlogCard key={blog._id} blog={blog} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2">
                            <Button
                                variant="outline"
                                disabled={!pagination.hasPrevPage}
                                onClick={() => handlePageChange(currentPage - 1)}
                            >
                                Trước
                            </Button>

                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                const page = i + 1;
                                return (
                                    <Button
                                        key={page}
                                        variant={page === currentPage ? "default" : "outline"}
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </Button>
                                );
                            })}

                            <Button
                                variant="outline"
                                disabled={!pagination.hasNextPage}
                                onClick={() => handlePageChange(currentPage + 1)}
                            >
                                Sau
                            </Button>
                        </div>
                    )}
                </>
            ) : error ? (
                <div className="text-center py-12">
                    <p className="text-red-500 text-lg">Lỗi: {error}</p>
                    <Button variant="outline" onClick={() => {
                        setError(null);
                        fetchBlogs();
                    }} className="mt-4">
                        Thử lại
                    </Button>
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">Không tìm thấy bài viết nào</p>
                    <Button variant="outline" onClick={clearFilters} className="mt-4">
                        Xóa bộ lọc
                    </Button>
                </div>
            )}
        </div>
    );
};

// Blog Card Component
const BlogCard: React.FC<{ blog: Blog }> = ({ blog }) => {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <Link to={`/blog/${blog.blog_slug}`}>
                <div className="aspect-video overflow-hidden">
                    <img
                        src={blog.blog_thumbnail?.url || '/placeholder-image.jpg'}
                        alt={blog.blog_thumbnail?.alt || blog.blog_title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                </div>
            </Link>

            <CardHeader className="p-4">
                <div className="flex items-center gap-2 mb-2">
                    {blog.blog_featured && (
                        <Badge variant="secondary">Nổi bật</Badge>
                    )}
                    {blog.blog_category && (
                        <Badge variant="outline">
                            {blog.blog_category.category_name}
                        </Badge>
                    )}
                </div>

                <Link to={`/blog/${blog.blog_slug}`}>
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                        {blog.blog_title}
                    </h3>
                </Link>

                <p className="text-gray-600 text-sm line-clamp-3 mt-2">
                    {blog.blog_excerpt}
                </p>

                <div className="flex items-center justify-between mt-4 text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{blog.blog_author.usr_name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                                {formatDistanceToNow(new Date(blog.createdAt), {
                                    addSuffix: true,
                                    locale: vi
                                })}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            <span>{blog.blog_views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{blog.blog_reading_time} phút</span>
                        </div>
                    </div>
                </div>

                {blog.blog_tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                        {blog.blog_tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                                <Tag className="h-2 w-2 mr-1" />
                                {tag}
                            </Badge>
                        ))}
                        {blog.blog_tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                                +{blog.blog_tags.length - 3}
                            </Badge>
                        )}
                    </div>
                )}
            </CardHeader>
        </Card>
    );
};

export default BlogList;
