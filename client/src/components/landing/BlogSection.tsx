import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import teaPlantation from "@/assets/tea-plantation.jpg"
import greenTea from "@/assets/green-tea.jpg"
import blackTea from "@/assets/black-tea.jpg"
import { useEffect, useState } from "react"
import { getPublishedBlogs } from "@/apis/blog.apis"
import dayjs from "dayjs"

const blogPosts = [
  {
    id: 1,
    title: "Hành Trình Khám Phá Trà Xanh Long Tỉnh",
    excerpt: "Tìm hiểu về lịch sử hàng ngàn năm của trà xanh Long Tỉnh và quy trình chế tác tinh xảo tạo nên hương vị độc đáo này.",
    image: teaPlantation,
    category: "Lịch Sử",
    readTime: "5 phút",
    date: "15 Tháng 12, 2024",
    featured: true
  },
  {
    id: 2,
    title: "Bí Quyết Pha Trà Xanh Đúng Chuẩn",
    excerpt: "Học cách pha trà xanh với nhiệt độ và thời gian hoàn hảo để giữ trọn hương vị và dưỡng chất tự nhiên.",
    image: greenTea,
    category: "Hướng Dẫn",
    readTime: "3 phút",
    date: "12 Tháng 12, 2024",
    featured: false
  },
  {
    id: 3,
    title: "Trà Đen và Nghệ Thuật Tea Time Cổ Điển",
    excerpt: "Khám phá truyền thống tea time sang trọng và cách thưởng thức trà đen theo phong cách quý tộc Anh.",
    image: blackTea,
    category: "Văn Hóa",
    readTime: "4 phút",
    date: "10 Tháng 12, 2024",
    featured: false
  }
]

const BlogSection = () => {

  const [blogs, setBlogs] = useState<Blog[]>([]);
  console.log("🚀 ~ BlogSection ~ blogs:", blogs)
  useEffect(() => {
    fetchBlog()
  }, [])

  const fetchBlog = async () => {
    await getPublishedBlogs({
      page: 1,
      limit: 4,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    }).then((res) => {
      setBlogs(res.data)
    })
  }
  return (
    <section id="blog" className="py-20 ">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-foreground">
            Câu Chuyện Về Trà
          </h2>
          <p className="text-xl font-elegant text-muted-foreground max-w-2xl mx-auto">
            Khám phá những câu chuyện thú vị, bí quyết pha chế và văn hóa trà từ khắp nơi trên thế giới
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Post */}
          {blogs.length > 0 && <div className="lg:col-span-2">
            <Card className="group overflow-hidden bg-card/95 backdrop-blur border-border/50 hover:shadow-elegant transition-all duration-500">
              <div className="relative">
                <img
                  src={blogs[0].blog_thumbnail.url || blogPosts[0].image}
                  alt={blogs[0].blog_thumbnail.alt}
                  className="w-full h-80 md:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-6 left-6">
                  <Badge className="bg-tea-gold text-tea-brown font-semibold">
                    Bài Viết Nổi Bật
                  </Badge>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>

              <CardContent className="p-8">
                <div className="flex items-center gap-4 mb-4 text-muted-foreground text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{dayjs(blogs[0].blog_published_at).format("DD/MM/YYYY")}</span>
                  </div>

                  {blogs[0].blog_category && <Badge variant="outline" className="text-xs">
                    {blogs[0].blog_category.category_name}
                  </Badge>}
                </div>

                <h3 className="text-3xl  font-bold mb-4 text-foreground group-hover:text-tea-green transition-colors">
                  {blogs[0].blog_title}
                </h3>

                <p className="text-muted-foreground  leading-relaxed mb-6">
                  {blogs[0].blog_excerpt}
                </p>

                <Button className="bg-gradient-tea text-black hover:shadow-elegant transition-all duration-300 group">
                  Đọc Tiếp
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </div>}

          {/* Side Posts */}
          <div className="space-y-6">
            {blogs.slice(1).map((post) => (
              <Card key={post._id} className="group overflow-hidden bg-card/95 backdrop-blur border-border/50 hover:shadow-elegant transition-all duration-500">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative sm:w-32 h-32 sm:h-auto flex-shrink-0">
                    <img
                      src={post.blog_thumbnail.url}
                      alt={post.blog_thumbnail.alt}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <CardContent className="p-4 flex-1">
                    <div className="flex items-center gap-2 mb-2 text-muted-foreground text-xs">
                      <Calendar className="h-3 w-3" />
                      <span>{dayjs(post.blog_published_at).format("DD/MM/YYYY")}</span>

                    </div>

                    <Badge variant="outline" className="text-xs mb-2">
                      {post.blog_category.category_name}
                    </Badge>

                    <h4 className=" font-bold mb-2 text-foreground group-hover:text-tea-green transition-colors line-clamp-2">
                      {post.blog_title}
                    </h4>

                    <p className="text-sm text-muted-foreground  line-clamp-2 mb-3">
                      {post.blog_excerpt}
                    </p>

                    <Button variant="ghost" size="sm" className="text-tea-green hover:text-tea-green hover:bg-tea-green/10 p-0 h-auto font-semibold group">
                      Đọc Tiếp
                      <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </div>
              </Card>
            ))}


          </div>
        </div>
      </div>
    </section>
  )
}

export default BlogSection