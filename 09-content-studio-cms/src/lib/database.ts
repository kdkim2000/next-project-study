// src/lib/database.ts
// SQLite 데이터베이스 설정 및 초기화 파일

import Database from 'better-sqlite3';
import path from 'path';
import { Content, ContentVersion, User, MediaFile } from '../types';

// 데이터베이스 파일 경로 설정
const dbPath = path.join(process.cwd(), 'database.db');

// SQLite 데이터베이스 연결 생성
// WAL 모드: 동시 읽기/쓰기 성능 향상
const db = new Database(dbPath, { 
  verbose: console.log, // 개발 중 SQL 쿼리 로깅 (운영시엔 제거)
});

// WAL 모드 활성화 (Write-Ahead Logging)
// 여러 사용자가 동시에 데이터를 읽을 수 있게 해줌
db.pragma('journal_mode = WAL');

/**
 * 데이터베이스 테이블 초기화
 * 애플리케이션 시작 시 필요한 테이블들을 생성
 */
export function initializeDatabase() {
  console.log('데이터베이스 초기화 시작...');

  // 1. 사용자 테이블 생성
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      display_name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'editor',
      password_hash TEXT NOT NULL,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      last_login_at TEXT,
      CONSTRAINT role_check CHECK (role IN ('admin', 'editor', 'viewer'))
    )
  `);

  // 2. 콘텐츠 테이블 생성
  db.exec(`
    CREATE TABLE IF NOT EXISTS contents (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      content TEXT NOT NULL,
      excerpt TEXT,
      type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'draft',
      language TEXT NOT NULL DEFAULT 'ko',
      
      -- 메타데이터 (JSON으로 저장)
      meta_title TEXT,
      meta_description TEXT,
      meta_keywords TEXT, -- JSON 배열
      meta_author TEXT,
      featured_image TEXT,
      social_title TEXT,
      social_description TEXT,
      
      -- 날짜 정보
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      published_at TEXT,
      
      -- 작성자 정보
      created_by TEXT NOT NULL,
      updated_by TEXT NOT NULL,
      
      -- 버전 관리
      current_version INTEGER NOT NULL DEFAULT 1,
      
      -- 추가 설정
      allow_comments INTEGER DEFAULT 1,
      featured_order INTEGER DEFAULT 0,
      tags TEXT, -- JSON 배열
      
      -- 제약 조건
      CONSTRAINT type_check CHECK (type IN ('article', 'page', 'blog', 'news')),
      CONSTRAINT status_check CHECK (status IN ('draft', 'published', 'archived')),
      CONSTRAINT language_check CHECK (language IN ('ko', 'en', 'ja')),
      FOREIGN KEY (created_by) REFERENCES users (id),
      FOREIGN KEY (updated_by) REFERENCES users (id)
    )
  `);

  // 3. 콘텐츠 버전 테이블 생성
  db.exec(`
    CREATE TABLE IF NOT EXISTS content_versions (
      id TEXT PRIMARY KEY,
      content_id TEXT NOT NULL,
      version INTEGER NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      meta_data TEXT, -- JSON으로 저장
      created_at TEXT NOT NULL,
      created_by TEXT NOT NULL,
      change_note TEXT,
      
      FOREIGN KEY (content_id) REFERENCES contents (id) ON DELETE CASCADE,
      FOREIGN KEY (created_by) REFERENCES users (id),
      UNIQUE (content_id, version)
    )
  `);

  // 4. 미디어 파일 테이블 생성
  db.exec(`
    CREATE TABLE IF NOT EXISTS media_files (
      id TEXT PRIMARY KEY,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      size INTEGER NOT NULL,
      url TEXT NOT NULL,
      uploaded_at TEXT NOT NULL,
      uploaded_by TEXT NOT NULL,
      
      FOREIGN KEY (uploaded_by) REFERENCES users (id)
    )
  `);

  // 5. 인덱스 생성 (검색 성능 향상)
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_contents_status ON contents (status);
    CREATE INDEX IF NOT EXISTS idx_contents_type ON contents (type);
    CREATE INDEX IF NOT EXISTS idx_contents_language ON contents (language);
    CREATE INDEX IF NOT EXISTS idx_contents_created_at ON contents (created_at);
    CREATE INDEX IF NOT EXISTS idx_contents_slug ON contents (slug);
    CREATE INDEX IF NOT EXISTS idx_content_versions_content_id ON content_versions (content_id);
    CREATE INDEX IF NOT EXISTS idx_media_files_uploaded_at ON media_files (uploaded_at);
  `);

  console.log('데이터베이스 테이블 초기화 완료');

  // 기본 관리자 계정 생성 (개발용)
  createDefaultAdmin();
}

/**
 * 기본 관리자 계정 생성
 * 개발 및 초기 설정을 위한 기본 계정
 */
function createDefaultAdmin() {
  const adminExists = db.prepare(
    'SELECT COUNT(*) as count FROM users WHERE role = ?'
  ).get('admin') as { count: number };

  // 관리자가 없으면 기본 계정 생성
  if (adminExists.count === 0) {
    const adminUser = {
      id: 'admin-001',
      username: 'admin',
      email: 'admin@example.com',
      display_name: '관리자',
      role: 'admin',
      password_hash: 'admin123', // 실제로는 해시화해야 함
      is_active: 1,
      created_at: new Date().toISOString()
    };

    const insertAdmin = db.prepare(`
      INSERT INTO users (
        id, username, email, display_name, role, 
        password_hash, is_active, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertAdmin.run(
      adminUser.id,
      adminUser.username,
      adminUser.email,
      adminUser.display_name,
      adminUser.role,
      adminUser.password_hash,
      adminUser.is_active,
      adminUser.created_at
    );

    console.log('기본 관리자 계정 생성됨 - ID: admin, PW: admin123');
  }
}

/**
 * 콘텐츠 관련 데이터베이스 작업 함수들
 */
export const contentQueries = {
  // 모든 콘텐츠 조회 (페이지네이션)
  getAll: (page: number = 1, limit: number = 10, filters: any = {}) => {
    let whereClause = '1=1';
    const params: any[] = [];

    // 필터 조건 추가
    if (filters.status) {
      whereClause += ' AND status = ?';
      params.push(filters.status);
    }
    if (filters.type) {
      whereClause += ' AND type = ?';
      params.push(filters.type);
    }
    if (filters.language) {
      whereClause += ' AND language = ?';
      params.push(filters.language);
    }

    const offset = (page - 1) * limit;
    
    const query = `
      SELECT * FROM contents 
      WHERE ${whereClause}
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `;

    const countQuery = `
      SELECT COUNT(*) as count FROM contents 
      WHERE ${whereClause}
    `;

    const contents = db.prepare(query).all(...params, limit, offset);
    const total = (db.prepare(countQuery).get(...params) as { count: number }).count;

    return {
      contents: contents.map(parseContentFromDb),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  },

  // ID로 단일 콘텐츠 조회
  getById: (id: string): Content | null => {
    const content = db.prepare('SELECT * FROM contents WHERE id = ?').get(id);
    return content ? parseContentFromDb(content) : null;
  },

  // 슬러그로 콘텐츠 조회
  getBySlug: (slug: string): Content | null => {
    const content = db.prepare('SELECT * FROM contents WHERE slug = ?').get(slug);
    return content ? parseContentFromDb(content) : null;
  },

  // 새 콘텐츠 생성
  create: (content: Omit<Content, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date().toISOString();

    const insertContent = db.prepare(`
      INSERT INTO contents (
        id, title, slug, content, excerpt, type, status, language,
        meta_title, meta_description, meta_keywords, meta_author,
        featured_image, social_title, social_description,
        created_at, updated_at, published_at, created_by, updated_by,
        current_version, allow_comments, featured_order, tags
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertContent.run(
      id, content.title, content.slug, content.content, content.excerpt,
      content.type, content.status, content.language,
      content.meta.title || null,
      content.meta.description || null,
      JSON.stringify(content.meta.keywords || []),
      content.meta.author || null,
      content.meta.featuredImage || null,
      content.meta.socialTitle || null,
      content.meta.socialDescription || null,
      now, now, content.publishedAt || null,
      content.createdBy, content.updatedBy,
      1, content.allowComments ? 1 : 0,
      content.featuredOrder || 0,
      JSON.stringify(content.tags || [])
    );

    return { ...content, id, createdAt: now, updatedAt: now };
  },

  // 콘텐츠 업데이트
  update: (id: string, updates: Partial<Content>) => {
    const now = new Date().toISOString();
    
    // 기존 콘텐츠 조회
    const existing = contentQueries.getById(id);
    if (!existing) return null;

    // 버전 생성 (내용이 변경된 경우)
    if (updates.content && updates.content !== existing.content) {
      const newVersion = existing.currentVersion + 1;
      
      // 이전 버전 저장
      const insertVersion = db.prepare(`
        INSERT INTO content_versions (
          id, content_id, version, title, content, meta_data,
          created_at, created_by, change_note
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      insertVersion.run(
        `version-${Date.now()}`,
        id,
        existing.currentVersion,
        existing.title,
        existing.content,
        JSON.stringify(existing.meta),
        existing.updatedAt,
        existing.updatedBy,
        updates.content ? '내용 수정' : null
      );

      updates.currentVersion = newVersion;
    }

    // 메인 테이블 업데이트
    const updateFields = [];
    const params = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && key !== 'id') {
        if (key === 'meta') {
          // 메타데이터는 개별 필드로 분해
          const meta = value as any;
          if (meta.title !== undefined) {
            updateFields.push('meta_title = ?');
            params.push(meta.title);
          }
          // ... 다른 메타 필드들도 동일하게 처리
        } else if (key === 'tags') {
          updateFields.push('tags = ?');
          params.push(JSON.stringify(value));
        } else {
          const dbField = key.replace(/([A-Z])/g, '_$1').toLowerCase();
          updateFields.push(`${dbField} = ?`);
          params.push(value);
        }
      }
    });

    updateFields.push('updated_at = ?');
    params.push(now);
    params.push(id);

    const updateQuery = `
      UPDATE contents 
      SET ${updateFields.join(', ')} 
      WHERE id = ?
    `;

    db.prepare(updateQuery).run(...params);
    return contentQueries.getById(id);
  },

  // 콘텐츠 삭제
  delete: (id: string) => {
    const deleteContent = db.prepare('DELETE FROM contents WHERE id = ?');
    const result = deleteContent.run(id);
    return result.changes > 0;
  }
};

/**
 * 데이터베이스에서 가져온 콘텐츠 데이터를 Content 인터페이스로 변환
 */
function parseContentFromDb(row: any): Content {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    content: row.content,
    excerpt: row.excerpt,
    type: row.type,
    status: row.status,
    language: row.language,
    meta: {
      title: row.meta_title,
      description: row.meta_description,
      keywords: row.meta_keywords ? JSON.parse(row.meta_keywords) : [],
      author: row.meta_author,
      featuredImage: row.featured_image,
      socialTitle: row.social_title,
      socialDescription: row.social_description,
    },
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    publishedAt: row.published_at,
    createdBy: row.created_by,
    updatedBy: row.updated_by,
    currentVersion: row.current_version,
    allowComments: Boolean(row.allow_comments),
    featuredOrder: row.featured_order,
    tags: row.tags ? JSON.parse(row.tags) : [],
  };
}

// 애플리케이션 시작 시 데이터베이스 초기화
initializeDatabase();

export default db;