import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import type {
  User,
  AuthState,
  LoginCredentials,
  RegisterData,
  UserRole,
} from "@/types/auth";
import { authAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initAuth = () => {
      try {
        const token = localStorage.getItem("authToken");
        const userStr = localStorage.getItem("user");

        if (token && userStr) {
          const user = JSON.parse(userStr) as User;
          setAuthState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuthState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      const response = await authAPI.login(credentials);

      if (response.success) {
        const { user, token } = response.data;

        // Store in localStorage
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Update state
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });

        toast({
          title: "Login Successful",
          description: `Welcome back, ${user.firstName}!`,
        });

        // Navigate based on role
        navigateByRole(user.role);
      }
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));

      const errorMessage =
        error instanceof Error
          ? (error as { response?: { data?: { error?: string } } }).response
              ?.data?.error || "Login failed. Please try again."
          : "Login failed. Please try again.";
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));

      const response = await authAPI.register(data);

      if (response.success) {
        const { user, token } = response.data;

        // Store in localStorage
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));

        // Update state
        setAuthState({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });

        toast({
          title: "Registration Successful",
          description: `Welcome, ${user.firstName}! Your account has been created.`,
        });

        // Navigate based on role
        navigateByRole(user.role);
      }
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));

      const errorMessage =
        error instanceof Error
          ? (error as { response?: { data?: { error?: string } } }).response
              ?.data?.error || "Registration failed. Please try again."
          : "Registration failed. Please try again.";
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    authAPI.logout();
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });

    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });

    navigate("/");
  };

  const updateUser = (user: User) => {
    localStorage.setItem("user", JSON.stringify(user));
    setAuthState((prev) => ({ ...prev, user }));
  };

  const navigateByRole = (role: UserRole) => {
    switch (role) {
      case "L1_MASTER_ADMIN":
        navigate("/admin/dashboard");
        break;
      case "L2_EXEC_ADMIN":
        navigate("/executive/dashboard");
        break;
      case "L3_CITIZEN":
        navigate("/citizen");
        break;
      default:
        navigate("/");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
