import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Eye, Clock, Tag, Share2, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { getBlogBySlug, getRecentBlogs } from '@/apis/blog.apis';
import { formatDistanceToNow, format } from 'date-fns';
import { vi } from 'date-fns/locale';
import SEO from '@/components/SEO';

const BlogDetail: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [recentBlogs, setRecentBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (slug) {
            fetchBlogDetail();
            fetchRecentBlogs();
        }
    }, [slug]);

    const fetchBlogDetail = async () => {
        if (!slug) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const response = await getBlogBySlug(slug);
            setBlog(response.data);
        } catch (error: any) {
            console.error('Error fetching blog detail:', error);
            if (error.response?.status === 404) {
                setError('Bài viết không tồn tại');
            } else {
                setError('Có lỗi xảy ra khi tải bài viết');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchRecentBlogs = async () => {
        try {
            const response = await getRecentBlogs(5);
            setRecentBlogs(response.data);
        } catch (error) {
            console.error('Error fetching recent blogs:', error);
        }
    };

    const handleShare = async () => {
        if (navigator.share && blog) {
            try {
                await navigator.share({
                    title: blog.blog_title,
                    text: blog.blog_excerpt,
                    url: window.location.href,
                });
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            // You can add a toast notification here
        }
    };

    if (loading) {
        return <BlogDetailSkeleton />;
    }

    if (error || !blog) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">
                        {error || 'Bài viết không tồn tại'}
                    </h1>
                    <Button onClick={() => navigate('/blog')} variant="outline">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay lại danh sách blog
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            {/* SEO Meta Tags */}
            <SEO
                title={blog.blog_meta?.title || blog.blog_title}
                description={blog.blog_meta?.description || blog.blog_excerpt}
                keywords={blog.blog_meta?.keywords?.join(', ') || blog.blog_tags.join(', ')}
                ogTitle={blog.blog_title}
                ogDescription={blog.blog_excerpt}
                ogImage={blog.blog_thumbnail?.url}
                ogUrl={window.location.href}
                ogType="article"
                twitterCard="summary_large_image"
                twitterTitle={blog.blog_title}
                twitterDescription={blog.blog_excerpt}
                twitterImage={blog.blog_thumbnail?.url}
            />

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Back Button */}
                    <Button 
                        variant="ghost" 
                        onClick={() => navigate('/blog')}
                        className="mb-6"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay lại danh sách blog
                    </Button>

                    {/* Article Header */}
                    <article className="bg-white rounded-lg shadow-sm border overflow-hidden">
                        {/* Featured Image */}
                        {blog.blog_thumbnail?.url && (
                            <div className="aspect-video overflow-hidden">
                                <img
                                    src={blog.blog_thumbnail.url}
                                    alt={blog.blog_thumbnail.alt || blog.blog_title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        <div className="p-8">
                            {/* Meta Info */}
                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                {blog.blog_featured && (
                                    <Badge variant="secondary">Nổi bật</Badge>
                                )}
                                {blog.blog_category && (
                                    <Badge variant="outline">
                                        {blog.blog_category.category_name}
                                    </Badge>
                                )}
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <User className="h-4 w-4" />
                                    <span>{blog.blog_author.usr_name}</span>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                        {format(new Date(blog.createdAt), 'dd/MM/yyyy', { locale: vi })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <Eye className="h-4 w-4" />
                                    <span>{blog.blog_views} lượt xem</span>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <Clock className="h-4 w-4" />
                                    <span>{blog.blog_reading_time} phút đọc</span>
                                </div>
                            </div>

                            {/* Title */}
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                                {blog.blog_title}
                            </h1>

                            {/* Excerpt */}
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                {blog.blog_excerpt}
                            </p>

                            {/* Share Button */}
                            <div className="flex justify-between items-center mb-8">
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={handleShare}>
                                        <Share2 className="h-4 w-4 mr-2" />
                                        Chia sẻ
                                    </Button>
                                </div>
                            </div>

                            <Separator className="mb-8" />

                            {/* Content */}
                            <div 
                                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900"
                                dangerouslySetInnerHTML={{ __html: blog.blog_content }}
                            />

                            {/* Tags */}
                            {blog.blog_tags.length > 0 && (
                                <div className="mt-8 pt-8 border-t">
                                    <h3 className="text-lg font-semibold mb-4">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {blog.blog_tags.map((tag, index) => (
                                            <Badge key={index} variant="secondary">
                                                <Tag className="h-3 w-3 mr-1" />
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Author Info */}
                            <div className="mt-8 pt-8 border-t">
                                <div className="flex items-center gap-4">
                                    {blog.blog_author.usr_avatar && (
                                        <img
                                            src={blog.blog_author.usr_avatar}
                                            alt={blog.blog_author.usr_name}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    )}
                                    <div>
                                        <h4 className="font-semibold text-gray-900">
                                            {blog.blog_author.usr_name}
                                        </h4>
                                        <p className="text-sm text-gray-600">Tác giả</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </article>

                    {/* Recent Blogs Sidebar */}
                    {recentBlogs.length > 0 && (
                        <div className="mt-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Bài viết gần đây</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {recentBlogs.filter(recentBlog => recentBlog._id !== blog._id).slice(0, 3).map((recentBlog) => (
                                    <Card key={recentBlog._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                        <Link to={`/blog/${recentBlog.blog_slug}`}>
                                            <div className="aspect-video overflow-hidden">
                                                <img
                                                    src={recentBlog.blog_thumbnail?.url || '/placeholder-image.jpg'}
                                                    alt={recentBlog.blog_title}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                        </Link>
                                        <CardHeader className="p-4">
                                            <Link to={`/blog/${recentBlog.blog_slug}`}>
                                                <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2">
                                                    {recentBlog.blog_title}
                                                </h3>
                                            </Link>
                                            <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                                                {recentBlog.blog_excerpt}
                                            </p>
                                            <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                                                <span>
                                                    {formatDistanceToNow(new Date(recentBlog.createdAt), { 
                                                        addSuffix: true, 
                                                        locale: vi 
                                                    })}
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    <Eye className="h-3 w-3" />
                                                    <span>{recentBlog.blog_views}</span>
                                                </div>
                                            </div>
                                        </CardHeader>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

// Loading Skeleton Component
const BlogDetailSkeleton: React.FC = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                <Skeleton className="h-10 w-40 mb-6" />
                <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                    <Skeleton className="aspect-video w-full" />
                    <div className="p-8">
                        <div className="flex gap-4 mb-6">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-6 w-32" />
                        </div>
                        <Skeleton className="h-12 w-full mb-6" />
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-6 w-3/4 mb-8" />
                        <div className="space-y-4">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;
