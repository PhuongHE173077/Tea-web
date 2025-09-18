// SEO utility functions for generating structured data

export const generateBlogStructuredData = (blog: Blog, siteUrl: string = window.location.origin) => {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blog.blog_title,
    "description": blog.blog_excerpt,
    "image": blog.blog_thumbnail?.url ? [blog.blog_thumbnail.url] : [],
    "author": {
      "@type": "Person",
      "name": blog.blog_author.usr_name,
      "image": blog.blog_author.usr_avatar,
      "url": `${siteUrl}/author/${blog.blog_author._id}`
    },
    "publisher": {
      "@type": "Organization",
      "name": "Tea Blog",
      "logo": {
        "@type": "ImageObject",
        "url": `${siteUrl}/logo.png`,
        "width": 200,
        "height": 60
      },
      "url": siteUrl
    },
    "datePublished": blog.blog_published_at || blog.createdAt,
    "dateModified": blog.updatedAt,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${blog.blog_slug}`
    },
    "keywords": blog.blog_tags.join(", "),
    "wordCount": blog.blog_content.split(/\s+/).length,
    "timeRequired": `PT${blog.blog_reading_time}M`,
    "articleSection": blog.blog_category?.category_name,
    "inLanguage": "vi-VN",
    "isAccessibleForFree": true,
    "genre": "Technology",
    "about": {
      "@type": "Thing",
      "name": blog.blog_category?.category_name || "Tea"
    }
  };
};

export const generateBreadcrumbStructuredData = (items: Array<{name: string, url: string}>) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};

export const generateWebsiteStructuredData = (siteUrl: string = window.location.origin) => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Tea Blog",
    "url": siteUrl,
    "description": "Blog về trà và văn hóa trà Việt Nam",
    "inLanguage": "vi-VN",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${siteUrl}/blog?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
};

export const generateOrganizationStructuredData = (siteUrl: string = window.location.origin) => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Tea Blog",
    "url": siteUrl,
    "logo": `${siteUrl}/logo.png`,
    "description": "Blog về trà và văn hóa trà Việt Nam",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "Vietnamese"
    },
    "sameAs": [
      // Add social media URLs here
      // "https://facebook.com/teablog",
      // "https://twitter.com/teablog"
    ]
  };
};

// Generate meta tags for social sharing
export const generateSocialMetaTags = (blog: Blog) => {
  const baseUrl = window.location.origin;
  const blogUrl = `${baseUrl}/blog/${blog.blog_slug}`;
  
  return {
    // Open Graph
    'og:title': blog.blog_meta?.title || blog.blog_title,
    'og:description': blog.blog_meta?.description || blog.blog_excerpt,
    'og:image': blog.blog_thumbnail?.url || `${baseUrl}/default-blog-image.jpg`,
    'og:url': blogUrl,
    'og:type': 'article',
    'og:site_name': 'Tea Blog',
    'og:locale': 'vi_VN',
    
    // Article specific
    'article:author': blog.blog_author.usr_name,
    'article:published_time': blog.blog_published_at || blog.createdAt,
    'article:modified_time': blog.updatedAt,
    'article:section': blog.blog_category?.category_name,
    'article:tag': blog.blog_tags,
    
    // Twitter Card
    'twitter:card': 'summary_large_image',
    'twitter:title': blog.blog_title,
    'twitter:description': blog.blog_excerpt,
    'twitter:image': blog.blog_thumbnail?.url || `${baseUrl}/default-blog-image.jpg`,
    'twitter:url': blogUrl,
    
    // Basic meta
    'description': blog.blog_meta?.description || blog.blog_excerpt,
    'keywords': blog.blog_meta?.keywords?.join(', ') || blog.blog_tags.join(', '),
    'author': blog.blog_author.usr_name,
    'robots': 'index, follow',
    'canonical': blogUrl
  };
};

// Generate title for different pages
export const generatePageTitle = (pageTitle: string, siteName: string = 'Tea Blog') => {
  return `${pageTitle} | ${siteName}`;
};

// Generate meta description with optimal length
export const generateMetaDescription = (description: string, maxLength: number = 160) => {
  if (description.length <= maxLength) {
    return description;
  }
  
  const truncated = description.substring(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
};
