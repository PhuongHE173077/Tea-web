import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Eye, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getFeaturedBlogs } from '@/apis/blog.apis';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface BlogFeaturedProps {
    limit?: number;
    showViewAll?: boolean;
    className?: string;
}

const BlogFeatured: React.FC<BlogFeaturedProps> = ({ 
    limit = 6, 
    showViewAll = true,
    className = ""
}) => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedBlogs();
    }, [limit]);

    const fetchFeaturedBlogs = async () => {
        setLoading(true);
        try {
            const response = await getFeaturedBlogs(limit);
            setBlogs(response.data);
        } catch (error) {
            console.error('Error fetching featured blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <section className={`py-16 bg-gray-50 ${className}`}>
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <Skeleton className="h-8 w-64 mx-auto mb-4" />
                        <Skeleton className="h-6 w-96 mx-auto" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: limit }).map((_, index) => (
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
                </div>
            </section>
        );
    }

    if (blogs.length === 0) {
        return null;
    }

    return (
        <section className={`py-16 bg-gray-50 ${className}`}>
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Blog Nổi Bật
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Khám phá những bài viết được yêu thích nhất về thế giới trà, 
                        từ kỹ thuật pha chế đến văn hóa trà truyền thống
                    </p>
                </div>

                {/* Featured Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {blogs.map((blog, index) => (
                        <BlogCard key={blog._id} blog={blog} featured={index === 0} />
                    ))}
                </div>

                {/* View All Button */}
                {showViewAll && (
                    <div className="text-center">
                        <Button asChild size="lg">
                            <Link to="/blog">
                                Xem tất cả bài viết
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Link>
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
};

// Blog Card Component
const BlogCard: React.FC<{ blog: Blog; featured?: boolean }> = ({ blog, featured = false }) => {
    return (
        <Card className={`overflow-hidden hover:shadow-lg transition-all duration-300 group ${
            featured ? 'md:col-span-2 lg:col-span-1' : ''
        }`}>
            <Link to={`/blog/${blog.blog_slug}`}>
                <div className={`overflow-hidden ${featured ? 'aspect-video' : 'aspect-video'}`}>
                    <img
                        src={blog.blog_thumbnail?.url || '/placeholder-image.jpg'}
                        alt={blog.blog_thumbnail?.alt || blog.blog_title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
            </Link>
            
            <CardHeader className="p-6">
                <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">Nổi bật</Badge>
                    {blog.blog_category && (
                        <Badge variant="outline">
                            {blog.blog_category.category_name}
                        </Badge>
                    )}
                </div>

                <Link to={`/blog/${blog.blog_slug}`}>
                    <h3 className={`font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 ${
                        featured ? 'text-xl md:text-2xl' : 'text-lg'
                    }`}>
                        {blog.blog_title}
                    </h3>
                </Link>

                <p className={`text-gray-600 line-clamp-3 mt-3 ${
                    featured ? 'text-base' : 'text-sm'
                }`}>
                    {blog.blog_excerpt}
                </p>

                <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{blog.blog_author.usr_name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
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
                            <Eye className="h-4 w-4" />
                            <span>{blog.blog_views}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{blog.blog_reading_time} phút</span>
                        </div>
                    </div>
                </div>

                {/* Read More Link */}
                <div className="mt-4 pt-4 border-t">
                    <Link 
                        to={`/blog/${blog.blog_slug}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                        Đọc tiếp
                        <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                </div>
            </CardHeader>
        </Card>
    );
};

export default BlogFeatured;
