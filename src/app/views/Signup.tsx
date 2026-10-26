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
  code: string;
  qualification: "ND" | "HND" | "Certificate" | "Diploma" | "Short Course";
  duration: string;
  description?: string;
  status: "Active" | "Inactive";
}

interface ApiResponse {
  success?: boolean;
  message?: string;
  departments?: Department[];
  data?: Department[];
}

const API_URL = import.meta.env.VITE_NODE_API_URL || "http://localhost:5001";

const REGISTER_ENDPOINT = `${API_URL}/api/register`;
const DEPARTMENTS_ENDPOINT = `${API_URL}/api/departments`;

const inputClass =
  "h-12 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none transition placeholder:text-muted-foreground/60 focus:border-[#c9a24a] focus:ring-4 focus:ring-[#c9a24a]/10";

const labelClass = "text-sm font-semibold text-[#0a1c33]";

const Signup = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // ---------- form state ----------
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Stores the Department _id, e.g. "68abc123..."
  const [department, setDepartment] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agree, setAgree] = useState(false);

  // ---------- UI state ----------
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // ---------- fetch departments ----------
  useEffect(() => {
    const fetchDepartments = async () => {
      setLoadingDepartments(true);
      setError("");

      try {
        const response = await fetch(DEPARTMENTS_ENDPOINT, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        const data: ApiResponse | Department[] = await response
          .json()
          .catch(() => ({}));

        if (!response.ok) {
          throw new Error(
            (!Array.isArray(data) && data?.message) ||
              "Unable to load available departments."
          );
        }

        // Accept [...], { departments: [...] } or { data: [...] }
        let list: Department[] = [];
        if (Array.isArray(data)) {
          list = data;
        } else if (Array.isArray(data.departments)) {
          list = data.departments;
        } else if (Array.isArray(data.data)) {
          list = data.data;
        }

        setDepartments(list.filter((item) => item.status === "Active"));
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load departments. Please try again."
        );
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, []);

  // Must come after all hooks
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // ---------- submit ----------
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!firstName.trim()) return setError("Please enter your first name.");
    if (!lastName.trim()) return setError("Please enter your last name.");
    if (!username.trim()) return setError("Please choose a username.");
    if (!email.trim()) return setError("Please enter your email address.");
    if (!phone.trim()) return setError("Please enter your phone number.");
    if (!department) return setError("Please select a department.");
    if (!password) return setError("Please create a password.");
    if (password.length < 6)
      return setError("Password must be at least 6 characters.");
    if (password !== confirmPassword)
      return setError("Passwords do not match.");
    if (!agree) return setError("You must agree to the Terms of Admission.");

    setSubmitting(true);

    try {
      const response = await fetch(REGISTER_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "student",
          username: username.trim(),
          email: email.trim().toLowerCase(),
          password,
          phone: phone.trim(),
          studentName: `${firstName.trim()} ${lastName.trim()}`,
          department,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data?.message || data?.error || "Registration failed. Please try again."
        );
      }

      setSuccess(true);

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

  const selectedDepartment = departments.find((item) => item._id === department);

  // ---------- page ----------
  return (
    <div className="min-h-dvh bg-background">
      <div className="grid min-h-dvh lg:grid-cols-2">
        {/* ================= LEFT SIDE ================= */}
        <div className="relative hidden overflow-hidden bg-[#050b16] lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_700px_500px_at_15%_10%,rgba(227,195,116,.12),transparent_60%)]" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#050b16] via-[#0a1c33] to-[#173a63]" />

          <div className="relative z-10 flex min-h-dvh w-full flex-col justify-between p-12 xl:p-16">
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
                      Choose your department
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-white/55">
                      Select from the departments currently offered by the
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

            <div className="border-t border-white/10 pt-6">
              <p className="max-w-lg text-sm italic leading-6 text-white/45">
                "I'm more attracted to this polytechnic due to the opportunity
                to study under international influence."
              </p>
              <p className="mt-2 text-xs text-white/35">— Prospective Student</p>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex min-h-dvh items-center justify-center px-5 py-10 sm:px-8 lg:px-12 xl:px-20">
          <div className="w-full max-w-xl">
            <Link
              to="/login"
              className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>

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
                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700">
                    {error}
                  </div>
                )}

                {/* NAME */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className={labelClass}>
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
                      className={inputClass}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="lastName" className={labelClass}>
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
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* USERNAME */}
                <div className="space-y-2">
                  <label htmlFor="username" className={labelClass}>
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
                    className={inputClass}
                  />
                </div>

                {/* EMAIL */}
                <div className="space-y-2">
                  <label htmlFor="email" className={labelClass}>
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
                    className={inputClass}
                  />
                </div>

                {/* PHONE */}
                <div className="space-y-2">
                  <label htmlFor="phone" className={labelClass}>
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
                    className={inputClass}
                  />
                </div>

                {/* DEPARTMENT */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <label htmlFor="department" className={labelClass}>
                      Department of interest
                    </label>

                    {departments.length > 0 && !loadingDepartments && (
                      <span className="text-xs text-muted-foreground">
                        {departments.length} available
                      </span>
                    )}
                  </div>

                  <select
                    id="department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                    disabled={loadingDepartments || departments.length === 0}
                    className="h-12 w-full rounded-lg border border-border bg-background px-4 text-sm outline-none transition focus:border-[#c9a24a] focus:ring-4 focus:ring-[#c9a24a]/10 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loadingDepartments ? (
                      <option value="">Loading departments...</option>
                    ) : departments.length === 0 ? (
                      <option value="">No departments currently available</option>
                    ) : (
                      <>
                        <option value="">Select a department</option>
                        {departments.map((item) => (
                          <option key={item._id} value={item._id}>
                            {item.name} ({item.qualification} • {item.duration})
                          </option>
                        ))}
                      </>
                    )}
                  </select>

                  {!loadingDepartments && departments.length === 0 && (
                    <p className="text-xs text-red-600">
                      There are currently no active departments available for
                      registration.
                    </p>
                  )}

                  {selectedDepartment && (
                    <div className="rounded-lg bg-[#faf6ec] px-4 py-3 text-xs text-[#5c6c82]">
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        <span>
                          <strong>Code:</strong> {selectedDepartment.code}
                        </span>
                        <span>
                          <strong>Qualification:</strong>{" "}
                          {selectedDepartment.qualification}
                        </span>
                        <span>
                          <strong>Duration:</strong>{" "}
                          {selectedDepartment.duration}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* PASSWORDS */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="password" className={labelClass}>
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
                        className={`${inputClass} pr-12`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
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

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className={labelClass}>
                      Confirm password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                        className={`${inputClass} pr-12`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        aria-label={
                          showConfirmPassword ? "Hide password" : "Show password"
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

                {/* TERMS */}
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

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={
                    submitting || loadingDepartments || departments.length === 0
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