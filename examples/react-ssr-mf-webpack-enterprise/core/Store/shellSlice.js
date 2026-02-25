import { createSlice } from '@reduxjs/toolkit';

const shellSlice = createSlice({
  name: 'shell',
  initialState: {
    template: 'template1'
  },
  reducers: {
    setTemplate(state, action) {
      state.template = action.payload;
    }
  }
});

export const { setTemplate } = shellSlice.actions;
export default shellSlice.reducer;
