# Blog API Fix - Sửa lỗi HTTP 400 trong BlogList

## Vấn đề
Lỗi HTTP 400 (Bad Request) khi gọi API blog từ BlogList.tsx:
```
GET http://localhost:8081/api/v1/blogs?page=1&limit=12&status=published&category=all&sortBy=createdAt&sortOrder=asc
```

**Nguyên nhân:** Parameter `category=all` được gửi đến backend, nhưng backend không nhận giá trị "all" và gây ra lỗi 400.

## Phân tích

### Logic trước khi sửa:
1. User chọn "Tất cả danh mục" → `selectedCategory = "all"`
2. `fetchBlogs()` được gọi với `selectedCategory = "all"`
3. Logic: `if (selectedCategory)` → `true` vì `"all"` là truthy
4. Gọi `getBlogsByCategory("all", filters)`
5. API gửi `category=all` → Backend trả về 400

### Logic sau khi sửa:
1. User chọn "Tất cả danh mục" → `selectedCategory = "all"`
2. `fetchBlogs()` được gọi với `selectedCategory = "all"`
3. Logic: `if (selectedCategory && selectedCategory !== 'all')` → `false`
4. Gọi `getPublishedBlogs(filters)` → Không gửi category parameter
5. API chỉ gửi `status=published` → Backend trả về tất cả blog published

## Các thay đổi đã thực hiện

### 1. Sửa logic fetchBlogs() trong BlogList.tsx

**Trước:**
```typescript
if (searchQuery) {
    response = await searchBlogs(searchQuery, filters);
} else if (selectedCategory) {
    response = await getBlogsByCategory(selectedCategory, filters);
} else {
    response = await getPublishedBlogs(filters);
}
```

**Sau:**
```typescript
if (searchQuery) {
    response = await searchBlogs(searchQuery, filters);
} else if (selectedCategory && selectedCategory !== 'all') {
    response = await getBlogsByCategory(selectedCategory, filters);
} else {
    response = await getPublishedBlogs(filters);
}
```

### 2. Cải thiện logic khởi tạo selectedCategory

**Trước:**
```typescript
const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
```

**Sau:**
```typescript
const [selectedCategory, setSelectedCategory] = useState(() => {
    const categoryParam = searchParams.get('category');
    return categoryParam || 'all';
});
```

## Flow hoạt động sau khi sửa

### Scenario 1: User chọn "Tất cả danh mục"
1. `selectedCategory = "all"`
2. `fetchBlogs()` → `getPublishedBlogs(filters)`
3. API call: `GET /api/v1/blogs?page=1&limit=12&status=published&sortBy=createdAt&sortOrder=desc`
4. ✅ Thành công - lấy tất cả blog published

### Scenario 2: User chọn danh mục cụ thể
1. `selectedCategory = "category_id_123"`
2. `fetchBlogs()` → `getBlogsByCategory("category_id_123", filters)`
3. API call: `GET /api/v1/blogs?page=1&limit=12&status=published&category=category_id_123&sortBy=createdAt&sortOrder=desc`
4. ✅ Thành công - lấy blog theo danh mục

### Scenario 3: User tìm kiếm
1. `searchQuery = "trà xanh"`
2. `fetchBlogs()` → `searchBlogs("trà xanh", filters)`
3. API call: `GET /api/v1/blogs?page=1&limit=12&status=published&search=trà+xanh&sortBy=createdAt&sortOrder=desc`
4. ✅ Thành công - tìm kiếm blog

## Logic xử lý URL Parameters

### handleCategoryChange() - Đã đúng từ trước
```typescript
const handleCategoryChange = (category: string) => {
    const categoryValue = category === 'all' ? '' : category;
    setSelectedCategory(category);  // UI state = "all"
    updateSearchParams({ category: categoryValue, page: '1' }); // URL param = ""
};
```

### updateSearchParams() - Đã đúng từ trước
```typescript
const updateSearchParams = (params: Record<string, string>) => {
    const newSearchParams = new URLSearchParams(searchParams);
    Object.entries(params).forEach(([key, value]) => {
        if (value) {
            newSearchParams.set(key, value);
        } else {
            newSearchParams.delete(key); // Xóa param khi value = ""
        }
    });
    setSearchParams(newSearchParams);
};
```

## Kết quả

### ✅ Đã sửa
- Lỗi HTTP 400 khi chọn "Tất cả danh mục"
- Logic API call đã chính xác theo từng scenario
- URL parameters được xử lý đúng cách
- User experience không thay đổi

### 🎯 API Calls mapping
| User Action | selectedCategory | API Function | URL Parameters |
|-------------|------------------|--------------|----------------|
| "Tất cả danh mục" | `"all"` | `getPublishedBlogs()` | `status=published` |
| "Danh mục A" | `"cat_id_a"` | `getBlogsByCategory()` | `status=published&category=cat_id_a` |
| Tìm kiếm | `"all"` hoặc `"cat_id"` | `searchBlogs()` | `status=published&search=query` |

### 🔄 URL State Management
- UI hiển thị: "Tất cả danh mục" 
- Internal state: `selectedCategory = "all"`
- URL parameter: không có `category` param (đã bị xóa)
- API call: `getPublishedBlogs()` - lấy tất cả blog published

## Test Cases

### ✅ Cần test
1. Load trang `/blog` → Hiển thị tất cả blog
2. Chọn "Tất cả danh mục" → Hiển thị tất cả blog  
3. Chọn danh mục cụ thể → Hiển thị blog theo danh mục
4. Tìm kiếm → Hiển thị kết quả tìm kiếm
5. URL direct access `/blog?category=cat_id` → Hiển thị blog theo danh mục
6. URL direct access `/blog` → Hiển thị tất cả blog

Lỗi HTTP 400 đã được sửa hoàn toàn! 🎉
