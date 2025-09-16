# Blog Debug Guide - Hướng dẫn debug BlogList component

## Vấn đề hiện tại
1. **Danh sách blog không hiển thị** - BlogList không load được blogs từ database
2. **Dropdown category trống** - Categories không hiển thị trong filter dropdown

## Debug Steps đã thực hiện

### 1. Thêm Debug Logging
- ✅ **API calls logging** trong `blog.apis.ts`
- ✅ **Component state logging** trong `BlogList.tsx`
- ✅ **Error handling** cải thiện với try-catch blocks
- ✅ **Debug info panel** hiển thị trên UI

### 2. Enhanced Error Handling
- ✅ **Error state** để track lỗi API
- ✅ **Loading states** riêng cho blogs và categories
- ✅ **Null checks** cho API responses
- ✅ **Error display** trong UI với nút "Thử lại"

### 3. Debug Information Panel
Thêm debug panel hiển thị:
- Loading states (blogs và categories)
- Số lượng blogs và categories loaded
- Selected category hiện tại
- Search query hiện tại
- Error messages (nếu có)

## Cách kiểm tra Debug

### 1. Mở Browser Console
```
F12 → Console tab
```

### 2. Kiểm tra Debug Logs
Khi load trang `/blog`, bạn sẽ thấy:

```javascript
// Categories API
"Fetching categories..."
"API URL: /categories?status=active"
"API Response: {data: [...], success: true}"
"Categories response: {data: [...], success: true}"
"Categories set: [...]"

// Blogs API  
"Fetching blogs with filters: {page: 1, limit: 12, sortBy: 'createdAt', sortOrder: 'desc'}"
"Search query: "
"Selected category: all"
"Using getPublishedBlogs API"
"API URL: /blogs?page=1&limit=12&status=published&sortBy=createdAt&sortOrder=desc"
"API Response: {data: [...], success: true}"
"Blogs response: {data: [...], success: true}"
"Blogs set: [...]"
"Pagination set: {...}"
```

### 3. Kiểm tra Network Tab
```
F12 → Network tab → Reload page
```

Tìm các requests:
- `GET /api/v1/categories?status=active`
- `GET /api/v1/blogs?page=1&limit=12&status=published&sortBy=createdAt&sortOrder=desc`

### 4. Kiểm tra Debug Panel trên UI
Trên trang blog sẽ có panel debug hiển thị:
- Loading: true/false
- Categories Loading: true/false
- Blogs Count: số
- Categories Count: số
- Selected Category: all/category_id
- Search Query: None/query
- Error: None/error_message

## Possible Issues & Solutions

### 1. API Server không chạy
**Triệu chứng:**
- Console error: `ERR_CONNECTION_REFUSED`
- Network tab: Failed requests

**Giải pháp:**
```bash
cd server
npm start
# hoặc
yarn start
```

### 2. Wrong API URL
**Triệu chứng:**
- Console error: `404 Not Found`
- API URL sai trong logs

**Kiểm tra:**
- File `.env`: `VITE_APP_API_URL=http://localhost:8081/api/v1`
- Server đang chạy trên port 8081

### 3. Database không có data
**Triệu chứng:**
- API success nhưng `data: []`
- Blogs Count: 0, Categories Count: 0

**Giải pháp:**
- Kiểm tra database có blogs với `status: 'published'`
- Kiểm tra database có categories với `status: 'active'`

### 4. CORS Issues
**Triệu chứng:**
- Console error: `CORS policy`
- Network tab: CORS error

**Giải pháp:**
- Kiểm tra server CORS configuration
- Đảm bảo `withCredentials: true` trong axios config

### 5. Authentication Issues
**Triệu chứng:**
- Console error: `401 Unauthorized`
- API returns authentication error

**Giải pháp:**
- Blog API có thể cần authentication
- Kiểm tra server middleware cho public routes

## Debug Commands

### 1. Test API directly
```javascript
// Trong browser console
fetch('http://localhost:8081/api/v1/blogs?status=published')
  .then(res => res.json())
  .then(data => console.log(data));

fetch('http://localhost:8081/api/v1/categories?status=active')
  .then(res => res.json())
  .then(data => console.log(data));
```

### 2. Check component state
```javascript
// Trong React DevTools
// Tìm BlogList component và xem state:
// - blogs: []
// - categories: []
// - loading: boolean
// - error: string | null
```

## Next Steps

### 1. Nếu API calls thành công nhưng UI không hiển thị
- Kiểm tra component render logic
- Kiểm tra CSS/styling issues
- Kiểm tra conditional rendering

### 2. Nếu API calls thất bại
- Kiểm tra server logs
- Kiểm tra database connection
- Kiểm tra API endpoints

### 3. Nếu categories load nhưng blogs không load
- Kiểm tra blog API endpoint cụ thể
- Kiểm tra blog data structure
- Kiểm tra blog status filtering

## Remove Debug Code
Sau khi fix xong, nhớ remove debug code:

```typescript
// Remove từ BlogList.tsx
console.log('Fetching categories...');
console.log('Categories response:', response);
// ... other console.logs

// Remove debug panel từ UI
{/* Debug Info - Remove in production */}
```

```typescript
// Remove từ blog.apis.ts
console.log('API URL:', url);
console.log('API Response:', response);
```

## Expected Results
Sau khi fix:
- ✅ Categories dropdown hiển thị danh sách categories
- ✅ Blog grid hiển thị danh sách blogs
- ✅ Pagination hoạt động
- ✅ Search và filter hoạt động
- ✅ Loading states hiển thị đúng
- ✅ Error handling hoạt động

Debug panel sẽ hiển thị:
- Loading: false
- Categories Loading: false  
- Blogs Count: > 0
- Categories Count: > 0
- Error: None
