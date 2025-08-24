import AboutSection from "@/components/landing/AboutSection"
import BlogSection from "@/components/landing/BlogSection"
import EventSection from "@/components/landing/EventSection"
import Footer from "@/components/landing/Footer"
import Header from "@/components/landing/Header"
import Hero from "@/components/landing/Hero"
import MainSection from "@/components/landing/MainSection"
import TeaCarousel from "@/components/landing/TeaCarousel"
import { motion } from 'framer-motion'

const Index = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-green-50 to-emerald-100">

      <Hero />
      {/* <div className="w-full max-w-5xl mx-auto">
        <div className="relative w-full overflow-hidden rounded-xl shadow-lg aspect-video">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/3-4vIejDFkE?autoplay=1&mute=1`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div> */}
      <AboutSection />

      <MainSection />
      <EventSection />
      <TeaCarousel />
      <BlogSection />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-8 right-8 z-40"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-white text-white p-4 rounded-full shadow-2xl flex items-center justify-center"
        >
          <img src="/images/icon/zalo-icon.svg" alt="Cart" className="w-6 h-6" />
        </motion.button>
      </motion.div>

    </main>
  )
}

export default Index