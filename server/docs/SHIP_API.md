# Ship Management API Documentation

## Tổng quan

API quản lý phí ship cho phép admin cấu hình và quản lý các thiết lập phí vận chuyển. Hệ thống hỗ trợ:

- Cấu hình ngưỡng miễn phí ship
- Thiết lập mức phí ship cố định
- Tính toán phí ship tự động dựa trên giá trị đơn hàng
- Chỉ admin mới có quyền thao tác (tạo, sửa, xóa)

## Base URL

```
http://localhost:3000/api/v1/ship
```

## Authentication

Tất cả các endpoint (trừ public endpoints) yêu cầu:
1. **Authentication**: JWT token trong cookie `accessToken`
2. **Authorization**: User phải có role `admin`

## Endpoints

### 1. Public Endpoints

#### GET /active
Lấy cấu hình ship đang active (không cần authentication)

**Response:**
```json
{
  "success": true,
  "message": "Active ship configuration retrieved successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "freeShippingThreshold": 500000,
    "shippingFee": 30000,
    "isActive": true,
    "description": "Cấu hình ship mặc định",
    "createdBy": {
      "usr_name": "Admin",
      "usr_email": "admin@example.com"
    },
    "createdAt": "2023-09-15T10:00:00.000Z",
    "updatedAt": "2023-09-15T10:00:00.000Z"
  }
}
```

#### POST /calculate-fee
Tính phí ship cho đơn hàng (không cần authentication)

**Request Body:**
```json
{
  "orderValue": 300000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Shipping fee calculated successfully",
  "data": {
    "orderValue": 300000,
    "shippingFee": 30000,
    "freeShippingThreshold": 500000,
    "isFreeShipping": false,
    "totalAmount": 330000
  }
}
```

### 2. Admin Endpoints

#### GET /
Lấy danh sách tất cả cấu hình ship (có phân trang)

**Query Parameters:**
- `page` (number, optional): Trang hiện tại (default: 1)
- `limit` (number, optional): Số items per page (default: 10, max: 100)
- `isActive` (string, optional): Filter theo trạng thái ('true' hoặc 'false')
- `search` (string, optional): Tìm kiếm trong description
- `sort_by` (string, optional): Sắp xếp theo field (default: 'createdAt')
- `sort_order` (string, optional): Thứ tự sắp xếp ('asc' hoặc 'desc', default: 'desc')

**Response:**
```json
{
  "success": true,
  "message": "Ship configurations retrieved successfully",
  "data": [...],
  "pagination": {
    "current_page": 1,
    "total_pages": 2,
    "total_items": 15,
    "items_per_page": 10
  }
}
```

#### POST /
Tạo cấu hình ship mới

**Request Body:**
```json
{
  "freeShippingThreshold": 500000,
  "shippingFee": 30000,
  "isActive": true,
  "description": "Cấu hình ship cho khuyến mãi"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Ship configuration created successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "freeShippingThreshold": 500000,
    "shippingFee": 30000,
    "isActive": true,
    "description": "Cấu hình ship cho khuyến mãi",
    "createdBy": "64f8a1b2c3d4e5f6a7b8c9d1",
    "createdAt": "2023-09-15T10:00:00.000Z",
    "updatedAt": "2023-09-15T10:00:00.000Z"
  }
}
```

#### GET /:id
Lấy chi tiết cấu hình ship theo ID

**Response:**
```json
{
  "success": true,
  "message": "Ship configuration retrieved successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "freeShippingThreshold": 500000,
    "shippingFee": 30000,
    "isActive": true,
    "description": "Cấu hình ship cho khuyến mãi",
    "createdBy": {
      "usr_name": "Admin",
      "usr_email": "admin@example.com"
    },
    "updatedBy": null,
    "createdAt": "2023-09-15T10:00:00.000Z",
    "updatedAt": "2023-09-15T10:00:00.000Z"
  }
}
```

#### PUT /:id
Cập nhật cấu hình ship

**Request Body:**
```json
{
  "freeShippingThreshold": 600000,
  "shippingFee": 25000,
  "isActive": false,
  "description": "Cấu hình ship đã cập nhật"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Ship configuration updated successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "freeShippingThreshold": 600000,
    "shippingFee": 25000,
    "isActive": false,
    "description": "Cấu hình ship đã cập nhật",
    "updatedBy": "64f8a1b2c3d4e5f6a7b8c9d1",
    "createdAt": "2023-09-15T10:00:00.000Z",
    "updatedAt": "2023-09-15T11:00:00.000Z"
  }
}
```

#### DELETE /:id
Xóa cấu hình ship

**Response:**
```json
{
  "success": true,
  "message": "Ship configuration deleted successfully"
}
```

#### PATCH /:id/toggle-status
Bật/tắt trạng thái cấu hình ship

**Request Body:**
```json
{
  "isActive": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Ship configuration activated successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "isActive": true,
    "updatedBy": "64f8a1b2c3d4e5f6a7b8c9d1",
    "updatedAt": "2023-09-15T11:00:00.000Z"
  }
}
```

## Business Logic

### Tính phí ship

1. **Đơn hàng có giá trị >= ngưỡng miễn phí**: Phí ship = 0 VNĐ
2. **Đơn hàng có giá trị < ngưỡng miễn phí**: Phí ship = mức phí cấu hình

### Quy tắc cấu hình

1. **Chỉ có 1 cấu hình active**: Khi set một cấu hình thành active, tất cả cấu hình khác sẽ tự động thành inactive
2. **Không thể xóa cấu hình duy nhất**: Nếu chỉ có 1 cấu hình active, không thể xóa
3. **Validation**: 
   - `freeShippingThreshold` >= 0
   - `shippingFee` >= 0
   - `description` <= 500 ký tự

## Error Codes

- `400`: Bad Request - Dữ liệu không hợp lệ
- `401`: Unauthorized - Chưa đăng nhập
- `403`: Forbidden - Không có quyền admin
- `404`: Not Found - Không tìm thấy cấu hình
- `409`: Conflict - Xung đột dữ liệu
- `500`: Internal Server Error - Lỗi server

## Examples

### Tạo cấu hình ship mới
```bash
curl -X POST http://localhost:3000/api/v1/ship \
  -H "Content-Type: application/json" \
  -H "Cookie: accessToken=your_jwt_token" \
  -d '{
    "freeShippingThreshold": 500000,
    "shippingFee": 30000,
    "isActive": true,
    "description": "Cấu hình ship tiêu chuẩn"
  }'
```

### Tính phí ship
```bash
curl -X POST http://localhost:3000/api/v1/ship/calculate-fee \
  -H "Content-Type: application/json" \
  -d '{
    "orderValue": 300000
  }'
```
