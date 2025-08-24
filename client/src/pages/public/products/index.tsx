import React from 'react'
import { FloatingParticles } from './components/FloatingParticles'
import AnniversarySwiper from './components/AnniversarySwiper'
import { teas } from './mock-api'
import ProductCard from './components/ProductCard'
import MainSection from './components/MainSection'

export const Products = () => {
    return (
        <div className="min-h-screen  relative overflow-hidden">
            <FloatingParticles />
            <AnniversarySwiper />
            <MainSection />
        </div>
    )
}
