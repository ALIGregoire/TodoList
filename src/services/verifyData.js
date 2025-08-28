export const verifyEmail = (email) => {
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regexEmail.test(email);
};

export const verifyPassword = (password) => {
  const regexPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regexPassword.test(password);
};

export const verifyName = (name) => {
  if (name.length < 3 || name.length > 50) {
    return false;
  }
  return true;
};

export const verifyUserName = (userName) => {
  if (userName.length < 3 || userName.length > 30) {
    return false;
  }

  const regexUserName = /^[a-zA-Z0-9]+$/;
  return regexUserName.test(userName);
};

export const verifyPasswordConfirme = (password, confirmPassword) => {
  if (!password == confirmPassword) {
    return false;
  }

  return true;
};
