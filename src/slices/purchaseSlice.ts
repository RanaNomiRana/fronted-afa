// src/slices/purchaseSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface PurchaseItem {
  id?: number;
  itemName: string;
  quantity: number;
  salePricePerPiece: number;
  saleAmount: number;
  expiryDate: string;
  supplier: string;
  purchasePricePerPiece: number;
  purchaseAmount: number;
  profit: number;
}

interface PurchaseState {
  items: PurchaseItem[];
  suggestions: any[];
  loadingSuggestions: boolean;
  purchaseErrors: any;
  submissionStatus: string | null;
}

const initialState: PurchaseState = {
  items: [],
  suggestions: [],
  loadingSuggestions: false,
  purchaseErrors: {},
  submissionStatus: null
};

export const fetchSuggestions = createAsyncThunk(
  'purchase/fetchSuggestions',
  async (query: string) => {
    if (!query.trim()) return [];
    const response = await axios.get(`http://localhost:3000/api/items`);
    return response.data.items;
  }
);

export const submitPurchase = createAsyncThunk(
  'purchase/submitPurchase',
  async (items: PurchaseItem[], { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:3000/api/purchases', { items });
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const purchaseSlice = createSlice({
  name: 'purchase',
  initialState,
  reducers: {
    setItemName: (state, action: PayloadAction<{ index: number; itemName: string }>) => {
      const { index, itemName } = action.payload;
      const item = state.items[index];
      item.itemName = itemName;
      // Clear suggestions when updating item name
      state.suggestions = [];
    },
    setItemValue: (state, action: PayloadAction<{ index: number; name: string; value: any }>) => {
      const { index, name, value } = action.payload;
      const item = state.items[index];
      item[name as keyof PurchaseItem] = value;
      // Recalculate amounts and profit
      item.saleAmount = item.quantity * item.salePricePerPiece;
      item.purchaseAmount = item.quantity * item.purchasePricePerPiece;
      item.profit = item.saleAmount - item.purchaseAmount;
    },
    addItem: (state) => {
      state.items.push({
        itemName: '',
        quantity: 0,
        salePricePerPiece: 0,
        saleAmount: 0,
        expiryDate: '',
        supplier: '',
        purchasePricePerPiece: 0,
        purchaseAmount: 0,
        profit: 0
      });
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((_, i) => i !== action.payload);
    },
    setPurchaseErrors: (state, action: PayloadAction<any>) => {
      state.purchaseErrors = action.payload;
    },
    clearPurchaseData: (state) => {
      state.items = [];
      state.purchaseErrors = {};
      state.submissionStatus = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuggestions.pending, (state) => {
        state.loadingSuggestions = true;
      })
      .addCase(fetchSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload;
        state.loadingSuggestions = false;
      })
      .addCase(fetchSuggestions.rejected, (state) => {
        state.loadingSuggestions = false;
      })
      .addCase(submitPurchase.pending, (state) => {
        state.submissionStatus = 'Submitting';
      })
      .addCase(submitPurchase.fulfilled, (state) => {
        state.submissionStatus = 'Submitted';
      })
      .addCase(submitPurchase.rejected, (state, action) => {
        state.submissionStatus = `Error: ${action.payload}`;
      });
  }
});

export const {
  setItemName,
  setItemValue,
  addItem,
  removeItem,
  setPurchaseErrors,
  clearPurchaseData
} = purchaseSlice.actions;

export default purchaseSlice.reducer;
