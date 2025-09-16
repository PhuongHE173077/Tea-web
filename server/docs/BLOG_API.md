# Blog API Documentation

## Tổng quan
API Blog cung cấp đầy đủ các chức năng CRUD (Create, Read, Update, Delete) để quản lý bài viết blog với các tính năng nâng cao như phân trang, tìm kiếm, lọc và SEO.

## Base URL
```
/api/v1/blogs
```

## Authentication
- **Public routes**: GET requests (xem blog)
- **Protected routes**: POST, PUT, DELETE (cần JWT token)
- **Admin only**: DELETE (cần quyền admin)

## Endpoints

### 1. GET /api/v1/blogs
**Mô tả**: Lấy danh sách tất cả blog với hỗ trợ phân trang và lọc

**Access**: Public

**Query Parameters**:
- `page` (number, optional): Số trang (mặc định: 1)
- `limit` (number, optional): Số item mỗi trang (mặc định: 10, tối đa: 100)
- `status` (string, optional): Lọc theo trạng thái (`draft`, `published`, `archived`)
- `category` (string, optional): Lọc theo category ID
- `author` (string, optional): Lọc theo author ID
- `featured` (string, optional): Lọc theo featured (`true`, `false`)
- `search` (string, optional): Tìm kiếm trong title, content, excerpt
- `sortBy` (string, optional): Sắp xếp theo field (`createdAt`, `updatedAt`, `blog_title`, `blog_views`, `blog_likes`)
- `sortOrder` (string, optional): Thứ tự sắp xếp (`asc`, `desc`)

**Response**:
```json
{
  "success": true,
  "message": "Blogs retrieved successfully",
  "data": [
    {
      "_id": "blog_id",
      "blog_title": "Tiêu đề blog",
      "blog_slug": "tieu-de-blog",
      "blog_excerpt": "Tóm tắt ngắn gọn...",
      "blog_thumbnail": {
        "url": "https://example.com/image.jpg",
        "alt": "Alt text"
      },
      "blog_author": {
        "_id": "author_id",
        "usr_name": "Tên tác giả",
        "usr_avatar": "avatar_url"
      },
      "blog_category": {
        "_id": "category_id",
        "category_name": "Tên danh mục"
      },
      "blog_status": "published",
      "blog_views": 100,
      "blog_likes": 25,
      "blog_reading_time": 5,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### 2. GET /api/v1/blogs/:id
**Mô tả**: Lấy chi tiết một blog theo ID

**Access**: Public

**Parameters**:
- `id` (string, required): Blog ID

**Response**:
```json
{
  "success": true,
  "message": "Blog retrieved successfully",
  "data": {
    "_id": "blog_id",
    "blog_title": "Tiêu đề blog",
    "blog_content": "Nội dung đầy đủ của blog...",
    "blog_excerpt": "Tóm tắt ngắn gọn...",
    "blog_tags": ["tag1", "tag2"],
    "blog_meta": {
      "title": "SEO title",
      "description": "SEO description",
      "keywords": ["keyword1", "keyword2"]
    },
    // ... các field khác
  }
}
```

### 3. GET /api/v1/blogs/slug/:slug
**Mô tả**: Lấy blog theo slug (SEO friendly URL)

**Access**: Public

**Parameters**:
- `slug` (string, required): Blog slug

### 4. POST /api/v1/blogs
**Mô tả**: Tạo blog mới

**Access**: Private (cần authentication)

**Request Body**:
```json
{
  "blog_title": "Tiêu đề blog", // required, 5-200 chars
  "blog_content": "Nội dung blog...", // required, min 50 chars
  "blog_excerpt": "Tóm tắt...", // required, 10-500 chars
  "blog_thumbnail": {
    "url": "https://example.com/image.jpg",
    "alt": "Alt text"
  },
  "blog_category": "category_id", // optional
  "blog_tags": ["tag1", "tag2"], // optional
  "blog_status": "draft", // optional: draft, published, archived
  "blog_meta": {
    "title": "SEO title", // max 60 chars
    "description": "SEO description", // max 160 chars
    "keywords": ["keyword1", "keyword2"]
  },
  "blog_featured": false // optional
}
```

### 5. PUT /api/v1/blogs/:id
**Mô tả**: Cập nhật blog theo ID

**Access**: Private (cần authentication)

**Parameters**:
- `id` (string, required): Blog ID

**Request Body**: Giống POST nhưng tất cả field đều optional

### 6. DELETE /api/v1/blogs/:id
**Mô tả**: Xóa blog theo ID

**Access**: Private (Admin only)

**Parameters**:
- `id` (string, required): Blog ID

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Access token required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Blog not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Tính năng đặc biệt

### 1. Auto Slug Generation
- Tự động tạo slug từ title
- Đảm bảo slug unique
- SEO friendly

### 2. Reading Time Calculation
- Tự động tính thời gian đọc (200 từ/phút)
- Cập nhật khi content thay đổi

### 3. View Counter
- Tự động tăng view count khi xem blog
- Không tăng view cho tác giả

### 4. Full-text Search
- Tìm kiếm trong title, content, excerpt
- Sử dụng MongoDB text index

### 5. Advanced Filtering
- Lọc theo status, category, author, featured
- Hỗ trợ multiple filters

### 6. SEO Optimization
- Meta title, description, keywords
- Slug-based URLs
- Structured data ready

## Usage Examples

### Lấy blog published với phân trang
```
GET /api/v1/blogs?status=published&page=1&limit=10&sortBy=createdAt&sortOrder=desc
```

### Tìm kiếm blog
```
GET /api/v1/blogs?search=react&status=published
```

### Lấy blog featured
```
GET /api/v1/blogs?featured=true&status=published
```

### Tạo blog mới
```
POST /api/v1/blogs
Authorization: Bearer <token>
Content-Type: application/json

{
  "blog_title": "Hướng dẫn React Hooks",
  "blog_content": "React Hooks là một tính năng mới...",
  "blog_excerpt": "Tìm hiểu về React Hooks và cách sử dụng",
  "blog_status": "published",
  "blog_tags": ["react", "hooks", "javascript"]
}
```
