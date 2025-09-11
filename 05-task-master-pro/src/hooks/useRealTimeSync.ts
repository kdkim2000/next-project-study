// src/hooks/useRealTimeSync.ts
// 실시간 동기화를 위한 커스텀 훅

'use client'

import { useEffect, useCallback, useRef } from 'react'
import { getAllTasks, getAllCategories } from '@/lib/actions'
import { Task, Category } from '@/lib/types'

interface UseRealTimeSyncProps {
  onTasksUpdate: (tasks: Task[]) => void
  onCategoriesUpdate: (categories: Category[]) => void
  onError: (error: string) => void
  enabled?: boolean
  intervalMs?: number
}

export function useRealTimeSync({
  onTasksUpdate,
  onCategoriesUpdate,
  onError,
  enabled = true,
  intervalMs = 30000, // 30초마다 동기화
}: UseRealTimeSyncProps) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastSyncRef = useRef<number>(0)

  // 데이터 동기화 함수
  const syncData = useCallback(async () => {
    try {
      const [tasks, categories] = await Promise.all([
        getAllTasks(),
        getAllCategories()
      ])
      
      onTasksUpdate(tasks)
      onCategoriesUpdate(categories)
      lastSyncRef.current = Date.now()
      
    } catch (error) {
      onError('데이터 동기화 중 오류가 발생했습니다')
      console.error('Sync error:', error)
    }
  }, [onTasksUpdate, onCategoriesUpdate, onError])

  // 브라우저 포커스 시 동기화
  const handleFocus = useCallback(() => {
    const timeSinceLastSync = Date.now() - lastSyncRef.current
    // 10초 이상 지났으면 동기화
    if (timeSinceLastSync > 10000) {
      syncData()
    }
  }, [syncData])

  // 실시간 동기화 시작/중지
  useEffect(() => {
    if (!enabled) return

    // 초기 동기화
    syncData()

    // 주기적 동기화 설정
    intervalRef.current = setInterval(syncData, intervalMs)

    // 브라우저 포커스 이벤트 리스너
    window.addEventListener('focus', handleFocus)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      window.removeEventListener('focus', handleFocus)
    }
  }, [enabled, syncData, handleFocus, intervalMs])

  // 수동 동기화
  const forceSync = useCallback(() => {
    syncData()
  }, [syncData])

  return {
    forceSync,
    lastSync: lastSyncRef.current,
  }
}