import React, { useEffect, useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Loader2,
  GraduationCap,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";

interface Department {
  _id: string;
  name: string;
}

interface Programme {
  _id: string;
  name: string;
  code: string;
  department: Department | string;
  qualification: "ND" | "HND" | "Certificate" | "Diploma";
  duration: string;
  description?: string;
  status: "Active" | "Inactive";
}

interface ApiResponse {
  success?: boolean;
  message?: string;
  programmes?: Programme[];
  data?: Programme[];
}

const API_URL =
  import.meta.env.VITE_NODE_API_URL || "http://localhost:5001";

/*
|--------------------------------------------------------------------------
| API ENDPOINTS
|--------------------------------------------------------------------------
|
| Change these only if your backend routes use different paths.
|
*/

const REGISTER_ENDPOINT = `${API_URL}/api/register`;
const PROGRAMMES_ENDPOINT = `${API_URL}/api/programmes`;

const Signup = () => {
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();

  /*
  |--------------------------------------------------------------------------
  | FORM STATE
  |--------------------------------------------------------------------------
  */

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  /*
   * This stores the PROGRAMME _id.
   *
   * We no longer store:
   *
   * "Accountancy with Digital & Cloud Accounting"
   *
   * Instead we store something like:
   *
   * "68abc123..."
   */
  const [programme, setProgramme] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [agree, setAgree] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | UI STATE
  |--------------------------------------------------------------------------
  */

  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loadingProgrammes, setLoadingProgrammes] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

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
  | FETCH PROGRAMMES
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const fetchProgrammes = async () => {
      setLoadingProgrammes(true);
      setError("");

      try {
        const response = await fetch(PROGRAMMES_ENDPOINT, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data: ApiResponse = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            data?.message || "Unable to load available programmes."
          );
        }

        /*
         * Support either:
         *
         * {
         *   programmes: [...]
         * }
         *
         * OR
         *
         * {
         *   data: [...]
         * }
         *
         * OR directly:
         *
         * [...]
         */
        let programmeList: Programme[] = [];

        if (Array.isArray(data)) {
          programmeList = data;
        } else if (Array.isArray(data.programmes)) {
          programmeList = data.programmes;
        } else if (Array.isArray(data.data)) {
          programmeList = data.data;
        }

        /*
         * Only display Active programmes.
         */
        const activeProgrammes = programmeList.filter(
          (item) => item.status === "Active"
        );

        setProgrammes(activeProgrammes);

        /*
         * Automatically select the first programme
         * if programmes exist.
         */
        if (activeProgrammes.length > 0) {
          setProgramme(activeProgrammes[0]._id);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load programmes. Please try again."
        );
      } finally {
        setLoadingProgrammes(false);
      }
    };

    fetchProgrammes();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | SUBMIT REGISTRATION
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    /*
    |--------------------------------------------------------------------------
    | BASIC VALIDATION
    |--------------------------------------------------------------------------
    */

    if (!firstName.trim()) {
      setError("Please enter your first name.");
      return;
    }

    if (!lastName.trim()) {
      setError("Please enter your last name.");
      return;
    }

    if (!username.trim()) {
      setError("Please choose a username.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (!programme) {
      setError("Please select a programme.");
      return;
    }

    if (!password) {
      setError("Please create a password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agree) {
      setError("You must agree to the Terms of Admission.");
      return;
    }

    setSubmitting(true);

    try {
      /*
      |--------------------------------------------------------------------------
      | REGISTRATION REQUEST
      |--------------------------------------------------------------------------
      |
      | programme is now the MongoDB Programme _id.
      |
      */

      const response = await fetch(REGISTER_ENDPOINT, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          role: "student",

          username: username.trim(),

          email: email.trim().toLowerCase(),

          password,

          phone: phone.trim(),

          studentName: `${firstName.trim()} ${lastName.trim()}`,

          programme,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Registration failed. Please try again."
        );
      }

      /*
      |--------------------------------------------------------------------------
      | SUCCESS
      |--------------------------------------------------------------------------
      */

      setSuccess(true);

      /*
       * Give the student a moment to see the success message.
       */
      setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: {
            message:
              "Account created successfully. Please log in to continue your application.",
          },
        });
      }, 1800);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | PROGRAMME DISPLAY HELPERS
  |--------------------------------------------------------------------------
  */

  const getDepartmentName = (department: Department | string) => {
    if (!department) {
      return "";
    }

    if (typeof department === "string") {
      return "";
    }

    return department.name || "";
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
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_700px_500px_at_15%_10%,rgba(227,195,116,.12),transparent_60%)]" />

          <div className="absolute inset-0 bg-gradient-to-br from-[#050b16] via-[#0a1c33] to-[#173a63]" />

          <div className="relative z-10 flex min-h-dvh w-full flex-col justify-between p-12 xl:p-16">
            {/* Logo / Brand */}

            <div>
              <div className="mb-14 flex items-center gap-3">
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

              {/* Admissions ribbon */}

              <div className="mb-7 inline-flex items-center gap-2 bg-[#0a1c33] px-5 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-[#f0dfa8]">
                <GraduationCap className="h-4 w-4 text-[#e3c374]" />

                2026/2027 Admissions
              </div>

              <h1 className="max-w-xl font-serif text-4xl font-semibold leading-tight text-[#fffdf8] xl:text-5xl">
                Take your career to a global level.
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-white/65">
                Create your student account and begin your admission journey
                with British Transatlantic Polytechnic.
              </p>

              {/* Benefits */}

              <div className="mt-12 max-w-lg space-y-6">
                <div className="flex gap-4">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#e3c374]" />

                  <div>
                    <h3 className="font-medium text-white">
                      Simple application process
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-white/55">
                      Create your account and continue your application from
                      your student portal.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#e3c374]" />

                  <div>
                    <h3 className="font-medium text-white">
                      Choose your programme
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-white/55">
                      Select from the programmes currently offered by the
                      Polytechnic.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#e3c374]" />

                  <div>
                    <h3 className="font-medium text-white">
                      Continue from the portal
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-white/55">
                      After registration, log in to complete the next stages
                      of your application.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quote */}

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
            {/* Back */}

            <Link
              to="/login"
              className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />

              Back to login
            </Link>

            {/* Heading */}

            <div className="mb-8">
              <div className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[#a67f2e]">
                Admissions
              </div>

              <h2 className="font-serif text-3xl font-semibold tracking-tight text-[#0a1c33] sm:text-4xl">
                Create your application account
              </h2>

              <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
                Start your application by creating your student account. You
                can continue the remaining application process after signing
                in.
              </p>
            </div>

            {/* ============================================================
                SUCCESS
            ============================================================ */}

            {success ? (
              <div className="rounded-xl border border-green-200 bg-green-50 p-6">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-green-600" />

                  <div>
                    <h3 className="font-semibold text-green-800">
                      Account created successfully
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-green-700">
                      Your student account has been created. Redirecting you
                      to the login page…
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* ========================================================
                    ERROR
                ======================================================== */}

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
                    {error}
                  </div>
                )}

                {/* ========================================================
                    NAME
                ======================================================== */}

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="firstName"
                      className="text-sm font-semibold text-[#0a1c33]"
                    >
                      First name
                    </label>

                    <input
                      id="firstName"
                      type="text"
                      placeholder="Adaeze"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      autoComplete="given-name"
                      className="h-12 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-[#c9a24a] focus:ring-4 focus:ring-[#c9a24a]/10"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="lastName"
                      className="text-sm font-semibold text-[#0a1c33]"
                    >
                      Last name
                    </label>

                    <input
                      id="lastName"
                      type="text"
                      placeholder="Okonkwo"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      autoComplete="family-name"
                      className="h-12 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-[#c9a24a] focus:ring-4 focus:ring-[#c9a24a]/10"
                    />
                  </div>
                </div>

                {/* ========================================================
                    USERNAME
                ======================================================== */}

                <div className="space-y-2">
                  <label
                    htmlFor="username"
                    className="text-sm font-semibold text-[#0a1c33]"
                  >
                    Username
                  </label>

                  <input
                    id="username"
                    type="text"
                    placeholder="adaeze.okonkwo"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoComplete="username"
                    className="h-12 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-[#c9a24a] focus:ring-4 focus:ring-[#c9a24a]/10"
                  />
                </div>

                {/* ========================================================
                    EMAIL
                ======================================================== */}

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-[#0a1c33]"
                  >
                    Email address
                  </label>

                  <input
                    id="email"
                    type="email"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="h-12 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-[#c9a24a] focus:ring-4 focus:ring-[#c9a24a]/10"
                  />
                </div>

                {/* ========================================================
                    PHONE
                ======================================================== */}

                <div className="space-y-2">
                  <label
                    htmlFor="phone"
                    className="text-sm font-semibold text-[#0a1c33]"
                  >
                    Phone number
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    placeholder="+234 800 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    autoComplete="tel"
                    className="h-12 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-[#c9a24a] focus:ring-4 focus:ring-[#c9a24a]/10"
                  />
                </div>

                {/* ========================================================
                    PROGRAMME
                ======================================================== */}

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <label
                      htmlFor="programme"
                      className="text-sm font-semibold text-[#0a1c33]"
                    >
                      Programme of interest
                    </label>

                    {programmes.length > 0 && !loadingProgrammes && (
                      <span className="text-xs text-muted-foreground">
                        {programmes.length} available
                      </span>
                    )}
                  </div>

                  <select
                    id="programme"
                    value={programme}
                    onChange={(e) => setProgramme(e.target.value)}
                    required
                    disabled={loadingProgrammes || programmes.length === 0}
                    className="h-12 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none transition focus:border-[#c9a24a] focus:ring-4 focus:ring-[#c9a24a]/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loadingProgrammes ? (
                      <option value="">Loading programmes...</option>
                    ) : programmes.length === 0 ? (
                      <option value="">
                        No programmes currently available
                      </option>
                    ) : (
                      <>
                        <option value="">Select a programme</option>

                        {programmes.map((item) => (
                          <option key={item._id} value={item._id}>
                            {item.name} ({item.qualification} •{" "}
                            {item.duration})
                          </option>
                        ))}
                      </>
                    )}
                  </select>

                  {!loadingProgrammes && programmes.length === 0 && (
                    <p className="text-xs text-red-600">
                      There are currently no active programmes available for
                      registration.
                    </p>
                  )}

                  {programme && (
                    <div className="rounded-lg bg-[#faf6ec] px-4 py-3 text-xs text-[#5c6c82]">
                      {(() => {
                        const selected = programmes.find(
                          (item) => item._id === programme
                        );

                        if (!selected) {
                          return null;
                        }

                        return (
                          <div className="flex flex-wrap gap-x-4 gap-y-1">
                            <span>
                              <strong>Code:</strong> {selected.code}
                            </span>

                            <span>
                              <strong>Qualification:</strong>{" "}
                              {selected.qualification}
                            </span>

                            <span>
                              <strong>Duration:</strong> {selected.duration}
                            </span>

                            {getDepartmentName(selected.department) && (
                              <span>
                                <strong>Department:</strong>{" "}
                                {getDepartmentName(selected.department)}
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>

                {/* ========================================================
                    PASSWORDS
                ======================================================== */}

                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Password */}

                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="text-sm font-semibold text-[#0a1c33]"
                    >
                      Password
                    </label>

                    <div className="relative">
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                        className="h-12 w-full rounded-lg border border-border bg-background px-4 pr-12 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-[#c9a24a] focus:ring-4 focus:ring-[#c9a24a]/10"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
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

                    <p className="text-xs text-muted-foreground">
                      Minimum 6 characters.
                    </p>
                  </div>

                  {/* Confirm Password */}

                  <div className="space-y-2">
                    <label
                      htmlFor="confirmPassword"
                      className="text-sm font-semibold text-[#0a1c33]"
                    >
                      Confirm password
                    </label>

                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={
                          showConfirmPassword ? "text" : "password"
                        }
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={(e) =>
                          setConfirmPassword(e.target.value)
                        }
                        required
                        autoComplete="new-password"
                        className="h-12 w-full rounded-lg border border-border bg-background px-4 pr-12 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-[#c9a24a] focus:ring-4 focus:ring-[#c9a24a]/10"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword((prev) => !prev)
                        }
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                        className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-muted-foreground transition hover:text-primary"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* ========================================================
                    TERMS
                ======================================================== */}

                <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="mt-1 h-4 w-4 shrink-0 accent-[#a67f2e]"
                  />

                  <span>
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="font-semibold text-[#8a6a1f] hover:underline"
                    >
                      Terms of Admission
                    </Link>{" "}
                    and confirm that the information provided is accurate.
                  </span>
                </label>

                {/* ========================================================
                    SUBMIT
                ======================================================== */}

                <button
                  type="submit"
                  disabled={
                    submitting ||
                    loadingProgrammes ||
                    programmes.length === 0
                  }
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#e3c374] to-[#a67f2e] px-6 text-sm font-semibold text-[#050b16] shadow-lg shadow-[#c9a24a]/20 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#c9a24a]/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />

                      Creating Account…
                    </>
                  ) : (
                    <>
                      <GraduationCap className="h-4 w-4" />

                      Create Account & Continue
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ============================================================
                FOOTER
            ============================================================ */}

            <div className="mt-8 border-t border-border pt-6 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#8a6a1f] hover:underline"
              >
                Log in
              </Link>
            </div>

            <p className="mt-6 text-center text-xs leading-5 text-muted-foreground/70">
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

export default Signup;