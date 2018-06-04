const findPerm = (k) => { 
  const n = 62;
  const r = 3;
  const perm = [];
  const first = Math.ceil(k / Math.pow(n, r - 1));
  perm.push(first);
  const second = Math.ceil((k - (Math.pow(n, r - 1) * (first - 1))) / n);
  perm.push(second);
  const third = k - Math.pow(n, r - 1) * (first - 1) - n * (second - 1);
  perm.push(third);
  return perm;
};

module.exports = findPerm;