var express = require('express');
var router = express.Router();

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
 service: 'gmail',
 auth: {
        user: 'covidwebapp@gmail.com',
        pass: '@sdf1234'
    }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// router.get('/html/hotspots.html', function(req, res, next) {
//   console.log("checked");
//   res.render('hotspots.html', { title: 'Express' });
// });



router.get('/load', function(req, res, next) {
    if(req.session.user) {
        console.log(req.session.user);
        res.json(req.session.user);
    } else {
        res.sendStatus(500);
    }
});



router.get('/load/user', function(req, res, next) {
    if (req.query.user) {
        req.pool.getConnection( function(err,connection) {
            if (err) {
              res.sendStatus(500);
              return;
            }
            var query = `SELECT name, time_stamp, active, start, positive_tests FROM checkin INNER JOIN venue
                            ON checkin.venue = venue.v_id LEFT JOIN hotspot
                            ON venue.v_id = hotspot.venue WHERE user = ?
                            ORDER BY time_stamp DESC;`;
            connection.query(query, [req.query.user],function(err, rows, fields) {
                connection.release(); // release connection
                if (err) {
                    res.sendStatus(500);
                    return;
                }
                res.json(rows); //send response
            });
        });
    } else if ('user' in req.session) {
        req.pool.getConnection( function(err,connection) {
            if (err) {
              res.sendStatus(500);
              return;
            }
            var query = `SELECT name, time_stamp, active, start, positive_tests FROM checkin INNER JOIN venue
                            ON checkin.venue = venue.v_id LEFT JOIN hotspot
                            ON venue.v_id = hotspot.venue WHERE user = ?
                            ORDER BY time_stamp DESC;`;
            connection.query(query, [req.session.user.u_id],function(err, rows, fields) {
                connection.release(); // release connection
                if (err) {
                    res.sendStatus(500);
                    return;
                }
                res.json(rows); //send response
            });
        });
    } else {
        res.sendStatus(400);
        return;
    }
});

// return all the venues on the home page to show pin on the map
router.get('/load/venues', function(req, res, next) {
    req.pool.getConnection( function(err,connection) {
        if (err) {
          res.sendStatus(500);
          return;
        }
        var query = `SELECT v_id, name, longitude, latitude FROM venue`;
        connection.query(query,function(err, rows, fields) {
            connection.release(); // release connection
            if (err) {
                res.sendStatus(500);
                return;
            }
            // console.log(rows);
            res.json(rows); //send response
        });
    });
});

// return all the hotspots on the home page to show pin on the map
router.get('/load/hotspots', function(req, res, next) {
    req.pool.getConnection( function(err,connection) {
        if (err) {
          res.sendStatus(500);
          return;
        }
        var query = `SELECT v_id, name, longitude, latitude, positive_tests FROM venue INNER JOIN hotspot
                        ON venue.v_id = hotspot.venue;`;
        connection.query(query,function(err, rows, fields) {
            connection.release(); // release connection
            if (err) {
                res.sendStatus(500);
                return;
            }
            res.json(rows); //send response
        });
    });
});

router.get('/load/venueOwner/venueName', function(req, res, next) {
    req.pool.getConnection( function(err,connection) {
        if (err) {
          res.sendStatus(500);
          return;
        }
        var query = `SELECT name, longitude, latitude FROM venue
                        WHERE v_id = ?;`;
        connection.query(query, [req.session.user.venue],function(err, rows, fields) {
            connection.release(); // release connection
            if (err) {
                res.sendStatus(500);
                return;
            }
            res.json(rows); //send response
        });
    });
});

router.get('/load/venueOwner', function(req, res, next) {
    if (req.query.venue) {
        req.pool.getConnection( function(err,connection) {
            if (err) {
              res.sendStatus(500);
              return;
            }
            var query = `SELECT CONCAT(first_name, " ", last_name) as name, IF(infected, true, false) as infected, time_stamp FROM user INNER JOIN checkin
                            ON user.u_id = checkin.user INNER JOIN venue
                            ON checkin.venue = venue.v_id WHERE v_id = ?;`;
            connection.query(query, [req.query.venue],function(err, rows, fields) {
                connection.release(); // release connection
                if (err) {
                    res.sendStatus(500);
                    return;
                }
                res.json(rows); //send response
            });
        });
    } else {
        req.pool.getConnection( function(err,connection) {
            if (err) {
              res.sendStatus(500);
              return;
            }
            var query = `SELECT CONCAT(first_name, " ", last_name) as name, IF(infected, true, false) as infected, time_stamp FROM user INNER JOIN checkin
                            ON user.u_id = checkin.user INNER JOIN venue
                            ON checkin.venue = venue.v_id WHERE v_id = ?;`;
            connection.query(query, [req.session.user.venue],function(err, rows, fields) {
                connection.release(); // release connection
                if (err) {
                    res.sendStatus(500);
                    return;
                }
                res.json(rows); //send response
            });
        });
    }
});

router.get('/load/healthOfficial/venue', function(req, res, next) {
    // Venues
    req.pool.getConnection( function(err,connection) {
        if (err) {
          res.sendStatus(500);
          return;
        }
        var query = `SELECT * FROM venue LEFT JOIN hotspot
                        ON venue.v_id = hotspot.venue;`;
        connection.query(query,function(err, rows, fields) {
            connection.release(); // release connection
            if (err) {
                res.sendStatus(500);
                return;
            }
            res.json(rows); //send response
        });
    });
});

router.get('/load/healthOfficial/user', function(req, res, next) {
    // Users
    req.pool.getConnection( function(err,connection) {
        if (err) {
          res.sendStatus(500);
          return;
        }
        var query = `SELECT u_id, email, first_name, last_name, health_official, infected, email_notification, IF(venue IS NULL, false, true) as venue_owner FROM user LEFT JOIN venueOwner
                        ON user.u_id = venueOwner.user
                        ORDER BY last_name, first_name;`;
        connection.query(query,function(err, rows, fields) {
            connection.release(); // release connection
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            }
            res.json(rows); //send response
        });
    });
});

router.post('/checkin', function(req, res, next) {
    req.pool.getConnection( function(err,connection) {
        if (err) {
          res.sendStatus(500);
          return;
        }
        var query = `SELECT * FROM venue WHERE v_id = ?;`;
        connection.query(query, [req.body.v_id],function(err, rows, fields) {
            connection.release(); // release connection
            if (err) {
                res.sendStatus(500);
                return;
            }
            if (rows.length > 0) {
                req.pool.getConnection( function(err,connection) {
                    if (err) {
                        res.sendStatus(500);
                        return;
                    }
                    var query = `INSERT INTO checkin (user, venue, time_stamp)
                                    VALUES (?, ?, NOW());`;
                    connection.query(query, [req.session.user.u_id, req.body.v_id], function(err, rows, fields) {
                        connection.release(); // release connection
                        if (err) {
                            res.sendStatus(500);
                            return;
                        }
                        res.end();
                    });
                });
            } else {
                res.sendStatus(404);
            }
        });
    });
});

router.post('/hotspot/create', function(req, res, next) {
    if ("venue" in req.body && req.body.venue != "" &&
        "start" in req.body && req.body.start != "" &&
        "cases" in req.body && req.body.cases != "" ) {
        req.pool.getConnection( function(err,connection) {
            if (err) {
                res.sendStatus(500);
                return;
            }
            var query = `INSERT INTO hotspot (venue, start, positive_tests)
                            VALUES (?, ?, ?);`;
            connection.query(query, [req.body.venue, req.body.start, req.body.cases], function(err, rows, fields) {
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
        res.sendStatus(400);
    }
});

router.post('/hotspot/update', function(req, res, next) {
    if ("venue" in req.body && req.body.venue != "" &&
        "start" in req.body && req.body.start != "" &&
        "cases" in req.body && req.body.cases != "" &&
        "active" in req.body) {
        req.pool.getConnection( function(err,connection) {
            if (err) {
                res.sendStatus(500);
                return;
            }
            var query = `UPDATE hotspot INNER JOIN venue
                            ON venue.v_id = hotspot.venue
                            SET start = ?, positive_tests = ?, active = ?
                            WHERE v_id = ?;`;
            connection.query(query, [
                req.body.start,
                req.body.cases,
                req.body.active,
                req.body.venue], function(err, rows, fields) {
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
        res.sendStatus(400);
    }
});

router.post('/register/health', function(req, res, next) {
    if ("first" in req.body && req.body.first != "" &&
        "last" in req.body && req.body.last != "" &&
        "email" in req.body && req.body.email != "" &&
        "password" in req.body && req.body.password != "" ) {
        req.pool.getConnection( function(err,connection) {
            if (err) {
                res.sendStatus(500);
                return;
            }
            var query = `INSERT INTO user (email, first_name, last_name, password_hash, health_official, email_notification)
                            VALUES (?, ?, ?, SHA2(?, 256), true, false);`;
            connection.query(query, [
                req.body.email,
                req.body.first,
                req.body.last,
                req.body.password], function(err, rows, fields) {
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
        res.sendStatus(400);
    }
});

router.post('/create/venue', function(req, res, next) {
    if ("name" in req.body && req.body.name != "" &&
        "long" in req.body && req.body.long != "" &&
        "lat" in req.body && req.body.lat != "") {
        req.pool.getConnection( function(err,connection) {
            if (err) {
                res.sendStatus(500);
                return;
            }
            var query = `INSERT INTO venue (name, longitude, latitude)
                            VALUES (?, ?, ?);`;
            connection.query(query, [
                req.body.name,
                req.body.longitude,
                req.body.latitude], function(err, rows, fields) {
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
        res.sendStatus(400);
    }
});

router.post('/update/venue', function(req, res, next) {
    console.log(req.body.name);
    if ('id' in req.body) {
        req.pool.getConnection( function(err,connection) {
            if (err) {
                res.sendStatus(500);
                return;
            }
            var query = `UPDATE venue
                            SET name = ?
                            WHERE v_id = ?;`;
            connection.query(query, [req.body.name, req.body.id], function(err, rows, fields) {
                connection.release(); // release connection
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                    return;
                }
                res.end();
            });
        });
    } else if (req.session.user.venue !== null) {
        req.pool.getConnection( function(err,connection) {
            if (err) {
                res.sendStatus(500);
                return;
            }
            var query = `UPDATE venue
                            SET name = ?
                            WHERE v_id = ?;`;
            connection.query(query, [req.body.name, req.session.user.venue], function(err, rows, fields) {
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
        res.sendStatus(400);
        return;
    }
});

router.post('/emailOne', function(req, res, next) {
    const mailOptions = {
        from: 'covidwebapp@gmail.com', // sender address
        to: req.session.user.email, // list of receivers
        subject: 'Information About Hotspots', // Subject line
        html:  `<pre>Welcome to the COVID Web App
Please Checkin to each location you visit and keep an eye out for hotspots.
They appear in red on the map
Take care, say safe :)
- the COVID Web App team</pre>`// plain text body
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if(err) {
            console.log(err);
            res.sendStatus(400);
            return;
        }
        else {
            console.log(info);
            res.end();
        }
    });
});

router.post('/emailAlert', function(req, res, next) {
    req.pool.getConnection( function(err,connection) {
        if (err) {
          res.sendStatus(500);
          return;
        }
        var query = `SELECT email FROM user
                        WHERE email_notification = 1;`;
        connection.query(query, function(err, rows, fields) {
            connection.release(); // release connection
            // console.log(rows);
            if (err) {
                res.sendStatus(500);
                return;
            }
            if (rows.length > 0) {
                var emails = [];
                for(var i=0; i<rows.length; i++) {
                    emails.push(rows[i].email);
                }
                const mailOptions = {
                    from: 'covidwebapp@gmail.com', // sender address
                    to: emails, // list of receivers
                    subject: 'ALERT: Hotspot has been created', // Subject line
                    html: `<p>A new hotspot has been created, please go on the covid web app and check the map for the latest updates. <br>
                    Please stay clear of all active hotspots, and if you have been to any of them in the past 14 days, please <br>
                    get tested at the nearest covid testing facility and quarantine until your results are obtained. If you have tested <br>
                    positive to COVID-19, then please quarantine for 14 days. Thankyou for your cooperation. <br>
                    Stay safe. </p>` // plain text body
                };
                transporter.sendMail(mailOptions, function (err, info) {
                    if(err) {
                        console.log(err);
                    }
                    else {
                        console.log(info);
                    }
                });
                res.end();
            } else {
                res.sendStatus(404);
            }
        });
    });
});

module.exports = router;