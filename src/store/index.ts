import { configureStore } from '@reduxjs/toolkit';
import imageConverterReducer from './slices/imageConverterSlice';
import pdfConverterReducer from './slices/pdfConverterSlice';
import mergeReducer from './slices/mergeSlice';
import splitterReducer from './slices/splitterSlice';
import compressorReducer from './slices/compressorSlice';

export const store = configureStore({
  reducer: {
    imageConverter: imageConverterReducer,
    pdfConverter: pdfConverterReducer,
    merge: mergeReducer,
    splitter: splitterReducer,
    compressor: compressorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these paths in the state
        ignoredPaths: ['imageConverter.images', 'pdfConverter.files', 'merge.files'],
        // Ignore these action types
        ignoredActions: ['imageConverter/addImages', 'pdfConverter/addFiles', 'merge/addFiles'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
