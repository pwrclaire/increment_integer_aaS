const validateEmail = (email) =>
{
  const regex = /\S+@\S+\.\S+/;
  return regex.test(email);
}

const validatePassword = (password) => {
  return password.length >= 6;
}

const validateInteger = int => {
  return int > -1;
}

module.exports = {
  validateEmail,
  validatePassword,
  validateInteger
}
