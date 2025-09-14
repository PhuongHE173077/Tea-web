import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import greenTea from "@/assets/green-tea.jpg"
import blackTea from "@/assets/black-tea.jpg"
import oolongTea from "@/assets/oolong-tea.jpg"

const teas = [
  {
    id: 1,
    name: "Trà Xanh Long Tỉnh",
    description: "Trà xanh cao cấp từ vùng núi Long Tỉnh, Trung Quốc với hương vị thanh mát, ngọt dịu tự nhiên",
    image: greenTea,
    origin: "Trung Quốc",
    category: "Trà Xanh"
  },
  {
    id: 2,
    name: "Trà Đen Earl Grey Premium",
    description: "Trà đen thơm ngon pha trộn với tinh dầu bergamot, mang đến hương vị quý tộc châu Âu",
    image: blackTea,
    origin: "Sri Lanka",
    category: "Trà Đen"
  },
  {
    id: 3,
    name: "Trà Oolong Đài Loan",
    description: "Trà oolong truyền thống từ cao nguyên Đài Loan với hương thơm phức tạp và vị ngọt kéo dài",
    image: oolongTea,
    origin: "Đài Loan",
    category: "Trà Oolong"
  },
  {
    id: 4,
    name: "Trà Xanh Matcha Nhật Bản",
    description: "Bột trà xanh matcha nguyên chất từ Uji, Nhật Bản với màu xanh jade đặc trưng",
    image: greenTea,
    origin: "Nhật Bản",
    category: "Matcha"
  },
  {
    id: 5,
    name: "Trà Đen Assam Ấn Độ",
    description: "Trà đen mạnh mẽ từ vùng Assam với hương vị đậm đà, thích hợp pha với sữa",
    image: blackTea,
    origin: "Ấn Độ",
    category: "Trà Đen"
  }
]

const TeaCarousel = ({ landingInfo }: { landingInfo: LandingPage }) => {
  const teaCarousel = [...teas, ...teas]; // Duplicate the array for infinite loop effect
  return (
    <section id="loai-tra" className="py-20 ">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl  font-bold mb-4 text-foreground">
            {landingInfo?.carousel?.title}
          </h2>
          <p className="text-xl  text-muted-foreground max-w-2xl mx-auto">
            {landingInfo?.carousel?.detail}
          </p>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
          spaceBetween={30}
          slidesPerView={1}
          centeredSlides={true}
          loop={true}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet tea-bullet',
            bulletActiveClass: 'swiper-pagination-bullet-active tea-bullet-active',
          }}
          navigation={true}
          effect="coverflow"
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
            slideShadows: true,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="tea-swiper"
        >
          {[...landingInfo?.carousel?.carouselList, ...landingInfo?.carousel?.carouselList].map((tea) => (
            <SwiperSlide key={tea.title}>
              {/* Swiper injects .swiper-slide-active class to the active slide */}
              <Card className="bg-card/95 border border-tea-green shadow-md transition-all duration-500 group swiper-slide-active:bg-white swiper-slide-active:shadow-2xl swiper-slide-active:scale-[1.06] swiper-slide-active:border-tea-gold">
                <CardContent className="p-6">
                  <div className="relative overflow-hidden rounded-lg mb-6">
                    <img
                      src={tea.imageCover}
                      alt={tea.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {/* <div className="absolute top-4 left-4">
                      <Badge className="bg-tea-gold text-tea-brown font-semibold">
                        {tea.category}
                      </Badge>
                    </div> */}
                    <div className="absolute top-4 right-4">
                      <Badge variant="outline" className="bg-card/80 backdrop-blur text-foreground border-border">
                        {tea.tab}
                      </Badge>
                    </div>
                  </div>

                  <h3 className="text-2xl font-serif font-bold mb-3 text-foreground group-hover:text-tea-green transition-colors">
                    {tea.title}
                  </h3>

                  <p className="text-muted-foreground font-elegant leading-relaxed">
                    {tea.detail}
                  </p>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

    </section>
  )
}

export default TeaCarousel