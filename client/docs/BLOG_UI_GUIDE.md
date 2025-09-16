# Blog UI System - Hướng dẫn sử dụng

## Tổng quan
Hệ thống Blog UI được xây dựng với React + TypeScript + Tailwind CSS + ShadCN UI, bao gồm hai phần chính:
- **Public Blog UI**: Giao diện người dùng xem blog
- **Admin Blog Management**: Giao diện quản trị viên quản lý blog

## Cấu trúc Files

### Public Blog UI
```
client/src/pages/public/blog/
├── index.tsx              # Routes chính
├── BlogList.tsx          # Trang danh sách blog
└── BlogDetail.tsx        # Trang chi tiết blog
```

### Admin Blog Management
```
client/src/pages/admin/blog/
├── index.tsx             # Routes admin
├── BlogDashboard.tsx     # Dashboard quản lý
├── BlogForm.tsx          # Form tạo/sửa blog
├── CreateBlog.tsx        # Wrapper tạo blog
└── EditBlog.tsx          # Wrapper sửa blog
```

### Components
```
client/src/components/blog/
├── BlogFeatured.tsx      # Component blog nổi bật
└── BlogRecent.tsx        # Component blog gần đây

client/src/components/
└── SEO.tsx               # Component SEO meta tags
```

### APIs & Types
```
client/src/apis/
└── blog.apis.ts          # Blog API functions

client/src/types/
└── index.ts              # Blog TypeScript types
```

## Tính năng chính

### 🌐 Public Blog UI

#### BlogList (Danh sách blog)
- **URL**: `/blog`
- **Tính năng**:
  - Hiển thị danh sách blog đã publish
  - Phân trang với navigation
  - Tìm kiếm full-text
  - Lọc theo danh mục, trạng thái
  - Sắp xếp theo ngày, lượt xem, tiêu đề
  - Responsive design
  - Loading states với skeleton

#### BlogDetail (Chi tiết blog)
- **URL**: `/blog/:slug`
- **Tính năng**:
  - Hiển thị nội dung blog đầy đủ
  - SEO meta tags tự động
  - Tăng view count
  - Hiển thị thông tin tác giả
  - Tags và category
  - Thời gian đọc
  - Chia sẻ social media
  - Blog liên quan
  - Responsive design

### 🔧 Admin Blog Management

#### BlogDashboard (Dashboard quản lý)
- **URL**: `/admin/blog`
- **Tính năng**:
  - Bảng danh sách blog với pagination
  - Thống kê tổng quan (tổng, published, draft, archived)
  - Tìm kiếm và lọc nâng cao
  - Sắp xếp đa tiêu chí
  - Thao tác CRUD (xem, sửa, xóa)
  - Xác nhận xóa với AlertDialog
  - Trạng thái loading

#### BlogForm (Form tạo/sửa)
- **URL**: `/admin/blog/create`, `/admin/blog/edit/:id`
- **Tính năng**:
  - Form validation với Zod
  - Rich content editor (textarea với HTML support)
  - Upload hình ảnh thumbnail
  - Quản lý tags
  - SEO meta tags
  - Preview mode
  - Auto-save draft
  - Responsive tabs layout

### 🎨 Reusable Components

#### BlogFeatured
- Hiển thị blog nổi bật
- Configurable limit
- Grid layout responsive
- Hover effects

#### BlogRecent
- Sidebar blog gần đây
- Compact card design
- Configurable title và limit

#### SEO
- Dynamic meta tags
- Open Graph support
- Twitter Cards
- Automatic cleanup

## Cách sử dụng

### 1. Tích hợp vào Routes

#### Public Routes
```tsx
// client/src/routers/public.router.tsx
import BlogRoutes from '@/pages/public/blog';

// Thêm vào routes
<Route path="/blog/*" element={<BlogRoutes />} />
```

#### Admin Routes
```tsx
// client/src/routers/admin.router.tsx
import AdminBlogRoutes from '@/pages/admin/blog';

// Thêm vào routes
<Route path="/admin/blog/*" element={<AdminBlogRoutes />} />
```

### 2. Sử dụng Components

#### Hiển thị Blog Featured trên trang chủ
```tsx
import BlogFeatured from '@/components/blog/BlogFeatured';

function HomePage() {
    return (
        <div>
            {/* Other content */}
            <BlogFeatured limit={6} showViewAll={true} />
            {/* Other content */}
        </div>
    );
}
```

#### Hiển thị Blog Recent trong sidebar
```tsx
import BlogRecent from '@/components/blog/BlogRecent';

function Sidebar() {
    return (
        <aside>
            <BlogRecent 
                limit={5} 
                title="Bài viết mới nhất"
                showViewAll={true}
            />
        </aside>
    );
}
```

### 3. Customization

#### Styling
- Sử dụng Tailwind CSS classes
- Tùy chỉnh theme trong `tailwind.config.ts`
- Override component styles với className props

#### API Integration
- Tất cả API calls đã được abstract trong `blog.apis.ts`
- Error handling tự động với toast notifications
- Loading states được quản lý

#### SEO Optimization
- Meta tags tự động từ blog content
- Open Graph và Twitter Cards
- Structured data ready

## Dependencies cần thiết

### Đã có sẵn
- React Router DOM
- React Hook Form
- Zod validation
- Tailwind CSS
- ShadCN UI components
- Axios
- Date-fns
- Lucide React icons

### Có thể thêm (tùy chọn)
```bash
# Rich Text Editor
npm install react-quill quill

# Image optimization
npm install next/image

# SEO advanced
npm install react-helmet-async
```

## Best Practices

### 1. Performance
- Lazy loading cho images
- Pagination thay vì infinite scroll
- Skeleton loading states
- Memoization cho expensive operations

### 2. SEO
- Semantic HTML structure
- Meta tags đầy đủ
- Alt text cho images
- Structured data

### 3. Accessibility
- Keyboard navigation
- Screen reader support
- Color contrast
- Focus management

### 4. Mobile First
- Responsive design
- Touch-friendly interactions
- Optimized images
- Fast loading

## Troubleshooting

### Common Issues

1. **API không hoạt động**
   - Kiểm tra `VITE_APP_API_URL` trong `.env`
   - Verify backend server đang chạy
   - Check network tab trong DevTools

2. **Images không hiển thị**
   - Kiểm tra upload API endpoint
   - Verify image URLs
   - Check CORS settings

3. **Routing không hoạt động**
   - Verify routes được import đúng
   - Check React Router configuration
   - Ensure nested routes setup

4. **Styling bị lỗi**
   - Check Tailwind CSS build
   - Verify ShadCN components import
   - Check CSS conflicts

### Debug Tips
- Sử dụng React DevTools
- Check console errors
- Verify API responses
- Test responsive design

## Roadmap

### Planned Features
- [ ] Rich text editor integration (Quill/TinyMCE)
- [ ] Comment system
- [ ] Like/bookmark functionality
- [ ] Blog analytics dashboard
- [ ] Email subscription
- [ ] Social media auto-posting
- [ ] Multi-language support
- [ ] Advanced search with filters
- [ ] Blog series/collections
- [ ] Author profiles

### Performance Improvements
- [ ] Image optimization
- [ ] Lazy loading
- [ ] Caching strategies
- [ ] Bundle optimization
- [ ] PWA support

Hệ thống Blog UI đã sẵn sàng sử dụng với đầy đủ tính năng cần thiết cho một blog hiện đại!
