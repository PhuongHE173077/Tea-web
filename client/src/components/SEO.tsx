import React, { useEffect } from 'react';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogUrl?: string;
    ogType?: string;
    twitterCard?: string;
    twitterTitle?: string;
    twitterDescription?: string;
    twitterImage?: string;
    // Structured data for articles
    article?: {
        author?: string;
        publishedTime?: string;
        modifiedTime?: string;
        section?: string;
        tags?: string[];
    };
    // JSON-LD structured data
    structuredData?: any;
}

const SEO: React.FC<SEOProps> = ({
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    ogUrl,
    ogType = 'website',
    twitterCard = 'summary_large_image',
    twitterTitle,
    twitterDescription,
    twitterImage,
    article,
    structuredData
}) => {
    useEffect(() => {
        // Update document title
        if (title) {
            document.title = title;
        }

        // Update meta tags
        const updateMetaTag = (name: string, content: string, property?: boolean) => {
            if (!content) return;
            
            const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
            let meta = document.querySelector(selector) as HTMLMetaElement;
            
            if (!meta) {
                meta = document.createElement('meta');
                if (property) {
                    meta.setAttribute('property', name);
                } else {
                    meta.setAttribute('name', name);
                }
                document.head.appendChild(meta);
            }
            
            meta.setAttribute('content', content);
        };

        // Basic meta tags
        updateMetaTag('description', description || '');
        updateMetaTag('keywords', keywords || '');

        // Open Graph tags
        updateMetaTag('og:title', ogTitle || title || '', true);
        updateMetaTag('og:description', ogDescription || description || '', true);
        updateMetaTag('og:image', ogImage || '', true);
        updateMetaTag('og:url', ogUrl || window.location.href, true);
        updateMetaTag('og:type', ogType, true);

        // Twitter Card tags
        updateMetaTag('twitter:card', twitterCard);
        updateMetaTag('twitter:title', twitterTitle || ogTitle || title || '');
        updateMetaTag('twitter:description', twitterDescription || ogDescription || description || '');
        updateMetaTag('twitter:image', twitterImage || ogImage || '');

        // Article meta tags (for blog posts)
        if (article && ogType === 'article') {
            updateMetaTag('article:author', article.author || '', true);
            updateMetaTag('article:published_time', article.publishedTime || '', true);
            updateMetaTag('article:modified_time', article.modifiedTime || '', true);
            updateMetaTag('article:section', article.section || '', true);

            // Article tags
            if (article.tags) {
                // Remove existing article:tag meta tags
                const existingTags = document.querySelectorAll('meta[property="article:tag"]');
                existingTags.forEach(tag => tag.remove());

                // Add new article:tag meta tags
                article.tags.forEach(tag => {
                    const meta = document.createElement('meta');
                    meta.setAttribute('property', 'article:tag');
                    meta.setAttribute('content', tag);
                    document.head.appendChild(meta);
                });
            }
        }

        // JSON-LD Structured Data
        const updateStructuredData = () => {
            // Remove existing JSON-LD script
            const existingScript = document.querySelector('script[type="application/ld+json"]');
            if (existingScript) {
                existingScript.remove();
            }

            if (structuredData) {
                const script = document.createElement('script');
                script.type = 'application/ld+json';
                script.textContent = JSON.stringify(structuredData);
                document.head.appendChild(script);
            }
        };

        updateStructuredData();

        // Cleanup function to remove meta tags when component unmounts
        return () => {
            // Optional: Remove meta tags when component unmounts
            // This might not be necessary in most cases
        };
    }, [
        title,
        description,
        keywords,
        ogTitle,
        ogDescription,
        ogImage,
        ogUrl,
        ogType,
        twitterCard,
        twitterTitle,
        twitterDescription,
        twitterImage,
        article,
        structuredData
    ]);

    return null; // This component doesn't render anything
};

export default SEO;
