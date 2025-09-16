# Admin Dashboard

Trang dashboard admin cung cấp tổng quan về hoạt động kinh doanh với các biểu đồ thống kê và dữ liệu quan trọng.

## Tính năng chính

### 1. Overview Cards (Thẻ tổng quan)
- **Tổng doanh thu**: Hiển thị tổng doanh thu và tỷ lệ tăng trưởng so với tháng trước
- **Tổng đơn hàng**: Số lượng đơn hàng và tỷ lệ tăng trưởng
- **Tổng người dùng**: Số lượng người dùng đăng ký và tỷ lệ tăng trưởng
- **Tổng sản phẩm**: Số lượng sản phẩm trong hệ thống và tỷ lệ tăng trưởng

### 2. Biểu đồ thống kê
- **Biểu đồ doanh thu**: Area chart hiển thị doanh thu và số đơn hàng theo tháng
- **Biểu đồ phân tích sản phẩm**: Pie chart hiển thị tỷ lệ bán hàng theo danh mục sản phẩm
- **Biểu đồ tăng trưởng người dùng**: Line chart hiển thị tổng người dùng và người dùng mới theo tháng

### 3. Dữ liệu chi tiết
- **Đơn hàng gần đây**: Danh sách 5 đơn hàng mới nhất
- **Bảng dữ liệu**: Tabs hiển thị chi tiết đơn hàng, khách hàng, sản phẩm

## Cấu trúc file

```
client/src/pages/admin/dashboard/
├── index.tsx           # Component chính của dashboard
├── README.md          # Tài liệu hướng dẫn
```

## Dependencies sử dụng

- **Recharts**: Thư viện biểu đồ cho React
- **ShadCN UI**: Components UI (Card, Table, Chart, Button, etc.)
- **Lucide React**: Icons
- **Tailwind CSS**: Styling
- **Custom hooks**: useDashboard để quản lý state và API calls

## API Endpoints

**⚠️ Hiện tại dashboard đang sử dụng MOCK DATA**

Khi backend sẵn sàng, dashboard sẽ sử dụng các API endpoints sau:

- `GET /api/v1/dashboard/stats` - Lấy thống kê tổng quan
- `GET /api/v1/dashboard/revenue-chart` - Dữ liệu biểu đồ doanh thu
- `GET /api/v1/dashboard/user-growth-chart` - Dữ liệu biểu đồ tăng trưởng người dùng
- `GET /api/v1/dashboard/product-category-chart` - Dữ liệu biểu đồ phân tích sản phẩm
- `GET /api/v1/dashboard/recent-orders` - Danh sách đơn hàng gần đây

### Cách chuyển từ Mock Data sang API thực:

1. **Tạo backend API endpoints** theo các route trên
2. **Uncomment các API calls** trong `client/src/hooks/useDashboard.ts`:
   ```typescript
   // Tìm và uncomment các dòng này:
   // const response = await dashboardAPIs.getDashboardStats(filters)
   // setStats(response.data)
   ```
3. **Comment lại mock data assignments**:
   ```typescript
   // Comment lại các dòng này:
   // setStats(mockStats)
   ```
4. **Enable auto-refresh** bằng cách uncomment useEffect hooks
5. **Remove demo alert** trong dashboard component

## Responsive Design

Dashboard được thiết kế responsive cho:
- **Mobile**: Grid 1 cột, charts thu gọn
- **Tablet**: Grid 2 cột
- **Desktop**: Grid 4 cột cho overview cards, layout tối ưu cho charts

## Loading States

- **Skeleton loading**: Hiển thị placeholder khi đang tải dữ liệu
- **Error handling**: Hiển thị thông báo lỗi khi API call thất bại
- **Refresh functionality**: Nút làm mới dữ liệu với loading indicator

## Customization

### Thay đổi màu sắc biểu đồ
Chỉnh sửa `chartConfig` trong component:

```typescript
const chartConfig = {
  revenue: {
    label: "Doanh thu",
    color: "#2563eb", // Thay đổi màu ở đây
  },
  // ...
}
```

### Thêm biểu đồ mới
1. Thêm API endpoint mới trong `dashboard.apis.ts`
2. Cập nhật hook `useDashboard.ts`
3. Thêm component biểu đồ trong dashboard

### Thay đổi thời gian lọc
Dashboard hỗ trợ các khoảng thời gian:
- `week`: Tuần
- `month`: Tháng (mặc định)
- `quarter`: Quý
- `year`: Năm

## Authentication & Authorization

Dashboard chỉ có thể truy cập bởi:
- Người dùng đã đăng nhập
- Có quyền admin (được kiểm tra trong router middleware)

## Performance

- **Lazy loading**: Components được load khi cần thiết
- **Memoization**: Sử dụng useCallback và useMemo để tối ưu performance
- **API caching**: Dữ liệu được cache để giảm số lần gọi API

## Troubleshooting

### Dashboard không hiển thị dữ liệu
1. Kiểm tra kết nối API server
2. Kiểm tra authentication token
3. Kiểm tra console để xem lỗi API

### Biểu đồ không render
1. Kiểm tra dữ liệu trả về từ API có đúng format không
2. Kiểm tra Recharts dependencies
3. Kiểm tra responsive container size

### Loading state không hoạt động
1. Kiểm tra hook useDashboard
2. Kiểm tra API response time
3. Kiểm tra error handling

## Future Enhancements

- [ ] Real-time updates với WebSocket
- [ ] Export dữ liệu ra PDF/Excel
- [ ] Thêm filter theo ngày tháng
- [ ] Dashboard customization cho từng admin
- [ ] Thêm more detailed analytics
- [ ] Mobile app support
