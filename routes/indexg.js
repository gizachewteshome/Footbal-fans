module.exports = {
    getHomePageGoal: (req, res) => {
        let query = "SELECT * FROM `goals` ORDER BY id ASC"; // query database to get all the players

        // execute query
        db.query(query, (err, result) => {
            if (err) {
                res.redirect('/');
            }
            res.render('indexg.ejs', {
                title: "Welcome to Football | View Goals"
                , goals: result
            });
        });
    },
};