export const validateMobile = (mobile: string): boolean => {
  const regex = /^07[1|2|4|5|6|7|8][0-9]{7}$/;
  return regex.test(mobile);
};

export const containsNumbers = (str: string): boolean => {
  const regex = /\d/;
  return regex.test(str);
};

export const validatePassword = (password: string): boolean => {
  const regex =
    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\S+$).{8,}$/;
  return regex.test(password);
};

export const validateEmail = (email: string): boolean => {
  const regex = /^[a-zA-Z0-9_!#$%&'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$/;
  return regex.test(email);
};