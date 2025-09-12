# Landing Page API Documentation

## Tổng quan
API RESTful để quản lý nội dung landing page với các sections: header, about, video, main, event, và carousel.

## Base URL
```
/api/v1/landing-page
```

## Endpoints

### 1. Lấy thông tin landing page
```http
GET /api/v1/landing-page
```

**Response:**
```json
{
  "success": true,
  "message": "Get landing page successfully",
  "data": {
    "_id": "...",
    "header": {
      "title": "Welcome to Tea Web",
      "detail": "Discover the finest tea collection",
      "imageCover": "https://example.com/header-image.jpg",
      "attribute": [],
      "isActive": true
    },
    "aboutSection": { ... },
    "video": { ... },
    "mainSection": [ ... ],
    "eventSection": { ... },
    "carousel": { ... }
  }
}
```

### 2. Tạo mới landing page
```http
POST /api/v1/landing-page
Content-Type: application/json
```

**Request Body:**
```json
{
  "header": {
    "title": "Welcome to Tea Web",
    "detail": "Discover the finest tea collection",
    "imageCover": "https://example.com/header-image.jpg",
    "attribute": [],
    "isActive": true
  },
  "aboutSection": {
    "title": "About Us",
    "detail": "We are passionate about tea",
    "attribute": [
      {
        "icon": "icon-quality",
        "title": "Premium Quality",
        "detail": "Only the finest tea leaves"
      }
    ],
    "isActive": true
  },
  "video": {
    "url": "https://youtube.com/watch?v=example",
    "isActive": true
  },
  "mainSection": [
    {
      "title": "Our Products",
      "detail": "Explore our tea collection",
      "imageCover": "https://example.com/products.jpg",
      "isActive": true
    }
  ],
  "eventSection": {
    "tag": ["event", "promotion"],
    "title": "Special Events",
    "detail": "Join our tea tasting events",
    "imageCol1": ["image1.jpg", "image2.jpg"],
    "imageCol2": ["image3.jpg", "image4.jpg"],
    "subSection": [
      {
        "title": "Tea Tasting",
        "detail": "Experience premium tea flavors"
      }
    ],
    "isActive": true
  },
  "carousel": {
    "title": "Featured Products",
    "detail": "Our best selling teas",
    "carouselList": ["product1.jpg", "product2.jpg"],
    "isActive": true
  }
}
```

### 3. Cập nhật toàn bộ landing page
```http
PUT /api/v1/landing-page
Content-Type: application/json
```

**Request Body:** Tương tự như POST nhưng tất cả fields đều optional.

### 4. Cập nhật từng section riêng biệt

#### Cập nhật Header
```http
PATCH /api/v1/landing-page/header
Content-Type: application/json

{
  "title": "New Header Title",
  "detail": "Updated header description",
  "imageCover": "https://example.com/new-header.jpg",
  "attribute": ["new", "attributes"],
  "isActive": true
}
```

#### Cập nhật About Section
```http
PATCH /api/v1/landing-page/about
Content-Type: application/json

{
  "title": "Updated About Title",
  "detail": "New about description",
  "attribute": [
    {
      "icon": "new-icon",
      "title": "New Feature",
      "detail": "Feature description"
    }
  ],
  "isActive": true
}
```

#### Cập nhật Video Section
```http
PATCH /api/v1/landing-page/video
Content-Type: application/json

{
  "url": "https://youtube.com/watch?v=new-video",
  "isActive": true
}
```

#### Cập nhật Main Section
```http
PATCH /api/v1/landing-page/main-section
Content-Type: application/json

[
  {
    "title": "Updated Main Title",
    "detail": "Updated main description",
    "imageCover": "https://example.com/new-main.jpg",
    "isActive": true
  }
]
```

#### Cập nhật Event Section
```http
PATCH /api/v1/landing-page/event-section
Content-Type: application/json

{
  "tag": ["updated", "tags"],
  "title": "Updated Event Title",
  "detail": "Updated event description",
  "imageCol1": ["new-image1.jpg"],
  "imageCol2": ["new-image2.jpg"],
  "subSection": [
    {
      "title": "Updated Sub Event",
      "detail": "Updated sub event description"
    }
  ],
  "isActive": true
}
```

#### Cập nhật Carousel Section
```http
PATCH /api/v1/landing-page/carousel
Content-Type: application/json

{
  "title": "Updated Carousel Title",
  "detail": "Updated carousel description",
  "carouselList": ["new-carousel1.jpg", "new-carousel2.jpg"],
  "isActive": true
}
```

### 5. Xóa landing page
```http
DELETE /api/v1/landing-page
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Landing page not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Validation Rules

### Header Section
- `title`: Required string
- `detail`: Required string  
- `imageCover`: Required string
- `attribute`: Optional array (default: [])
- `isActive`: Optional boolean (default: true)

### About Section
- `title`: Required string
- `detail`: Required string
- `attribute`: Optional array of objects with `icon`, `title`, `detail`
- `isActive`: Optional boolean (default: true)

### Video Section
- `url`: Required string
- `isActive`: Optional boolean (default: true)

### Main Section
- Array of objects with:
  - `title`: Required string
  - `detail`: Required string
  - `imageCover`: Required string
  - `isActive`: Optional boolean (default: true)

### Event Section
- `tag`: Optional array (default: [])
- `title`: Required string
- `detail`: Required string
- `imageCol1`: Optional array (default: [])
- `imageCol2`: Optional array (default: [])
- `subSection`: Optional array of objects with `title`, `detail`
- `isActive`: Optional boolean (default: true)

### Carousel Section
- `title`: Required string
- `detail`: Required string
- `carouselList`: Optional array (default: [])
- `isActive`: Optional boolean (default: true)
