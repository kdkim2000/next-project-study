// src/components/WysiwygEditor.tsx
// WYSIWYG 에디터 컴포넌트 - React Quill 기반 리치 텍스트 에디터

'use client';

import React, { useMemo, useRef } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { 
  Image as ImageIcon, 
  Link as LinkIcon,
  FormatBold,
  FormatItalic,
  FormatUnderlined
} from '@mui/icons-material';

// React Quill 동적 import (SSR 문제 방지)
import dynamic from 'next/dynamic';

// React Quill을 클라이언트 사이드에서만 로드
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => (
    <Box 
      sx={{ 
        height: 300, 
        border: '1px solid #ccc', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Typography>에디터를 로드하는 중...</Typography>
    </Box>
  ),
});

// React Quill CSS import
import 'react-quill/dist/quill.snow.css';

/**
 * WYSIWYG 에디터 컴포넌트 Props
 */
interface WysiwygEditorProps {
  value: string;                    // 에디터 내용
  onChange: (content: string) => void; // 내용 변경 핸들러
  placeholder?: string;             // 플레이스홀더 텍스트
  height?: number;                  // 에디터 높이
  readOnly?: boolean;               // 읽기 전용 모드
  onImageUpload?: (file: File) => Promise<string>; // 이미지 업로드 핸들러
}

/**
 * WYSIWYG 에디터 컴포넌트
 * 초보자도 쉽게 사용할 수 있는 리치 텍스트 에디터
 */
const WysiwygEditor: React.FC<WysiwygEditorProps> = ({
  value,
  onChange,
  placeholder = '내용을 입력하세요...',
  height = 300,
  readOnly = false,
  onImageUpload
}) => {
  const quillRef = useRef<any>(null);

  /**
   * 에디터 도구모음 설정
   * 초보자에게 필요한 기본적인 도구들만 포함
   */
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        // 텍스트 포맷팅
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        
        // 색상 및 배경
        [{ 'color': [] }, { 'background': [] }],
        
        // 정렬
        [{ 'align': [] }],
        
        // 목록
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        
        // 들여쓰기
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        
        // 링크, 이미지, 비디오
        ['link', 'image', 'video'],
        
        // 기타
        ['clean'] // 포맷 제거 버튼
      ],
      // 커스텀 핸들러
      handlers: {
        image: handleImageUpload
      }
    },
    // 클립보드 설정
    clipboard: {
      matchVisual: false // 붙여넣기 시 스타일 유지하지 않음
    }
  }), [onImageUpload]);

  /**
   * 에디터 포맷 설정
   * 사용할 수 있는 포맷들을 정의
   */
  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video',
    'align', 'color', 'background'
  ];

  /**
   * 이미지 업로드 처리
   * 사용자가 이미지 버튼을 클릭했을 때 실행
   */
  function handleImageUpload() {
    console.log('이미지 업로드 버튼 클릭');
    
    // 파일 선택 input 생성
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      console.log('선택된 이미지 파일:', file.name);

      try {
        // 로딩 상태 표시 (선택적)
        const quill = quillRef.current?.getEditor();
        if (!quill) return;

        const range = quill.getSelection();
        const index = range ? range.index : quill.getLength();

        // 로딩 텍스트 임시 삽입
        quill.insertText(index, '[이미지 업로드 중...]');

        let imageUrl: string;

        // 커스텀 업로드 핸들러가 있으면 사용
        if (onImageUpload) {
          imageUrl = await onImageUpload(file);
        } else {
          // 기본 업로드 API 사용
          imageUrl = await uploadImageToServer(file);
        }

        // 로딩 텍스트 제거
        quill.deleteText(index, '[이미지 업로드 중...]'.length);
        
        // 이미지 삽입
        quill.insertEmbed(index, 'image', imageUrl);
        quill.setSelection(index + 1);

        console.log('이미지 업로드 완료:', imageUrl);

      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        
        // 에러 발생 시 로딩 텍스트 제거
        const quill = quillRef.current?.getEditor();
        if (quill) {
          const currentContent = quill.getText();
          const loadingTextIndex = currentContent.indexOf('[이미지 업로드 중...]');
          if (loadingTextIndex !== -1) {
            quill.deleteText(loadingTextIndex, '[이미지 업로드 중...]'.length);
            quill.insertText(loadingTextIndex, '[이미지 업로드 실패]');
          }
        }
        
        alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
      }
    };

    input.click();
  }

  /**
   * 서버로 이미지 업로드
   */
  async function uploadImageToServer(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/media/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('서버 업로드 실패');
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || '업로드 실패');
    }

    return data.data.url;
  }

  /**
   * 에디터 내용 변경 핸들러
   */
  const handleChange = (content: string) => {
    onChange(content);
  };

  return (
    <Box sx={{ '& .ql-editor': { minHeight: `${height}px` } }}>
      {/* 에디터 제목 및 도움말 */}
      <Box sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" color="text.secondary">
          리치 텍스트 에디터
        </Typography>
        
        {/* 도구 설명 (초보자용) */}
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <FormatBold fontSize="small" color="action" title="굵게" />
          <FormatItalic fontSize="small" color="action" title="기울임" />
          <FormatUnderlined fontSize="small" color="action" title="밑줄" />
          <ImageIcon fontSize="small" color="action" title="이미지 업로드" />
          <LinkIcon fontSize="small" color="action" title="링크 삽입" />
        </Box>
      </Box>

      {/* React Quill 에디터 */}
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        readOnly={readOnly}
        modules={modules}
        formats={formats}
        style={{
          backgroundColor: readOnly ? '#f5f5f5' : 'white'
        }}
      />

      {/* 에디터 하단 도움말 */}
      <Box sx={{ mt: 1 }}>
        <Typography variant="caption" color="text.secondary">
          💡 팁: 이미지를 드래그&드롭하거나 도구모음의 이미지 버튼을 사용하여 이미지를 삽입할 수 있습니다.
        </Typography>
      </Box>

      {/* 글자 수 표시 (선택적) */}
      {value && (
        <Box sx={{ mt: 1, textAlign: 'right' }}>
          <Typography variant="caption" color="text.secondary">
            글자 수: {value.replace(/<[^>]*>/g, '').length}자
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default WysiwygEditor;