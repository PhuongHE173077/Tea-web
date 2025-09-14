import { Card, CardContent } from "@/components/ui/card"
import { Leaf, Heart, Award, Globe } from "lucide-react"
import Reveal from "../Reveal"

const features = [
  {
    icon: Leaf,
    title: "Nguồn Gốc Tự Nhiên",
    description: "Trà được trồng và chăm sóc hoàn toàn tự nhiên, không sử dụng hóa chất độc hại"
  },
  {
    icon: Heart,
    title: "Đam Mê Chất Lượng",
    description: "Mỗi lá trà đều được tuyển chọn kỹ lưỡng với tình yêu và sự tận tâm"
  },
  {
    icon: Award,
    title: "Giải Thưởng Quốc Tế",
    description: "Được công nhận bởi các tổ chức uy tín về chất lượng trà cao cấp"
  },
  {
    icon: Globe,
    title: "Phục Vụ Toàn Cầu",
    description: "Mang hương vị trà Việt Nam đến với những người yêu trà trên khắp thế giới"
  }
]

const AboutSection = ({ landingInfo }: { landingInfo: LandingPage }) => {
  return (
    <Reveal>
      <section id="gioi-thieu" className="pt-20 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl  font-bold mb-4 text-foreground">
              {landingInfo?.aboutSection?.title}
            </h2>
            <p className="text-xl  text-muted-foreground max-w-3xl mx-auto">
              {landingInfo?.aboutSection?.detail}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {landingInfo?.aboutSection?.attribute?.map((feature, index) => (
              <Card key={index} className="group bg-secondary/60 backdrop-blur border-border/50 hover:shadow-elegant transition-all duration-500">
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    {feature.icon && <img
                      src={feature.icon}
                      alt={feature.title}
                      className="w-16 h-16 object-cover group-hover:scale-105 transition-transform duration-500"
                    />}
                  </div>
                  <h3 className="font-bold text-xl mb-3 text-foreground group-hover:text-tea-green transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground  leading-relaxed">
                    {feature.detail}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Reveal>
  )
}

export default AboutSection