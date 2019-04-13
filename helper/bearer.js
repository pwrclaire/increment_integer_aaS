const BEARER = "Bearer";

const parseBearer = token => {
  let index = token.indexOf(BEARER);
  if (index != 0) {
    console.log("ParseBeare helper error!");
    return false;
  }
  const result = token.substr(BEARER.length + 1);
  return result;
};

const encodeBearer = token => {
  return `${BEARER} ${token}`;
};

module.exports = {
  parseBearer,
  encodeBearer
};
