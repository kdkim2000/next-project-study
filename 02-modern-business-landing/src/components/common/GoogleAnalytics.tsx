
// src/components/common/GoogleAnalytics.tsx
'use client'
import Script from 'next/script'

interface GoogleAnalyticsProps {
  GA_MEASUREMENT_ID: string
}

/**
 * Google Analytics 컴포넌트 (Client Component)
 * 실제 GA 스크립트를 로드하고 초기화
 */
const GoogleAnalytics = ({ GA_MEASUREMENT_ID }: GoogleAnalyticsProps) => {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `,
        }}
      />
    </>
  )
}

export default GoogleAnalytics