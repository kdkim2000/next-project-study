// src/app/@modal/loading.tsx - 모달 로딩 상태
import { Dialog, DialogContent, CircularProgress, Box } from '@mui/material';

export default function ModalLoading() {
  return (
    <Dialog open={true} maxWidth="lg" fullWidth>
      <DialogContent>
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight={400}
        >
          <CircularProgress size={60} />
        </Box>
      </DialogContent>
    </Dialog>
  );
}