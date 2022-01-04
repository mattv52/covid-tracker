var express = require('express');
var router = express.Router();

const CLIENT_ID = '810192089400-ef5k6jellspebjam9ehav5c0jul9dle6.apps.googleusercontent.com';
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// get request for the venue //
router.get('/venue', function(req, res) {
    req.pool.getConnection( function(err,connection) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        var query = `SELECT name, v_id FROM venue LEFT JOIN venueOwner
                        ON venue.v_id = venueOwner.venue
                        WHERE user IS NULL;`;
        connection.query(query, function(err, rows, fields) {
            connection.release();
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            }
            console.log(rows);
            res.send(rows);
        });

    });
});

router.post('/update', function(req, res, next) {
    if ("first" in req.body && req.body.first != "" &&
        "last" in req.body && req.body.last != "" &&
        "email" in req.body && req.body.email != "" &&
        "password" in req.body) {
            if ('user' in req.body) {
                req.pool.getConnection( function(err,connection) {
                    if (err) {
                        res.sendStatus(500);
                        return;
                    }
                    var query;
                    if (req.body.password == '') {
                        query = `UPDATE user
                                    SET first_name = ?, last_name = ?, email = ?, email_notification = ?
                                    WHERE u_id = ?;`;
                        connection.query(query, [
                            req.body.first,
                            req.body.last,
                            req.body.email,
                            req.body.email_notification,
                            req.body.user], function(err, rows, fields) {
                            connection.release(); // release connection
                            if (err) {
                                console.log(err);
                                res.sendStatus(500);
                                return;
                            }
                            res.end();
                        });
                    } else {
                        query = `UPDATE user
                                    SET first_name = ?, last_name = ?, email = ?, password_hash = SHA2(?, 256), email_notification = ?
                                    WHERE u_id = ?;`;
                        connection.query(query, [
                            req.body.first,
                            req.body.last,
                            req.body.email,
                            req.body.password,
                            req.body.email_notification,
                            req.body.user], function(err, rows, fields) {
                            connection.release(); // release connection
                            if (err) {
                                console.log(err);
                                res.sendStatus(500);
                                return;
                            }
                            res.end();
                        });
                    }
                });
            } else {
                req.pool.getConnection( function(err,connection) {
                    if (err) {
                        res.sendStatus(500);
                        return;
                    }
                    var query;
                    if (req.body.password == '') {
                        query = `UPDATE user
                                    SET first_name = ?, last_name = ?, email = ?, email_notification = ?
                                    WHERE u_id = ?;`;
                        connection.query(query, [
                            req.body.first,
                            req.body.last,
                            req.body.email,
                            req.body.email_notification,
                            req.session.user.u_id], function(err, rows, fields) {
                            connection.release(); // release connection
                            if (err) {
                                console.log(err);
                                res.sendStatus(500);
                                return;
                            }
                            res.end();
                        });
                    } else {
                        query = `UPDATE user
                                    SET first_name = ?, last_name = ?, email = ?, password_hash = SHA2(?, 256), email_notification = ?
                                    WHERE u_id = ?;`;
                        connection.query(query, [
                            req.body.first,
                            req.body.last,
                            req.body.email,
                            req.body.password,
                            req.body.email_notification,
                            req.session.user.u_id], function(err, rows, fields) {
                            connection.release(); // release connection
                            if (err) {
                                console.log(err);
                                res.sendStatus(500);
                                return;
                            }
                            res.end();
                        });
                    }
                });
            }
    } else {
        res.sendStatus(400);
    }
});

router.post('/register', function(req, res) {
    if (('email' in req.body && req.body.email != "" &&
         'first_name' in req.body && req.body.first_name != "" &&
         'last_name' in req.body && req.body.last_name != "" &&
         'password' in req.body && req.body.password != "" &&
         'email_notification' in req.body &&
         'venue_owner' in req.body) &&
         ((req.body.venue_owner == true && req.body.venue != 'NULL') || req.body.venue_owner == false)) {

        req.pool.getConnection( function(err,connection) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            }
            var query = `INSERT INTO user (email, first_name, last_name, password_hash, email_notification)
                            VALUES (?, ?, ?, SHA2(?, 256), ?);`;
            connection.query(query,[
                req.body.email,
                req.body.first_name,
                req.body.last_name,
                req.body.password,
                req.body.email_notification], function(err, rows, fields) {
                connection.release()
                if (err) {
                    if (err.errno == 1062) {
                        console.log("Email already exists, try a new one!!");
                        res.sendStatus(409);
                        return;
                    }
                    console.log(err);
                    res.sendStatus(500);
                    return;
                }
                if (req.body.venue_owner == true) {
                    req.pool.getConnection( function(err,connection) {
                        if (err) {
                            console.log(err);
                            res.sendStatus(500);
                            return;
                        }
                        var query = `INSERT INTO venueOwner VALUES (LAST_INSERT_ID(), ?);`;
                        connection.query(query,[req.body.venue], function(err, rows, fields) {
                            connection.release(); // release connection
                            if (err) {
                                console.log(err);
                                res.sendStatus(500);
                                return;
                            }
                        });
                    });
                }
                res.end();
            });
        });
    } else {
        res.sendStatus(400);
    }
});

// WHats this???????
// router.post('/up', function(req, res) {
//     if (('email' in req.body && req.body.email != "" &&
//          'first_name' in req.body && req.body.first_name != "" &&
//          'last_name' in req.body && req.body.last_name != "" &&
//          'password' in req.body && req.body.password != "" &&
//          'email_notification' in req.body &&
//          'venue_owner' in req.body) &&
//          ((req.body.venue_owner == true && 'venue' in req.body) || req.body.venue_owner == false)) {

//         req.pool.getConnection( function(err,connection) {
//             if (err) {
//                 console.log(err);
//                 res.sendStatus(500);
//                 return;
//             }
//             if (req.body.venue_owner == true) {
//                 var query = `INSERT INTO user (email, first_name, last_name, password_hash, email_notification)
//                             VALUES (?, ?, ?, SHA2(?, 256), ?);
//                             INSERT INTO venueOwner VALUES (LAST_INSERT_ID(), ?);`;
//             } else {
//                 var query = `INSERT INTO user (email, first_name, last_name, password_hash, email_notification)
//                             VALUES (?, ?, ?, SHA2(?, 256), ?);`;
//             }
//             connection.query(query,[
//                 req.body.email,
//                 req.body.first_name,
//                 req.body.last_name,
//                 req.body.password,
//                 req.body.email_notification,
//                 req.body.venue], function(err, rows, fields) {
//                 connection.release();
//                 if (err) {
//                     console.log(err);
//                     res.sendStatus(500);
//                     return;
//                 }
//             });
//             res.end();
//         });
//     }
// });

router.post('/login', function(req, res, next) {
    if('email' in req.body && 'password' in req.body && req.body.email != "" && req.body.password != "") {
        req.pool.getConnection( function(err,connection) {
            if (err) {
                console.log(err);

                res.sendStatus(500);
                return;
            }
            var query = `SELECT u_id, first_name, last_name, email, health_official, infected, email_notification, venue FROM user LEFT JOIN venueOwner
                            ON user.u_id = venueOwner.user
                            WHERE email = ? AND password_hash = SHA2(?, 256);`;
            connection.query(query,[
                req.body.email,
                req.body.password
                ], function(err, rows, fields) {
                connection.release(); // release connection
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                    return;
                }
                if(rows.length > 0){
                    req.session.user = rows[0];
                    res.json(rows[0]);
                } else {
                    res.sendStatus(401);
                }
            });
        });
    } else if( 'token' in req.body ) {
 async function verify() {
            const ticket = await client.verifyIdToken({
                idToken: req.body.token,
                audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
                // Or, if multiple clients access the backend:
                //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
            });
            const payload = ticket.getPayload();
            req.pool.getConnection( function(err,connection) {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                    return;
                }
                var query = `SELECT u_id, first_name, last_name, email, health_official, infected, email_notification, venue FROM user LEFT JOIN venueOwner
                                ON user.u_id = venueOwner.user
                                WHERE email = ?;`;
                connection.query(query,[payload['email']], function(err, rows, fields) {
                    connection.release(); // release connection
                    if (err) {
                        console.log(err);
                        res.sendStatus(500);
                        return;
                    }
                    if(rows.length > 0){
                        req.session.user = rows[0];
                        res.json(rows[0]);
                        return;
                    } else {
                        req.pool.getConnection( function(err,connection) {
                            if (err) {
                                console.log(err);
                                res.sendStatus(500);
                                return;
                            }
                            var query = `INSERT INTO user (email, first_name, last_name, email_notification)
                                            VALUES (?, ?, ?, false);`;
                            connection.query(query,[payload.email, payload.given_name, payload.family_name, false], function(err, rows, fields) {
                                connection.release(); // release connection
                                if (err) {
                                    console.log(err);
                                    res.sendStatus(500);
                                    return;
                                }
                                res.end();
                            });
                        });
                    }
                });
            });
        }

        verify().catch(function(){
            res.sendStatus(401);
        });

    } else {
        res.sendStatus(400);
    }
});


router.post('/signout', function(req, res) {
    delete req.session.user;
    res.end();
});

router.post('/delete/venue', function (req, res, next) {
    req.pool.getConnection( function(err,connection) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        var query = `DELETE FROM venue
                        WHERE v_id = ?;`;
        connection.query(query,[req.session.user.venue], function(err, rows, fields) {
            connection.release(); // release connection
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            }
        });
    });
    req.pool.getConnection( function(err,connection) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        var query = `DELETE FROM user
                        WHERE u_id = ?;`;
        connection.query(query,[req.session.user.u_id], function(err, rows, fields) {
            connection.release(); // release connection
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            }
            res.end();
        });
    });
});

router.post('/delete', function (req, res, next) {
    if ('user' in req.body) {
        req.pool.getConnection( function(err,connection) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            }
            var query = `DELETE FROM user
                            WHERE u_id = ?`;
            connection.query(query,[req.body.user], function(err, rows, fields) {
                connection.release(); // release connection
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                    return;
                }
                res.end();
            });
        });
    } else {
        req.pool.getConnection( function(err,connection) {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            }
            var query = `DELETE FROM user
                            WHERE u_id = ?`;
            connection.query(query,[req.session.user.u_id], function(err, rows, fields) {
                connection.release(); // release connection
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                    return;
                }
                res.end();
            });
        });
    }
});


module.exports = router;
