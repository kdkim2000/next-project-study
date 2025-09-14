// src/app/@sidebar/loading.tsx - 사이드바 로딩 상태
import { Skeleton, Box } from '@mui/material';

export default function SidebarLoading() {
  return (
    <Box sx={{ width: 240, p: 2 }}>
      <Skeleton variant="text" width="60%" height={40} />
      <Box sx={{ mt: 3 }}>
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton 
            key={index} 
            variant="rectangular" 
            width="100%" 
            height={40} 
            sx={{ mb: 1, borderRadius: 1 }}
          />
        ))}
      </Box>
    </Box>
  );
}