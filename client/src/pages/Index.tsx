import Header from "@/components/landing/Header"
import Hero from "@/components/landing/Hero"
import AboutSection from "@/components/landing/AboutSection"
import TeaCarousel from "@/components/landing/TeaCarousel"
import BlogSection from "@/components/landing/BlogSection"
import Footer from "@/components/landing/Footer"
import MainSection from "@/components/landing/MainSection"

const Index = () => {
  return (
    <main className="min-h-screen bg-background">

      <Header />
      <Hero />
      <AboutSection />
      <MainSection />
      <TeaCarousel />
      <BlogSection />
      <Footer />
    </main>
  )
}

export default Index