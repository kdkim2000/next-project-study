export type FrontMatter = {
  title: string;
  date: string; // YYYY-MM-DD
  excerpt?: string;
  category?: string;
  tags?: string[];
  cover?: string;
};

export type ReadingTime = {
  text: string;
  minutes: number;
  time: number;
  words: number;
};

export type Post = {
  slug: string;
  contentHtml: string;
  readingTime: ReadingTime;
  frontMatter: FrontMatter;
};

export type CategoryCount = { category: string; count: number };

export type SearchFilters = {
  query?: string;
  category?: string;
  tags?: string[];
};
