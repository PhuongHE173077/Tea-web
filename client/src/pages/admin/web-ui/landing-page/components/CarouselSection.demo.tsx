import React from 'react'
import { CarouselSection } from './CarouselSection'
import { AddCarouselItemDialog } from './AddCarouselItemDialog'

// Demo data for testing
const demoData: LandingPageCarousel = {
    title: "Bộ sưu tập trà cao cấp",
    detail: "Khám phá những loại trà tuyệt vời nhất từ khắp nơi trên thế giới",
    carouselList: [
        {
            title: "Trà Xanh Sencha",
            detail: "Trà xanh Nhật Bản với hương vị tươi mát và thanh khiết",
            imageCover: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500",
            tab: "Trà Xanh"
        },
        {
            title: "Trà Đen Earl Grey",
            detail: "Trà đen cổ điển với hương bergamot đặc trưng",
            imageCover: "https://images.unsplash.com/photo-1597318181409-cf64d0b3c200?w=500",
            tab: "Trà Đen"
        },
        {
            title: "Trà Oolong Đài Loan",
            detail: "Trà oolong cao cấp với hương vị phức tạp và tinh tế",
            imageCover: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500",
            tab: "Trà Oolong"
        }
    ],
    isActive: true
}

export function CarouselSectionDemo() {
    const handleUpdate = async (data: Partial<LandingPageCarousel>) => {
        console.log('Updating carousel data:', data)
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Update completed')
                resolve(data)
            }, 1000)
        })
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Demo CarouselSection Component</h1>
            <CarouselSection
                data={demoData}
                onUpdate={handleUpdate}
                loading={false}
            />
        </div>
    )
}

export default CarouselSectionDemo
