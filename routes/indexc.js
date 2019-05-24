module.exports = {
    getHomePageClub: (req, res) => {
        let query = "SELECT * FROM `clubs` ORDER BY id ASC"; // query database to get all the players

        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/');
            }
            res.render('indexc.ejs', {
                title: "Welcome to Football | View Clubs"
                , clubs: result
            });
        });
    },
};