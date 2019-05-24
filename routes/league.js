const fs = require('fs');

module.exports = {
    addLeaguePage: (req, res) => {
        res.render('add-league.ejs', {
            title: "Welcome to Football App | Add a new league"
            , message: ''
        });
    },
    addLeague: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }

        let message = '';
        let league_name = req.body.league_name;
        let country = req.body.country;
        let numberofclub = req.body.numberofclub;
        let supporters_number = req.body.supporters_number;
        let username = req.body.username;
        let uploadedFile = req.files.image;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = username + '.' + fileExtension;

        let usernameQuery = "SELECT * FROM `leagues` WHERE user_name = '" + username + "'";

        db.query(usernameQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Username already exists';
                res.render('add-league.ejs', {
                    message,
                    title: "Welcome to Football App | Add a new league"
                });
            } else {
                // check the filetype before uploading it
                if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {
                    // upload the file to the /public/assets/img directory
                    uploadedFile.mv(`public/assets/img/${image_name}`, (err) => {
                        if (err) {
                            return res.status(500).send(err);
                        }
                        // send the player's details to the database
                        let query = "INSERT INTO `leagues` (league_name, country, numberofclub, supporters_number, image, user_name) VALUES ('" +
                            league_name + "', '" + country + "', '" + numberofclub + "', '" + supporters_number + "', '" + image_name + "', '" + username + "')";
                        db.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/');
                        });
                    });
                } else {
                    message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
                    res.render('league-add.ejs', {
                        message,
                        title: "Welcome to Football App | Add a new league"
                    });
                }
            }
        });
    },
    editLeaguePage: (req, res) => {
        let leagueId = req.params.id;
        let query = "SELECT * FROM `leagues` WHERE id = '" + leagueId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-league.ejs', {
                title: "Edit  League"
                , league: result[0]
                , message: ''
            });
        });
    },
    editLeague: (req, res) => {
        let leagueId = req.params.id;
        let league_name = req.body.league_name;
        let country = req.body.country;
        let numberofclub = req.body.numberofclub;
        let supporters_number = req.body.supporters_number;

        let query = "UPDATE `leagues` SET `league_name` = '" + league_name + "', `country` = '" + country + "', ` numberofclub` = '" + numberofclub + "', `supporters_number` = '" + supporters_number + "' WHERE `leagues`.`id` = '" + leagueId + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    },
    deleteLeague: (req, res) => {
        let leagueId = req.params.id;
        let getImageQuery = 'SELECT image from `leagues` WHERE id = "' + leagueId + '"';
        let deleteUserQuery = 'DELETE FROM leagues WHERE id = "' + leagueId + '"';

        db.query(getImageQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }

            let image = result[0].image;

            fs.unlink(`public/assets/img/${image}`, (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
                db.query(deleteUserQuery, (err, result) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                    res.redirect('/');
                });
            });
        });
    }
};
