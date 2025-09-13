// src/components/WysiwygEditorAlternative.tsx
// React 19 호환을 위한 대안적 WYSIWYG 에디터 구현

'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Box, Button, Typography, Divider, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  Link as LinkIcon,
  Image as ImageIcon,
  Code as CodeIcon,
  FormatQuote,
  Undo,
  Redo,
  FormatSize,
  FormatColorText,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight
} from '@mui/icons-material';

/**
 * React 19 호환 WYSIWYG 에디터 컴포넌트
 * contentEditable을 사용한 네이티브 구현
 */
interface WysiwygEditorAlternativeProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
  readOnly?: boolean;
  onImageUpload?: (file: File) => Promise<string>;
}

const WysiwygEditorAlternative: React.FC<WysiwygEditorAlternativeProps> = ({
  value,
  onChange,
  placeholder = '내용을 입력하세요...',
  height = 300,
  readOnly = false,
  onImageUpload
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [colorMenuAnchor, setColorMenuAnchor] = useState<null | HTMLElement>(null);
  const [sizeMenuAnchor, setSizeMenuAnchor] = useState<null | HTMLElement>(null);

  // 에디터 초기화
  useEffect(() => {
    if (editorRef.current && !isInitialized) {
      editorRef.current.innerHTML = value;
      setIsInitialized(true);
    }
  }, [value, isInitialized]);

  /**
   * 에디터 내용 변경 핸들러
   */
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  }, [onChange]);

  /**
   * 키보드 단축키 처리
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          executeCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          executeCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          executeCommand('underline');
          break;
        case 'z':
          e.preventDefault();
          executeCommand(e.shiftKey ? 'redo' : 'undo');
          break;
      }
    }
  }, []);

  /**
   * 에디터 명령어 실행
   */
  const executeCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    handleInput();
    
    // 포커스 유지
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, [handleInput]);

  /**
   * 링크 삽입
   */
  const insertLink = useCallback(() => {
    const url = prompt('링크 URL을 입력하세요:');
    if (url) {
      executeCommand('createLink', url);
    }
  }, [executeCommand]);

  /**
   * 이미지 업로드 및 삽입
   */
  const handleImageUpload = useCallback(async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        let imageUrl: string;
        
        if (onImageUpload) {
          imageUrl = await onImageUpload(file);
        } else {
          // 기본 업로드 API 사용
          const formData = new FormData();
          formData.append('file', file);
          
          const response = await fetch('/api/media/upload', {
            method: 'POST',
            body: formData
          });
          
          if (!response.ok) throw new Error('업로드 실패');
          
          const data = await response.json();
          imageUrl = data.data.url;
        }

        // 이미지 삽입
        executeCommand('insertHTML', `<img src="${imageUrl}" alt="업로드된 이미지" style="max-width: 100%; height: auto;" />`);
        
      } catch (error) {
        console.error('이미지 업로드 실패:', error);
        alert('이미지 업로드에 실패했습니다.');
      }
    };

    input.click();
  }, [executeCommand, onImageUpload]);

  /**
   * HTML 삽입
   */
  const insertHTML = useCallback((html: string) => {
    executeCommand('insertHTML', html);
  }, [executeCommand]);

  // 텍스트 색상 옵션
  const colorOptions = [
    { name: '검정', value: '#000000' },
    { name: '빨강', value: '#ff0000' },
    { name: '파랑', value: '#0000ff' },
    { name: '녹색', value: '#008000' },
    { name: '주황', value: '#ffa500' },
    { name: '보라', value: '#800080' }
  ];

  // 폰트 크기 옵션
  const sizeOptions = [
    { name: '작게', value: '1' },
    { name: '보통', value: '3' },
    { name: '크게', value: '5' },
    { name: '매우 크게', value: '7' }
  ];

  return (
    <Box sx={{ border: '1px solid #ccc', borderRadius: 1, bgcolor: 'background.paper' }}>
      {/* 도구모음 */}
      {!readOnly && (
        <Box sx={{ 
          p: 1, 
          borderBottom: '1px solid #ccc',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 0.5
        }}>
          {/* 실행취소/다시실행 */}
          <Tooltip title="실행취소 (Ctrl+Z)">
            <IconButton size="small" onClick={() => executeCommand('undo')}>
              <Undo fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="다시실행 (Ctrl+Shift+Z)">
            <IconButton size="small" onClick={() => executeCommand('redo')}>
              <Redo fontSize="small" />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

          {/* 텍스트 서식 */}
          <Tooltip title="굵게 (Ctrl+B)">
            <IconButton size="small" onClick={() => executeCommand('bold')}>
              <FormatBold fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="기울임 (Ctrl+I)">
            <IconButton size="small" onClick={() => executeCommand('italic')}>
              <FormatItalic fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="밑줄 (Ctrl+U)">
            <IconButton size="small" onClick={() => executeCommand('underline')}>
              <FormatUnderlined fontSize="small" />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

          {/* 정렬 */}
          <Tooltip title="왼쪽 정렬">
            <IconButton size="small" onClick={() => executeCommand('justifyLeft')}>
              <FormatAlignLeft fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="가운데 정렬">
            <IconButton size="small" onClick={() => executeCommand('justifyCenter')}>
              <FormatAlignCenter fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="오른쪽 정렬">
            <IconButton size="small" onClick={() => executeCommand('justifyRight')}>
              <FormatAlignRight fontSize="small" />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

          {/* 목록 */}
          <Tooltip title="번호 목록">
            <IconButton size="small" onClick={() => executeCommand('insertOrderedList')}>
              <FormatListNumbered fontSize="small" />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="글머리 목록">
            <IconButton size="small" onClick={() => executeCommand('insertUnorderedList')}>
              <FormatListBulleted fontSize="small" />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

          {/* 텍스트 색상 */}
          <Tooltip title="텍스트 색상">
            <IconButton 
              size="small" 
              onClick={(e) => setColorMenuAnchor(e.currentTarget)}
            >
              <FormatColorText fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* 폰트 크기 */}
          <Tooltip title="폰트 크기">
            <IconButton 
              size="small" 
              onClick={(e) => setSizeMenuAnchor(e.currentTarget)}
            >
              <FormatSize fontSize="small" />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

          {/* 링크 */}
          <Tooltip title="링크 삽입">
            <IconButton size="small" onClick={insertLink}>
              <LinkIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          
          {/* 이미지 */}
          <Tooltip title="이미지 업로드">
            <IconButton size="small" onClick={handleImageUpload}>
              <ImageIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* 인용문 */}
          <Tooltip title="인용문">
            <IconButton size="small" onClick={() => executeCommand('formatBlock', 'blockquote')}>
              <FormatQuote fontSize="small" />
            </IconButton>
          </Tooltip>

          {/* 코드 */}
          <Tooltip title="코드">
            <IconButton 
              size="small" 
              onClick={() => insertHTML('<code>코드</code>')}
            >
              <CodeIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {/* 색상 선택 메뉴 */}
      <Menu
        anchorEl={colorMenuAnchor}
        open={Boolean(colorMenuAnchor)}
        onClose={() => setColorMenuAnchor(null)}
      >
        {colorOptions.map((color) => (
          <MenuItem
            key={color.value}
            onClick={() => {
              executeCommand('foreColor', color.value);
              setColorMenuAnchor(null);
            }}
          >
            <Box 
              sx={{ 
                width: 20, 
                height: 20, 
                backgroundColor: color.value, 
                mr: 1,
                border: '1px solid #ccc'
              }} 
            />
            {color.name}
          </MenuItem>
        ))}
      </Menu>

      {/* 크기 선택 메뉴 */}
      <Menu
        anchorEl={sizeMenuAnchor}
        open={Boolean(sizeMenuAnchor)}
        onClose={() => setSizeMenuAnchor(null)}
      >
        {sizeOptions.map((size) => (
          <MenuItem
            key={size.value}
            onClick={() => {
              executeCommand('fontSize', size.value);
              setSizeMenuAnchor(null);
            }}
          >
            {size.name}
          </MenuItem>
        ))}
      </Menu>

      {/* 에디터 본문 */}
      <Box
        ref={editorRef}
        contentEditable={!readOnly}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        sx={{
          minHeight: height,
          p: 2,
          outline: 'none',
          '&:empty::before': {
            content: `"${placeholder}"`,
            color: 'text.secondary',
            fontStyle: 'italic'
          },
          '& img': {
            maxWidth: '100%',
            height: 'auto'
          },
          '& blockquote': {
            borderLeft: '4px solid #ccc',
            margin: '1em 0',
            paddingLeft: '1em',
            fontStyle: 'italic'
          },
          '& code': {
            backgroundColor: '#f4f4f4',
            padding: '2px 4px',
            borderRadius: '3px',
            fontFamily: 'monospace',
            fontSize: '0.9em'
          },
          '& ul, & ol': {
            paddingLeft: '2em'
          },
          backgroundColor: readOnly ? 'grey.50' : 'transparent'
        }}
        suppressContentEditableWarning={true}
      />

      {/* 도움말 */}
      <Box sx={{ p: 1, bgcolor: 'grey.50', borderTop: '1px solid #ccc' }}>
        <Typography variant="caption" color="text.secondary">
          💡 키보드 단축키: Ctrl+B (굵게), Ctrl+I (기울임), Ctrl+U (밑줄), Ctrl+Z (실행취소)
        </Typography>
      </Box>
    </Box>
  );
};

export default WysiwygEditorAlternative;