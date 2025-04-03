const db = require('../config/database');
const responseMatch = require('../response/match.response')

const getMatchQuery = `
    SELECT 
        matches.*, 
        championships.year AS year,
        home_team.id AS home_team_id,
        home_team.name AS home_team_name,
        home_team.logo AS home_team_logo,
        away_team.id AS away_team_id,
        away_team.name AS away_team_name,
        away_team.logo AS away_team_logo
    FROM matches
    JOIN championships ON matches.championship_id = championships.id
    JOIN teams AS home_team ON matches.team_home = home_team.id
    JOIN teams AS away_team ON matches.team_away = away_team.id
    WHERE matches.championship_id = ?
`;

// Listar todas as partidas
exports.getAll = (req, res) => {
  const { championship_id } = req.params; // Obtém ID da partida e campeonato da URL

  if (!championship_id) {
      return res.status(400).json({ error: 'O parâmetro championship_id é obrigatório' });
  }

  const query = `${getMatchQuery} ORDER BY matches.round ASC`;

  db.query(query, [championship_id], (err, results) => {
      if (err) return res.status(500).json({ error: 'Erro ao buscar partidas', details: err });

      let ret = responseMatch(results)

      res.json(ret);
  });
};

// Buscar uma partida por ID
exports.getById = (req, res) => {
  const { id, championship_id } = req.params; // Obtém ID da partida e campeonato da URL

  if (!championship_id) {
      return res.status(400).json({ error: 'O parâmetro championship_id é obrigatório' });
  }

  const query = `${getMatchQuery} AND matches.id = ?`;

  db.query(query, [championship_id, id], (err, results) => {
      if (err) return res.status(500).json({ error: 'Erro ao buscar a partida', details: err });
      if (results.length === 0) return res.status(404).json({ error: 'Partida não encontrada' });

      let ret = responseMatch(results)

      res.json(ret[0]);
  });
};

exports.getByTeam = (req, res) => {
  const { team_id, championship_id } = req.params; // Obtém ID da partida e campeonato da URL

  if (!team_id) {
      return res.status(400).json({ error: 'O parâmetro team_id é obrigatório' });
  }

  if (!championship_id) {
    return res.status(400).json({ error: 'O parâmetro championship_id é obrigatório' });
}

  const query = `
  SELECT 
    m.*,
    m.score_home AS home_team_score,
    ht.id AS home_team_id, 
    ht.name AS home_team_name, 
    ht.logo AS home_team_logo,
    at.name AS away_team_name,
    at.logo AS away_team_logo,
    at.id AS away_team_id,
    m.score_away AS away_team_score
FROM matches m
JOIN teams ht ON m.team_home = ht.id
JOIN teams at ON m.team_away = at.id
WHERE (m.team_home = ? OR m.team_away = ?)
AND m.championship_id = ?
ORDER BY m.round
  `;

  db.query(query, [team_id, team_id, championship_id], (err, results) => {
      if (err) return res.status(500).json({ error: 'Erro ao buscar a partida', details: err });
      if (results.length === 0) return res.status(404).json({ error: 'jogos não encontrados' });

      let ret = responseMatch(results)

      res.json(ret);
  });
};

// Criar uma nova partida
exports.create = (req, res) => {
    const { round, team_home, team_away, score_home, score_away } = req.body;
    if (!round || !team_home || !team_away || score_home === undefined || score_away === undefined) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    
    db.query(
        'INSERT INTO matches (round, team_home, team_away, score_home, score_away) VALUES (?, ?, ?, ?, ?)',
        [round, team_home, team_away, score_home, score_away],
        (err, result) => {
            if (err) return res.status(500).send(err);
            
            const matchId = result.insertId;

            const query = `${getMatchQuery} AND matches.id = ?`;
    
            db.query(query, [championship_id, matchId], (err, results) => {
                if (err) return res.status(500).json({ error: err.message });
    
                if (results.length === 0) {
                    return res.status(404).json({ error: 'Partida não encontrada após criação' });
                }

                let ret = responseMatch(results)
    
                res.status(201).json(ret[0]);
            });

        }
    );
};

// Atualizar uma partida existente
exports.update = (req, res) => {
    const { round, team_home, team_away, score_home, score_away } = req.body;
    const { id, championship_id } = req.params; 

  if (!championship_id) {
      return res.status(400).json({ error: 'O parâmetro championship_id é obrigatório' });
  }

    if (!round || !team_home || !team_away || score_home === undefined || score_away === undefined) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }
    
    db.query(
        'UPDATE matches SET round = ?, team_home = ?, team_away = ?, score_home = ?, score_away = ? WHERE id = ? AND championship_id = ?',
        [round, team_home, team_away, score_home, score_away, id, championship_id],
        (err, results) => {
            if (results.affectedRows === 0) return res.status(404).json({ error: 'Partida não encontrada' });         
    
            const matchId = id;

            const query = `${getMatchQuery} AND matches.id = ?`;

            db.query(query, [championship_id, matchId], (err, results) => {
                if (err) return res.status(500).json({ error: err.message });
    
                if (results.length === 0) {
                    return res.status(404).json({ error: 'Partida não encontrada após criação' });
                }

                let ret = responseMatch(results)
    
                res.status(201).json(ret[0]);
            });

        }
    );
};

// Atualiza gols partida
exports.updateScore = (req, res) => {
  const { score_home, score_away } = req.body;
  const { id, championship_id } = req.params; 

  if (!championship_id) {
      return res.status(400).json({ error: 'O parâmetro championship_id é obrigatório' });
  }

  if (
    score_home === undefined || score_away === undefined || 
    score_home === null || score_away === null || 
    score_home < 0 || score_away < 0
) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }
  
  db.query(
      'UPDATE matches SET score_home = ?, score_away = ? WHERE id = ? AND championship_id = ?',
      [score_home, score_away, id, championship_id],
      (err, results) => {
          if (results.affectedRows === 0) return res.status(404).json({ error: 'Partida não encontrada' });         
  
          const matchId = id;

          const query = `${getMatchQuery} AND matches.id = ?`;

          db.query(query, [championship_id, matchId], (err, results) => {
              if (err) return res.status(500).json({ error: err.message });
  
              if (results.length === 0) {
                  return res.status(404).json({ error: 'Partida não encontrada após criação' });
              }

              let ret = responseMatch(results)
  
              res.status(201).json(ret[0]);
          });

      }
  );
}; 

// Remover uma partida
exports.remove = (req, res) => {
    db.query('DELETE FROM matches WHERE id = ?', [req.params.id], (err, results) => {
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Partida não encontrada' });
        res.json({ message: 'Partida removida com sucesso' });
    });
};