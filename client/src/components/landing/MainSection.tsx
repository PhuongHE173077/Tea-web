import LazyImage from '@/hooks/LazyImage';
import { useParallaxEffect, useScrollAnimation } from '@/hooks/useScrollAnimation';
import Reveal from '../Reveal';

export default function MainSection({ landingInfo }: { landingInfo: LandingPage }) {
    const [originRef, originVisible] = useScrollAnimation(0.2);
    const [processRef, processVisible] = useScrollAnimation(0.2);
    const [benefitsRef, benefitsVisible] = useScrollAnimation(0.2);
    const [collectionRef, collectionVisible] = useScrollAnimation(0.2);
    const parallaxOffset = useParallaxEffect();
    return (

        <main>
            {landingInfo?.mainSection?.map((mn, index) => {
                const [sectionRef, sectionVisible] = useScrollAnimation(0.2);

                const isEven = index % 2 === 0;

                return (
                    <Reveal key={index}>
                        <section id={`section-${index}`} className="container py-20" ref={sectionRef}>
                            <div className="grid md:grid-cols-2 gap-10 items-center">
                                {/* Nếu là even thì text bên trái, image bên phải */}
                                {isEven ? (
                                    <>
                                        <article
                                            className={`scroll-animate-left ${sectionVisible ? "is-visible" : ""}`}
                                        >
                                            <h2 className="font-display text-3xl md:text-4xl mb-4">{mn?.title}</h2>
                                            <p className="text-muted-foreground max-w-prose">{mn?.detail}</p>
                                        </article>

                                        <div
                                            className={`scroll-animate-right ${sectionVisible ? "is-visible" : ""} image-hover-zoom`}
                                        >
                                            <LazyImage
                                                src={mn?.imageCover}
                                                alt={mn?.title || "Image"}
                                                className="w-full h-[320px] md:h-[420px] rounded-xl border"
                                            />
                                        </div>
                                    </>
                                ) : (
                                    /* Odd thì đổi chỗ: image trái, text phải */
                                    <>
                                        <div
                                            className={`scroll-animate-left ${sectionVisible ? "is-visible" : ""} image-hover-zoom`}
                                        >
                                            <LazyImage
                                                src={mn?.imageCover}
                                                alt={mn?.title || "Image"}
                                                className="w-full h-[320px] md:h-[420px] rounded-xl border"
                                            />
                                        </div>

                                        <article
                                            className={`scroll-animate-right ${sectionVisible ? "is-visible" : ""}`}
                                        >
                                            <h2 className="font-display text-3xl md:text-4xl mb-4">{mn?.title}</h2>
                                            <p className="text-muted-foreground max-w-prose">{mn?.detail}</p>
                                        </article>
                                    </>
                                )}
                            </div>
                        </section>
                    </Reveal>
                );
            })}



        </main>
    )
}
