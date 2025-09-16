# Select Item Fix - Sửa lỗi value="" trong SelectItem

## Vấn đề
React Select component báo lỗi:
```
Uncaught Error: A <Select.Item /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.
```

## Nguyên nhân
Các `<SelectItem>` có `value=""` (empty string) trong các component blog UI, đặc biệt trong các dropdown filter "Tất cả" hoặc "Không có".

## Giải pháp đã thực hiện

### 1. BlogList.tsx
**Thay đổi:**
- `<SelectItem value="">Tất cả danh mục</SelectItem>` → `<SelectItem value="all">Tất cả danh mục</SelectItem>`

**Logic cập nhật:**
```typescript
// Trước
const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    updateSearchParams({ category, page: '1' });
};

// Sau
const handleCategoryChange = (category: string) => {
    const categoryValue = category === 'all' ? '' : category;
    setSelectedCategory(category);
    updateSearchParams({ category: categoryValue, page: '1' });
};
```

**Giá trị khởi tạo:**
- `useState(searchParams.get('category') || '')` → `useState(searchParams.get('category') || 'all')`
- `clearFilters()` set `selectedCategory` về `'all'`

### 2. BlogDashboard.tsx
**Thay đổi:**
- `<SelectItem value="">Tất cả trạng thái</SelectItem>` → `<SelectItem value="all">Tất cả trạng thái</SelectItem>`
- `<SelectItem value="">Tất cả danh mục</SelectItem>` → `<SelectItem value="all">Tất cả danh mục</SelectItem>`

**Logic cập nhật:**
```typescript
// Status Filter
const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    setFilters(prev => ({ 
        ...prev, 
        status: status === 'all' ? undefined : status as any, 
        page: 1 
    }));
};

// Category Filter
const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    setFilters(prev => ({ 
        ...prev, 
        category: category === 'all' ? undefined : category, 
        page: 1 
    }));
};
```

**Giá trị khởi tạo:**
- `useState<string>('')` → `useState<string>('all')` cho cả status và category
- `clearFilters()` set về `'all'`

### 3. BlogForm.tsx
**Thay đổi:**
- `<SelectItem value="">Không có danh mục</SelectItem>` → `<SelectItem value="none">Không có danh mục</SelectItem>`

**Logic cập nhật:**
```typescript
// Submit handler
const onSubmit = async (data: BlogFormData) => {
    const blogData = {
        ...data,
        blog_category: data.blog_category === 'none' ? undefined : data.blog_category,
        // ... other fields
    };
};

// Load blog data for edit
reset({
    // ... other fields
    blog_category: blog.blog_category?._id || 'none',
});
```

**Select value:**
- `value={watchedValues.blog_category || ''}` → `value={watchedValues.blog_category || 'none'}`

## Kết quả

### ✅ Đã sửa
- Tất cả `<SelectItem value="">` đã được thay thế bằng giá trị có ý nghĩa
- Logic xử lý đã được cập nhật để convert giá trị mới về empty string khi cần
- Giá trị khởi tạo và clearFilters đã được cập nhật
- Placeholder vẫn hoạt động bình thường

### 🎯 Mapping giá trị
| Component | Trước | Sau | Ý nghĩa |
|-----------|-------|-----|---------|
| BlogList | `value=""` | `value="all"` | Tất cả danh mục |
| BlogDashboard | `value=""` | `value="all"` | Tất cả trạng thái/danh mục |
| BlogForm | `value=""` | `value="none"` | Không có danh mục |

### 🔄 Logic xử lý
- **"all"** → convert thành `undefined` hoặc `""` khi gọi API (để lấy tất cả)
- **"none"** → convert thành `undefined` khi submit (để không set category)
- **Giá trị khác** → giữ nguyên

### 📋 Test Cases
1. ✅ Dropdown hiển thị đúng option mặc định
2. ✅ Filter "Tất cả" hoạt động đúng (lấy tất cả records)
3. ✅ Filter theo category/status cụ thể hoạt động đúng
4. ✅ Clear filters reset về trạng thái ban đầu
5. ✅ Form create/edit blog xử lý category đúng
6. ✅ Không còn lỗi React Select

## Lưu ý
- Thay đổi này không ảnh hưởng đến API backend
- Frontend tự động convert giá trị trước khi gửi request
- User experience không thay đổi
- Tất cả chức năng filtering vẫn hoạt động như cũ

Lỗi `SelectItem value=""` đã được sửa hoàn toàn! 🎉
