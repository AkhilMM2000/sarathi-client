export const nameRegex = /^[A-Za-z\s]{3,}$/;
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const mobileRegex = /^[6-9]\d{9}$/;
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const validateName = (name: string): string | null => {
  if (!name) return "Name is required.";
  if (!nameRegex.test(name)) return "Invalid name! Must be at least 3 letters.";
  return null;
};

export const validateEmail = (email: string): string | null => {
  if (!email) return "Email is required.";
  if (!emailRegex.test(email)) return "Invalid email format!";
  return null;
};

export const validateMobile = (mobile: string): string | null => {
  if (!mobile) return "Mobile number is required.";
  if (!mobileRegex.test(mobile)) return "Invalid mobile number! Must be 10 digits.";
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return "Password is required.";
  if (!passwordRegex.test(password)) {
    return "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.";
  }
  return null;
};

export const getPasswordStrength = (password: string): { label: string; color: string; percentage: number } => {
  if (!password) return { label: "None", color: "transparent", percentage: 0 };
  
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[@$!%*?&]/.test(password)) strength++;

  const levels = [
    { label: "Very Weak", color: "#f44336", percentage: 20 },
    { label: "Weak", color: "#ff9800", percentage: 40 },
    { label: "Medium", color: "#ffc107", percentage: 60 },
    { label: "Strong", color: "#4caf50", percentage: 80 },
    { label: "Very Strong", color: "#00c853", percentage: 100 },
  ];

  return levels[strength - 1] || levels[0];
};

