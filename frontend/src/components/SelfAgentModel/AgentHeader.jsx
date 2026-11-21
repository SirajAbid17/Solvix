import React from "react";
import { useNavigate } from "react-router-dom";
import { FiCpu, FiLogOut, FiUser } from "react-icons/fi";
import api from "../../utlis/axios";
import { useDispatch, useSelector } from "react-redux";
import { setuserData } from "../../redux/userSlice";
import { clearConversations } from "../../redux/conversationSlice";
import toast from "react-hot-toast";

export default function AgentHeader({ dark }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userdata } = useSelector((s) => s.user);

  const textPrimary = dark ? "text-white" : "text-gray-900";
  const textSecondary = dark ? "text-gray-400" : "text-gray-500";

  
  const avatar =
    userdata?.avatar && String(userdata.avatar).trim() !== ""
      ? userdata.avatar
      : null;
  const displayName = userdata?.name?.trim() || "User";
  const initial = displayName.charAt(0).toUpperCase() || "U";

  const handleLogout = async () => {
    const toastId = toast.loading("Logging out...", {
      style: {
        background: dark ? "#1a1a1a" : "#fff",
        color: dark ? "#fff" : "#000",
      },
    });
    try {
      await api.post("/auth/logout");
      dispatch(setuserData(null));
      dispatch(clearConversations());
      toast.success("Logged out successfully", { id: toastId });
      setTimeout(() => navigate("/"), 500);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout", { id: toastId });
    }
  };

  return (
    <header
      className={`sa-header relative z-20 border-b ${
        dark
          ? "border-white/10 bg-black/40 backdrop-blur-xl"
          : "border-gray-200 bg-white/80 backdrop-blur-xl"
      }`}
    >
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-2 px-3 py-2.5 sm:px-6 sm:py-3 lg:px-10">
      
        <div className="flex min-w-0 items-center gap-2 sm:gap-2.5">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl sm:h-9 sm:w-9 ${
              dark ? "bg-white text-black" : "bg-black text-white"
            }`}
          >
            <FiCpu className="text-sm sm:text-base" />
          </div>
          <div className="min-w-0 leading-tight">
            <p
              className={`truncate text-xs font-bold tracking-tight sm:text-sm ${textPrimary}`}
            >
              Solvix
            </p>
            <p
              className={`truncate text-[8px] uppercase tracking-[0.18em] sm:text-[9px] sm:tracking-[0.2em] ${textSecondary}`}
            >
              AI Workspace
            </p>
          </div>
        </div>

        
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {userdata ? (
            <>
              <div className="flex items-center gap-2">
                
                {avatar ? (
                  <img
                    src={avatar}
                    alt={displayName}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      e.currentTarget.nextSibling?.classList?.remove("hidden");
                    }}
                    className={`h-7 w-7 rounded-full object-cover border sm:h-8 sm:w-8 ${
                      dark ? "border-white/15" : "border-gray-200"
                    }`}
                  />
                ) : null}

                <div
                  className={`${
                    avatar ? "hidden" : "flex"
                  } h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold sm:h-8 sm:w-8 sm:text-xs ${
                    dark
                      ? "border-white/15 bg-white/10 text-white"
                      : "border-gray-200 bg-gray-100 text-gray-700"
                  }`}
                >
                  {initial}
                </div>

                <div className="hidden sm:block leading-tight">
                  <p className={`text-[9px] ${textSecondary}`}>Welcome, </p>
                  <p
                    className={`max-w-[120px] truncate text-xs font-semibold ${textPrimary}`}
                  >
                    {displayName}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className={`ml-1 flex h-8 items-center gap-1.5 rounded-lg border px-2 text-[11px] font-semibold transition active:scale-95 sm:px-2.5 ${
                  dark
                    ? "border-white/10 bg-white/[0.04] text-gray-200 hover:bg-white/10"
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FiLogOut className="text-xs" />
                <span className="hidden xs:inline sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full border sm:h-8 sm:w-8 ${
                  dark
                    ? "border-white/15 bg-white/10 text-gray-300"
                    : "border-gray-200 bg-gray-100 text-gray-500"
                }`}
                title="Guest"
              >
                <FiUser className="text-xs sm:text-sm" />
              </div>
              <button
                onClick={() => navigate("/login-required")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition active:scale-95 ${
                  dark ? "bg-white text-black" : "bg-black text-white"
                }`}
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}