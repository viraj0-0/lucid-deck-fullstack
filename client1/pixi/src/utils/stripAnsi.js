export const stripAnsi = (text = "") => {
  return String(text).replace(/\u001b\[[0-9;]*[A-Za-z]/g, "");
};
