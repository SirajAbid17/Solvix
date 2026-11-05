import { signInWithPopup } from "firebase/auth";
import React, { useState } from "react";
import api from "../utlis/axios";
import { auth, googleProvider } from "../utlis/firebase";
import { useDispatch, useSelector } from "react-redux";
import { setuserData } from "../redux/userSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../BgContext/ThemeContext";
import { clearConversations } from "../redux/conversationSlice";

export default function Register() {
  const { userdata } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { dark } = useTheme();

  const [loading, setLoading] = useState(false);

 
  const from = location.state?.from || "/agent";

  const LogoutUser = async () => {
    try {
      await api.post("/auth/logout");

      dispatch(setuserData(null));
      dispatch(clearConversations());

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const handleData = async (token) => {
    try {
      const { data } = await api.post("/auth/login", { token });
      dispatch(setuserData(data));
      navigate(from, { replace: true }); 
    } catch (error) {
      console.log(error);
    }
  };

  const UDashboard = () => {
    navigate("/user-dashboard");
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();

      await handleData(token);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {userdata ? (
        <div
          className={`
            p-3
            border-t
            transition-colors duration-300
            ${
              dark
                ? "border-white/10"
                : "border-gray-200"
            }
          `}
        >
          {}
          <div
            className={`
              flex items-center gap-3
              p-3
              rounded-xl
              border
              transition-all duration-200

              ${
                dark
                  ? "bg-white/5 border-white/10 hover:bg-white/10"
                  : "bg-white border-gray-200 hover:bg-gray-50 shadow-sm"
              }
            `}
          >
            {}
            <img
              src={userdata.avatar}
              alt={userdata.name}
              className={`
                w-10 h-10
                rounded-full
                object-cover
                border
                ${
                  dark
                    ? "border-white/10"
                    : "border-gray-200"
                }
              `}
            />

            {}
            <div className="flex-1 min-w-0">
              <h1
                className={`
                  text-sm
                  font-semibold
                  truncate
                  ${
                    dark
                      ? "text-white"
                      : "text-gray-900"
                  }
                `}
              >
                {userdata.name}
              </h1>

              <p
                className={`
                  text-xs
                  mt-0.5
                  ${
                    dark
                      ? "text-gray-400"
                      : "text-gray-500"
                  }
                `}
              >
                Free Plan
              </p>
            </div>

            {}
            <div className="text-right">
              <button
                onClick={LogoutUser}
                className={`
                  w-full
                  px-4 py-2.5
                  rounded-lg
                  text-sm
                  font-semibold
                  border
                  transition-all duration-200
                  active:scale-95

                  ${
                    dark
                      ? `
                        text-white
                        bg-white/5
                        border-white/10
                        hover:bg-white
                        hover:text-black
                        hover:border-white
                      `
                      : `
                        text-gray-900
                        bg-gray-100
                        border-gray-200
                        hover:bg-black
                        hover:text-white
                        hover:border-black
                      `
                  }
                `}
              >
                Logout
              </button>
            </div>
          </div>

          <button
            onClick={UDashboard}
            className={`
              w-full
              mt-2
              px-3 py-2
              rounded-lg
              text-sm
              font-medium
              border
              transition-all duration-200
              active:scale-[0.98]

              ${
                dark
                  ? `
                    text-gray-200
                    bg-white/5
                    border-white/10
                    hover:bg-white/10
                    hover:text-white
                  `
                  : `
                    text-gray-700
                    bg-gray-50
                    border-gray-200
                    hover:bg-gray-100
                    hover:text-gray-900
                  `
              }
            `}
          >
            User Dashboard
          </button>
        </div>
      ) : (
        <button
          onClick={handleLogin}
          disabled={loading}
          className={`
            w-full
            mb-0.5
            flex items-center justify-center gap-3
            px-4 py-3
            border
            shadow-sm
            active:scale-95
            transition-all duration-200
            disabled:cursor-not-allowed
            disabled:opacity-60

            ${
              dark
                ? `
                  bg-white/5
                  text-white
                  border-white/10
                  hover:bg-white/10
                `
                : `
                  bg-white
                  text-gray-800
                  border-gray-300
                  hover:bg-gray-50
                `
            }
          `}
        >
          {loading ? (
            <>
              <span
                className={`
                  h-5
                  w-5
                  animate-spin
                  rounded-full
                  border-2
                  ${dark ? "border-white/20 border-t-white" : "border-black/20 border-t-black"}
                `}
              />
              <span className="font-medium">Signing in...</span>
            </>
          ) : (
            <>
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5"
              />
              <span className="font-medium">
                Continue with Google
              </span>
            </>
          )}
        </button>
      )}
    </div>
  );
}