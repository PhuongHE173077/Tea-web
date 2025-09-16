import axiosCustomize from "@/services/axios.customize";

// Get all blogs with filters and pagination
export const getAllBlogs = async (filters?: BlogFilters): Promise<BlogResponse> => {
    const params = new URLSearchParams();
    
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.author) params.append('author', filters.author);
    if (filters?.featured !== undefined) params.append('featured', filters.featured.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.sortBy) params.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);

    const url = `/blogs?${params.toString()}`;
    console.log('API URL:', url);
    const response = await axiosCustomize.get(url);
    console.log('API Response:', response);
    return response.data;
};

// Get blog by ID
export const getBlogById = async (id: string): Promise<BlogSingleResponse> => {
    const response = await axiosCustomize.get(`/blogs/${id}`);
    return response.data;
};

// Get blog by slug
export const getBlogBySlug = async (slug: string): Promise<BlogSingleResponse> => {
    const response = await axiosCustomize.get(`/blogs/slug/${slug}`);
    return response.data;
};

// Create new blog (Admin only)
export const createBlog = async (data: BlogFormData): Promise<BlogSingleResponse> => {
    const response = await axiosCustomize.post('/blogs', data);
    return response.data;
};

// Update blog (Admin only)
export const updateBlog = async (id: string, data: Partial<BlogFormData>): Promise<BlogSingleResponse> => {
    const response = await axiosCustomize.put(`/blogs/${id}`, data);
    return response.data;
};

// Delete blog (Admin only)
export const deleteBlog = async (id: string): Promise<{ success: boolean; message: string }> => {
    const response = await axiosCustomize.delete(`/blogs/${id}`);
    return response.data;
};

// Get published blogs for public (with default filters)
export const getPublishedBlogs = async (filters?: Omit<BlogFilters, 'status'>): Promise<BlogResponse> => {
    return getAllBlogs({ ...filters, status: 'published' });
};

// Get featured blogs
export const getFeaturedBlogs = async (limit: number = 6): Promise<BlogResponse> => {
    return getAllBlogs({ 
        status: 'published', 
        featured: true, 
        limit,
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });
};

// Search blogs
export const searchBlogs = async (query: string, filters?: Omit<BlogFilters, 'search'>): Promise<BlogResponse> => {
    return getAllBlogs({ ...filters, search: query, status: 'published' });
};

// Get blogs by category
export const getBlogsByCategory = async (categoryId: string, filters?: Omit<BlogFilters, 'category'>): Promise<BlogResponse> => {
    return getAllBlogs({ ...filters, category: categoryId, status: 'published' });
};

// Get recent blogs
export const getRecentBlogs = async (limit: number = 5): Promise<BlogResponse> => {
    return getAllBlogs({
        status: 'published',
        limit,
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });
};

// Get popular blogs (by views)
export const getPopularBlogs = async (limit: number = 5): Promise<BlogResponse> => {
    return getAllBlogs({
        status: 'published',
        limit,
        sortBy: 'blog_views',
        sortOrder: 'desc'
    });
};
