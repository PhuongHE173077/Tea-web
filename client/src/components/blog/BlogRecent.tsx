import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Eye, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { getRecentBlogs } from '@/apis/blog.apis';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface BlogRecentProps {
    limit?: number;
    showViewAll?: boolean;
    className?: string;
    title?: string;
}

const BlogRecent: React.FC<BlogRecentProps> = ({ 
    limit = 5, 
    showViewAll = true,
    className = "",
    title = "Bài viết gần đây"
}) => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRecentBlogs();
    }, [limit]);

    const fetchRecentBlogs = async () => {
        setLoading(true);
        try {
            const response = await getRecentBlogs(limit);
            setBlogs(response.data);
        } catch (error) {
            console.error('Error fetching recent blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Card className={className}>
                <CardHeader>
                    <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent className="space-y-4">
                    {Array.from({ length: limit }).map((_, index) => (
                        <div key={index} className="flex gap-3">
                            <Skeleton className="h-16 w-20 rounded" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-3 w-2/3" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        );
    }

    if (blogs.length === 0) {
        return null;
    }

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {blogs.map((blog) => (
                    <div key={blog._id} className="flex gap-3 group">
                        <Link to={`/blog/${blog.blog_slug}`} className="flex-shrink-0">
                            <img
                                src={blog.blog_thumbnail?.url || '/placeholder-image.jpg'}
                                alt={blog.blog_title}
                                className="w-20 h-16 object-cover rounded group-hover:opacity-80 transition-opacity"
                            />
                        </Link>
                        
                        <div className="flex-1 min-w-0">
                            <Link to={`/blog/${blog.blog_slug}`}>
                                <h4 className="font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 text-sm">
                                    {blog.blog_title}
                                </h4>
                            </Link>
                            
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>
                                        {formatDistanceToNow(new Date(blog.createdAt), { 
                                            addSuffix: true, 
                                            locale: vi 
                                        })}
                                    </span>
                                </div>
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
                    </div>
                ))}

                {showViewAll && (
                    <div className="pt-4 border-t">
                        <Button variant="ghost" size="sm" asChild className="w-full justify-center">
                            <Link to="/blog">
                                Xem tất cả
                                <ArrowRight className="h-3 w-3 ml-1" />
                            </Link>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default BlogRecent;
