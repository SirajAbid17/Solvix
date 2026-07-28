import { createSlice } from "@reduxjs/toolkit";

const UserSlice = createSlice({
  name: "User",
  initialState: {
    userdata: null
  },
  reducers: {
    setuserData: (state, action) => {
      const data = action.payload;
      if (data && data.userId) {
        state.userdata = {
          _id: data.userId,
          name: data.name,
          email: data.email,
          avatar: data.avatar
        };
      } else {
        state.userdata = data;
      }
    }
  }
});

export const { setuserData } = UserSlice.actions;
export default UserSlice.reducer;