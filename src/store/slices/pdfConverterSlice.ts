import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { convertPDFToImages } from '../../utils/fileConverter';

export interface ImageResult {
  id: string;
  blob: Blob;
  url: string;
  filename: string;
  pageNumber: number;
}

export interface PdfFile {
  id: string;
  file: File;
  name: string;
  size: number;
}

interface PdfConverterState {
  files: PdfFile[];
  results: ImageResult[];
  isConverting: boolean;
  error: string | null;
  warning: string | null;
  progress: { current: number; total: number } | null;
  outputFormat: 'png' | 'jpg' | 'webp';
}

const initialState: PdfConverterState = {
  files: [],
  results: [],
  isConverting: false,
  error: null,
  warning: null,
  progress: null,
  outputFormat: 'png',
};

// Async thunk for converting PDF to images
export const convertPdfToImages = createAsyncThunk(
  'pdfConverter/convertToImages',
  async ({ file, format }: { file: PdfFile; format: 'png' | 'jpg' | 'webp' }, { dispatch }) => {
    try {
      const imageBlobs = await convertPDFToImages(file.file);
      
      const results: ImageResult[] = imageBlobs.map((blob, index) => ({
        id: Math.random().toString(36).substring(2),
        blob,
        url: URL.createObjectURL(blob),
        filename: `${file.name.replace(/\.[^/.]+$/, "")}_page_${index + 1}.${format}`,
        pageNumber: index + 1
      }));

      return results;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Conversion failed');
    }
  }
);

const pdfConverterSlice = createSlice({
  name: 'pdfConverter',
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
    setOutputFormat: (state, action: PayloadAction<'png' | 'jpg' | 'webp'>) => {
      state.outputFormat = action.payload;
    },
    setProgress: (state, action: PayloadAction<{ current: number; total: number }>) => {
      state.progress = action.payload;
    },
    setWarning: (state, action: PayloadAction<string>) => {
      state.warning = action.payload;
    },
    clearResults: (state) => {
      // Clean up object URLs
      state.results.forEach(result => URL.revokeObjectURL(result.url));
      state.results = [];
    },
    reset: (state) => {
      // Clean up object URLs
      state.results.forEach(result => URL.revokeObjectURL(result.url));
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(convertPdfToImages.pending, (state) => {
        state.isConverting = true;
        state.error = null;
        state.warning = null;
        state.results = [];
      })
      .addCase(convertPdfToImages.fulfilled, (state, action) => {
        state.isConverting = false;
        state.results = action.payload;
        state.progress = null;
      })
      .addCase(convertPdfToImages.rejected, (state, action) => {
        state.isConverting = false;
        state.error = action.error.message || 'Failed to convert PDF to images';
        state.progress = null;
      });
  },
});

export const {
  addFiles,
  removeFile,
  setOutputFormat,
  setProgress,
  setWarning,
  clearResults,
  reset,
} = pdfConverterSlice.actions;

export default pdfConverterSlice.reducer;
