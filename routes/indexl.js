module.exports = {
    getHomePageLeague: (req, res) => {
        let query = "SELECT * FROM `leagues` ORDER BY id ASC"; // query database to get all the players

        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/');
            }
            res.render('indexl.ejs', {
                title: "Welcome to Football | View Leagues"
                , leagues: result
            });
        });
    },
};