import React, { useEffect, useState } from 'react'
import { FloatingParticles } from './components/FloatingParticles'
import AnniversarySwiper from './components/AnniversarySwiper'
import ProductCard from './components/ProductCard'
import MainSection from './components/MainSection'
import { useParams } from 'react-router-dom'
import { fetchCategoryBySlugAPIs } from '@/apis/category.apis'

export const Products = () => {
    const { slug } = useParams();
    const [category, setCategory] = useState<Category>(null)

    useEffect(() => {
        if (slug) {
            fetchCategoryBySlugAPIs(slug).then(res => {
                setCategory(res.data)
            })
        }
    }, [slug])

    return (
        <div className="min-h-screen  relative overflow-hidden">
            <FloatingParticles />
            {category && category.category_image && category.category_image.isActive
                && category.category_image.url
                && <AnniversarySwiper category={category} />}
            <MainSection />
        </div>
    )
}
