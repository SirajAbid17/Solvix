
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userdata: null,
  loading: true,
};

const UserSlice = createSlice({
  name: "User",

  initialState,

  reducers: {
    setuserData: (state, action) => {
      const data = action.payload;

      if (data) {
        state.userdata = {
          _id: data._id || data.userId || "",
          name: data.name || "",
          email: data.email || "",
          avatar: data.avatar || "",

          plan: data.plan || "free",
          credits: Number(data.credits ?? 0),
          totalcredits: Number(data.totalcredits ?? 0),
        };
      } else {
        state.userdata = null;
      }

      state.loading = false;
    },

    setUserLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setuserData,
  setUserLoading,
} = UserSlice.actions;

export default UserSlice.reducer;

