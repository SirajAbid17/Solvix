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
      const data = action.payload;

      console.log("📦 setuserData called with:", data);

      if (data) {
        // ✅ CRITICAL FIX: isAdmin ko pehle set karein
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
        
        // ✅ state.isAdmin ko bhi set karein
        state.isAdmin = isAdminValue;
        
        console.log("✅ isAdmin set to:", state.isAdmin);
        console.log("✅ userdata.isAdmin:", state.userdata.isAdmin);
      } else {
        state.userdata = null;
        state.isAdmin = false;
      }

      state.loading = false;
    },

    setUserLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // ✅ Optional: Separate action for admin status
    setAdminStatus: (state, action) => {
      state.isAdmin = action.payload;
      if (state.userdata) {
        state.userdata.isAdmin = action.payload;
      }
    },
  },
});

export const {
  setuserData,
  setUserLoading,
  setAdminStatus, // Export new action
} = UserSlice.actions;

export default UserSlice.reducer;