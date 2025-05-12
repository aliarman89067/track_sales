import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  isAlertDialogOpen: false,
  memberId: "",
  isMemberRemoved: false,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    openAlertDialog: (
      state,
      action: PayloadAction<{
        memberId: string;
        openValue: boolean;
        isRemoved: boolean;
      }>
    ) => {
      state.isMemberRemoved = action.payload.isRemoved;
      state.isAlertDialogOpen = action.payload.openValue;
      state.memberId = action.payload.memberId;
    },
  },
});

export const { openAlertDialog } = globalSlice.actions;
export default globalSlice.reducer;
