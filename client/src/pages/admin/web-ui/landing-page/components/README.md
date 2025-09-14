# CarouselSection Components

## Tổng quan

Bộ component được thiết kế để quản lý carousel section trong trang landing page admin, bao gồm:

- `CarouselSection.tsx` - Component chính để quản lý carousel
- `AddCarouselItemDialog.tsx` - Dialog để thêm mục carousel mới với upload ảnh
- `CarouselSection.demo.tsx` - Component demo để test

## Tính năng chính

### 🎯 CarouselSection
- ✅ Quản lý thông tin cơ bản (tiêu đề, mô tả)
- ✅ Danh sách carousel items với preview hình ảnh
- ✅ Chỉnh sửa inline từng mục
- ✅ Sắp xếp thứ tự (di chuyển lên/xuống)
- ✅ Xóa mục
- ✅ Bật/tắt hiển thị carousel
- ✅ Validation và error handling

### 🖼️ AddCarouselItemDialog
- ✅ Upload ảnh từ file (sử dụng API `/images/upload`)
- ✅ Nhập URL ảnh thủ công
- ✅ Preview ảnh real-time
- ✅ Form validation đầy đủ
- ✅ Responsive design
- ✅ Drag & drop support (UI)

## Cấu trúc dữ liệu

```typescript
interface CarouselItem {
    title: string        // Tiêu đề mục
    detail: string       // Mô tả chi tiết
    imageCover: string   // URL hình ảnh
    tab: string          // Danh mục/tag
}

interface LandingPageCarousel {
    title: string                // Tiêu đề section
    detail: string               // Mô tả section
    carouselList: CarouselItem[] // Danh sách mục
    isActive: boolean            // Trạng thái hiển thị
}
```

## Cách sử dụng

### 1. Import component

```tsx
import { CarouselSection } from './components/CarouselSection'
```

### 2. Sử dụng trong component

```tsx
<CarouselSection 
    data={carouselData}
    onUpdate={handleUpdateCarousel}
    loading={isLoading}
/>
```

### 3. Props

| Prop | Type | Mô tả |
|------|------|-------|
| `data` | `LandingPageCarousel?` | Dữ liệu carousel hiện tại |
| `onUpdate` | `(data: Partial<LandingPageCarousel>) => Promise<any>` | Callback khi cập nhật |
| `loading` | `boolean` | Trạng thái loading |

## API Integration

Component sử dụng các API sau:

### Upload ảnh
```typescript
import { uploadSingleImage } from "@/apis"

// Upload file và nhận URL
const imageUrl = await uploadSingleImage(file)
```

### Validation
- File type: chỉ chấp nhận image/*
- File size: tối đa 5MB
- Required fields: title, imageCover

## Styling

Component sử dụng:
- **shadcn/ui** components
- **Tailwind CSS** cho styling
- **Lucide React** cho icons
- **Framer Motion** (có thể thêm cho animations)

## Demo

Chạy component demo:

```tsx
import { CarouselSectionDemo } from './components/CarouselSection.demo'

// Trong app
<CarouselSectionDemo />
```

## Tương thích

- ✅ Tương thích với `TeaCarousel` component hiện có
- ✅ Dữ liệu được lưu đúng format cho frontend
- ✅ Responsive design cho mobile/tablet
- ✅ TypeScript support đầy đủ

## Troubleshooting

### Lỗi upload ảnh
- Kiểm tra API endpoint `/images/upload`
- Đảm bảo file đúng format và kích thước
- Kiểm tra network connection

### Lỗi validation
- Đảm bảo các trường bắt buộc được điền
- Kiểm tra format URL hình ảnh

### Performance
- Component được optimize với React.memo (có thể thêm)
- Upload ảnh có loading state
- Lazy loading cho preview ảnh lớn
