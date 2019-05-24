const fs = require('fs');

module.exports = {
    addClubPage: (req, res) => {
        res.render('add-club.ejs', {
            title: "Welcome to Football App | Add a new club"
            , message: ''
        });
    },
    addClub: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }

        let message = '';
        let club_name = req.body.club_name;
        let country = req.body.country;
        let numberofstaff = req.body.numberofstaff;
        let supporters_number = req.body.supporters_number;
        let username = req.body.username;
        let uploadedFile = req.files.image;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = username + '.' + fileExtension;

        let usernameQuery = "SELECT * FROM `clubs` WHERE user_name = '" + username + "'";

        db.query(usernameQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Username already exists';
                res.render('add-club.ejs', {
                    message,
                    title: "Welcome to Football App | Add a new club"
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
                        let query = "INSERT INTO `clubs` (club_name, country, numberofstaff, supporters_number, image, user_name) VALUES ('" +
                            club_name + "', '" + country + "', '" + numberofstaff + "', '" + supporters_number + "', '" + image_name + "', '" + username + "')";
                        db.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/');
                        });
                    });
                } else {
                    message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
                    res.render('add-club.ejs', {
                        message,
                        title: "Welcome to Football App | Add a new club"
                    });
                }
            }
        });
    },
    editClubPage: (req, res) => {
        let clubId = req.params.id;
        let query = "SELECT * FROM `clubs` WHERE id = '" + clubId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-club.ejs', {
                title: "Edit  Club"
                , club: result[0]
                , message: ''
            });
        });
    },
    editClub: (req, res) => {
        let clubId = req.params.id;
        let club_name = req.body.club_name;
        let country = req.body.country;
        let numberofstaff = req.body.numberofstaff;
        let supporters_number = req.body.supporters_number;

        let query = "UPDATE `clubs` SET `club_name` = '" + club_name + "', `country` = '" + country + "', ` numberofstaff` = '" + numberofstaff + "', `supporters_number` = '" + supporters_number + "' WHERE `clubs`.`id` = '" + clubId + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    },
    deleteClub: (req, res) => {
        let clubId = req.params.id;
        let getImageQuery = 'SELECT image from `clubs` WHERE id = "' + clubId + '"';
        let deleteUserQuery = 'DELETE FROM clubs WHERE id = "' + clubId + '"';

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
