-- All Venues (name, long, lat, active hotspot, )
SELECT name, longitude, latitude, (
    CASE
        WHEN active THEN 'active'
        WHEN NOT active THEN 'inactive'
        else 'no hotspot'
    END) as hotspot, positive_tests FROM venue LEFT JOIN hotspot
    ON venue.v_id = hotspot.venue;

-- Venue (name, long, lat) owned by a particualr user:
SELECT name, longitude, latitude FROM venue INNER JOIN venueOwner
    ON venue.v_id = venueOwner.venue INNER JOIN user
    ON venueOwner.user = user.u_id WHERE u_id = ?;

-- Checkins (venue, time) by particular user:
SELECT name, time_stamp, active, start, positive_tests FROM checkin INNER JOIN venue
    ON checkin.venue = venue.v_id LEFT JOIN hotspot
    ON venue.v_id = hotspot.venue WHERE user = ?;

-- Checkins (user, infected, time) at particular venue
SELECT CONCAT(first_name, " ", last_name) as name, IF(infected, true, false) as infected, TIME(time_stamp) as time, DATE(time_stamp) as date FROM user INNER JOIN checkin
    ON user.u_id = checkin.user INNER JOIN venue
    ON checkin.venue = venue.v_id WHERE v_id = ?;

-- Email from particular user
SELECT email FROM user
    WHERE u_id = ?;

-- Hotspots (venue name, long, lat, start, postive_tests, active)
SELECT name, longitude, latitude, start, positive_tests, IF(active, 'active', 'inactive') as active FROM hotspot INNER JOIN venue
    ON hotspot.venue = venue.v_id;

-- Update infected status for particular user
UPDATE user
    SET infected = ?
    WHERE u_id = ?;

-- Updating particular hotpot
UPDATE hotspot INNER JOIN venue
    ON venue.v_id = hotspot.venue
    SET start = ?, positive_tests = ?, active = ?
    WHERE v_id = ?;

-- Add User (from register)
INSERT INTO user (email, first_name, last_name, password_hash, email_notification)
    VALUES (?, ?, ?, SHA2(?, 256), ?);

-- Add Health Official
INSERT INTO user (email, first_name, last_name, password_hash, health_official, email_notification)
    VALUES (?, ?, ?, SHA2(?, 256), true, false);

-- Add User (for google signin)
INSERT INTO user (email, first_name, last_name, email_notification)
    VALUES (?, ?, ?, false);

-- Select User based on email
SELECT u_id, first_name, last_name, email, health_official, infected, email_notification, venue FROM user LEFT JOIN venueOwner
    ON user.u_id = venueOwner.user
    WHERE email = ?;

-- Select User based on email and password
SELECT u_id, first_name, last_name, email, health_official, infected, email_notification, venue FROM user LEFT JOIN venueOwner
    ON user.u_id = venueOwner.user
    WHERE email = ? AND password_hash = SHA2(?, 256);

-- Add venueOwner
INSERT INTO venueOwner VALUES (LAST_INSERT_ID(), ?);

-- SELECT venues hat dont have a venueowner associated with them
SELECT name, v_id FROM venue LEFT JOIN venueOwner
    ON venue.v_id = venueOwner.user
    WHERE user IS NULL;

-- SELECT venue from database by v_id
SELECT * FROM venue
    WHERE v_id = ?;

-- Add new checkin
INSERT INTO checkin (user, venue, time_stamp)
    VALUES (?, ?, NOW());

-- update account
UPDATE user
    SET first_name = ?, last_name = ?, email = ?, password_hash = SHA2(?, 256)
    WHERE u_id = ?;

--
SELECT v_id, name, longitude, latitude, positive_tests FROM venue INNER JOIN hotspot
    ON venue.v_id = hotspot.venue;

-- Getting venues that dont have a venue owner associated with them, i.e. are not owned.
SELECT name, v_id FROM venue LEFT JOIN venueOwner
    ON venue.v_id = venueOwner.venue
    WHERE user IS NULL;

-- Getting venue information for healthOfficials
SELECT * FROM venue LEFT JOIN hotspot
    ON venue.v_id = hotspot.venue;

-- Add hotspot
INSERT INTO hotspot (venue, start, positive_tests)
    VALUES (?, ?, ?);

-- Getting information on all users
SELECT u_id, email, first_name, last_name, health_official, infected, email_notification, IF(venue IS NULL, false, true) as venue_owner FROM user LEFT JOIN venueOwner
    ON user.u_id = venueOwner.user;