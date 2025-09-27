---
title: "스마트한 읽기 시간 계산 시스템 - 다국어 지원부터 개인화까지"
date: "2024-01-25"
description: "단순한 단어 수 기반 계산을 넘어서, 언어별 특성을 고려하고 사용자의 읽기 속도를 학습하는 지능형 읽기 시간 계산 시스템을 구축해봅니다."
keywords: ["reading-time", "text-analysis", "user-experience", "internationalization", "personalization"]
---

# 스마트한 읽기 시간 계산 시스템

읽기 시간 표시는 사용자가 콘텐츠를 소비할지 결정하는 중요한 지표입니다. 하지만 단순한 "단어 수 ÷ 200"을 넘어서, 언어의 특성과 콘텐츠의 복잡도, 그리고 개별 사용자의 읽기 습관까지 고려한 정교한 시스템을 구축해봅시다.

## 기본 읽기 시간 계산 이해

### 언어별 읽기 속도 차이
```typescript
// lib/reading-speed-constants.ts
export const READING_SPEEDS = {
  // 분당 단어/글자 수
  korean: {
    charactersPerMinute: 500,  // 한글 글자
    wordsPerMinute: 250        // 한글 단어 (띄어쓰기 기준)
  },
  english: {
    wordsPerMinute: 200,       // 영어 단어
    charactersPerMinute: 1000  // 영어 글자 (참고용)
  },
  japanese: {
    charactersPerMinute: 400,  // 일본어 글자
    wordsPerMinute: 200
  },
  chinese: {
    charactersPerMinute: 300,  // 중국어 글자
    wordsPerMinute: 150
  }
} as const;

// 콘텐츠 복잡도에 따른 조정 계수
export const COMPLEXITY_FACTORS = {
  technical: 0.7,      // 기술 문서는 70% 속도
  academic: 0.6,       // 학술 문서는 60% 속도  
  casual: 1.0,         // 일반 블로그는 100% 속도
  news: 1.2,           // 뉴스는 120% 속도
  fiction: 1.1         // 소설은 110% 속도
} as const;
```

### 고급 텍스트 분석
```typescript
// lib/text-analyzer.ts
interface TextAnalysis {
  koreanChars: number;
  englishWords: number;
  codeBlocks: number;
  mathFormulas: number;
  lists: number;
  images: number;
  complexity: keyof typeof COMPLEXITY_FACTORS;
  sentences: number;
  avgSentenceLength: number;
}

export function analyzeText(content: string): TextAnalysis {
  // HTML 및 마크다운 태그 제거
  const cleanText = stripMarkdown(content);
  
  // 언어별 텍스트 분석
  const koreanChars = (cleanText.match(/[가-힣]/g) || []).length;
  const englishWords = (cleanText.match(/[a-zA-Z]+/g) || []).length;
  
  // 특수 요소들 분석
  const codeBlocks = (content.match(/```[\s\S]*?```/g) || []).length;
  const mathFormulas = (content.match(/\$[\s\S]*?\$/g) || []).length;
  const lists = (content.match(/^[\s]*[-*+]\s/gm) || []).length;
  const images = (content.match(/!\[.*?\]\(.*?\)/g) || []).length;
  
  // 문장 구조 분석
  const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.length > 0 
    ? cleanText.length / sentences.length 
    : 0;
  
  // 복잡도 추정
  const complexity = estimateComplexity(content, {
    avgSentenceLength,
    codeBlocks,
    mathFormulas,
    technicalTerms: countTechnicalTerms(cleanText)
  });
  
  return {
    koreanChars,
    englishWords,
    codeBlocks,
    mathFormulas,
    lists,
    images,
    complexity,
    sentences: sentences.length,
    avgSentenceLength
  };
}

function stripMarkdown(markdown: string): string {
  return markdown
    // 코드 블록 제거
    .replace(/```[\s\S]*?```/g, '')
    // 인라인 코드 제거
    .replace(/`[^`]+`/g, '')
    // 링크에서 텍스트만 추출
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // 이미지 제거
    .replace(/!\[.*?\]\(.*?\)/g, '')
    // 헤더 마크다운 제거
    .replace(/^#+\s*/gm, '')
    // HTML 태그 제거
    .replace(/<[^>]*>/g, '')
    // 여러 공백을 하나로
    .replace(/\s+/g, ' ')
    .trim();
}

function estimateComplexity(
  content: string, 
  metrics: {
    avgSentenceLength: number;
    codeBlocks: number;
    mathFormulas: number;
    technicalTerms: number;
  }
): keyof typeof COMPLEXITY_FACTORS {
  let complexityScore = 0;
  
  // 문장 길이가 길수록 복잡
  if (metrics.avgSentenceLength > 100) complexityScore += 2;
  else if (metrics.avgSentenceLength > 80) complexityScore += 1;
  
  // 코드 블록 존재
  if (metrics.codeBlocks > 0) complexityScore += 2;
  
  // 수식 존재
  if (metrics.mathFormulas > 0) complexityScore += 2;
  
  // 기술 용어 빈도
  if (metrics.technicalTerms > 10) complexityScore += 2;
  else if (metrics.technicalTerms > 5) complexityScore += 1;
  
  // 복잡도 분류
  if (complexityScore >= 5) return 'academic';
  if (complexityScore >= 3) return 'technical';
  if (complexityScore >= 1) return 'casual';
  return 'casual';
}

function countTechnicalTerms(text: string): number {
  const technicalTerms = [
    'api', 'database', 'algorithm', 'function', 'variable',
    'component', 'framework', 'library', 'interface', 'protocol',
    '데이터베이스', '알고리즘', '함수', '변수', '컴포넌트',
    '프레임워크', '라이브러리', '인터페이스', '프로토콜'
  ];
  
  const lowerText = text.toLowerCase();
  return technicalTerms.reduce((count, term) => 
    count + (lowerText.split(term).length - 1), 0
  );
}
```

## 향상된 읽기 시간 계산

### 멀티언어 계산 엔진
```typescript
// lib/advanced-reading-time.ts
export interface ReadingTimeResult {
  minutes: number;
  seconds: number;
  text: string;
  details: {
    koreanTime: number;
    englishTime: number;
    codeTime: number;
    imageTime: number;
    totalWords: number;
    totalChars: number;
    complexity: string;
  };
}

export function calculateAdvancedReadingTime(
  content: string,
  userPreferences?: {
    readingSpeed?: number; // 사용자 개별 속도 (기본값 대비 배율)
    skipImages?: boolean;
    includeCode?: boolean;
  }
): ReadingTimeResult {
  const analysis = analyzeText(content);
  const prefs = {
    readingSpeed: 1.0,
    skipImages: false,
    includeCode: true,
    ...userPreferences
  };
  
  // 언어별 읽기 시간 계산
  const koreanTime = analysis.koreanChars / READING_SPEEDS.korean.charactersPerMinute;
  const englishTime = analysis.englishWords / READING_SPEEDS.english.wordsPerMinute;
  
  // 특수 콘텐츠 시간 추가
  const codeTime = prefs.includeCode 
    ? analysis.codeBlocks * 0.5  // 코드 블록 당 30초
    : 0;
  
  const imageTime = prefs.skipImages 
    ? 0 
    : analysis.images * 0.25;    // 이미지 당 15초
  
  const mathTime = analysis.mathFormulas * 0.5; // 수식 당 30초
  
  // 기본 읽기 시간 합계
  let baseTime = koreanTime + englishTime + codeTime + imageTime + mathTime;
  
  // 복잡도 조정
  const complexityFactor = COMPLEXITY_FACTORS[analysis.complexity];
  baseTime = baseTime / complexityFactor;
  
  // 사용자 개별 속도 조정
  baseTime = baseTime / prefs.readingSpeed;
  
  // 최소 시간 보장 (너무 짧지 않게)
  const finalMinutes = Math.max(1, Math.round(baseTime));
  const finalSeconds = Math.round((baseTime % 1) * 60);
  
  return {
    minutes: finalMinutes,
    seconds: finalSeconds,
    text: formatReadingTime(finalMinutes, finalSeconds),
    details: {
      koreanTime: Math.round(koreanTime * 60), // 초 단위
      englishTime: Math.round(englishTime * 60),
      codeTime: Math.round(codeTime * 60),
      imageTime: Math.round(imageTime * 60),
      totalWords: analysis.englishWords,
      totalChars: analysis.koreanChars,
      complexity: analysis.complexity
    }
  };
}

function formatReadingTime(minutes: number, seconds: number): string {
  if (minutes === 0) {
    return `${seconds}초`;
  } else if (seconds === 0) {
    return `${minutes}분`;
  } else {
    return `${minutes}분 ${seconds}초`;
  }
}
```

### 사용자 맞춤형 읽기 속도 학습
```typescript
// lib/reading-speed-learner.ts
interface ReadingSession {
  postSlug: string;
  startTime: Date;
  endTime: Date;
  estimatedTime: number;    // 초 단위
  actualTime: number;       // 초 단위
  completed: boolean;       // 끝까지 읽었는지
  wordsRead: number;
  complexity: string;
}

export class ReadingSpeedLearner {
  private sessions: ReadingSession[] = [];
  
  constructor() {
    this.loadSessionsFromStorage();
  }
  
  startReading(postSlug: string, estimatedTime: number, wordCount: number): void {
    const session: ReadingSession = {
      postSlug,
      startTime: new Date(),
      endTime: new Date(),
      estimatedTime,
      actualTime: 0,
      completed: false,
      wordsRead: wordCount,
      complexity: 'casual'
    };
    
    this.sessions.push(session);
    this.saveSessionsToStorage();
  }
  
  endReading(postSlug: string, completed: boolean = true): void {
    const session = this.sessions.find(s => 
      s.postSlug === postSlug && 
      s.actualTime === 0
    );
    
    if (session) {
      session.endTime = new Date();
      session.actualTime = (session.endTime.getTime() - session.startTime.getTime()) / 1000;
      session.completed = completed;
      
      this.saveSessionsToStorage();
    }
  }
  
  getUserReadingSpeed(): number {
    const completedSessions = this.sessions.filter(s => s.completed);
    
    if (completedSessions.length < 3) {
      return 1.0; // 기본값
    }
    
    // 최근 10개 세션만 고려
    const recentSessions = completedSessions.slice(-10);
    
    let totalSpeedRatio = 0;
    recentSessions.forEach(session => {
      const speedRatio = session.estimatedTime / session.actualTime;
      totalSpeedRatio += speedRatio;
    });
    
    const avgSpeedRatio = totalSpeedRatio / recentSessions.length;
    
    // 극단적인 값 필터링 (0.3 ~ 3.0 사이로 제한)
    return Math.max(0.3, Math.min(3.0, avgSpeedRatio));
  }
  
  getReadingStats() {
    const completedSessions = this.sessions.filter(s => s.completed);
    
    return {
      totalArticlesRead: completedSessions.length,
      totalTimeSpent: completedSessions.reduce((sum, s) => sum + s.actualTime, 0),
      averageAccuracy: this.calculateAccuracyRate(),
      preferredComplexity: this.getPreferredComplexity(),
      readingSpeed: this.getUserReadingSpeed()
    };
  }
  
  private calculateAccuracyRate(): number {
    const completedSessions = this.sessions.filter(s => s.completed);
    
    if (completedSessions.length === 0) return 0;
    
    let accuracySum = 0;
    completedSessions.forEach(session => {
      const accuracy = Math.abs(1 - Math.abs(session.estimatedTime - session.actualTime) / session.estimatedTime);
      accuracySum += Math.max(0, accuracy);
    });
    
    return accuracySum / completedSessions.length;
  }
  
  private getPreferredComplexity(): string {
    const complexityCounts = this.sessions.reduce((counts, session) => {
      counts[session.complexity] = (counts[session.complexity] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
    
    return Object.entries(complexityCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'casual';
  }
  
  private saveSessionsToStorage(): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('readingSessions', JSON.stringify(this.sessions));
    }
  }
  
  private loadSessionsFromStorage(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('readingSessions');
      if (stored) {
        this.sessions = JSON.parse(stored).map((s: any) => ({
          ...s,
          startTime: new Date(s.startTime),
          endTime: new Date(s.endTime)
        }));
      }
    }
  }
}
```

## 시각적 읽기 진행률 표시

### 읽기 진행률 컴포넌트
```typescript
// components/ReadingProgress.tsx
"use client";

import { useState, useEffect } from 'react';
import { LinearProgress, Typography, Box } from '@mui/material';
import { ReadingTimeResult } from '@/lib/advanced-reading-time';

interface ReadingProgressProps {
  readingTime: ReadingTimeResult;
  content: string;
  onReadingComplete?: () => void;
}

export default function ReadingProgress({ 
  readingTime, 
  content,
  onReadingComplete 
}: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isReading, setIsReading] = useState(false);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.min(100, (scrollTop / docHeight) * 100);
      
      setProgress(scrollPercent);
      
      if (scrollPercent > 10 && !isReading) {
        setIsReading(true);
        interval = setInterval(() => {
          setTimeSpent(prev => prev + 1);
        }, 1000);
      }
      
      if (scrollPercent > 90 && onReadingComplete) {
        onReadingComplete();
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (interval) clearInterval(interval);
    };
  }, [isReading, onReadingComplete]);
  
  const estimatedSeconds = readingTime.minutes * 60 + readingTime.seconds;
  const remainingTime = Math.max(0, estimatedSeconds - timeSpent);
  
  return (
    <Box className="reading-progress">
      <div className="progress-bar">
        <LinearProgress 
          variant="determinate" 
          value={progress}
          sx={{
            height: 4,
            backgroundColor: 'rgba(0,0,0,0.1)',
            '& .MuiLinearProgress-bar': {
              backgroundColor: 'primary.main'
            }
          }}
        />
      </div>
      
      <div className="reading-stats">
        <Typography variant="caption">
          진행률: {Math.round(progress)}%
        </Typography>
        
        <Typography variant="caption">
          남은 시간: {formatTime(remainingTime)}
        </Typography>
        
        {timeSpent > estimatedSeconds && (
          <Typography variant="caption" color="text.secondary">
            예상보다 {formatTime(timeSpent - estimatedSeconds)} 더 걸림
          </Typography>
        )}
      </div>
    </Box>
  );
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  if (mins === 0) return `${secs}초`;
  return `${mins}분 ${secs}초`;
}
```

### 읽기 통계 대시보드
```typescript
// components/ReadingStatsDashboard.tsx
"use client";

import { useEffect, useState } from 'react';
import { ReadingSpeedLearner } from '@/lib/reading-speed-learner';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  LinearProgress,
  Chip
} from '@mui/material';
import { 
  TimerIcon, 
  BookOpenIcon, 
  TrendingUpIcon,
  TargetIcon 
} from '@mui/icons-material';

export default function ReadingStatsDashboard() {
  const [stats, setStats] = useState<any>(null);
  const learner = new ReadingSpeedLearner();
  
  useEffect(() => {
    setStats(learner.getReadingStats());
  }, []);
  
  if (!stats) return null;
  
  const speedDescription = getSpeedDescription(stats.readingSpeed);
  const accuracyPercentage = Math.round(stats.averageAccuracy * 100);
  
  return (
    <Card className="reading-stats-dashboard">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          나의 읽기 통계
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <div className="stat-item">
              <BookOpenIcon color="primary" />
              <Typography variant="h4">{stats.totalArticlesRead}</Typography>
              <Typography variant="caption">완독한 글</Typography>
            </div>
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <div className="stat-item">
              <TimerIcon color="primary" />
              <Typography variant="h4">
                {Math.round(stats.totalTimeSpent / 3600)}h
              </Typography>
              <Typography variant="caption">총 읽기 시간</Typography>
            </div>
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <div className="stat-item">
              <TrendingUpIcon color="primary" />
              <Typography variant="h4">{speedDescription.multiplier}</Typography>
              <Typography variant="caption">{speedDescription.text}</Typography>
            </div>
          </Grid>
          
          <Grid item xs={6} sm={3}>
            <div className="stat-item">
              <TargetIcon color="primary" />
              <Typography variant="h4">{accuracyPercentage}%</Typography>
              <Typography variant="caption">예측 정확도</Typography>
            </div>
          </Grid>
        </Grid>
        
        <div className="accuracy-progress">
          <Typography variant="body2" gutterBottom>
            시간 예측 정확도
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={accuracyPercentage}
            color={accuracyPercentage > 70 ? 'success' : 'warning'}
          />
        </div>
        
        <div className="preferred-complexity">
          <Typography variant="body2" gutterBottom>
            선호하는 글 유형
          </Typography>
          <Chip 
            label={getComplexityLabel(stats.preferredComplexity)} 
            color="primary" 
            variant="outlined" 
          />
        </div>
      </CardContent>
    </Card>
  );
}

function getSpeedDescription(speed: number) {
  if (speed > 1.5) return { multiplier: '1.5x', text: '빠른 독자' };
  if (speed > 1.2) return { multiplier: '1.2x', text: '평균 이상' };
  if (speed < 0.8) return { multiplier: '0.8x', text: '신중한 독자' };
  return { multiplier: '1.0x', text: '평균 속도' };
}

function getComplexityLabel(complexity: string): string {
  const labels = {
    casual: '일반 글',
    technical: '기술 문서',
    academic: '학술 논문',
    news: '뉴스',
    fiction: '소설'
  };
  return labels[complexity as keyof typeof labels] || '일반 글';
}
```

## A/B 테스트 및 최적화

### 읽기 시간 표시 최적화
```typescript
// lib/reading-time-experiments.ts
interface ExperimentVariant {
  id: string;
  displayFormat: (time: ReadingTimeResult) => string;
  showDetails: boolean;
  position: 'header' | 'sidebar' | 'footer';
}

const READING_TIME_EXPERIMENTS: ExperimentVariant[] = [
  {
    id: 'simple',
    displayFormat: (time) => `${time.minutes}분 읽기`,
    showDetails: false,
    position: 'header'
  },
  {
    id: 'detailed',
    displayFormat: (time) => `읽기 시간: ${time.text} (${time.details.totalWords}단어)`,
    showDetails: true,
    position: 'header'
  },
  {
    id: 'range',
    displayFormat: (time) => `${Math.max(1, time.minutes - 1)}-${time.minutes + 1}분`,
    showDetails: false,
    position: 'sidebar'
  },
  {
    id: 'emoji',
    displayFormat: (time) => `📖 ${time.minutes}분`,
    showDetails: false,
    position: 'header'
  }
];

export function getExperimentVariant(userId: string): ExperimentVariant {
  // 사용자 ID 기반 일관된 실험 그룹 할당
  const hash = simpleHash(userId);
  const variantIndex = hash % READING_TIME_EXPERIMENTS.length;
  
  return READING_TIME_EXPERIMENTS[variantIndex];
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32비트 정수로 변환
  }
  return Math.abs(hash);
}

// 실험 결과 추적
export function trackReadingTimeInteraction(
  variantId: string,
  action: 'view' | 'click' | 'complete',
  metadata?: any
) {
  const event = {
    experimentId: 'reading-time-display',
    variantId,
    action,
    timestamp: new Date().toISOString(),
    metadata
  };
  
  // 분석 서비스로 전송
  fetch('/api/experiments/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event)
  });
}
```

## 국제화 지원

### 다국어 읽기 시간 표시
```typescript
// lib/reading-time-i18n.ts
export const READING_TIME_MESSAGES = {
  ko: {
    minuteRead: (minutes: number) => `${minutes}분 읽기`,
    secondRead: (seconds: number) => `${seconds}초 읽기`,
    minSecRead: (min: number, sec: number) => `${min}분 ${sec}초 읽기`,
    aboutMinutes: (minutes: number) => `약 ${minutes}분`,
    quickRead: '빠른 읽기',
    longRead: '긴 글'
  },
  en: {
    minuteRead: (minutes: number) => `${minutes} min read`,
    secondRead: (seconds: number) => `${seconds} sec read`,
    minSecRead: (min: number, sec: number) => `${min}m ${sec}s read`,
    aboutMinutes: (minutes: number) => `~${minutes} min`,
    quickRead: 'Quick read',
    longRead: 'Long read'
  },
  ja: {
    minuteRead: (minutes: number) => `${minutes}分で読む`,
    secondRead: (seconds: number) => `${seconds}秒で読む`,
    minSecRead: (min: number, sec: number) => `${min}分${sec}秒`,
    aboutMinutes: (minutes: number) => `約${minutes}分`,
    quickRead: 'クイック読み',
    longRead: '長い記事'
  }
} as const;

export function formatReadingTimeI18n(
  result: ReadingTimeResult,
  locale: keyof typeof READING_TIME_MESSAGES = 'ko'
): string {
  const messages = READING_TIME_MESSAGES[locale];
  
  if (result.minutes === 0) {
    return messages.secondRead(result.seconds);
  } else if (result.seconds === 0) {
    return messages.minuteRead(result.minutes);
  } else {
    return messages.minSecRead(result.minutes, result.seconds);
  }
}
```

## 마무리

읽기 시간 계산은 단순해 보이지만, 사용자 경험에 큰 영향을 미치는 기능입니다. 언어의 특성을 고려하고, 개별 사용자의 읽기 습관을 학습하며, 콘텐츠의 복잡도를 반영한 정교한 시스템을 구축하면, 사용자가 더 정확한 예상을 가지고 콘텐츠를 소비할 수 있습니다.

지금까지 Next.js를 활용한 마크다운 블로그 시스템의 모든 핵심 기능들을 살펴보았습니다. 각각의 기능은 독립적으로도 유용하지만, 서로 연결되어 완성도 높은 블로그 플랫폼을 만들어냅니다.
