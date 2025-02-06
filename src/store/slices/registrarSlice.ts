// src/store/slices/registrarSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Registrar {
  id: string;
  name: string;
  type: "namecheap" | "resellerclub" | "godaddy" | "cloudflare";
  username: string;
  status: "active" | "error" | "maintenance";
  lastSync: string;
  domainCount?: number;
  balance?: number;
}

interface RegistrarState {
  registrars: Registrar[];
  loading: boolean;
  error: string | null;
}

const initialState: RegistrarState = {
  registrars: [
    {
      id: "1",
      name: "Namecheap Reseller",
      type: "namecheap",
      username: "reselleraccount",
      status: "active",
      lastSync: "2024-02-06T10:30:00",
      domainCount: 156,
      balance: 2500.0,
    },
    {
      id: "2",
      name: "ResellerClub",
      type: "resellerclub",
      username: "vscloud",
      status: "active",
      lastSync: "2024-02-06T10:30:00",
      domainCount: 89,
      balance: 1200.5,
    },
  ],
  loading: false,
  error: null,
};

const registrarSlice = createSlice({
  name: "registrars",
  initialState,
  reducers: {
    addRegistrar: (state, action: PayloadAction<Registrar>) => {
      state.registrars.push(action.payload);
    },
    updateRegistrar: (state, action: PayloadAction<Registrar>) => {
      const index = state.registrars.findIndex(r => r.id === action.payload.id);
      if (index !== -1) {
        state.registrars[index] = action.payload;
      }
    },
    deleteRegistrar: (state, action: PayloadAction<string>) => {
      state.registrars = state.registrars.filter(r => r.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addRegistrar,
  updateRegistrar,
  deleteRegistrar,
  setLoading,
  setError,
} = registrarSlice.actions;

export default registrarSlice.reducer;
