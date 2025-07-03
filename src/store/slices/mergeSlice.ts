import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PdfFile {
  id: string;
  file: File;
  name: string;
  size: number;
}

interface MergeState {
  files: PdfFile[];
  isProcessing: boolean;
  error: string | null;
  result: { url: string; filename: string } | null;
}

const initialState: MergeState = {
  files: [],
  isProcessing: false,
  error: null,
  result: null,
};

const mergeSlice = createSlice({
  name: 'merge',
  initialState,
  reducers: {
    addFiles: (state, action: PayloadAction<File[]>) => {
      const newFiles: PdfFile[] = action.payload.map(file => ({
        id: Math.random().toString(36).substring(2),
        file,
        name: file.name,
        size: file.size
      }));
      state.files.push(...newFiles);
      state.error = null;
    },
    removeFile: (state, action: PayloadAction<string>) => {
      state.files = state.files.filter(file => file.id !== action.payload);
    },
    reorderFiles: (state, action: PayloadAction<PdfFile[]>) => {
      state.files = action.payload;
    },
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setResult: (state, action: PayloadAction<{ url: string; filename: string }>) => {
      state.result = action.payload;
    },
    reset: (state) => {
      if (state.result) {
        URL.revokeObjectURL(state.result.url);
      }
      return initialState;
    },
  },
});

export const {
  addFiles,
  removeFile,
  reorderFiles,
  setProcessing,
  setError,
  setResult,
  reset,
} = mergeSlice.actions;

export default mergeSlice.reducer;
