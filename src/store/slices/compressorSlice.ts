import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type FileType = 'pdf' | 'image';
export type CompressionLevel = 'low' | 'medium' | 'high';

export interface FileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: FileType;
}

interface CompressorState {
  files: FileItem[];
  isProcessing: boolean;
  error: string | null;
  compressionLevel: CompressionLevel;
  results: { url: string; filename: string; originalSize: number; compressedSize: number }[];
}

const initialState: CompressorState = {
  files: [],
  isProcessing: false,
  error: null,
  compressionLevel: 'medium',
  results: [],
};

const compressorSlice = createSlice({
  name: 'compressor',
  initialState,
  reducers: {
    addFiles: (state, action: PayloadAction<{ files: File[]; type: FileType }>) => {
      const newFiles: FileItem[] = action.payload.files.map(file => ({
        id: Math.random().toString(36).substring(2),
        file,
        name: file.name,
        size: file.size,
        type: action.payload.type
      }));
      state.files.push(...newFiles);
      state.error = null;
    },
    removeFile: (state, action: PayloadAction<string>) => {
      state.files = state.files.filter(file => file.id !== action.payload);
    },
    setCompressionLevel: (state, action: PayloadAction<CompressionLevel>) => {
      state.compressionLevel = action.payload;
    },
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setResults: (state, action: PayloadAction<{ url: string; filename: string; originalSize: number; compressedSize: number }[]>) => {
      state.results = action.payload;
    },
    reset: (state) => {
      state.results.forEach(result => URL.revokeObjectURL(result.url));
      return initialState;
    },
  },
});

export const {
  addFiles,
  removeFile,
  setCompressionLevel,
  setProcessing,
  setError,
  setResults,
  reset,
} = compressorSlice.actions;

export default compressorSlice.reducer;
