"use client"

import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, FreeMode } from "swiper/modules"
import "swiper/css"
import "swiper/css/free-mode"
import { motion } from "framer-motion"
import { Phone, Zap } from "lucide-react"

export default function EventSection({ landingInfo }: { landingInfo: LandingPage }) {
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
                    <p className="text-sm text-black uppercase tracking-wide">
                        {
                            landingInfo?.eventSection?.tag?.map((tag, index) => <span key={index}>#{tag} </span>)
                        }
                    </p>
                    {(() => {
                        const title = landingInfo?.eventSection?.title || "";
                        const words = title.split(" ");
                        const firstPart = words.slice(0, 3).join(" ");
                        const secondPart = words.slice(3).join(" ");

                        return (
                            <h2 className="text-4xl font-bold mt-3 leading-snug">
                                {firstPart} <br />
                                {secondPart}
                            </h2>
                        );
                    })()}


                    <p className="mt-4 text-black leading-relaxed">
                        {
                            landingInfo?.eventSection?.detail
                        }
                    </p>

                    {/* Stats */}
                    <div className="mt-10 flex gap-10">
                        {landingInfo?.eventSection?.subSection?.map((sb, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                                className="flex items-center gap-3"
                            >

                                <div>
                                    <p className="text-xl font-bold">{sb.title}</p>
                                    <p className="text-black-400 text-sm">
                                        {sb.detail}
                                    </p>
                                </div>
                            </motion.div>
                        ))

                        }

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
                            {landingInfo?.eventSection?.imageCol1?.map((src, i) => (
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
                            {landingInfo?.eventSection?.imageCol2.map((src, i) => (
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
