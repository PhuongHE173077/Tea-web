'use client'

import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const slides = [
    {
        title: "Celebrate Topo Chico's 130th Anniversary",
        description: "Your favorite mineral water is celebrating 130 years with an epic new video, sweepstakes, and more. Join the party!",
        background: "/images/carousel/carousel-4.png",
    },
    {
        title: "Limited Edition Flavor",
        description: "Try our refreshing new flavor – available for a limited time only!",
        background: "/images/carousel/carousel-2.png",
    },
    {
        title: "Hydrate Boldly",
        description: "Stay fresh and fizz up your day with Topo Chico's signature mineral blend.",
        background: "/images/carousel/carousel-3.png",
    },
]

export default function AnniversarySwiper() {
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false)
        }, 1000)
        return () => clearTimeout(timer)
    }, [])

    return (
        <div className="w-full py-6 max-w-7xl mx-auto rounded-2xl">
            {isLoading ? (
                <div className="w-full h-[260px] rounded-2xl overflow-hidden bg-gray-200 animate-pulse shadow-lg relative" />
            ) : (
                <Swiper
                    modules={[Navigation, Pagination]}
                    loop={true}
                    centeredSlides={true}
                    spaceBetween={8}
                    pagination={{ clickable: true }}
                    className="w-full"
                >
                    {slides.map((slide, index) => (
                        <SwiperSlide key={index}>
                            <div
                                className="rounded-2xl h-[260px] flex overflow-hidden shadow-lg transition-all duration-300 bg-cover bg-center"
                                style={{ backgroundImage: `url(${slide.background})` }}
                            >
                                <div className="flex-1 p-6 text-white flex flex-col justify-center bg-black/30">
                                    <h2 className="text-lg md:text-xl font-bold mb-2">{slide.title}</h2>
                                    <p className="mb-3 text-xs md:text-sm">{slide.description}</p>
                                    <button className="bg-white text-black px-3 py-1.5 rounded-full font-semibold hover:bg-gray-200 transition w-fit text-xs">
                                        Let's Go
                                    </button>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    )
}
