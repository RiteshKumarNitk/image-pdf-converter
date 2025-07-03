import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SplitRange {
  id: string;
  start: number;
  end: number;
  name: string;
}

interface SplitterState {
  file: File | null;
  totalPages: number;
  splitRanges: SplitRange[];
  isProcessing: boolean;
  error: string | null;
  results: { url: string; filename: string }[];
}

const initialState: SplitterState = {
  file: null,
  totalPages: 0,
  splitRanges: [],
  isProcessing: false,
  error: null,
  results: [],
};

const splitterSlice = createSlice({
  name: 'splitter',
  initialState,
  reducers: {
    setFile: (state, action: PayloadAction<File>) => {
      state.file = action.payload;
      state.error = null;
    },
    setTotalPages: (state, action: PayloadAction<number>) => {
      state.totalPages = action.payload;
    },
    addSplitRange: (state, action: PayloadAction<Omit<SplitRange, 'id'>>) => {
      const newRange: SplitRange = {
        ...action.payload,
        id: Math.random().toString(36).substring(2),
      };
      state.splitRanges.push(newRange);
    },
    removeSplitRange: (state, action: PayloadAction<string>) => {
      state.splitRanges = state.splitRanges.filter(range => range.id !== action.payload);
    },
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    setResults: (state, action: PayloadAction<{ url: string; filename: string }[]>) => {
      state.results = action.payload;
    },
    reset: (state) => {
      state.results.forEach(result => URL.revokeObjectURL(result.url));
      return initialState;
    },
  },
});

export const {
  setFile,
  setTotalPages,
  addSplitRange,
  removeSplitRange,
  setProcessing,
  setError,
  setResults,
  reset,
} = splitterSlice.actions;

export default splitterSlice.reducer;
