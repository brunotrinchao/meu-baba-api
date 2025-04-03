const { fill } = require("../models/team.model");

const formatTeamMatchResponse = (results = []) => {
    
  if (!Array.isArray(results)) {
    console.warn("formatTeamMatchResponse recebeu um valor inválido:", results);
    return [];
  }

  return results.map((item) => ({
      id: item.id,
      championship: {
          id: item.championship_id,
          year: item.year
      },
      round: item.round,
      match: {
          home: fill({
            id: item.team_home_id,
            name: item.home_team_name,
            logo: item.home_team_logo,
            score: item.score_home
          }),
          away: fill({
            id: item.team_away_id,
            name: item.away_team_name,
            logo: item.away_team_logo,
            score: item.score_away
          })
      }
  }));
};

module.exports = formatMatchResponse