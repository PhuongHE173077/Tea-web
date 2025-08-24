"use client"

import { useState } from "react"
import { Star, ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface TeaProductDetailProps {
    tea: Tea
}

export function TeaProductDetail() {

    const tea: Tea = {
        _id: "1",
        name: "Trà Ô Long Đài Loan",
        brand: "Premium Tea Co.",
        images: ["/premium-oolong-tea-leaves.png", "/tea-brewing-process.png", "/lush-tea-plantation.png"],
        price: 250000,
        imageThumb: "/oolong-tea-thumbnail.png",
        imageCover: "/premium-oolong-tea-cover.png",
        description: "Trà Ô Long Đài Loan cao cấp với hương vị thơm ngon, được chế biến theo phương pháp truyền thống.",
        descriptionDetail:
            "Trà Ô Long Đài Loan này được trồng trên những cao nguyên Đài Loan với độ cao trên 1000m. Lá trà được hái thủ công và chế biến theo phương pháp truyền thống, tạo nên hương vị đặc trưng với sự cân bằng hoàn hảo giữa vị ngọt tự nhiên và hương thơm đặc trưng. Sản phẩm không chứa chất bảo quản, an toàn cho sức khỏe.",
        brewing: [
            "Sử dụng 3-5g trà cho 200ml nước",
            "Nhiệt độ nước: 85-90°C",
            "Thời gian pha: 2-3 phút cho lần đầu",
            "Có thể pha lại 3-4 lần",
            "Dùng ấm trà hoặc ly thủy tinh để thưởng thức tốt nhất",
        ],
        category: "Ô Long",
        popularity: 95,
        reviews: [
            {
                _id: "r1",
                username: "Nguyễn Văn A",
                rating: 5,
                comment: "Trà rất thơm và ngon, chất lượng tuyệt vời. Sẽ mua lại!",
                date: "2024-01-15",
            },
            {
                _id: "r2",
                username: "Trần Thị B",
                rating: 4,
                comment: "Hương vị đậm đà, rất hài lòng với sản phẩm này.",
                date: "2024-01-10",
            },
            {
                _id: "r3",
                username: "Lê Minh C",
                rating: 5,
                comment: "Đóng gói cẹn thận, trà có mùi thơm tự nhiên. Recommend!",
                date: "2024-01-05",
            },
        ],
        rating: 4.7,
    }
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)



    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price)
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN")
    }

    const relatedProducts: Tea[] = [
        {
            _id: "2",
            name: "Trà Xanh Sencha Nhật Bản",
            brand: "Kyoto Tea House",
            category: "Trà xanh",
            price: 280000,
            rating: 4.6,
            description: "Trà xanh Sencha cao cấp từ Nhật Bản với hương vị tươi mát",
            descriptionDetail: "Trà Sencha được trồng tại vùng núi Uji nổi tiếng của Nhật Bản...",
            images: ["/sencha-tea.png", "/sencha-leaves.png"],
            brewing: ["Pha với nước 70-80°C", "Thời gian pha: 1-2 phút", "Có thể pha lại 2-3 lần"],
            reviews: [
                {
                    _id: "r3",
                    username: "Minh Anh",
                    rating: 5,
                    comment: "Trà xanh tuyệt vời, hương vị rất tươi mát!",
                    date: "2024-01-10",
                },
            ],
            imageThumb: "/sencha-tea.png",
            imageCover: "/sencha-leaves.png",
            popularity: 90,
        },
        {
            _id: "3",
            name: "Trà Đen Earl Grey Premium",
            brand: "London Tea Co",
            category: "Trà đen",
            price: 320000,
            rating: 4.4,
            description: "Trà đen Earl Grey với tinh dầu bergamot thơm nồng",
            descriptionDetail: "Earl Grey là loại trà đen truyền thống của Anh với hương bergamot đặc trưng...",
            images: ["/earl-grey.png", "/earl-grey-cup.png"],
            brewing: ["Pha với nước sôi 100°C", "Thời gian pha: 3-5 phút", "Có thể thêm sữa và đường"],
            reviews: [
                {
                    _id: "r4",
                    username: "Thanh Hoa",
                    rating: 4,
                    comment: "Hương bergamot rất thơm, phù hợp uống buổi chiều",
                    date: "2024-01-08",
                },
            ],
        },
        {
            _id: "4",
            name: "Trà Hoa Nhài Cao Cấp",
            brand: "Việt Nam Tea",
            category: "Trà hoa",
            price: 250000,
            rating: 4.7,
            description: "Trà xanh ướp hoa nhài thơm ngọt tự nhiên",
            descriptionDetail: "Trà hoa nhài được làm từ trà xanh tươi ướp với hoa nhài tự nhiên...",
            images: ["/jasmine-tea.png", "/jasmine-flowers.png"],
            brewing: ["Pha với nước 80-85°C", "Thời gian pha: 2-3 phút", "Hương hoa nhài tỏa ra khi pha"],
            reviews: [
                {
                    _id: "r5",
                    username: "Lan Phương",
                    rating: 5,
                    comment: "Hương hoa nhài rất thơm và tự nhiên, không bị gắt",
                    date: "2024-01-05",
                },
            ],
        },
        {
            _id: "5",
            name: "Trà Pu-erh Cổ Thụ",
            brand: "Yunnan Premium",
            category: "Trà đen",
            price: 450000,
            rating: 4.8,
            description: "Trà Pu-erh từ cây chè cổ thụ 100 năm tuổi",
            descriptionDetail: "Trà Pu-erh cổ thụ được thu hái từ những cây chè hàng trăm năm tuổi...",
            images: ["/puerh-tea.png", "/puerh-cake.png"],
            brewing: ["Pha với nước sôi 95-100°C", "Rửa trà lần đầu", "Pha nhanh 10-20 giây mỗi lần"],
            reviews: [
                {
                    _id: "r6",
                    username: "Hoàng Nam",
                    rating: 5,
                    comment: "Trà có độ đậm đà và hậu vị ngọt rất đặc biệt",
                    date: "2024-01-03",
                },
            ],
        },
    ]

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Product Images */}
                <div className="space-y-4">
                    <div className="aspect-square relative overflow-hidden rounded-lg bg-muted">
                        <img src={tea.images[selectedImage] || "/placeholder.svg"} alt={tea.name} className="object-cover" />
                    </div>
                    <div className="flex gap-2 overflow-x-auto">
                        {tea.images.map((image, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${selectedImage === index ? "border-primary" : "border-border"
                                    }`}
                            >
                                <img
                                    src={image || "/placeholder.svg"}
                                    alt={`${tea.name} ${index + 1}`}
                                    width={80}
                                    height={80}
                                    className="object-cover w-full h-full"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                    <div>
                        <Badge variant="secondary" className="mb-2">
                            {tea.category}
                        </Badge>
                        <h1 className="text-3xl font-bold mb-2">{tea.name}</h1>
                        <p className="text-muted-foreground mb-4">{tea.brand}</p>

                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${i < Math.floor(tea.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="font-medium">{tea.rating}</span>
                            <span className="text-muted-foreground">({tea.reviews.length} đánh giá)</span>
                        </div>

                        <p className="text-muted-foreground mb-6">{tea.description}</p>

                        <div className="text-3xl font-bold text-primary mb-6">{formatPrice(tea.price)}</div>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center border rounded-md">
                            <Button variant="ghost" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                                -
                            </Button>
                            <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                            <Button variant="ghost" size="sm" onClick={() => setQuantity(quantity + 1)}>
                                +
                            </Button>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Button size="lg" className="flex-1">
                            <ShoppingCart className="w-5 h-5 mr-2" />
                            Thêm vào giỏ hàng
                        </Button>
                        <Button variant="outline" size="lg">
                            <Heart className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Product Details Tabs */}
            <Card className="mb-8">
                <CardContent className="p-6">
                    <Tabs defaultValue="description" className="w-full">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="description">Mô tả chi tiết</TabsTrigger>
                            <TabsTrigger value="brewing">Hướng dẫn pha chế</TabsTrigger>
                            <TabsTrigger value="reviews">Đánh giá ({tea.reviews.length})</TabsTrigger>
                        </TabsList>

                        <TabsContent value="description" className="mt-6">
                            <div className="prose max-w-none">
                                <p className="text-muted-foreground leading-relaxed">{tea.descriptionDetail}</p>
                            </div>
                        </TabsContent>

                        <TabsContent value="brewing" className="mt-6">
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold mb-4">Cách pha chế tối ưu:</h3>
                                <ul className="space-y-3">
                                    {tea.brewing.map((step, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                                                {index + 1}
                                            </span>
                                            <span className="text-muted-foreground">{step}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </TabsContent>

                        <TabsContent value="reviews" className="mt-6">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">Đánh giá từ khách hàng</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < Math.floor(tea.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="font-medium">{tea.rating}/5</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {tea.reviews.map((review, index) => (
                                        <Card key={index}>
                                            <CardContent className="p-4">
                                                <div className="flex items-start gap-4">
                                                    <Avatar>
                                                        <AvatarFallback>{review.username.charAt(0).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="font-medium">{review.username}</h4>
                                                            <span className="text-sm text-muted-foreground">{formatDate(review.date)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star
                                                                    key={i}
                                                                    className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <p className="text-muted-foreground">{review.comment}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {relatedProducts.map((product) => (
                        <Card key={product._id} className="group cursor-pointer hover:shadow-lg transition-shadow">
                            <CardContent className="p-4">
                                <div className="aspect-square relative overflow-hidden rounded-lg mb-4 bg-muted">
                                    <img
                                        src={product.images[0] || "/placeholder.svg?height=200&width=200&query=tea product"}
                                        alt={product.name}

                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <Badge variant="secondary" className="mb-2 text-xs">
                                    {product.category}
                                </Badge>
                                <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.name}</h3>
                                <p className="text-xs text-muted-foreground mb-2">{product.brand}</p>
                                <div className="flex items-center gap-1 mb-2">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-3 h-3 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-xs font-medium">{product.rating}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="font-bold text-primary">{formatPrice(product.price)}</span>
                                    <Button size="sm" variant="outline">
                                        <ShoppingCart className="w-3 h-3" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}
