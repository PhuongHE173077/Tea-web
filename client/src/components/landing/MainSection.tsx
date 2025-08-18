import LazyImage from '@/hooks/LazyImage';
import { useParallaxEffect, useScrollAnimation } from '@/hooks/useScrollAnimation';
import Reveal from '../Reveal';

export default function MainSection() {
    const [originRef, originVisible] = useScrollAnimation(0.2);
    const [processRef, processVisible] = useScrollAnimation(0.2);
    const [benefitsRef, benefitsVisible] = useScrollAnimation(0.2);
    const [collectionRef, collectionVisible] = useScrollAnimation(0.2);
    const parallaxOffset = useParallaxEffect();
    return (

        <main>
            <Reveal>
                <section id="origin" className="container py-20" ref={originRef}>
                    <div className="grid md:grid-cols-2 gap-10 items-center">
                        <article className={`order-2 md:order-1 scroll-animate-left ${originVisible ? 'is-visible' : ''}`}>
                            <h2 className="font-display text-3xl md:text-4xl mb-4">Nguồn gốc tự nhiên</h2>
                            <p className="text-muted-foreground max-w-prose">
                                Lá trà được thu hái từ những đồi trà lâu năm, hấp thụ sương sớm và nắng mai. Chúng tôi chỉ chọn những búp non tinh khiết nhất để tạo nên hương vị thanh tao.
                            </p>
                        </article>
                        <div className={`order-1 md:order-2 scroll-animate-right ${originVisible ? 'is-visible' : ''} image-hover-zoom`}>
                            <LazyImage
                                src={'/images/leaf-macro.png'}
                                alt="Cận cảnh lá trà tươi với giọt sương"
                                className="w-full h-[320px] md:h-[420px] rounded-xl border"
                            />
                        </div>
                    </div>
                </section>
            </Reveal>
            <Reveal>
                <section id="process" className="container py-20" ref={processRef}>
                    <div className="grid md:grid-cols-2 gap-10 items-center">
                        <div className={`scroll-animate-left ${processVisible ? 'is-visible' : ''} image-hover-zoom`}>
                            <LazyImage
                                src={'/images/cup.png'}
                                alt="Tách trà xanh nóng trên khay gỗ"
                                className="w-full h-[320px] md:h-[420px] rounded-xl border shadow-elevate"
                            />
                        </div>
                        <article className={`scroll-animate-right ${processVisible ? 'is-visible' : ''}`}>
                            <h2 className="font-display text-3xl md:text-4xl mb-4">Quy trình thủ công</h2>
                            <p className="text-muted-foreground max-w-prose">
                                Từ sao, sấy đến ủ hương, mọi công đoạn đều được nghệ nhân thực hiện tỉ mỉ. Chính sự cầu kỳ này tạo nên vị ngọt hậu, hương thơm tinh tế và cảm giác thư thái.
                            </p>
                        </article>
                    </div>
                </section>
            </Reveal>




        </main>
    )
}
