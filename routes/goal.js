const fs = require('fs');

module.exports = {
    addGoalPage: (req, res) => {
        res.render('add-goal.ejs', {
            title: "Welcome to Football App | Add a new goal"
            , message: ''
        });
    },
    addGoal: (req, res) => {
        if (!req.files) {
            return res.status(400).send("No files were uploaded.");
        }

        let message = '';
        let name_goal_scorer = req.body.name_goal_scorer;
        let typeofcompeti = req.body.typeofcompeti;
        let numbergoal = req.body.numbergoal;
        let club = req.body.club;
        let date = req.body.date;
        let username = req.body.username;
        let uploadedFile = req.files.image;
        let image_name = uploadedFile.name;
        let fileExtension = uploadedFile.mimetype.split('/')[1];
        image_name = username + '.' + fileExtension;

        let usernameQuery = "SELECT * FROM `goals` WHERE user_name = '" + username + "'";

        db.query(usernameQuery, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            if (result.length > 0) {
                message = 'Username already exists';
                res.render('add-goal.ejs', {
                    message,
                    title: "Welcome to Football App | Add a new goal"
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
                        let query = "INSERT INTO `goals` (name_goal_scorer, typeofcompeti, numbergoal, club, date, image, user_name) VALUES ('" +
                            name_goal_scorer + "', '" + typeofcompeti + "', '" + numbergoal + "', '" + club + "', '" + date + "', '" + image_name + "', '" + username + "')";
                        db.query(query, (err, result) => {
                            if (err) {
                                return res.status(500).send(err);
                            }
                            res.redirect('/');
                        });
                    });
                } else {
                    message = "Invalid File format. Only 'gif', 'jpeg' and 'png' images are allowed.";
                    res.render('add-goal.ejs', {
                        message,
                        title: "Welcome to Football App | Add a new goal"
                    });
                }
            }
        });
    },
    editGoalPage: (req, res) => {
        let goalId = req.params.id;
        let query = "SELECT * FROM `goals` WHERE id = '" + goalId + "' ";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.render('edit-goal.ejs', {
                title: "Edit  goal"
                , goal: result[0]
                , message: ''
            });
        });
    },
    editGoal: (req, res) => {
        let goalId = req.params.id;
        let name_goal_scorer = req.body.name_goal_scorer;
        let typeofcompeti = req.body.typeofcompeti;
        let numbergoal = req.body.numbergoal;
        let club = req.body.club;
        let date = req.body.date;

        let query = "UPDATE `goals` SET `name_goal_scorer` = '" + name_goal_scorer + "', `typeofcompeti` = '" + typeofcompeti + "', ` numbergoal` = '" + numbergoal + "', `club` = '" + club + "', `date` = '" + date + "' WHERE `goals`.`id` = '" + goalId + "'";
        db.query(query, (err, result) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.redirect('/');
        });
    },
    deleteGoal: (req, res) => {
        let goalId = req.params.id;
        let getImageQuery = 'SELECT image from `goals` WHERE id = "' + goalId + '"';
        let deleteUserQuery = 'DELETE FROM goals WHERE id = "' + goalId + '"';

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
