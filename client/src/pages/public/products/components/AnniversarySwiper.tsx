'use client'

import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Button } from '@/components/ui/button'



export default function AnniversarySwiper({ category }: { category: Category }) {
    const [isLoading, setIsLoading] = useState(true)
    const [slides, setSlides] = useState([])
    useEffect(() => {
        setSlides([{
            title: category?.category_name,
            description: category?.category_description,
            background: category?.category_image?.url,
            isActive: category?.category_image?.isActive
        }])
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
                                className="rounded-2xl h-[260px] relative flex overflow-hidden shadow-lg transition-all duration-300 bg-cover bg-center"
                                style={{ backgroundImage: `url(${slide.background})` }}
                            >
                                <div className="flex-1 p-6 text-white flex flex-col justify-center bg-black/30">

                                    <h2 className="absolute top-1 right-2 py-1 px-2 border rounded-lg text-white text-xl">{slide.title}</h2>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </div>
    )
}
