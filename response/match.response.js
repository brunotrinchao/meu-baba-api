const formatMatchResponse = (results = []) => {
    
  if (!Array.isArray(results)) {
    console.warn("formatMatchResponse recebeu um valor inválido:", results);
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
          home: {
            id: item.home_team_id,
            name: item.home_team_name,
            logo: item.home_team_logo,
            score: item.score_home
          },
          away: {
            id: item.away_team_id,
            name: item.away_team_name,
            logo: item.away_team_logo,
            score: item.score_away
          }
      }
  }));
};

module.exports = formatMatchResponse