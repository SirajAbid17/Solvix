import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userdata: null,
  loading: true,
  isAdmin: false,
};

const UserSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    setuserData: (state, action) => {
      const payload = action.payload;

      const data = payload?.user ?? payload;

      if (data) {
        const isAdminValue = data.isAdmin === true;

        state.userdata = {
          _id: data._id || data.userId || "",
          name: data.name || "",
          email: data.email || "",
          avatar: data.avatar || "",
          plan: data.plan || "free",
          credits: Number(data.credits ?? 0),
          totalcredits: Number(data.totalcredits ?? 0),
          isAdmin: isAdminValue,
        };

        state.isAdmin = isAdminValue;
      } else {
        state.userdata = null;
        state.isAdmin = false;
      }

      state.loading = false;
    },

    setUserLoading: (state, action) => {
      state.loading = action.payload;
    },

    setAdminStatus: (state, action) => {
      state.isAdmin = action.payload;
      if (state.userdata) {
        state.userdata.isAdmin = action.payload;
      }
    },
  },
});

export const { setuserData, setUserLoading, setAdminStatus } =
  UserSlice.actions;

export default UserSlice.reducer;
