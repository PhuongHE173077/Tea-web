# Discount API Documentation

## Tổng quan
API quản lý hệ thống giảm giá (discount) cho ứng dụng Tea_Web. Hỗ trợ tạo, quản lý và áp dụng các mã giảm giá với nhiều loại khác nhau.

## Base URL
```
http://localhost:3000/api/v1/discount
```

## Authentication
Hầu hết các endpoints yêu cầu authentication thông qua JWT token trong cookie `accessToken`.

## Discount Model

### Cấu trúc dữ liệu
```javascript
{
  "_id": "ObjectId",
  "code": "String", // Mã giảm giá (unique, uppercase)
  "name": "String", // Tên chương trình giảm giá
  "description": "String", // Mô tả
  "discount_type": "String", // "percentage" hoặc "fixed_amount"
  "discount_value": "Number", // Giá trị giảm giá
  "min_order_value": "Number", // Giá trị đơn hàng tối thiểu
  "max_discount_amount": "Number", // Số tiền giảm tối đa
  "start_date": "Date", // Ngày bắt đầu
  "end_date": "Date", // Ngày kết thúc
  "usage_limit": "Number", // Số lần sử dụng tối đa
  "used_count": "Number", // Số lần đã sử dụng
  "is_active": "Boolean", // Trạng thái hoạt động
  "users_used": [{ // Danh sách người dùng đã sử dụng
    "user_id": "ObjectId",
    "used_at": "Date",
    "order_id": "ObjectId"
  }],
  "created_by": "ObjectId", // Người tạo
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## API Endpoints

### 1. Lấy danh sách discount đang hoạt động (Public)

**GET** `/active`

**Mô tả:** Lấy danh sách các discount đang hoạt động, không cần authentication.

**Response:**
```json
{
  "success": true,
  "message": "Active discounts retrieved successfully",
  "data": [
    {
      "_id": "64f5a1b2c3d4e5f6a7b8c9d0",
      "code": "SUMMER2024",
      "name": "Giảm giá mùa hè",
      "description": "Giảm 20% cho đơn hàng từ 500k",
      "discount_type": "percentage",
      "discount_value": 20,
      "min_order_value": 500000,
      "max_discount_amount": 100000,
      "start_date": "2024-06-01T00:00:00.000Z",
      "end_date": "2024-08-31T23:59:59.000Z"
    }
  ]
}
```

### 2. Lấy danh sách discount (Protected)

**GET** `/`

**Headers:**
```
Cookie: accessToken=<jwt_token>
```

**Query Parameters:**
- `page` (number, optional): Trang hiện tại (default: 1)
- `limit` (number, optional): Số item per page (default: 10, max: 100)
- `is_active` (string, optional): "true" hoặc "false"
- `discount_type` (string, optional): "percentage" hoặc "fixed_amount"
- `search` (string, optional): Tìm kiếm theo code, name, description
- `sort_by` (string, optional): Sắp xếp theo field (default: "createdAt")
- `sort_order` (string, optional): "asc" hoặc "desc" (default: "desc")

**Example Request:**
```
GET /api/v1/discount?page=1&limit=10&is_active=true&search=SUMMER
```

**Response:**
```json
{
  "success": true,
  "message": "Discounts retrieved successfully",
  "data": [
    {
      "_id": "64f5a1b2c3d4e5f6a7b8c9d0",
      "code": "SUMMER2024",
      "name": "Giảm giá mùa hè",
      "description": "Giảm 20% cho đơn hàng từ 500k",
      "discount_type": "percentage",
      "discount_value": 20,
      "min_order_value": 500000,
      "max_discount_amount": 100000,
      "start_date": "2024-06-01T00:00:00.000Z",
      "end_date": "2024-08-31T23:59:59.000Z",
      "usage_limit": 1000,
      "used_count": 150,
      "is_active": true,
      "created_by": {
        "_id": "64f5a1b2c3d4e5f6a7b8c9d1",
        "usr_name": "Admin User",
        "usr_email": "admin@example.com"
      },
      "createdAt": "2024-06-01T00:00:00.000Z",
      "updatedAt": "2024-06-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_items": 50,
    "items_per_page": 10
  }
}
```

### 3. Tạo discount mới (Protected)

**POST** `/`

**Headers:**
```
Cookie: accessToken=<jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "code": "NEWUSER2024",
  "name": "Giảm giá cho khách hàng mới",
  "description": "Giảm 15% cho đơn hàng đầu tiên từ 300k",
  "discount_type": "percentage",
  "discount_value": 15,
  "min_order_value": 300000,
  "max_discount_amount": 50000,
  "start_date": "2024-09-01T00:00:00.000Z",
  "end_date": "2024-12-31T23:59:59.000Z",
  "usage_limit": 500,
  "is_active": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Discount created successfully",
  "data": {
    "_id": "64f5a1b2c3d4e5f6a7b8c9d2",
    "code": "NEWUSER2024",
    "name": "Giảm giá cho khách hàng mới",
    "description": "Giảm 15% cho đơn hàng đầu tiên từ 300k",
    "discount_type": "percentage",
    "discount_value": 15,
    "min_order_value": 300000,
    "max_discount_amount": 50000,
    "start_date": "2024-09-01T00:00:00.000Z",
    "end_date": "2024-12-31T23:59:59.000Z",
    "usage_limit": 500,
    "used_count": 0,
    "is_active": true,
    "users_used": [],
    "created_by": "64f5a1b2c3d4e5f6a7b8c9d1",
    "createdAt": "2024-09-10T10:00:00.000Z",
    "updatedAt": "2024-09-10T10:00:00.000Z"
  }
}
```

### 4. Lấy chi tiết discount (Protected)

**GET** `/:id`

**Headers:**
```
Cookie: accessToken=<jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Discount retrieved successfully",
  "data": {
    "_id": "64f5a1b2c3d4e5f6a7b8c9d0",
    "code": "SUMMER2024",
    "name": "Giảm giá mùa hè",
    "description": "Giảm 20% cho đơn hàng từ 500k",
    "discount_type": "percentage",
    "discount_value": 20,
    "min_order_value": 500000,
    "max_discount_amount": 100000,
    "start_date": "2024-06-01T00:00:00.000Z",
    "end_date": "2024-08-31T23:59:59.000Z",
    "usage_limit": 1000,
    "used_count": 150,
    "is_active": true,
    "users_used": [
      {
        "user_id": {
          "_id": "64f5a1b2c3d4e5f6a7b8c9d3",
          "usr_name": "John Doe",
          "usr_email": "john@example.com",
          "usr_phone": "0123456789"
        },
        "used_at": "2024-06-15T14:30:00.000Z",
        "order_id": "64f5a1b2c3d4e5f6a7b8c9d4"
      }
    ],
    "created_by": {
      "_id": "64f5a1b2c3d4e5f6a7b8c9d1",
      "usr_name": "Admin User",
      "usr_email": "admin@example.com"
    },
    "createdAt": "2024-06-01T00:00:00.000Z",
    "updatedAt": "2024-06-15T10:30:00.000Z"
  }
}
```

### 5. Cập nhật discount (Protected)

**PUT** `/:id`

**Headers:**
```
Cookie: accessToken=<jwt_token>
Content-Type: application/json
```

**Request Body:** (Chỉ cần gửi các field muốn cập nhật)
```json
{
  "name": "Giảm giá mùa hè 2024 - Cập nhật",
  "description": "Giảm 25% cho đơn hàng từ 500k",
  "discount_value": 25,
  "is_active": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Discount updated successfully",
  "data": {
    // Discount object đã được cập nhật
  }
}
```

### 6. Xóa discount (Protected)

**DELETE** `/:id`

**Headers:**
```
Cookie: accessToken=<jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Discount deleted successfully"
}
```

**Lưu ý:** Không thể xóa discount đã được sử dụng (used_count > 0).

### 7. Kiểm tra tính hợp lệ của mã giảm giá (Protected)

**POST** `/validate`

**Headers:**
```
Cookie: accessToken=<jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "code": "SUMMER2024",
  "order_value": 600000,
  "user_id": "64f5a1b2c3d4e5f6a7b8c9d3" // Optional, sẽ lấy từ JWT nếu không có
}
```

**Response (Valid):**
```json
{
  "success": true,
  "message": "Discount code is valid",
  "data": {
    "valid": true,
    "discount": {
      "id": "64f5a1b2c3d4e5f6a7b8c9d0",
      "code": "SUMMER2024",
      "name": "Giảm giá mùa hè",
      "discount_type": "percentage",
      "discount_value": 20,
      "discount_amount": 100000,
      "min_order_value": 500000,
      "max_discount_amount": 100000
    }
  }
}
```

**Response (Invalid):**
```json
{
  "success": false,
  "message": "Discount has expired"
}
```

### 8. Lấy thống kê discount (Protected)

**GET** `/stats`

**Headers:**
```
Cookie: accessToken=<jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Discount statistics retrieved successfully",
  "data": {
    "overview": {
      "total_discounts": 25,
      "active_discounts": 15,
      "expired_discounts": 8,
      "used_discounts": 12,
      "total_usage": 1250
    },
    "top_used_discounts": [
      {
        "_id": "64f5a1b2c3d4e5f6a7b8c9d0",
        "code": "SUMMER2024",
        "name": "Giảm giá mùa hè",
        "used_count": 150,
        "usage_limit": 1000
      }
    ]
  }
}
```

### 9. Bật/tắt trạng thái discount (Protected)

**PATCH** `/:id/toggle`

**Headers:**
```
Cookie: accessToken=<jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "is_active": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "Discount deactivated successfully",
  "data": {
    // Discount object đã được cập nhật
  }
}
```

### 10. Sử dụng discount (Protected)

**POST** `/use`

**Headers:**
```
Cookie: accessToken=<jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "discount_id": "64f5a1b2c3d4e5f6a7b8c9d0",
  "order_id": "64f5a1b2c3d4e5f6a7b8c9d4"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Discount used successfully",
  "data": {
    // Discount object đã được cập nhật với thông tin sử dụng mới
  }
}
```

## Error Responses

### Validation Errors (400)
```json
{
  "success": false,
  "message": "\"code\" is required"
}
```

### Authentication Errors (401)
```json
{
  "success": false,
  "message": "Unauthorized(Token not found)"
}
```

### Not Found Errors (404)
```json
{
  "success": false,
  "message": "Discount not found"
}
```

### Conflict Errors (409)
```json
{
  "success": false,
  "message": "Discount code already exists"
}
```

### Business Logic Errors (400)
```json
{
  "success": false,
  "message": "You have already used this discount"
}
```

## Validation Rules

### Tạo discount mới:
- `code`: Bắt buộc, 3-20 ký tự, chỉ chữ hoa và số
- `name`: Bắt buộc, 3-100 ký tự
- `description`: Bắt buộc, 10-500 ký tự
- `discount_type`: Bắt buộc, "percentage" hoặc "fixed_amount"
- `discount_value`: Bắt buộc, > 0, ≤ 100 nếu là percentage
- `min_order_value`: ≥ 0
- `max_discount_amount`: > 0, bắt buộc nếu discount_type là percentage
- `start_date`: Bắt buộc, định dạng ISO
- `end_date`: Bắt buộc, phải sau start_date
- `usage_limit`: Bắt buộc, ≥ 1

### Business Rules:
- Không thể cập nhật code nếu discount đã được sử dụng
- Không thể xóa discount đã được sử dụng
- User chỉ có thể sử dụng mỗi discount một lần
- Discount phải trong thời gian hiệu lực
- Đơn hàng phải đạt giá trị tối thiểu
- Discount không được vượt quá số lần sử dụng cho phép

## Examples

### Tạo discount giảm theo phần trăm:
```bash
curl -X POST http://localhost:3000/api/v1/discount \
  -H "Content-Type: application/json" \
  -H "Cookie: accessToken=your_jwt_token" \
  -d '{
    "code": "PERCENT20",
    "name": "Giảm 20%",
    "description": "Giảm 20% cho đơn hàng từ 500k",
    "discount_type": "percentage",
    "discount_value": 20,
    "min_order_value": 500000,
    "max_discount_amount": 100000,
    "start_date": "2024-09-01T00:00:00.000Z",
    "end_date": "2024-12-31T23:59:59.000Z",
    "usage_limit": 1000
  }'
```

### Tạo discount giảm số tiền cố định:
```bash
curl -X POST http://localhost:3000/api/v1/discount \
  -H "Content-Type: application/json" \
  -H "Cookie: accessToken=your_jwt_token" \
  -d '{
    "code": "FIXED50K",
    "name": "Giảm 50k",
    "description": "Giảm 50k cho đơn hàng từ 300k",
    "discount_type": "fixed_amount",
    "discount_value": 50000,
    "min_order_value": 300000,
    "start_date": "2024-09-01T00:00:00.000Z",
    "end_date": "2024-12-31T23:59:59.000Z",
    "usage_limit": 500
  }'
```

### Kiểm tra mã giảm giá:
```bash
curl -X POST http://localhost:3000/api/v1/discount/validate \
  -H "Content-Type: application/json" \
  -H "Cookie: accessToken=your_jwt_token" \
  -d '{
    "code": "SUMMER2024",
    "order_value": 600000
  }'
```
