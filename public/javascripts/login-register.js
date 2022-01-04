$( document ).ready(function() {
    $('#signup').hide();
    document.title = 'Login';
    $('#loginError').hide();
    $('#inputEmpty').hide();
    $('#signupInputEmpty').hide();
    $('#password-strength').hide();
    // $('#confirmPasswordMessage').hide();
    $('#signUpError').hide();


});

$("#signuplink").click(function(){
  $('#login').hide();
  $('#signup').show();
  document.title = 'Signup';
});
$("#loginlink").click(function () {
    $('#signup').hide();
    $('#login').show();
    document.title = 'Login';
});

function ifVenueOwner(that) {
    if(that.value == "venue_owner") {
        document.getElementById("venue").style.display = "block";
        getVenues();
    } else {
        document.getElementById("venue").style.display = "none";
    }
}

function onSignIn(googleUser) {

    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.



    var id_token = googleUser.getAuthResponse().id_token;
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            window.location.href = "/html/hotspots.html";
        } else  if (this.readyState == 4 && this.status == 401) {
            alert("failed");
        }
    };

    xhr.open('POST', '/users/login', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({'token': id_token}));

    window.location.href = "/html/hotspots.html";
}

function login() {
    var profile = {
        email: document.getElementById("email_").value,
        password: document.getElementById("password_").value,
    };
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            window.location.href = "/html/hotspots.html";
        } else  if (this.readyState == 4 && this.status == 401) {
            // login failed
            console.log("Username and/or password incorrect!");
            $('#inputEmpty').hide();
            $('#loginError').show();

        } else if(document.getElementById("email_").value == "" || document.getElementById("password_").value == "") {
            $('#loginError').hide();
            $('#inputEmpty').show();
        }

        if(document.getElementById("email_").value == "") {
            document.getElementById("email_").style.borderColor = "red";
        } else {
            document.getElementById("email_").style.borderColor = "#ddd";
        }
        if(document.getElementById("password_").value == "") {
            document.getElementById("password_").style.borderColor = "red";
        } else {
            document.getElementById("password_").style.borderColor = "#ddd";
        }
    };
    xhr.open("POST", "/users/login", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    // console.log(profile);
    xhr.send(JSON.stringify(profile));
}

function checkPassword() {
        $('#password-strength').hide();
        var password = document.getElementById("password");
        var confirmed = document.getElementById("confirmPassword");
        if (password.value === confirmed.value) {
                document.getElementById('confirmPasswordMessage').style.color = 'green';
                document.getElementById("confirmPassword").style.borderColor = 'green';
                document.getElementById('confirmPasswordMessage').innerHTML = 'Passwords match';

        } else {
            document.getElementById('confirmPasswordMessage').style.color = 'red';
            document.getElementById('confirmPassword').style.borderColor = 'red';
            document.getElementById('confirmPasswordMessage').innerHTML = 'Passwords do not match';

        }
    }


function register() {
    var profile = {
        email: document.getElementById("email").value,
        first_name: document.getElementById("first-name").value,
        last_name: document.getElementById("last-name").value,
        password: document.getElementById("password").value,
        email_notification: document.getElementById("email-notification").checked,
        venue: document.getElementById("venue").value
    };
    var first_name = document.getElementById("first-name").value;
    var last_name = document.getElementById("last-name").value;
    var emailAddress = document.getElementById("email").value;
    var select = document.getElementById("user_status").value;
    var selectedVenue = document.getElementById("venue").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;
    if(first_name == "" || last_name == "" || emailAddress == "" || select == "" || selectedVenue == "" || password == "") {
        $('#signupInputEmpty').show();
    }
    if(document.getElementById("first-name").value == "") {
            document.getElementById("first-name").style.borderColor = "red";
    } else {
            document.getElementById("first-name").style.borderColor = "#ddd";
    }
    if(document.getElementById("last-name").value == "") {
            document.getElementById("last-name").style.borderColor = "red";
    } else {
            document.getElementById("last-name").style.borderColor = "#ddd";
    }
    if(document.getElementById("email").value == "") {
            document.getElementById("email").style.borderColor = "red";
    } else {
            document.getElementById("email").style.borderColor = "#ddd";
    }
    if(document.getElementById("user_status").value == "status") {
            document.getElementById("user_status").style.borderColor = "red";
    } else {
            document.getElementById("user_status").style.borderColor = "#ddd";
    }
    if(document.getElementById("venue").value == "") {
            document.getElementById("venue").style.borderColor = "red";
    } else {
            document.getElementById("venue").style.borderColor = "#ddd";
    }
    if(document.getElementById("password").value == "") {
            document.getElementById("password").style.borderColor = "red";
    } else {
            document.getElementById("password").style.borderColor = "#ddd";
    }
    if(document.getElementById("confirmPassword").value == "") {
        document.getElementById("confirmPassword").style.borderColor = "red";
    } else {
        document.getElementById("confirmPassword").style.borderColor = "#ddd";
    }



        console.log(profile);
    if (document.getElementById("user_status").value == "venue_owner") {
        profile.venue_owner = true;
    } else {
        profile.venue_owner = false;
    }

    if(confirmPassword == password) {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var xhr = new XMLHttpRequest();

            xhr.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var emailreq = new XMLHttpRequest();
                    emailreq.onreadystatechange = function () {
                       if (this.readyState == 4 && this.status == 200) {
                            window.location.href = "/html/hotspots.html";
                            console.log("mega triple success");
                        }
                    };

                    emailreq.open('POST', '/emailOne', true);
                    emailreq.send();


                } else  if (this.readyState == 4 && this.status == 401) {
                    // login failed

                } else if(this.readyState == 4 && this.status == 500) {
                    console.log("Error");
                }
            };
            xhr.open("POST", "/users/login");
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({email: profile.email, password: profile.password}));
        } else  if (this.readyState == 4 && this.status == 409) {
            // login failed
            $('#signUpError').show();

        } else if(this.readyState == 4 && this.status == 500) {
            console.log("Error");
        }
    };

    xhr.open("POST", "/users/register");
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(profile));
    } else {
        document.getElementById('confirmPasswordMessage').innerHTML = 'Please confirm your password!';
    }
}

function getVenues() {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let venues = JSON.parse(this.response);
            console.log(venues);
            var select = document.getElementById("venue");
            for (var i=0; i <venues.length; i++) {
                select.innerHTML += `<option value="${venues[i].v_id}">${venues[i].name}</option>`;
            }
        }
    };

    xhr.open("GET", "/users/venue");
    xhr.send();
}

var strength = {
              0: "Weakest",
              1: "Weak",
              2: "Okay",
              3: "Good",
              4: "Strong"
            };

var password = document.getElementById('password');
var text = document.getElementById('password-strength-text');

password.addEventListener('input', function() {
    var val = password.value;
    var result = zxcvbn(val);

    // This updates the password meter text
    if (val !== "") {
        text.innerHTML = "Password Strength: " + strength[result.score];
    } else {
        text.innerHTML = "";
    }

    if(strength[result.score] == "Weakest") {
        document.getElementById("password-strength-text").style.color = "red";
    } else if(strength[result.score] == "Weak") {
        document.getElementById("password-strength-text").style.color = "#ff8c00";
    } else if(strength[result.score] == "Okay") {
        document.getElementById("password-strength-text").style.color = "orange";
    } else if(strength[result.score] == "Good") {
        document.getElementById("password-strength-text").style.color = "green";
    } else if(strength[result.score] == "Strong") {
        document.getElementById("password-strength-text").style.color = "green";
    }
});