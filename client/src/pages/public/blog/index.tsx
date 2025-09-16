import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BlogList from './BlogList';
import BlogDetail from './BlogDetail';

const BlogRoutes: React.FC = () => {
    return (
        <Routes>
            <Route index element={<BlogList />} />
            <Route path=":slug" element={<BlogDetail />} />
        </Routes>
    );
};

export default BlogRoutes;
