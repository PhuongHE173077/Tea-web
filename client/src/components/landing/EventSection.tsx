"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, FreeMode } from "swiper/modules"
import "swiper/css"
import "swiper/css/free-mode"
import { motion } from "framer-motion"
import { Phone, Zap } from "lucide-react"

export default function EventSection() {
    const images = [
        "/images/event/image-1.png",
        "/images/event/image-2.png",
        "/images/event/image-3.png",
        "/images/event/image-4.png",
        "/images/event/image-5.png",
    ]
    const imagesCopy = [...images, ...images]; // Tạo bản sao để lặp lại hình ảnh

    return (
        <section className="text-black py-20">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                {/* Left Content */}
                <div>
                    <p className="text-sm text-black uppercase tracking-wide">#My Customers</p>
                    <h2 className="text-4xl font-bold mt-3 leading-snug">
                        Những sự kiện <br /> chúng tôi đã thực hiện
                    </h2>
                    <p className="mt-4 text-black leading-relaxed">
                        Từ những sự kiện hàng nghìn người đến các sự kiện VIP, với các đối tác là
                        chính phủ, doanh nghiệp, hiệp hội hay nhãn hàng
                    </p>

                    {/* Stats */}
                    <div className="mt-10 flex gap-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex items-center gap-3"
                        >
                            <div className="bg-blue-500/10 p-4 rounded-full">
                                <Phone className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <p className="text-xl font-bold">Từ 2006</p>
                                <p className="text-black-400 text-sm">
                                    Sự kiện đầu tiên chúng tôi thực hiện là Lễ Hội Trà Đà Lạt 2006
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="flex items-center gap-3"
                        >
                            <div className="bg-yellow-500/10 p-4 rounded-full">
                                <Zap className="w-6 h-6 text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-xl font-bold">+100</p>
                                <p className="text-black-400 text-sm">
                                    Hàng trăm khách mời là chính khách và người nổi tiếng
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Right Content */}
                <div className="flex gap-10 justify-center items-center ml-20"> {/* giảm khoảng cách giữa 2 carousel */}
                    {/* Carousel 1 (xuống) */}
                    <div className="relative  h-[500px] overflow-hidden">

                        <Swiper
                            direction="vertical"
                            modules={[Autoplay, FreeMode]}
                            loop
                            freeMode={{ enabled: true, momentum: false }}
                            autoplay={{
                                delay: 0,
                                disableOnInteraction: false, // không dừng khi click
                                reverseDirection: false,      // lăn xuống
                            }}
                            speed={5000}
                            slidesPerView={3}
                            spaceBetween={20}
                            allowTouchMove={false}
                            className="h-full"
                        >
                            {imagesCopy.map((src, i) => (
                                <SwiperSlide key={i}>
                                    <img
                                        src={src}
                                        alt={`Event ${i + 1}`}
                                        className="w-36 h-36 object-cover  mx-auto pointer-events-none"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {/* Carousel 2 (ngược lên) */}
                    <div className=" h-[400px] mt-10">
                        <Swiper
                            direction="vertical"
                            modules={[Autoplay, FreeMode]}
                            loop
                            freeMode={{ enabled: true, momentum: false }}
                            autoplay={{
                                delay: 0,
                                disableOnInteraction: false,
                                reverseDirection: true,
                            }}
                            speed={5000}
                            slidesPerView={3}
                            spaceBetween={20}
                            allowTouchMove={false}
                            className="h-full"
                        >
                            {imagesCopy.map((src, i) => (
                                <SwiperSlide key={i}>
                                    <img
                                        src={src}
                                        alt={`Event ${i + 1}`}
                                        className="w-28 h-28 object-cover  mx-auto pointer-events-none"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>
            </div>
        </section>
    )
}
