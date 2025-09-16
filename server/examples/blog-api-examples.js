// Blog API Usage Examples
// Sử dụng với axios hoặc fetch

const API_BASE_URL = 'http://localhost:3000/api/v1';

// 1. Lấy danh sách blog với phân trang
const getAllBlogs = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/blogs?page=1&limit=10&status=published`);
        const data = await response.json();
        console.log('Blogs:', data);
    } catch (error) {
        console.error('Error:', error);
    }
};

// 2. Tìm kiếm blog
const searchBlogs = async (searchTerm) => {
    try {
        const response = await fetch(`${API_BASE_URL}/blogs?search=${encodeURIComponent(searchTerm)}&status=published`);
        const data = await response.json();
        console.log('Search results:', data);
    } catch (error) {
        console.error('Error:', error);
    }
};

// 3. Lấy blog theo ID
const getBlogById = async (blogId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/blogs/${blogId}`);
        const data = await response.json();
        console.log('Blog detail:', data);
    } catch (error) {
        console.error('Error:', error);
    }
};

// 4. Lấy blog theo slug
const getBlogBySlug = async (slug) => {
    try {
        const response = await fetch(`${API_BASE_URL}/blogs/slug/${slug}`);
        const data = await response.json();
        console.log('Blog by slug:', data);
    } catch (error) {
        console.error('Error:', error);
    }
};

// 5. Tạo blog mới (cần authentication)
const createBlog = async (blogData, token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/blogs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(blogData)
        });
        const data = await response.json();
        console.log('Created blog:', data);
    } catch (error) {
        console.error('Error:', error);
    }
};

// 6. Cập nhật blog (cần authentication)
const updateBlog = async (blogId, updateData, token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/blogs/${blogId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updateData)
        });
        const data = await response.json();
        console.log('Updated blog:', data);
    } catch (error) {
        console.error('Error:', error);
    }
};

// 7. Xóa blog (cần admin permission)
const deleteBlog = async (blogId, token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/blogs/${blogId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        console.log('Delete result:', data);
    } catch (error) {
        console.error('Error:', error);
    }
};

// Example data for creating blog
const sampleBlogData = {
    blog_title: "Hướng dẫn sử dụng React Hooks",
    blog_content: `
        React Hooks là một tính năng mới được giới thiệu trong React 16.8 cho phép bạn sử dụng state và các tính năng khác của React mà không cần viết class component.

        ## useState Hook
        useState là hook cơ bản nhất cho phép bạn thêm state vào functional component:

        \`\`\`javascript
        import React, { useState } from 'react';

        function Counter() {
            const [count, setCount] = useState(0);

            return (
                <div>
                    <p>You clicked {count} times</p>
                    <button onClick={() => setCount(count + 1)}>
                        Click me
                    </button>
                </div>
            );
        }
        \`\`\`

        ## useEffect Hook
        useEffect cho phép bạn thực hiện side effects trong functional component:

        \`\`\`javascript
        import React, { useState, useEffect } from 'react';

        function Example() {
            const [count, setCount] = useState(0);

            useEffect(() => {
                document.title = \`You clicked \${count} times\`;
            });

            return (
                <div>
                    <p>You clicked {count} times</p>
                    <button onClick={() => setCount(count + 1)}>
                        Click me
                    </button>
                </div>
            );
        }
        \`\`\`

        React Hooks giúp code trở nên sạch sẽ và dễ hiểu hơn, đồng thời cho phép tái sử dụng logic giữa các component.
    `,
    blog_excerpt: "Tìm hiểu về React Hooks và cách sử dụng useState, useEffect để xây dựng functional component hiệu quả.",
    blog_thumbnail: {
        url: "https://example.com/react-hooks-thumbnail.jpg",
        alt: "React Hooks Tutorial"
    },
    blog_tags: ["react", "hooks", "javascript", "frontend", "tutorial"],
    blog_status: "published",
    blog_meta: {
        title: "Hướng dẫn React Hooks - useState và useEffect",
        description: "Học cách sử dụng React Hooks để xây dựng functional component mạnh mẽ với useState và useEffect",
        keywords: ["react hooks", "usestate", "useeffect", "functional component", "react tutorial"]
    },
    blog_featured: true
};

// Usage examples
console.log('=== Blog API Examples ===');

// Get all blogs
getAllBlogs();

// Search blogs
searchBlogs('react');

// Get blog by ID (replace with actual ID)
// getBlogById('60f7b3b3b3b3b3b3b3b3b3b3');

// Get blog by slug
// getBlogBySlug('huong-dan-su-dung-react-hooks');

// Create blog (replace with actual token)
// createBlog(sampleBlogData, 'your-jwt-token-here');

// Update blog (replace with actual ID and token)
// updateBlog('60f7b3b3b3b3b3b3b3b3b3b3', { blog_title: 'Updated Title' }, 'your-jwt-token-here');

// Delete blog (replace with actual ID and admin token)
// deleteBlog('60f7b3b3b3b3b3b3b3b3b3b3', 'your-admin-jwt-token-here');

export {
    getAllBlogs,
    searchBlogs,
    getBlogById,
    getBlogBySlug,
    createBlog,
    updateBlog,
    deleteBlog,
    sampleBlogData
};
