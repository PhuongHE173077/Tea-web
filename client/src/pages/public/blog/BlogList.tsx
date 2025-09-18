import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Calendar, User, Eye, Clock, Tag, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getPublishedBlogs } from '@/apis/blog.apis';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import blogTra from "@/assets/blog-tra.jpeg";

interface Blog {
    _id: string;
    blog_title: string;
    blog_slug: string;
    blog_excerpt: string;
    blog_content: string;
    blog_thumbnail?: {
        url: string;
        alt: string;
    };
    blog_category?: {
        category_name: string;
    };
    blog_tags: string[];
    blog_views: number;
    blog_reading_time: number;
    blog_featured: boolean;
    blog_author?: {
        user_name: string;
    };
    createdAt: string;
    updatedAt: string;
}

const BlogList: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([]);
    const [allBlogs, setAllBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [featuredPagination, setFeaturedPagination] = useState<any>(null);
    const [allPagination, setAllPagination] = useState<any>(null);

    const featuredPage = parseInt(searchParams.get('featuredPage') || '1');
    const allPage = parseInt(searchParams.get('page') || '1');

    useEffect(() => {
        fetchBlogs();
    }, [featuredPage, allPage]);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            // Fetch featured blogs (for featured section)
            const featuredResponse = await getPublishedBlogs({
                page: 1,
                limit: 6,
                featured: 'true',
                sortBy: 'createdAt',
                sortOrder: 'desc'
            });

            // Fetch all blogs (for main section)
            const allResponse = await getPublishedBlogs({
                page: allPage,
                limit: 12,
                sortBy: 'createdAt',
                sortOrder: 'desc'
            });

            console.log('Featured blogs response:', featuredResponse);
            console.log('All blogs response:', allResponse);

            if (featuredResponse && featuredResponse.data) {
                setFeaturedBlogs(featuredResponse.data);
                setFeaturedPagination(featuredResponse.pagination);
            } else {
                setFeaturedBlogs([]);
                setFeaturedPagination(null);
            }

            if (allResponse && allResponse.data) {
                setAllBlogs(allResponse.data);
                setAllPagination(allResponse.pagination);
            } else {
                setAllBlogs([]);
                setAllPagination(null);
            }

            setError(null);
        } catch (error: any) {
            console.error('Error fetching blogs:', error);
            setFeaturedBlogs([]);
            setAllBlogs([]);
            setFeaturedPagination(null);
            setAllPagination(null);
            setError(error?.message || 'Có lỗi xảy ra khi tải blog');
        } finally {
            setLoading(false);
        }
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

    const handleFeaturedPageChange = (page: number) => {
        updateSearchParams({ featuredPage: page.toString() });
    };

    const handleAllPageChange = (page: number) => {
        updateSearchParams({ page: page.toString() });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Banner */}
            <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] bg-gradient-to-r from-green-800 to-green-600 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={blogTra}
                        alt="Blog Tea Banner"
                        className="w-full h-full object-cover opacity-30"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-green-700/60"></div>
                <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
                        Blog Trà Xanh Thái Nguyên
                    </h1>
                    <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 max-w-3xl leading-relaxed opacity-90 px-4">
                        Tổng hợp kiến thức về trà xanh - Khám phá thế giới trà qua những bài viết chuyên sâu về văn hóa, kỹ thuật pha chế và những câu chuyện thú vị
                    </p>
                    <Button
                        size="lg"
                        className="bg-orange-500 hover:bg-orange-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        onClick={() => document.getElementById('blog-content')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        <span className="hidden sm:inline">Xem những bài viết</span>
                        <span className="sm:hidden">Xem bài viết</span>
                        <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                </div>
            </div>



            {/* Blog Content */}
            <div id="blog-content" className="container mx-auto px-4 py-16">
                {loading ? (
                    <div>
                        {/* Featured Posts Skeleton */}
                        <div className="mb-16">
                            <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">Bài viết nổi bật</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <Card key={index} className="overflow-hidden shadow-lg animate-pulse">
                                        <div className="h-48 bg-gray-200"></div>
                                        <CardContent className="p-6">
                                            <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
                                            <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                                            <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                                            <div className="flex justify-between">
                                                <div className="h-4 bg-gray-200 rounded w-20"></div>
                                                <div className="h-4 bg-gray-200 rounded w-16"></div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>

                        {/* All Posts Skeleton */}
                        <div>
                            <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">Tất cả bài viết</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                                {Array.from({ length: 12 }).map((_, index) => (
                                    <Card key={index} className="overflow-hidden shadow-lg animate-pulse">
                                        <div className="h-48 bg-gray-200"></div>
                                        <CardContent className="p-6">
                                            <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>
                                            <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                                            <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                                            <div className="flex justify-between">
                                                <div className="h-4 bg-gray-200 rounded w-20"></div>
                                                <div className="h-4 bg-gray-200 rounded w-16"></div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </div>
            ) : (featuredBlogs.length > 0 || allBlogs.length > 0) ? (
                <div>
                    {/* Featured Posts Section */}
                    {featuredBlogs.length > 0 && (
                        <div className="mb-16">
                            <div className="text-center mb-12">
                                <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">Bài viết nổi bật</h2>
                                <div className="w-24 h-1 bg-orange-500 mx-auto mb-4"></div>
                                <p className="text-gray-600 text-lg">Những bài viết được quan tâm nhất</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                                {featuredBlogs.map((blog) => (
                                    <FeaturedBlogCard key={blog._id} blog={blog} />
                                ))}
                            </div>

                            {/* Featured Pagination */}
                            {featuredPagination && featuredPagination.totalPages > 1 && (
                                <div className="flex justify-center items-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={!featuredPagination.hasPrevPage}
                                        onClick={() => handleFeaturedPageChange(featuredPage - 1)}
                                        className="border-green-600 text-green-600 hover:bg-green-50"
                                    >
                                        Trước
                                    </Button>
                                    <span className="text-sm text-gray-600 px-4 py-2 bg-gray-100 rounded">
                                        {featuredPage} / {featuredPagination.totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={!featuredPagination.hasNextPage}
                                        onClick={() => handleFeaturedPageChange(featuredPage + 1)}
                                        className="border-green-600 text-green-600 hover:bg-green-50"
                                    >
                                        Sau
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* All Posts Section */}
                    <div>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">Tất cả bài viết</h2>
                            <div className="w-24 h-1 bg-orange-500 mx-auto mb-4"></div>
                            <p className="text-gray-600 text-lg">Khám phá thêm nhiều bài viết thú vị</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 mb-8">
                            {allBlogs.map((blog) => (
                                <RegularBlogCard key={blog._id} blog={blog} />
                            ))}
                        </div>

                        {/* All Posts Pagination */}
                        {allPagination && allPagination.totalPages > 1 && (
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-12">
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={!allPagination.hasPrevPage}
                                        onClick={() => handleAllPageChange(allPage - 1)}
                                        className="border-green-600 text-green-600 hover:bg-green-50 px-4 py-2"
                                    >
                                        ← Trước
                                    </Button>

                                    {/* Page Numbers */}
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: Math.min(5, allPagination.totalPages) }, (_, i) => {
                                            let pageNum;
                                            if (allPagination.totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (allPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (allPage >= allPagination.totalPages - 2) {
                                                pageNum = allPagination.totalPages - 4 + i;
                                            } else {
                                                pageNum = allPage - 2 + i;
                                            }

                                            return (
                                                <Button
                                                    key={pageNum}
                                                    variant={pageNum === allPage ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => handleAllPageChange(pageNum)}
                                                    className={pageNum === allPage
                                                        ? "bg-green-600 text-white hover:bg-green-700 px-3 py-2"
                                                        : "border-green-600 text-green-600 hover:bg-green-50 px-3 py-2"
                                                    }
                                                >
                                                    {pageNum}
                                                </Button>
                                            );
                                        })}
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={!allPagination.hasNextPage}
                                        onClick={() => handleAllPageChange(allPage + 1)}
                                        className="border-green-600 text-green-600 hover:bg-green-50 px-4 py-2"
                                    >
                                        Sau →
                                    </Button>
                                </div>

                                <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-full">
                                    Trang {allPage} / {allPagination.totalPages}
                                    <span className="ml-2 text-gray-500">
                                        ({allPagination.totalDocs} bài viết)
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : error ? (
                <div className="text-center py-20">
                    <div className="max-w-md mx-auto">
                        <div className="text-red-500 text-6xl mb-4">⚠️</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Có lỗi xảy ra</h3>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <Button
                            onClick={() => {
                                setError(null);
                                fetchBlogs();
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full"
                        >
                            Thử lại
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20">
                    <div className="max-w-md mx-auto">
                        <div className="text-gray-400 text-6xl mb-4">📝</div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">Chưa có bài viết</h3>
                        <p className="text-gray-600 mb-6">Hiện tại chưa có bài viết nào được đăng tải</p>
                        <Button
                            onClick={fetchBlogs}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full"
                        >
                            Tải lại
                        </Button>
                    </div>
                </div>
            )}
            </div>


        </div>
    );
};

// Featured Blog Card Component (Inspired by trathainguyen.org)
const FeaturedBlogCard: React.FC<{ blog: Blog }> = ({ blog }) => {
    return (
        <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 group bg-white border-0 shadow-lg">
            <Link to={`/blog/${blog.blog_slug}`} className="block">
                <div className="relative overflow-hidden">
                    <img
                        src={blog.blog_thumbnail?.url || '/placeholder-image.jpg'}
                        alt={blog.blog_thumbnail?.alt || blog.blog_title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                        <Badge className="bg-green-600 hover:bg-green-700 text-white font-semibold px-3 py-1 rounded-full shadow-lg">
                            Nổi bật
                        </Badge>
                    </div>
                    {blog.blog_category && (
                        <div className="absolute top-4 right-4">
                            <Badge variant="secondary" className="bg-white/90 text-green-800 font-medium px-3 py-1 rounded-full">
                                {blog.blog_category.category_name}
                            </Badge>
                        </div>
                    )}
                </div>
            </Link>

            <CardContent className="p-6">
                <Link to={`/blog/${blog.blog_slug}`}>
                    <h3 className="text-xl font-bold text-gray-900 hover:text-green-600 transition-colors line-clamp-2 mb-3 leading-tight">
                        {blog.blog_title}
                    </h3>
                </Link>

                <p className="text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                    {blog.blog_excerpt}
                </p>

                {blog.blog_tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {blog.blog_tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-green-200 text-green-700 hover:bg-green-50">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span>
                            {new Date(blog.createdAt).toLocaleDateString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                            })}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4 text-green-600" />
                            <span>{blog.blog_views || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-green-600" />
                            <span>{blog.blog_reading_time || 0}p</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// Regular Blog Card Component (Same style as featured for consistency)
const RegularBlogCard: React.FC<{ blog: Blog }> = ({ blog }) => {
    return (
        <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 group bg-white border-0 shadow-lg">
            <Link to={`/blog/${blog.blog_slug}`} className="block">
                <div className="relative overflow-hidden">
                    <img
                        src={blog.blog_thumbnail?.url || '/placeholder-image.jpg'}
                        alt={blog.blog_thumbnail?.alt || blog.blog_title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {blog.blog_category && (
                        <div className="absolute top-4 right-4">
                            <Badge variant="secondary" className="bg-white/90 text-green-800 font-medium px-3 py-1 rounded-full">
                                {blog.blog_category.category_name}
                            </Badge>
                        </div>
                    )}
                </div>
            </Link>

            <CardContent className="p-6">
                <Link to={`/blog/${blog.blog_slug}`}>
                    <h3 className="text-xl font-bold text-gray-900 hover:text-green-600 transition-colors line-clamp-2 mb-3 leading-tight">
                        {blog.blog_title}
                    </h3>
                </Link>

                <p className="text-gray-600 line-clamp-3 mb-4 leading-relaxed">
                    {blog.blog_excerpt}
                </p>

                {blog.blog_tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {blog.blog_tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-green-200 text-green-700 hover:bg-green-50">
                                {tag}
                            </Badge>
                        ))}
                    </div>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span>
                            {new Date(blog.createdAt).toLocaleDateString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric'
                            })}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4 text-green-600" />
                            <span>{blog.blog_views || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-green-600" />
                            <span>{blog.blog_reading_time || 0}p</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default BlogList;
