// src/components/ShareButton.tsx - 공유 버튼 컴포넌트 (클라이언트 전용)

'use client';

import React from 'react';
import { Button } from '@mui/material';
import { Share as ShareIcon } from '@mui/icons-material';

interface ShareButtonProps {
  title: string;
  text: string;
  url?: string;
}

/**
 * 🎯 클라이언트 컴포넌트 예시
 * 브라우저 API를 사용하는 기능은 클라이언트에서만 동작
 */
const ShareButton: React.FC<ShareButtonProps> = ({ title, text, url }) => {
  const handleShare = async () => {
    // 브라우저 환경에서만 실행
    if (typeof window === 'undefined') return;

    const shareUrl = url || window.location.href;
    
    try {
      // Web Share API 사용
      if (navigator.share) {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
      } else {
        // 폴백: 클립보드에 URL 복사
        await navigator.clipboard.writeText(shareUrl);
        alert('링크가 클립보드에 복사되었습니다!');
      }
    } catch (error) {
      console.log('공유 실패:', error);
      // 최후 수단: 직접 클립보드 복사 시도
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('링크가 클립보드에 복사되었습니다!');
      } catch (clipboardError) {
        console.error('클립보드 복사도 실패:', clipboardError);
        alert('공유에 실패했습니다. 브라우저가 지원하지 않을 수 있습니다.');
      }
    }
  };

  return (
    <Button
      variant="outlined"
      size="small"
      startIcon={<ShareIcon />}
      onClick={handleShare}
    >
      공유하기
    </Button>
  );
};

export default ShareButton;