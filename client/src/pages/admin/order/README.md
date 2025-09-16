# Order Management - Quản lý Đơn hàng

## Tổng quan

Trang quản lý đơn hàng cho admin trong ứng dụng Tea-web, cho phép xem, quản lý và cập nhật trạng thái các đơn hàng.

## Cấu trúc Files

```
client/src/pages/admin/order/
├── index.tsx           # Component chính OrderManagement
├── types/
│   └── index.ts       # Types và interfaces cho Order
└── README.md          # Tài liệu hướng dẫn
```

## Tính năng chính

### 1. Hiển thị danh sách đơn hàng
- **Desktop**: Hiển thị dưới dạng bảng với đầy đủ thông tin
- **Mobile**: Hiển thị dưới dạng card responsive
- Thông tin hiển thị:
  - Mã đơn hàng và tracking number
  - Thông tin khách hàng (tên, SĐT, email)
  - Danh sách sản phẩm
  - Tổng tiền đơn hàng
  - Phương thức thanh toán
  - Trạng thái đơn hàng
  - Ngày đặt hàng

### 2. Quản lý trạng thái đơn hàng
- Dropdown select để cập nhật trạng thái
- Các trạng thái có sẵn:
  - **Chờ xác nhận** (pending)
  - **Đã xác nhận** (confirmed)
  - **Đang giao hàng** (shipping)
  - **Đã giao** (delivered)
  - **Đã hủy** (cancelled)
- Cập nhật real-time với API
- Hiển thị màu sắc khác nhau cho từng trạng thái

### 3. Modal chi tiết đơn hàng
- Hiển thị đầy đủ thông tin đơn hàng
- **Thông tin khách hàng**: Tên, SĐT, email, ghi chú
- **Địa chỉ giao hàng**: Địa chỉ đầy đủ với tỉnh/thành, quận/huyện, phường/xã
- **Thông tin thanh toán**: Phương thức và trạng thái thanh toán
- **Chi tiết sản phẩm**: Hình ảnh, tên, thuộc tính, giá, số lượng
- **Tổng kết đơn hàng**: Tạm tính, phí ship, giảm giá, tổng cộng
- **Cập nhật trạng thái**: Có thể thay đổi trạng thái trực tiếp trong modal

### 4. Filtering và Pagination
- **Lọc theo trạng thái**: Dropdown để lọc đơn hàng theo trạng thái
- **Phân trang**: Hỗ trợ phân trang với các tùy chọn số lượng hiển thị (5, 10, 20, 50)
- **URL parameters**: Lưu trạng thái filter và pagination trong URL

### 5. Responsive Design
- **Desktop**: Bảng đầy đủ thông tin với tooltip
- **Mobile**: Card layout tối ưu cho màn hình nhỏ
- **Loading states**: Skeleton loading cho trải nghiệm tốt hơn

## API Integration

### Endpoints sử dụng:
- `getAllOrdersAPIs(filters)`: Lấy danh sách đơn hàng với filter
- `updateOrderStatusAPIs(orderId, status, note)`: Cập nhật trạng thái đơn hàng

### Filters hỗ trợ:
```typescript
interface OrderFilters {
    page?: number
    limit?: number
    status?: string
    search?: string
    start_date?: string
    end_date?: string
    sort_by?: string
    sort_order?: 'asc' | 'desc'
}
```

## Types và Interfaces

### Order Interface:
```typescript
interface Order {
    _id: string
    order_id: string
    order_trackingNumber: string
    order_status: 'pending' | 'confirmed' | 'shipping' | 'delivered' | 'cancelled'
    order_items: OrderItem[]
    customer_info: OrderCustomer
    order_shipping: OrderShipping
    order_payment: OrderPayment
    order_checkout: OrderCheckout
    discount_code?: string
    order_notes?: string
    createdAt: string
    updatedAt: string
}
```

## Routing

Route được thêm vào `client/src/routers/admin.router.tsx`:
```typescript
{
    path: "/orders",
    element: <OrderManagement />
}
```

Truy cập tại: `/orders` trong admin panel

## Styling và UI

- Sử dụng **Tailwind CSS** cho styling
- **Framer Motion** cho animations
- **Lucide React** cho icons
- **ShadCN UI** components:
  - Table, Card, Dialog, Badge
  - Select, Button, Pagination
  - Tooltip cho UX tốt hơn

## Error Handling

- **SweetAlert2** cho thông báo lỗi và thành công
- **Try-catch** blocks cho tất cả API calls
- **Loading states** và **error states** được xử lý đầy đủ

## Performance

- **Lazy loading** với pagination
- **Optimistic updates** cho trạng thái đơn hàng
- **Memoization** cho các component con (có thể thêm nếu cần)

## Cách sử dụng

1. **Truy cập trang**: Vào admin panel và click vào "Đơn hàng" trong sidebar
2. **Xem danh sách**: Danh sách đơn hàng sẽ hiển thị với pagination
3. **Lọc đơn hàng**: Sử dụng dropdown "Lọc theo trạng thái"
4. **Xem chi tiết**: Click nút "Xem chi tiết" (icon mắt)
5. **Cập nhật trạng thái**: 
   - Trong bảng: Click vào dropdown trạng thái
   - Trong modal: Sử dụng select ở cuối modal
6. **Phân trang**: Sử dụng các nút phân trang ở cuối trang

## Tương lai có thể mở rộng

- **Tìm kiếm**: Thêm ô tìm kiếm theo tên khách hàng, mã đơn hàng
- **Export**: Xuất danh sách đơn hàng ra Excel/PDF
- **Bulk actions**: Cập nhật trạng thái nhiều đơn hàng cùng lúc
- **Order timeline**: Hiển thị lịch sử thay đổi trạng thái
- **Print**: In hóa đơn/phiếu giao hàng
- **Statistics**: Thống kê đơn hàng theo thời gian, trạng thái
