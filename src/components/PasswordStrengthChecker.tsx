import { useState, useEffect } from "react";
import {
  Check,
  X,
  Eye,
  EyeOff,
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Lock,
} from "lucide-react";

interface PasswordStrengthCheckerProps {
  password: string;
  onPasswordChange: (password: string) => void;
  onStrengthChange?: (strength: number, isValid: boolean) => void;
  showRequirements?: boolean;
  className?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

interface Requirement {
  id: string;
  label: string;
  test: (password: string) => boolean;
}

const requirements: Requirement[] = [
  {
    id: "length",
    label: "At least 8 characters",
    test: (pwd) => pwd.length >= 8,
  },
  {
    id: "uppercase",
    label: "One uppercase letter",
    test: (pwd) => /[A-Z]/.test(pwd),
  },
  {
    id: "lowercase",
    label: "One lowercase letter",
    test: (pwd) => /[a-z]/.test(pwd),
  },
  {
    id: "number",
    label: "One number",
    test: (pwd) => /[0-9]/.test(pwd),
  },
  {
    id: "special",
    label: "One special character (!@#$%^&*)",
    test: (pwd) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
  },
];

const calculateStrength = (password: string): number => {
  if (!password) return 0;

  let score = 0;
  const passedRequirements = requirements.filter((req) => req.test(password));
  score = passedRequirements.length;

  // Bonus points for extra length
  if (password.length >= 12) score += 0.5;
  if (password.length >= 16) score += 0.5;

  return Math.min(score, 5);
};

const getStrengthLabel = (strength: number): { label: string; color: string; icon: React.ReactNode } => {
  if (strength === 0) {
    return {
      label: "Enter password",
      color: "text-gray-400",
      icon: <Lock className="w-5 h-5" />,
    };
  }
  if (strength <= 2) {
    return {
      label: "Weak",
      color: "text-red-500",
      icon: <ShieldX className="w-5 h-5" />,
    };
  }
  if (strength <= 3) {
    return {
      label: "Fair",
      color: "text-orange-500",
      icon: <ShieldAlert className="w-5 h-5" />,
    };
  }
  if (strength <= 4) {
    return {
      label: "Good",
      color: "text-yellow-500",
      icon: <Shield className="w-5 h-5" />,
    };
  }
  return {
    label: "Strong",
    color: "text-green-500",
    icon: <ShieldCheck className="w-5 h-5" />,
  };
};

const getStrengthColor = (strength: number): string => {
  if (strength <= 2) return "bg-red-500";
  if (strength <= 3) return "bg-orange-500";
  if (strength <= 4) return "bg-yellow-500";
  return "bg-green-500";
};

const getStrengthGradient = (strength: number): string => {
  if (strength <= 2) return "from-red-500 to-red-400";
  if (strength <= 3) return "from-orange-500 to-orange-400";
  if (strength <= 4) return "from-yellow-500 to-yellow-400";
  return "from-green-500 to-emerald-400";
};

export default function PasswordStrengthChecker({
  password,
  onPasswordChange,
  onStrengthChange,
  showRequirements = true,
  className = "",
  placeholder = "Enter your password",
  label = "Password",
  required = false,
}: PasswordStrengthCheckerProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [strength, setStrength] = useState(0);

  useEffect(() => {
    const newStrength = calculateStrength(password);
    setStrength(newStrength);
    if (onStrengthChange) {
      onStrengthChange(newStrength, newStrength >= 4);
    }
  }, [password, onStrengthChange]);

  const strengthInfo = getStrengthLabel(strength);
  const strengthPercentage = (strength / 5) * 100;
  const passedCount = requirements.filter((req) => req.test(password)).length;

  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Password Input */}
      <div
        className={`relative group transition-all duration-200 ${
          isFocused ? "transform scale-[1.02]" : ""
        }`}
      >
        <div
          className={`absolute inset-0 bg-gradient-to-r ${
            strength > 0 ? getStrengthGradient(strength) : "from-gray-200 to-gray-300"
          } rounded-xl blur opacity-20 transition-opacity duration-300 ${
            isFocused ? "opacity-40" : ""
          }`}
        />
        <div
          className={`relative flex items-center bg-white border-2 rounded-xl overflow-hidden transition-all duration-200 ${
            isFocused
              ? strength > 0
                ? `border-${getStrengthColor(strength).replace("bg-", "").replace("-500", "-400")}`
                : "border-indigo-400"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="pl-4 pr-3 py-3">
            <Lock
              className={`w-5 h-5 transition-colors duration-200 ${
                isFocused ? "text-indigo-500" : "text-gray-400"
              }`}
            />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="flex-1 py-3 pr-4 bg-transparent outline-none text-gray-900 placeholder-gray-400"
            required={required}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="p-3 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Strength Meter */}
      {password && (
        <div className="mt-3 space-y-2">
          {/* Strength Bar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full ${getStrengthColor(
                  strength
                )} transition-all duration-500 ease-out rounded-full`}
                style={{ width: `${strengthPercentage}%` }}
              />
            </div>
            <div className={`flex items-center gap-1.5 ${strengthInfo.color}`}>
              {strengthInfo.icon}
              <span className="text-sm font-semibold">{strengthInfo.label}</span>
            </div>
          </div>

          {/* Strength Score */}
          <p className="text-xs text-gray-500">
            Password strength: {passedCount}/{requirements.length} requirements met
          </p>
        </div>
      )}

      {/* Requirements List - Only show when password is weak (strength < 4) */}
      {showRequirements && password && strength < 4 && (
        <div className="mt-4 space-y-2 animate-fadeIn">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Requirements
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {requirements.map((req) => {
              const isMet = req.test(password);
              return (
                <div
                  key={req.id}
                  className={`flex items-center gap-2 text-sm transition-all duration-300 ${
                    isMet ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isMet
                        ? "bg-green-100 scale-100"
                        : "bg-gray-100 scale-90"
                    }`}
                  >
                    {isMet ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <X className="w-3 h-3" />
                    )}
                  </div>
                  <span className={isMet ? "font-medium" : ""}>{req.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Security Tip */}
      {strength >= 4 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-lg">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-700">
              <span className="font-semibold">Great job!</span> Your password is strong and secure.
            </p>
          </div>
        </div>
      )}

      {strength > 0 && strength < 4 && (
        <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg">
          <div className="flex items-start gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700">
              <span className="font-semibold">Tip:</span> Use a mix of uppercase, lowercase, numbers, and special characters for a stronger password.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
