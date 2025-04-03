const db = require('../config/database');
const responseMatch = require('../response/match.response')

exports.getAll = (req, res) => {
    db.query('SELECT * FROM teams ORDER BY name', (err, results) => {
        if (err) {
            console.error('Erro ao listar times:', err);
            return res.status(500).send(err);
        }
        res.json(results);
    });
};

exports.getById = (req, res) => {
    db.query('SELECT * FROM teams WHERE id = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length === 0) return res.status(404).json({ error: 'Time não encontrado' });
        res.json(results[0]);
    });
};

exports.getMatchs = (req, res) => {
  const { championship_id, id } = req.params;

  if (!championship_id) {
    return res.status(400).json({ error: 'O parâmetro championship_id é obrigatório' });
}


  let query = `
            SELECT 
                teams.*, 
                matches_home.*
            FROM teams
            JOIN matches AS matches_home ON matches_home.team_home = teams.id 
            WHERE teams.id = ? AND matches_home.championship_id = ?

            UNION ALL

            SELECT 
                teams.*, 
                matches_away.*
            FROM teams
            JOIN matches AS matches_away ON matches_away.team_away = teams.id 
            WHERE teams.id = ? AND matches_away.championship_id = ?
      `;
  db.query(query, [id, championship_id, id, championship_id], (err, results) => {
      if (err) return res.status(500).send(err);
      if (results.length === 0) return res.status(404).json({ error: 'Time não encontrado' });
      console.log(results)
      let ret = responseMatch(results)
      res.json(ret);
  });
};


exports.create = (req, res) => {
    const { name, logo } = req.body;
    db.query('INSERT INTO teams (name, logo) VALUES (?, ?)', [name, logo], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ id: result.insertId, name, logo });
    });
};

exports.update = (req, res) => {
    const { name, logo } = req.body;
    db.query('UPDATE teams SET name = ?, logo = ? WHERE id = ?', [name, logo, req.params.id], (err, results) => {
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Time não encontrado' });
        res.json({ message: 'Time atualizado com sucesso' });
    });
};

exports.remove = (req, res) => {
    db.query('DELETE FROM teams WHERE id = ?', [req.params.id], (err, results) => {
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Time não encontrado' });
        res.json({ message: 'Time removido com sucesso' });
    });
};
