const db = require('../config/database');

exports.getAll = (req, res) => {
    db.query('SELECT * FROM championships', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
};

exports.getById = (req, res) => {
    db.query('SELECT * FROM championships WHERE id = ?', [req.params.id], (err, results) => {
        if (results.length === 0) return res.status(404).json({ error: 'Campeonato não encontrado' });
        res.json(results[0]);
    });
};

exports.create = (req, res) => {
    const { team_id, year } = req.body;
    db.query('INSERT INTO championships (team_id, year) VALUES (?, ?)', [team_id, year], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ id: result.insertId, team_id, year });
    });
};

exports.update = (req, res) => {
    const { team_id, year } = req.body;
    db.query('UPDATE championships SET team_id = ?, year = ? WHERE id = ?', [team_id, year, req.params.id], (err, results) => {
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Campeonato não encontrado' });
        res.json({ message: 'Campeonato atualizado com sucesso' });
    });
};

exports.remove = (req, res) => {
    db.query('DELETE FROM championships WHERE id = ?', [req.params.id], (err, results) => {
        if (results.affectedRows === 0) return res.status(404).json({ error: 'Campeonato não encontrado' });
        res.json({ message: 'Campeonato removido com sucesso' });
    });
};
