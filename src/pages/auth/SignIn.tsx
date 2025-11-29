import React, { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Users, User, Eye, EyeOff, ArrowLeft } from "lucide-react";
import type { UserRole } from "@/types/auth";
import { ROLE_LABELS, ROLE_DESCRIPTIONS } from "@/types/auth";

const SignIn = () => {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get("role") as UserRole | null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const role = roleParam || "L3_CITIZEN";

  const roleConfig = {
    L1_MASTER_ADMIN: {
      icon: Shield,
      gradient: "from-primary to-primary-hover",
      title: "Master Admin",
      subtitle: "Minister/MLA/MP Portal",
    },
    L2_EXEC_ADMIN: {
      icon: Users,
      gradient: "from-info to-info/80",
      title: "Executive Admin",
      subtitle: "PA/PS/OSD Portal",
    },
    L3_CITIZEN: {
      icon: User,
      gradient: "from-success to-success/80",
      title: "Citizen Portal",
      subtitle: "Public Access",
    },
  };

  const config = roleConfig[role];
  const IconComponent = config.icon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login({ email, password, role });
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-card flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Back to Role Selection */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Portal Selection
        </Button>

        <Card className="shadow-elevated">
          {/* Header with Role Badge */}
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto mb-2 p-4 rounded-full bg-gradient-card shadow-card w-fit">
              <IconComponent className="h-10 w-10 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">
                {config.title}
              </CardTitle>
              <CardDescription className="text-base font-medium text-primary mt-1">
                {config.subtitle}
              </CardDescription>
            </div>
            <p className="text-sm text-muted-foreground">
              Sign in to access your dashboard
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full"
                variant="government"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 border-t pt-6">
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                to={`/signup?role=${role}`}
                className="text-primary hover:underline font-medium"
              >
                Create Account
              </Link>
            </div>

            {/* Role Description */}
            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-xs text-muted-foreground">
                {ROLE_DESCRIPTIONS[role]}
              </p>
            </div>
          </CardFooter>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            🔒 Secure government portal with encrypted authentication
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
