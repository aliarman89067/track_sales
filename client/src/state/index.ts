import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  isAlertDialogOpen: false,
  memberId: "",
  isMemberRemoved: false,
  isOrgDialogOpen: false,
  orgId: "",
  isOrgRemoved: false,
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
    openOrgDialog: (
      state,
      action: PayloadAction<{
        orgId: string;
        openValue: boolean;
        isRemoved: boolean;
      }>
    ) => {
      state.isOrgRemoved = action.payload.isRemoved;
      state.isOrgDialogOpen = action.payload.openValue;
      state.orgId = action.payload.orgId;
    },
  },
});

export const { openAlertDialog, openOrgDialog } = globalSlice.actions;
export default globalSlice.reducer;
