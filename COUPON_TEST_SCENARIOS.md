# Test Scenarios - Mã Giảm Giá Tự Động Cập Nhật

## Chuẩn Bị Test

### 1. Tạo Discount Code Test:
```javascript
// Trong admin panel hoặc database
{
  "code": "TEST20",
  "name": "Test 20% Discount",
  "discount_type": "percentage",
  "discount_value": 20,
  "min_order_value": 100000,
  "max_discount_amount": 50000,
  "usage_limit": 100,
  "is_active": true
}
```

### 2. Tạo Fixed Amount Discount:
```javascript
{
  "code": "FIXED50K",
  "name": "Fixed 50k Discount", 
  "discount_type": "fixed_amount",
  "discount_value": 50000,
  "min_order_value": 200000,
  "usage_limit": 100,
  "is_active": true
}
```

## Test Cases

### ✅ Test 1: Áp Dụng Mã Hợp Lệ
**Steps:**
1. Thêm sản phẩm vào cart (tổng > 100k)
2. Nhập mã "TEST20"
3. Click "Áp dụng"

**Expected:**
- ✅ Hiển thị success message
- ✅ Discount card xuất hiện với thông tin chi tiết
- ✅ CartSummary hiển thị discount amount
- ✅ Tổng tiền được cập nhật

### ✅ Test 2: Auto-Update Khi Tăng Số Lượng
**Steps:**
1. Áp dụng mã TEST20 (20%)
2. Tăng số lượng sản phẩm trong cart
3. Quan sát thay đổi

**Expected:**
- ✅ Loading spinner xuất hiện trong discount card
- ✅ Discount amount tự động cập nhật theo cart total mới
- ✅ Toast notification: "Mã giảm giá đã được cập nhật!"
- ✅ Không bị xóa mã

### ✅ Test 3: Auto-Update Khi Giảm Số Lượng
**Steps:**
1. Áp dụng mã TEST20
2. Giảm số lượng sản phẩm (nhưng vẫn > min_order_value)
3. Quan sát thay đổi

**Expected:**
- ✅ Discount amount giảm theo tỷ lệ
- ✅ Toast notification về cập nhật
- ✅ Mã vẫn được giữ

### ✅ Test 4: Xóa Mã Khi Không Đủ Điều Kiện
**Steps:**
1. Áp dụng mã TEST20 (min 100k)
2. Giảm số lượng sản phẩm xuống < 100k
3. Quan sát thay đổi

**Expected:**
- ✅ Loading spinner xuất hiện
- ✅ Mã bị xóa tự động
- ✅ Error message: "Giá trị đơn hàng tối thiểu là 100,000 VND"
- ✅ Toast error notification

### ✅ Test 5: Fixed Amount Discount
**Steps:**
1. Cart total > 200k
2. Áp dụng mã "FIXED50K"
3. Thay đổi số lượng sản phẩm

**Expected:**
- ✅ Fixed amount 50k được áp dụng
- ✅ Khi cart thay đổi, amount vẫn là 50k (không thay đổi theo %)
- ✅ Chỉ bị xóa khi < min_order_value

### ✅ Test 6: Manual Refresh Button
**Steps:**
1. Áp dụng mã giảm giá
2. Click nút refresh (RefreshCw icon)

**Expected:**
- ✅ Loading spinner xuất hiện
- ✅ Revalidate discount
- ✅ Cập nhật thông tin nếu có thay đổi

### ✅ Test 7: Remove Button
**Steps:**
1. Áp dụng mã giảm giá
2. Click nút remove (XCircle icon)

**Expected:**
- ✅ Mã bị xóa ngay lập tức
- ✅ Toast info: "Đã xóa mã giảm giá"
- ✅ CartSummary cập nhật

### ✅ Test 8: Keyboard Support
**Steps:**
1. Nhập mã vào input
2. Nhấn Enter

**Expected:**
- ✅ Tự động áp dụng mã (không cần click button)

### ✅ Test 9: Error Handling
**Steps:**
1. Nhập mã không tồn tại: "INVALID"
2. Nhập mã hết hạn
3. Nhập mã hết lượt sử dụng

**Expected:**
- ✅ Error messages tiếng Việt rõ ràng
- ✅ Không crash application
- ✅ Input vẫn có thể sử dụng

### ✅ Test 10: Cart Events Integration
**Steps:**
1. Áp dụng mã giảm giá
2. Xóa sản phẩm khỏi cart
3. Thêm sản phẩm mới vào cart

**Expected:**
- ✅ Discount tự động revalidate với cart mới
- ✅ Cập nhật hoặc xóa tùy theo điều kiện

## Console Debugging

Kiểm tra browser console để thấy:
```
Cart total changed, revalidating discount... {oldTotal: 150000, newTotal: 200000, discount: "TEST20"}
Cart updated via event, revalidating discount... {newTotal: 200000, discount: "TEST20"}
```

## Performance Check

### 1. Network Tab:
- ✅ API calls chỉ khi cần thiết
- ✅ Không spam requests
- ✅ Proper error handling

### 2. Memory:
- ✅ Event listeners được cleanup
- ✅ Không memory leaks

### 3. UX:
- ✅ Smooth transitions
- ✅ Loading states
- ✅ Clear feedback

## Edge Cases

### 1. Empty Cart:
- ✅ Không thể áp dụng mã khi cart trống
- ✅ Error message phù hợp

### 2. Network Error:
- ✅ Graceful handling khi API fail
- ✅ Retry mechanism (manual refresh)

### 3. Multiple Rapid Changes:
- ✅ Debounce/throttle để tránh spam API
- ✅ Cancel previous requests nếu cần

## Success Criteria

Tất cả test cases trên phải pass để đảm bảo:
- ✅ Mã giảm giá tự động cập nhật thay vì bị xóa
- ✅ UX mượt mà và intuitive
- ✅ Error handling robust
- ✅ Performance tốt
- ✅ Integration hoàn hảo với cart system
