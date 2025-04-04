const team = {
  id: null,
  name: null,
  logo: null,
  score: null
};

const fill = (data = {}) => {
  return {
    id: data.id || null,
    name: data.name || null,
    logo: data.logo || null,
    score: data.score || null
  };
};

module.exports = { team, fill };
