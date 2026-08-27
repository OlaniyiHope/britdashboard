// import { useState } from "react";
// import { useNavigate, Navigate, Link } from "react-router-dom";
// import { useAuth } from "@/contexts/AuthContext";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const { login, isAuthenticated } = useAuth();
//   const navigate = useNavigate();

//   if (isAuthenticated) {
//     return <Navigate to="/dashboard" replace />;
//   }

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();

//     setError("");
//     setLoading(true);

//     try {
//       await login(email, password);
//       navigate("/dashboard");
//     } catch {
//       setError("Invalid email or password");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-dvh flex items-center justify-center bg-background px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))]">
//       <Card className="w-full max-w-md shadow-lg">
//         <CardHeader className="text-center space-y-4 px-4 sm:px-6">
//           <div>
//             <CardTitle className="text-xl sm:text-2xl text-foreground">
//               British Transatlantic Polytechnic
//             </CardTitle>

//             <CardDescription className="mt-1 text-sm">
//               Login to your portal
//             </CardDescription>
//           </div>
//         </CardHeader>

//         <CardContent className="px-4 pb-6 sm:px-6">
//           <form onSubmit={handleLogin} className="space-y-4">

//             {/* ERROR */}
//             {error ? (
//               <div className="bg-destructive/10 text-destructive border border-destructive/20 text-sm p-3 rounded-md">
//                 {error}
//               </div>
//             ) : null}

//             {/* EMAIL / USERNAME */}
//             <div className="space-y-2">
//               <Label htmlFor="email">
//                 Email / Username
//               </Label>

//               <Input
//                 id="email"
//                 placeholder="admin@example.com"
//                 autoComplete="username"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="min-h-11"
//               />
//             </div>

//             {/* PASSWORD */}
//             <div className="space-y-2">
//               <Label htmlFor="password">
//                 Password
//               </Label>

//               <div className="relative">
//                 <Input
//                   id="password"
//                   type={showPassword ? "text" : "password"}
//                   placeholder="********"
//                   autoComplete="current-password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   className="min-h-11 pr-12"
//                 />

//                 <button
//                   type="button"
//                   aria-label={
//                     showPassword
//                       ? "Hide password"
//                       : "Show password"
//                   }
//                   onClick={() =>
//                     setShowPassword((prev) => !prev)
//                   }
//                   className="absolute inset-y-0 right-0 inline-flex w-11 items-center justify-center text-slate-500 transition hover:text-primary"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-4 w-4" />
//                   ) : (
//                     <Eye className="h-4 w-4" />
//                   )}
//                 </button>
//               </div>
//             </div>

//             {/* FORGOT PASSWORD */}
//             <div className="flex justify-end">
//               <Link
//                 to="/session/forgot-password"
//                 className="text-sm font-medium text-primary hover:underline"
//               >
//                 Forgot Password?
//               </Link>
//             </div>

//             {/* LOGIN BUTTON */}
//             <Button
//               type="submit"
//               disabled={loading}
//               className="w-full min-h-11 gap-2"
//             >
//               {loading ? (
//                 <Loader2 className="h-4 w-4 animate-spin" />
//               ) : null}

//               {loading
//                 ? "Signing In..."
//                 : "Sign In"}
//             </Button>

//             {/* DIVIDER */}
//             <div className="relative my-5">
//               <div className="absolute inset-0 flex items-center">
//                 <span className="w-full border-t" />
//               </div>

//               <div className="relative flex justify-center text-xs uppercase">
//                 <span className="bg-background px-3 text-muted-foreground">
//                   New student?
//                 </span>
//               </div>
//             </div>

//             {/* SIGN UP */}
//             <div className="text-center">
//               <p className="text-sm text-muted-foreground">
//                 Don't have an account?
//               </p>

//               <Link
//                 to="/signup"
//                 className="mt-2 inline-flex items-center justify-center gap-2 text-sm font-semibold text-primary hover:underline"
//               >
//                 <UserPlus className="h-4 w-4" />
//                 Sign up for an account
//               </Link>
//             </div>

//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default Login;

import { useState } from "react";
import { Link, useNavigate, Navigate, useLocation } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Loader2,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { login, isAuthenticated } = useAuth();

  /*
  |--------------------------------------------------------------------------
  | FORM STATE
  |--------------------------------------------------------------------------
  */

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /*
  |--------------------------------------------------------------------------
  | UI STATE
  |--------------------------------------------------------------------------
  */

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | SUCCESS MESSAGE FROM SIGNUP
  |--------------------------------------------------------------------------
  |
  | Signup redirects here with:
  |
  | navigate("/login", {
  |   state: {
  |     message: "Account created successfully..."
  |   }
  | })
  |
  */

  const successMessage = location.state?.message;

  /*
  |--------------------------------------------------------------------------
  | REDIRECT AUTHENTICATED USERS
  |--------------------------------------------------------------------------
  */

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  /*
  |--------------------------------------------------------------------------
  | LOGIN
  |--------------------------------------------------------------------------
  */

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email or username.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      await login(email.trim(), password);

      navigate("/dashboard", {
        replace: true,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Invalid email/username or password."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | PAGE
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-dvh bg-background">
      <div className="grid min-h-dvh lg:grid-cols-2">

        {/* ================================================================
            LEFT SIDE
        ================================================================ */}

        <div className="relative hidden overflow-hidden bg-[#050b16] lg:flex">

          {/* Gold glow */}

          <div className="absolute inset-0 bg-[radial-gradient(ellipse_700px_500px_at_15%_10%,rgba(227,195,116,.12),transparent_60%)]" />

          {/* Navy gradient */}

          <div className="absolute inset-0 bg-gradient-to-br from-[#050b16] via-[#0a1c33] to-[#173a63]" />

          <div className="relative z-10 flex min-h-dvh w-full flex-col justify-between p-12 xl:p-16">

            {/* ============================================================
                BRAND
            ============================================================ */}

            <div>

              <div className="mb-14 flex items-center gap-3">

                {/* Logo */}

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#e3c374] to-[#a67f2e] text-lg font-bold text-[#050b16]">
                  BP
                </div>

                <div>

                  <div className="font-serif text-lg font-semibold text-[#fffdf8]">
                    British Transatlantic Polytechnic
                  </div>

                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#e3c374]">
                    Student Portal
                  </div>

                </div>

              </div>

              {/* ========================================================
                  PORTAL RIBBON
              ======================================================== */}

              <div className="mb-7 inline-flex items-center gap-2 bg-[#0a1c33] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-[#f0dfa8]">

                <GraduationCap className="h-4 w-4 text-[#e3c374]" />

                Student Portal

              </div>

              {/* ========================================================
                  MAIN HEADING
              ======================================================== */}

              <h1 className="max-w-xl font-serif text-4xl font-semibold leading-tight text-[#fffdf8] xl:text-5xl">
                Welcome back to your academic journey.
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-white/65">
                Sign in to your British Transatlantic Polytechnic student
                portal to continue your application and access your academic
                journey.
              </p>

              {/* ========================================================
                  BENEFITS
              ======================================================== */}

              <div className="mt-12 max-w-lg space-y-6">

                {/* Benefit 1 */}

                <div className="flex gap-4">

                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#e3c374]" />

                  <div>

                    <h3 className="font-medium text-white">
                      Continue your application
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-white/55">
                      Pick up where you left off and continue your admission
                      process from your student portal.
                    </p>

                  </div>

                </div>

                {/* Benefit 2 */}

                <div className="flex gap-4">

                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#e3c374]" />

                  <div>

                    <h3 className="font-medium text-white">
                      Manage your student information
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-white/55">
                      Access your programme information and manage your student
                      profile from one place.
                    </p>

                  </div>

                </div>

                {/* Benefit 3 */}

                <div className="flex gap-4">

                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#e3c374]" />

                  <div>

                    <h3 className="font-medium text-white">
                      Stay connected
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-white/55">
                      Keep up with important information throughout your
                      academic journey.
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* ============================================================
                QUOTE
            ============================================================ */}

            <div className="border-t border-white/10 pt-6">

              <p className="max-w-lg text-sm italic leading-6 text-white/45">
                "I'm more attracted to this polytechnic due to the opportunity
                to study under international influence."
              </p>

              <p className="mt-2 text-xs text-white/35">
                — Prospective Student
              </p>

            </div>

          </div>

        </div>

        {/* ================================================================
            RIGHT SIDE
        ================================================================ */}

        <div className="flex min-h-dvh items-center justify-center px-5 py-10 sm:px-8 lg:px-12 xl:px-20">

          <div className="w-full max-w-xl">

            {/* ============================================================
                MOBILE BRAND
            ============================================================ */}

            <div className="mb-10 flex items-center gap-3 lg:hidden">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#e3c374] to-[#a67f2e] text-base font-bold text-[#050b16]">
                BP
              </div>

              <div>

                <div className="font-serif text-base font-semibold text-[#0a1c33]">
                  British Transatlantic Polytechnic
                </div>

                <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#a67f2e]">
                  Student Portal
                </div>

              </div>

            </div>

            {/* ============================================================
                HEADING
            ============================================================ */}

            <div className="mb-8">

              <div className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[#a67f2e]">
                Student Portal
              </div>

              <h2 className="font-serif text-3xl font-semibold tracking-tight text-[#0a1c33] sm:text-4xl">
                Welcome back
              </h2>

              <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
                Sign in to your student account to continue your application
                and access your Polytechnic portal.
              </p>

            </div>

            {/* ============================================================
                SUCCESS MESSAGE
            ============================================================ */}

            {successMessage && (

              <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4">

                <div className="flex items-start gap-3">

                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />

                  <div>

                    <p className="text-sm font-semibold text-green-800">
                      Account created successfully
                    </p>

                    <p className="mt-1 text-sm leading-6 text-green-700">
                      {successMessage}
                    </p>

                  </div>

                </div>

              </div>

            )}

            {/* ============================================================
                LOGIN FORM
            ============================================================ */}

            <form
              onSubmit={handleLogin}
              className="space-y-6"
            >

              {/* ========================================================
                  ERROR
              ======================================================== */}

              {error && (

                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
                  {error}
                </div>

              )}

              {/* ========================================================
                  EMAIL / USERNAME
              ======================================================== */}

              <div className="space-y-2">

                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-[#0a1c33]"
                >
                  Email / Username
                </label>

                <input
                  id="email"
                  type="text"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                  className="h-12 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-[#c9a24a] focus:ring-4 focus:ring-[#c9a24a]/10"
                />

              </div>

              {/* ========================================================
                  PASSWORD
              ======================================================== */}

              <div className="space-y-2">

                <div className="flex items-center justify-between gap-3">

                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-[#0a1c33]"
                  >
                    Password
                  </label>

                  <Link
                    to="/session/forgot-password"
                    className="text-xs font-semibold text-[#8a6a1f] hover:underline sm:text-sm"
                  >
                    Forgot password?
                  </Link>

                </div>

                <div className="relative">

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="h-12 w-full rounded-lg border border-border bg-background px-4 pr-12 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-[#c9a24a] focus:ring-4 focus:ring-[#c9a24a]/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted-foreground transition hover:text-primary"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>

                </div>

              </div>

              {/* ========================================================
                  SIGN IN BUTTON
              ======================================================== */}

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#e3c374] to-[#a67f2e] px-6 text-sm font-semibold text-[#050b16] shadow-lg shadow-[#c9a24a]/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#c9a24a]/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >

                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    <GraduationCap className="h-4 w-4" />
                    Sign In
                  </>
                )}

              </button>

              {/* ========================================================
                  DIVIDER
              ======================================================== */}

              <div className="relative my-7">

                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>

                <div className="relative flex justify-center">

                  <span className="bg-background px-4 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    New student?
                  </span>

                </div>

              </div>

              {/* ========================================================
                  SIGN UP
              ======================================================== */}

              <div className="rounded-xl border border-[#e8dcc0] bg-[#faf6ec] p-5 text-center">

                <p className="text-sm text-[#5c6c82]">
                  Don't have a student account yet?
                </p>

                <Link
                  to="/signup"
                  className="mt-3 inline-flex items-center justify-center gap-2 text-sm font-semibold text-[#8a6a1f] transition hover:gap-3 hover:underline"
                >
                  Create your application account

                  <ArrowRight className="h-4 w-4" />

                </Link>

              </div>

            </form>

            {/* ============================================================
                FOOTER
            ============================================================ */}

            <p className="mt-10 text-center text-xs leading-5 text-muted-foreground/70">

              © 2026 British Transatlantic Polytechnic, Akure.
              <br />

              All rights reserved.

            </p>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Login;