import { fetchCategoriesAPIs } from "@/apis/category.apis"
import { fetchCompanyInfosAPIs } from "@/apis/company-info.apis"
import { getLandingPageAPI } from "@/apis/landing-page.apis"
import AboutSection from "@/components/landing/AboutSection"
import BlogSection from "@/components/landing/BlogSection"
import EventSection from "@/components/landing/EventSection"
import Footer from "@/components/landing/Footer"
import Header from "@/components/landing/Header"
import Hero from "@/components/landing/Hero"
import MainSection from "@/components/landing/MainSection"
import TeaCarousel from "@/components/landing/TeaCarousel"
import { motion } from 'framer-motion'
import { useEffect, useState } from "react"

const LandingPage = () => {
  const [landingInfo, setLandingInfo] = useState<LandingPage>()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    getLandingPageAPI().then(res => {
      setLandingInfo(res.data.data)
    })
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }


  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-green-50 to-emerald-100">

      <Hero landingInfo={landingInfo} />

      <AboutSection landingInfo={landingInfo} />
      {landingInfo?.video && landingInfo?.video.url && landingInfo.video.isActive && <div className="w-full max-w-5xl mx-auto">
        <div className="relative w-full overflow-hidden rounded-xl shadow-lg aspect-video">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={landingInfo.video.url}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>}

      {landingInfo?.mainSection && <MainSection landingInfo={landingInfo} />}
      {landingInfo?.eventSection && landingInfo.eventSection.isActive && <EventSection landingInfo={landingInfo} />}
      {landingInfo?.carousel && landingInfo.carousel.isActive && <TeaCarousel landingInfo={landingInfo} />}
      <BlogSection />
    </main>
  )
}

export default LandingPage