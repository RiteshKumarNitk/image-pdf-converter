import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { convertMultipleImagesToPDF } from '../../utils/multipleImageConverter';

export interface ImageItem {
  id: string;
  file: File;
  preview: string;
  name: string;
  size: number;
}

export interface ConversionResult {
  url: string;
  filename: string;
}

export interface Progress {
  current: number;
  total: number;
}

interface ImageConverterState {
  images: ImageItem[];
  isConverting: boolean;
  error: string | null;
  result: ConversionResult | null;
  progress: Progress | null;
}

const initialState: ImageConverterState = {
  images: [],
  isConverting: false,
  error: null,
  result: null,
  progress: null,
};

// Async thunk for converting images to PDF
export const convertImagesToPdf = createAsyncThunk(
  'imageConverter/convertToPdf',
  async (images: ImageItem[], { dispatch }) => {
    const files = images.map(img => img.file);
    
    const pdfBlob = await convertMultipleImagesToPDF(files, (current) => {
      dispatch(setProgress({ current, total: files.length }));
    });

    const url = URL.createObjectURL(pdfBlob);
    const filename = `converted_images_${new Date().toISOString().slice(0, 10)}.pdf`;
    
    return { url, filename };
  }
);

const imageConverterSlice = createSlice({
  name: 'imageConverter',
  initialState,
  reducers: {
    addImages: (state, action: PayloadAction<File[]>) => {
      const newImages: ImageItem[] = action.payload.map(file => ({
        id: Math.random().toString(36).substring(2),
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
        size: file.size
      }));
      
      state.images.push(...newImages);
      state.error = null;
    },
    removeImage: (state, action: PayloadAction<string>) => {
      const imageToRemove = state.images.find(img => img.id === action.payload);
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview);
      }
      state.images = state.images.filter(img => img.id !== action.payload);
    },
    reorderImages: (state, action: PayloadAction<ImageItem[]>) => {
      state.images = action.payload;
    },
    setProgress: (state, action: PayloadAction<Progress>) => {
      state.progress = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    reset: (state) => {
      // Clean up object URLs
      state.images.forEach(img => URL.revokeObjectURL(img.preview));
      if (state.result) {
        URL.revokeObjectURL(state.result.url);
      }
      
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(convertImagesToPdf.pending, (state) => {
        state.isConverting = true;
        state.error = null;
        state.progress = { current: 0, total: state.images.length };
      })
      .addCase(convertImagesToPdf.fulfilled, (state, action) => {
        state.isConverting = false;
        state.result = action.payload;
        state.progress = null;
      })
      .addCase(convertImagesToPdf.rejected, (state, action) => {
        state.isConverting = false;
        state.error = action.error.message || 'Failed to convert images to PDF';
        state.progress = null;
      });
  },
});

export const {
  addImages,
  removeImage,
  reorderImages,
  setProgress,
  setError,
  reset,
} = imageConverterSlice.actions;

export default imageConverterSlice.reducer;
