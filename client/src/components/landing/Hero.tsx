import { Button } from "@/components/ui/button"
import { ArrowDown, Sparkles } from "lucide-react"
import heroImage from "@/assets/hero-tea.jpg"
import Reveal from "../Reveal"
import { useEffect, useMemo, useState } from "react"

const Hero = () => {
  const [spotlight, setSpotlight] = useState({ x: 50, y: 40 });

  const heroStyle = useMemo(() => ({
    background: `radial-gradient(600px 400px at ${spotlight.x}% ${spotlight.y}%, hsl(var(--accent) / 0.18), transparent 60%)`
  }), [spotlight]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const target = document.getElementById("hero");
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setSpotlight({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
    };
    const heroEl = document.getElementById("hero");
    heroEl?.addEventListener("mousemove", onMove);
    return () => heroEl?.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section id="hero" className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={heroStyle} />
      <div className="container grid lg:grid-cols-2 gap-10 items-center py-16 lg:py-24">
        <Reveal>
          <div className="space-y-6">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl leading-tight">
              Trà Thượng Hạng – Trải nghiệm tinh hoa trà Việt
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl">
              Bộ sưu tập trà tuyển chọn: Oolong, Trà xanh, Trà sen với hương vị tinh tế, đóng gói sang trọng, phù hợp làm quà biếu và thưởng thức mỗi ngày.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="lg">Khám phá bộ sưu tập</Button>
              <Button size="lg">Tìm hiểu thêm</Button>
            </div>
            <div className="flex items-center gap-6 pt-2 text-sm text-muted-foreground">
              <div>Giao nhanh 24-48h</div>
              <div>Miễn phí đổi trả 7 ngày</div>
              <div>Đóng gói quà tặng</div>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="relative">
            <img
              src={'/images/hero-tea.png'}
              alt="Nghệ thuật thưởng trà sang trọng với ấm chén và lá trà"
              className="w-full h-auto rounded-xl shadow-elegant hover-scale"
              loading="eager"
              decoding="async"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default Hero