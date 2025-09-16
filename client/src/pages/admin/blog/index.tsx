import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BlogDashboard from './BlogDashboard';
import CreateBlog from './CreateBlog';
import EditBlog from './EditBlog';

const AdminBlogRoutes: React.FC = () => {
    return (
        <Routes>
            <Route index element={<BlogDashboard />} />
            <Route path="create" element={<CreateBlog />} />
            <Route path="edit/:id" element={<EditBlog />} />
        </Routes>
    );
};

export default AdminBlogRoutes;
