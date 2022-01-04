/* Create and switch to Database */
CREATE DATABASE IF NOT EXISTS covid;
USE covid;

/* Creating tables */
CREATE TABLE user (
    u_id INT AUTO_INCREMENT,
    email VARCHAR(128) UNIQUE NOT NULL,
    first_name VARCHAR(64),
    last_name VARCHAR(64),
    password_hash VARCHAR(256),
    health_official BOOLEAN DEFAULT false,
    infected BOOLEAN DEFAULT false,
    email_notification BOOLEAN,
    PRIMARY KEY (u_id)
);

CREATE TABLE venue (
    v_id INT AUTO_INCREMENT,
    name VARCHAR(64),
    longitude FLOAT,
    latitude FLOAT,
    PRIMARY KEY (v_id)
);

CREATE TABLE venueOwner (
    user INT,
    venue INT,
    PRIMARY KEY (user, venue),
    FOREIGN KEY (user) REFERENCES user(u_id) ON DELETE CASCADE,
    FOREIGN KEY (venue) REFERENCES venue(v_id) ON DELETE CASCADE
);

CREATE TABLE checkin (
    c_id INT AUTO_INCREMENT,
    user INT,
    venue INT,
    time_stamp DATETIME DEFAULT NOW(),
    PRIMARY KEY (c_id),
    FOREIGN KEY (user) REFERENCES user(u_id) ON DELETE CASCADE,
    FOREIGN KEY (venue) REFERENCES venue(v_id) ON DELETE CASCADE
);

CREATE TABLE hotspot (
    h_id INT AUTO_INCREMENT,
    venue INT,
    start DATE,
    positive_tests INT,
    active BOOLEAN DEFAULT true,
    PRIMARY KEY (h_id),
    FOREIGN KEY (venue) REFERENCES venue(v_id) ON DELETE CASCADE
);




-- Test data in the system
INSERT INTO user (email, first_name, last_name, password_hash, health_official, infected, email_notification)
    VALUES ("venue@test.com", "tester", "test", "e622da235a56977383e1db8bfe71eaa9b6156cec5cd95df9dc4d2aa3ac5d267a", false, false, true), ("user@test.com", "Jimmy", "jim", "04f8996da763b7a969b1028ee3007569eaf3a635486ddab211d512c85b9df8fb", false, true, true), ("health@test.com", "Matt", "Vol", "62484e22a6a5ade1ba25cb1b7c55c4b8861de24caddab73c9409742734008b26", true, false, true);
    --                                          = venue                                                                                                                      = user                                                                                                                  = health
INSERT INTO venue (name, longitude, latitude)
    VALUES ("Zoo", 138.60613771782354, -34.91457065322774), ("Uni", 138.6046253552119, -34.919565292091896), ("Adelaide OVal", 138.5959600072661, -34.91530364111909), ("The Beachouse",138.511470, -34.978961 ), ("Carrick Hill", 138.6319, -34.9793), ("Mount Lofty Botanic Garden", 138.7148, -34.9870), ("Art Gallery of South Australia", 138.6039, -34.9206), ("Port Noarlunga Jetty Fishing", 138.466246255, -35.1490382614), ("Amazon Waterlily Pavilion", 138.6107, -34.9181), ("Adelaide Airport", 138.5332, -34.9462), ("Adelaide Convention Centre", 138.5945, -34.9203);

INSERT INTO venueOwner (user, venue)
    VALUES (1, 1);

INSERT INTO checkin (user, venue, time_stamp)
    VALUES (2, 1, NOW()-INTERVAL 1 DAY), (2, 2, NOW());

INSERT INTO hotspot (venue, start, positive_tests)
    VALUES (1, NOW()-INTERVAL 2 DAY, 12), (6, NOW()-INTERVAL 4 DAY, 60), (4, NOW()-INTERVAL 10 DAY, 40);
