import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Upload, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createBlog, updateBlog, getBlogById } from '@/apis/blog.apis';
import { getAllCategories } from '@/apis/category.apis';
import { uploadSingleImage } from '@/apis/index';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const blogSchema = z.object({
    blog_title: z.string().min(5, 'Tiêu đề phải có ít nhất 5 ký tự').max(200, 'Tiêu đề không được quá 200 ký tự'),
    blog_content: z.string().min(50, 'Nội dung phải có ít nhất 50 ký tự'),
    blog_excerpt: z.string().min(10, 'Tóm tắt phải có ít nhất 10 ký tự').max(500, 'Tóm tắt không được quá 500 ký tự'),
    blog_category: z.string().optional(),
    blog_status: z.enum(['draft', 'published', 'archived']),
    blog_featured: z.boolean(),
    blog_meta: z.object({
        title: z.string().max(60, 'Meta title không được quá 60 ký tự').optional(),
        description: z.string().max(160, 'Meta description không được quá 160 ký tự').optional(),
        keywords: z.array(z.string()).optional()
    }).optional()
});

type BlogFormData = z.infer<typeof blogSchema>;

interface BlogFormProps {
    mode: 'create' | 'edit';
}

const BlogForm: React.FC<BlogFormProps> = ({ mode }) => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [thumbnail, setThumbnail] = useState<{ url: string; alt: string } | null>(null);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [previewMode, setPreviewMode] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset
    } = useForm<BlogFormData>({
        resolver: zodResolver(blogSchema),
        defaultValues: {
            blog_status: 'draft',
            blog_featured: false,
            blog_meta: {
                title: '',
                description: '',
                keywords: []
            }
        }
    });

    const watchedValues = watch();

    useEffect(() => {
        fetchCategories();
        if (mode === 'edit' && id) {
            fetchBlogData();
        }
    }, [mode, id]);

    const fetchCategories = async () => {
        try {
            console.log('BlogForm: Fetching categories...');
            const response = await getAllCategories({ status: 'active' });
            console.log('BlogForm: Categories response:', response);

            // From your logs: BlogForm gets full axios response object
            // But getAllCategories should return response.data (which is the array)
            // Let's handle both cases to be safe

            console.log('BlogForm: Response type:', typeof response);
            console.log('BlogForm: Is response array?', Array.isArray(response));
            console.log('BlogForm: Response has data?', response && response.data);

            if (Array.isArray(response)) {
                // getAllCategories returned response.data directly (expected)
                setCategories(response);
                console.log('BlogForm: Categories set from array response:', response);
            } else if (response && response.data && Array.isArray(response.data)) {
                // Somehow got full axios response (unexpected but handle it)
                setCategories(response.data);
                console.log('BlogForm: Categories set from response.data:', response.data);
            } else {
                console.warn('BlogForm: Unexpected response format:', response);
                setCategories([]);
            }
        } catch (error) {
            console.error('BlogForm: Error fetching categories:', error);
            toast.error('Có lỗi xảy ra khi tải danh mục');
            setCategories([]);
        }
    };

    const fetchBlogData = async () => {
        if (!id) return;
        
        setLoading(true);
        try {
            const response = await getBlogById(id);
            const blog = response.data;
            
            reset({
                blog_title: blog.blog_title,
                blog_content: blog.blog_content,
                blog_excerpt: blog.blog_excerpt,
                blog_category: blog.blog_category?._id || 'none',
                blog_status: blog.blog_status,
                blog_featured: blog.blog_featured,
                blog_meta: blog.blog_meta || { title: '', description: '', keywords: [] }
            });

            if (blog.blog_thumbnail) {
                setThumbnail(blog.blog_thumbnail);
            }
            setTags(blog.blog_tags || []);
        } catch (error) {
            console.error('Error fetching blog:', error);
            toast.error('Có lỗi xảy ra khi tải dữ liệu blog');
            navigate('/admin/blog');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Vui lòng chọn file hình ảnh');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Kích thước file không được vượt quá 5MB');
            return;
        }

        setUploading(true);
        try {
            const imageUrl = await uploadSingleImage(file);
            setThumbnail({
                url: imageUrl,
                alt: watchedValues.blog_title || 'Blog thumbnail'
            });
            toast.success('Tải ảnh lên thành công');
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Có lỗi xảy ra khi tải ảnh lên');
        } finally {
            setUploading(false);
        }
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const onSubmit = async (data: BlogFormData) => {
        setLoading(true);
        try {
            const blogData: BlogFormData & { blog_tags: string[]; blog_thumbnail?: { url: string; alt: string } } = {
                ...data,
                blog_category: data.blog_category === 'none' ? undefined : data.blog_category,
                blog_tags: tags,
                blog_thumbnail: thumbnail || undefined
            };

            if (mode === 'create') {
                await createBlog(blogData);
                toast.success('Tạo blog thành công');
            } else if (id) {
                await updateBlog(id, blogData);
                toast.success('Cập nhật blog thành công');
            }

            navigate('/admin/blog');
        } catch (error: any) {
            console.error('Error saving blog:', error);
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi lưu blog');
        } finally {
            setLoading(false);
        }
    };

    const handlePreview = () => {
        setPreviewMode(!previewMode);
    };

    if (loading && mode === 'edit') {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-64 bg-gray-200 rounded"></div>
                        <div className="h-32 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => navigate('/admin/blog')}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Quay lại
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {mode === 'create' ? 'Tạo blog mới' : 'Chỉnh sửa blog'}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {mode === 'create' ? 'Tạo một bài viết blog mới' : 'Cập nhật thông tin blog'}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handlePreview}>
                            <Eye className="h-4 w-4 mr-2" />
                            {previewMode ? 'Chỉnh sửa' : 'Xem trước'}
                        </Button>
                        <Button 
                            onClick={handleSubmit(onSubmit)} 
                            disabled={loading}
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {loading ? 'Đang lưu...' : 'Lưu blog'}
                        </Button>
                    </div>
                </div>

                {previewMode ? (
                    /* Preview Mode */
                    <Card>
                        <CardContent className="p-8">
                            {thumbnail && (
                                <div className="aspect-video overflow-hidden rounded-lg mb-6">
                                    <img
                                        src={thumbnail.url}
                                        alt={thumbnail.alt}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                {watchedValues.blog_title || 'Tiêu đề blog'}
                            </h1>
                            <p className="text-lg text-gray-600 mb-6">
                                {watchedValues.blog_excerpt || 'Tóm tắt blog'}
                            </p>
                            <div className="prose max-w-none">
                                <div dangerouslySetInnerHTML={{ 
                                    __html: watchedValues.blog_content?.replace(/\n/g, '<br>') || 'Nội dung blog' 
                                }} />
                            </div>
                            {tags.length > 0 && (
                                <div className="mt-8 pt-6 border-t">
                                    <h3 className="text-lg font-semibold mb-4">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {tags.map((tag, index) => (
                                            <Badge key={index} variant="secondary">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    /* Edit Mode */
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <Tabs defaultValue="content" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="content">Nội dung</TabsTrigger>
                                <TabsTrigger value="settings">Cài đặt</TabsTrigger>
                                <TabsTrigger value="seo">SEO</TabsTrigger>
                            </TabsList>

                            <TabsContent value="content" className="space-y-6">
                                {/* Basic Info */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Thông tin cơ bản</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Title */}
                                        <div>
                                            <Label htmlFor="blog_title">Tiêu đề *</Label>
                                            <Input
                                                id="blog_title"
                                                {...register('blog_title')}
                                                placeholder="Nhập tiêu đề blog..."
                                                className={errors.blog_title ? 'border-red-500' : ''}
                                            />
                                            {errors.blog_title && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {errors.blog_title.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Excerpt */}
                                        <div>
                                            <Label htmlFor="blog_excerpt">Tóm tắt *</Label>
                                            <Textarea
                                                id="blog_excerpt"
                                                {...register('blog_excerpt')}
                                                placeholder="Nhập tóm tắt ngắn gọn về blog..."
                                                rows={3}
                                                className={errors.blog_excerpt ? 'border-red-500' : ''}
                                            />
                                            {errors.blog_excerpt && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {errors.blog_excerpt.message}
                                                </p>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div>
                                            <Label htmlFor="blog_content">Nội dung *</Label>
                                            <Textarea
                                                id="blog_content"
                                                {...register('blog_content')}
                                                placeholder="Nhập nội dung blog... (Hỗ trợ HTML)"
                                                rows={15}
                                                className={errors.blog_content ? 'border-red-500' : ''}
                                            />
                                            {errors.blog_content && (
                                                <p className="text-red-500 text-sm mt-1">
                                                    {errors.blog_content.message}
                                                </p>
                                            )}
                                            <p className="text-sm text-gray-500 mt-1">
                                                Bạn có thể sử dụng HTML tags để định dạng nội dung
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Thumbnail */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Hình ảnh đại diện</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {thumbnail ? (
                                                <div className="relative">
                                                    <img
                                                        src={thumbnail.url}
                                                        alt={thumbnail.alt}
                                                        className="w-full h-48 object-cover rounded-lg"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        className="absolute top-2 right-2"
                                                        onClick={() => setThumbnail(null)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                                    <p className="text-gray-600 mb-2">Chọn hình ảnh đại diện</p>
                                                    <p className="text-sm text-gray-500">PNG, JPG, GIF tối đa 5MB</p>
                                                </div>
                                            )}
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                disabled={uploading}
                                            />
                                            {uploading && (
                                                <p className="text-sm text-blue-600">Đang tải ảnh lên...</p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="settings" className="space-y-6">
                                {/* Settings */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Cài đặt blog</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Category */}
                                        <div>
                                            <Label htmlFor="blog_category">Danh mục</Label>



                                            <Select
                                                value={watchedValues.blog_category || 'none'}
                                                onValueChange={(value) => setValue('blog_category', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Chọn danh mục" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="none">Không có danh mục</SelectItem>
                                                    {categories?.map((category) => (
                                                        <SelectItem key={category._id} value={category._id}>
                                                            {category.category_name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Status */}
                                        <div>
                                            <Label htmlFor="blog_status">Trạng thái</Label>
                                            <Select
                                                value={watchedValues.blog_status}
                                                onValueChange={(value) => setValue('blog_status', value as any)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="draft">Bản nháp</SelectItem>
                                                    <SelectItem value="published">Đã xuất bản</SelectItem>
                                                    <SelectItem value="archived">Lưu trữ</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Featured */}
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                id="blog_featured"
                                                checked={watchedValues.blog_featured}
                                                onCheckedChange={(checked) => setValue('blog_featured', checked)}
                                            />
                                            <Label htmlFor="blog_featured">Blog nổi bật</Label>
                                        </div>

                                        {/* Tags */}
                                        <div>
                                            <Label>Tags</Label>
                                            <div className="flex gap-2 mb-2">
                                                <Input
                                                    value={tagInput}
                                                    onChange={(e) => setTagInput(e.target.value)}
                                                    placeholder="Nhập tag..."
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            handleAddTag();
                                                        }
                                                    }}
                                                />
                                                <Button type="button" onClick={handleAddTag}>
                                                    Thêm
                                                </Button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {tags.map((tag, index) => (
                                                    <Badge key={index} variant="secondary" className="cursor-pointer">
                                                        {tag}
                                                        <X
                                                            className="h-3 w-3 ml-1"
                                                            onClick={() => handleRemoveTag(tag)}
                                                        />
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="seo" className="space-y-6">
                                {/* SEO */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>SEO Meta Tags</CardTitle>
                                        <p className="text-sm text-gray-600">
                                            Tối ưu hóa blog cho công cụ tìm kiếm
                                        </p>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Meta Title */}
                                        <div>
                                            <Label htmlFor="meta_title">Meta Title</Label>
                                            <Input
                                                id="meta_title"
                                                {...register('blog_meta.title')}
                                                placeholder="Tiêu đề SEO (tối đa 60 ký tự)"
                                                maxLength={60}
                                            />
                                            <p className="text-sm text-gray-500 mt-1">
                                                {watchedValues.blog_meta?.title?.length || 0}/60 ký tự
                                            </p>
                                        </div>

                                        {/* Meta Description */}
                                        <div>
                                            <Label htmlFor="meta_description">Meta Description</Label>
                                            <Textarea
                                                id="meta_description"
                                                {...register('blog_meta.description')}
                                                placeholder="Mô tả SEO (tối đa 160 ký tự)"
                                                rows={3}
                                                maxLength={160}
                                            />
                                            <p className="text-sm text-gray-500 mt-1">
                                                {watchedValues.blog_meta?.description?.length || 0}/160 ký tự
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>

                        {/* Submit Buttons */}
                        <div className="flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate('/admin/blog')}
                            >
                                Hủy
                            </Button>
                            <Button type="submit" disabled={loading}>
                                <Save className="h-4 w-4 mr-2" />
                                {loading ? 'Đang lưu...' : 'Lưu blog'}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default BlogForm;
