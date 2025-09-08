// src/app/api/contact/route.ts (API 라우트에서 환경변수 사용 예시)
import { NextRequest, NextResponse } from 'next/server'
import { privateConfig } from '@/lib/config'

/**
 * 연락처 폼 제출 API (Server Component)
 * 환경변수를 사용한 이메일 발송 예시
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, company, phone, message } = body

    // 입력값 검증
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // 환경변수 확인
    if (!privateConfig.MAIL_SERVICE_API_KEY) {
      console.error('이메일 서비스 API 키가 설정되지 않았습니다.')
      return NextResponse.json(
        { error: '이메일 서비스 설정 오류' },
        { status: 500 }
      )
    }

    // 실제 이메일 발송 로직 (예시)
    const emailData = {
      from: privateConfig.MAIL_SERVICE_FROM_EMAIL,
      to: privateConfig.MAIL_SERVICE_TO_EMAIL,
      subject: `[웹사이트 문의] ${company}의 ${name}님`,
      html: `
        <h2>새로운 문의가 접수되었습니다</h2>
        <p><strong>이름:</strong> ${name}</p>
        <p><strong>이메일:</strong> ${email}</p>
        <p><strong>회사:</strong> ${company}</p>
        <p><strong>연락처:</strong> ${phone}</p>
        <p><strong>문의내용:</strong></p>
        <p>${message}</p>
      `,
    }

    // 여기서 실제 이메일 서비스 (SendGrid, Nodemailer 등) 호출
    console.log('이메일 발송 데이터:', emailData)
    
    // 성공 응답
    return NextResponse.json(
      { 
        success: true, 
        message: '문의가 성공적으로 전송되었습니다.' 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('연락처 폼 처리 오류:', error)
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}