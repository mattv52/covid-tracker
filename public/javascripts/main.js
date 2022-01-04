$( document ).ready(function() {
    loadVue();
    $('.modal').modal();
});


// Loading Map
mapboxgl.accessToken = 'pk.eyJ1IjoibWF0dHY1MiIsImEiOiJja3A2Nmw5cnoyZmY0Mm9xd29xdHpoMTlqIn0.6ly4txfV8TZcVI6iAJsRGg';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [138.6007, -34.9285],
    // pitch: 60,
    // bearing: -60,
    zoom: 10
});
// Fri Jun 11 2021 11:02:57 GMT+0930 (Australian Central Standard Time)
function setDate(datetime) {
    var date = datetime.getDate()+'/'+(datetime.getMonth()+1)+'/'+datetime.getFullYear();
    return(date);
}

function setTime(datetime) {
    var hours = datetime.getHours(), ampm = " am", mins = datetime.getMinutes();
    if (hours >= 12) {
        ampm = " pm";
        if (hours >=13) {
            hours -= 12;
        }
    }
    if (mins < 10) {
        mins = "0"+ mins;
    }
    var time = hours+':'+mins+ampm;
    return(time);
}

function manageUser() {
    let profile = {
        first: document.getElementById("firstName").value,
        last: document.getElementById("lastName").value,
        email: document.getElementById("email1").value,
        password: document.getElementById("password").value,
        email_notification: document.getElementById("emailNotifActive").checked
    };
    var instance = M.Modal.getInstance(document.getElementById("manage"));
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            loadVue();
            instance.close();
        }
    };
    xhr.open('POST', '/users/update', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(profile));
}
// Venue
function loadVue() {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = async function() {
        if (this.readyState == 4 && this.status == 200) {
            // console.log(this.response);
            var user = JSON.parse(this.response);
            modalVue.invalidCheckin = false;
            vue.userAccount = user;
            // console.log(user);
            document.getElementById('profileImg').src = "https://moonvillageassociation.org/wp-content/uploads/2018/06/default-profile-picture1.jpg";
            document.getElementById('name').innerHTML = user.first_name + " " + user.last_name;
            document.getElementById('email').innerHTML = user.email;
            document.getElementById('profileName').innerHTML = user.first_name + " " + user.last_name;
            document.getElementById('profileEmail').innerHTML = user.email;
            $('#firstName').val(user.first_name);
            $('#lastName').val(user.last_name);
            $('#email1').val(user.email);
            if (user.venue !== null) {
                vue.healthOfficial = false;
                vue.venueOwner = true;
                vue.user = false;
                await loadVenueOwner();
                await loadVenuesHealthVenue();
            } else if (user.health_official > 0) {
                vue.healthOfficial = true;
                vue.venueOwner = false;
                vue.user = false;
                await loadHealthOfficial();
                await loadVenuesHealthVenue();
            } else {
                vue.healthOfficial = false;
                vue.venueOwner = false;
                vue.user = true;
                await loadUser();
                await loadVenuesUser();
            }
        } else if (this.readyState == 4 && this.status == 500) {
            window.location.href = "/index.html";
        }
    };

    xhr.open('GET', '/load', true);
    xhr.send();
}

//User
function loadUser() {
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var arr = JSON.parse(this.response);
            for (var i = 0; i < arr.length; i++) {
                let datetime = new Date(Date.parse(arr[i].time_stamp));
                arr[i].time = setTime(datetime);
                arr[i].date = setDate(datetime);
                let startdate = new Date(Date.parse(arr[i].start));
                arr[i].start = setDate(startdate);
                if (arr[i].active === null) {
                    arr[i].active = "NO";
                    arr[i].positive_tests = "-";
                    arr[i].start = "-";
                } else {
                    arr[i].active = "YES";
                }
            }
            console.log(arr);
            vue.userCheckins = arr;
        }
    };

    xhr.open('GET', '/load/user', true);
    xhr.send();
}

//Venue owner
function loadVenueOwner() {
    document.getElementById("header").innerHTML = "VENUE OWNERS";
    document.getElementById("headerInfo").innerHTML = "The map below contains all the COVID-19 hotspots.";
    var xhr = new XMLHttpRequest();
    var xhr2 = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var arr = JSON.parse(this.response);
            for (var i = 0; i < arr.length; i++) {
                let datetime = new Date(Date.parse(arr[i].time_stamp));
                arr[i].time = setTime(datetime);
                arr[i].date = setDate(datetime);
                if (arr[i].infected > 0) {
                    arr[i].infected = "YES";
                } else {
                    arr[i].infected = "NO";
                }
            }

            console.log(arr);
            vue.venueCheckins = arr;
        }
    };

    xhr2.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var arr = JSON.parse(this.response);
            console.log(arr);
            document.getElementById("manageVName").value = arr[0].name;
            map.flyTo({
                center: [
                    arr[0].longitude,
                    arr[0].latitude
                ],
                    essential: true // this animation is considered essential with respect to prefers-reduced-motion
            });
        }
    };

    xhr.open('GET', '/load/venueOwner', true);
    xhr.send();
    xhr2.open('GET', '/load/venueOwner/venueName', true);
    xhr2.send();
}

function loadHealthOfficial() {
    var xhr1 = new XMLHttpRequest();
    var xhr2 = new XMLHttpRequest();

    xhr1.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var arr = JSON.parse(this.response);
            console.log(arr);
            var hotspot = [], nothotspot = [];
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].active == 1) {
                    hotspot.push(arr[i]);
                } else {
                    nothotspot.push(arr[i]);
                }
            }
            modalVue.notHotspotVenue = nothotspot;
            modalVue.hotspotVenue = hotspot;
            vue.allVenues = arr;
            modalVue.allVenues = arr;
            // vue.notHotspotVenue = nothotspot;
            // vue.hotspotVenue = hotspot;
        }
    };
    xhr2.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var arr = JSON.parse(this.response);
            vue.allUsers = arr;
            modalVue.allUsers = arr;
        }
    };

    xhr1.open('GET', '/load/healthOfficial/venue', true);
    xhr1.send();
    xhr2.open('GET', '/load/healthOfficial/user', true);
    xhr2.send();
}

function loadManageHotspot() {
    let form = {
        venue: document.getElementById("manageHotspotVenue").value,
        start: document.getElementById("manageHotspotStartDate"),
        cases: document.getElementById("manageHotspotCases"),
        active: document.getElementById("manageHotspotActive")
    };
    let v = modalVue.hotspotVenue.find(function(x){
        return x.v_id == form.venue;
    });
    form.start.value = v.start.slice(0, 10);
    form.cases.value = v.positive_tests;
    form.active.checked = 1;
}

function loadManageVenue() {
    venue = document.getElementById("manageVenueDropdown").value
    let v = modalVue.allVenues.find(function(x){
        return x.v_id == venue;
    });
    document.getElementById("manageVenueNameHealth").value = v.name;
}

function loadManageUser() {
    let form = {
        user: document.getElementById("manageUserDropdown").value,
        first: document.getElementById("manageUserFirst"),
        last: document.getElementById("manageUserLast"),
        email: document.getElementById("manageUserEmail"),
        email_notif: document.getElementById("emailNotifHealth")
    };
    let u = modalVue.allUsers.find(function(x){
        return x.u_id == form.user;
    });
    form.first.value = u.first_name;
    form.last.value = u.last_name;
    form.email.value = u.email;
    form.email_notif.checked = u.email_notification;
}

function manageVenue() {
    var xhr = new XMLHttpRequest();
    var instance = M.Modal.getInstance(document.getElementById("manageVenue"));
    var venue = {
        name: document.getElementById("manageVName").value
    };
    console.log(venue);

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            instance.close();
            loadVenueOwner();
        }
    };
    xhr.open('POST', '/update/venue', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(venue));
}

function manageVenueHealth() {
    var venue = {
        id: document.getElementById("manageVenueDropdown").value,
        name: document.getElementById("manageVenueNameHealth").value
    };
    console.log(venue);
    var instance = M.Modal.getInstance(document.getElementById("manageVenueHealth"));
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            instance.close();
            loadHealthOfficial();
            loadVenuesHealthVenue();

        }
    };
    xhr.open('POST', '/update/venue', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(venue));
}

function manageHotspot() {
    let form = {
        venue: document.getElementById("manageHotspotVenue").value,
        start: document.getElementById("manageHotspotStartDate").value,
        cases: document.getElementById("manageHotspotCases").value,
        active: document.getElementById("manageHotspotActive").checked
    };
    var instance = M.Modal.getInstance(document.getElementById("manageHotspot"));
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            instance.close();
            loadHealthOfficial();
            loadVenuesHealthVenue();
        }
    };
    xhr.open('POST', '/hotspot/update', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(form));
}

function manageUserHealth() {
    let profile = {
        user: document.getElementById("manageUserDropdown").value,
        first: document.getElementById("manageUserFirst").value,
        last: document.getElementById("manageUserLast").value,
        email: document.getElementById("manageUserEmail").value,
        password: document.getElementById("manageUserPassword").value,
        email_notification: document.getElementById("emailNotifHealth").checked
    };
    var instance = M.Modal.getInstance(document.getElementById("manageUserHealth"));
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            instance.close();
            loadHealthOfficial();
        }
    };
    xhr.open('POST', '/users/update', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(profile));
}

function loadUserCheckinHistory() {
    var user = document.getElementById("selectUserCheckinHistory").value;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var arr = JSON.parse(this.response);
            for(var i=0; i<arr.length;i++) {
                let datetime = new Date(Date.parse(arr[i].time_stamp));
                arr[i].time = setTime(datetime);
                arr[i].date = setDate(datetime);
                let startdate = new Date(Date.parse(arr[i].start));
                arr[i].start = setDate(startdate);
                if (arr[i].active === null) {
                    arr[i].active = "NO";
                    arr[i].positive_tests = "-";
                    arr[i].start = "-";
                } else {
                    arr[i].active = "YES";
                }
            }
            vue.userCheckins = arr;
        }
    };

    xhr.open('GET', '/load/user?user='+encodeURIComponent(user), true);
    xhr.send();
}

function loadVenueCheckinHistory() {
    var venue = document.getElementById("selectVenueCheckinHistory").value;
    var xhr = new XMLHttpRequest();
    console.log(venue);
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var arr = JSON.parse(this.response);
            console.log(arr);
            for (var i = 0; i < arr.length; i++) {
                let datetime = new Date(Date.parse(arr[i].time_stamp));
                arr[i].time = setTime(datetime);
                arr[i].date = setDate(datetime);
                if (arr[i].infected > 0) {
                    arr[i].infected = "YES";
                } else {
                    arr[i].infected = "NO";
                }
            }
            vue.venueCheckins = arr;
        }
    };

    xhr.open('GET', '/load/venueOwner?venue='+encodeURIComponent(venue), true);
    xhr.send();
}

function createHealthOfficialAccoount() {
    let account = {
        first: document.getElementById("healthOfficalFirst").value,
        last: document.getElementById("healthOfficalLast").value,
        email: document.getElementById("healthOfficalEmail").value,
        password: document.getElementById("healthOfficalPassword").value
    };
    var instance = M.Modal.getInstance(document.getElementById("createHealthAccount"));
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            instance.close();
        }
    };
    xhr.open('POST', '/register/health', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(account));
}

function createVenue() {
    let venue = {
        name: document.getElementById("venueName").value,
        long: document.getElementById("venueLongitude").value,
        lat: document.getElementById("venueLatitude").value,
    };
    var instance = M.Modal.getInstance(document.getElementById("createVenue"));
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            instance.close();
            loadHealthOfficial();
        }
    };

    xhr.open('POST', '/create/venue', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(venue));
}

// FOR GOOGLE AUTHENTICATION SIGNOUT AND LOADING PROFILE //




// load and print venues on map//
function loadVenuesUser() {
     console.log('loading Venues');

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {
            var arr = JSON.parse(this.response);
            console.log("selected marker", arr);

            for (var i = 0; i < arr.length; i++) {
                let venueLatestCheckIn = vue.userCheckins.find(item => item.name === arr[i].name);
                let descriptionHtml = '<h6 style=padding-right:20px; >' + arr[i].name + '</h6>';
                if(venueLatestCheckIn != undefined) {
                    descriptionHtml +=  '<p style=padding-right:20px; ><b> Checkin History</b></hp>';
                    descriptionHtml +=  '<p style=padding-right:20px; > Date: ' +  venueLatestCheckIn.date + '</p>' +
                                       '<p style=padding-right:20px; > Time: ' +  venueLatestCheckIn.time + '</p>';
                }
                const divElement = document.createElement('div');
                const buttonElement = document.createElement('div');
                buttonElement.innerHTML = `<button id="venue-${arr[i].v_id}" type="button">Check In</button>`;
                divElement.innerHTML = descriptionHtml;
                divElement.appendChild(buttonElement);
                buttonElement.addEventListener('click', async(e) => {
                    console.log("btn click", e.target.attributes.id.value);
                    let venueId = e.target.attributes.id.value;
                    venueId = venueId.split('-')[1];
                    await checkIn(venueId);
                    location.reload();
                });

                // create the popup for the map //
                var popup = new mapboxgl.Popup({ offset: 25 }).
                setDOMContent(divElement);
                var marker1 = new mapboxgl.Marker()
                .setLngLat([arr[i].longitude, arr[i].latitude])
                .setPopup(popup)
                .addTo(map);
            }
            console.log(arr);


            loadHotspotUser();
        }
    };


    xhr.open('GET', '/load/venues', true);
    xhr.send();
}

// load and print venues on map//
function loadVenuesHealthVenue() {
     console.log('loading Venues fro health and venue');

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {
            var arr = JSON.parse(this.response);
            console.log("selected marker", arr);

            for (var i = 0; i < arr.length; i++) {
                let venueLatestCheckIn = vue.userCheckins.find(item => item.name === arr[i].name);
                let descriptionHtml = '<h6 style=padding-right:20px; >' + arr[i].name + '</h6>';

                // create the popup for the map //
                const divElement = document.createElement('div');
                divElement.innerHTML = descriptionHtml;
                var popup = new mapboxgl.Popup({ offset: 25 }).
                setDOMContent(divElement);
                var marker1 = new mapboxgl.Marker()
                .setLngLat([arr[i].longitude, arr[i].latitude])
                .setPopup(popup)
                .addTo(map);
            }
            console.log(arr);


            loadHotspotHealthVenue();
        }
    };


    xhr.open('GET', '/load/venues', true);
    xhr.send();
}

//loading hotspots on the map
function loadHotspotUser(){
     console.log('loading loadHotspot');
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var arr = JSON.parse(this.response);
            for (var i = 0; i < arr.length; i++) {
                let venueLatestCheckIn = vue.userCheckins.find(item => item.name === arr[i].name);
                let descriptionHtml = '<h6 style=padding-right:20px; >' + arr[i].name + '</h6>' +
                                      '<p style=padding-right:20px; > Positive tests: ' + arr[i].positive_tests + '</p>';
                if(venueLatestCheckIn != undefined) {
                    descriptionHtml +=  '<p style=padding-right:20px; ><b> Checkin History</b></hp>';
                    descriptionHtml +=  '<p style=padding-right:20px; > Date: ' + venueLatestCheckIn.date + '</p>' +
                                       '<p style=padding-right:20px; > Time: ' +  venueLatestCheckIn.time + '</p>';
                }
                const divElement = document.createElement('div');
                const buttonElement = document.createElement('div');
                buttonElement.innerHTML = `<button id="venue-${arr[i].v_id}" type="button">Check In</button>`;
                divElement.innerHTML = descriptionHtml;
                divElement.appendChild(buttonElement);
                buttonElement.addEventListener('click', (e) => {
                    console.log("btn click", e.target.attributes.id.value);
                    let venueId = e.target.attributes.id.value;
                    venueId = venueId.split('-')[1];
                    checkIn(venueId);
                    location.reload();
                });

            // create the popup for the map //
            var popup = new mapboxgl.Popup({ offset: 25 }).
            setDOMContent(divElement);
            var marker1 = new mapboxgl.Marker({color: "#FF0000"})
            .setLngLat([arr[i].longitude, arr[i].latitude])
            .setPopup(popup)
            .addTo(map);

            }
            console.log(arr);
        }
    };

    xhr.open('GET', '/load/hotspots', true);
    xhr.send();
}
//loading hotspots on the map
function loadHotspotHealthVenue(){
     console.log('loading loadHotspot');
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var arr = JSON.parse(this.response);
            for (var i = 0; i < arr.length; i++) {
                let venueLatestCheckIn = vue.userCheckins.find(item => item.name === arr[i].name);
                let descriptionHtml = '<h6 style=padding-right:20px; >' + arr[i].name + '</h6>' +
                                      '<p style=padding-right:20px; > Positive tests: ' + arr[i].positive_tests + '</p>';

                const divElement = document.createElement('div');
                divElement.innerHTML = descriptionHtml;

            // create the popup for the map //
            var popup = new mapboxgl.Popup({ offset: 25 }).
            setDOMContent(divElement);
            var marker1 = new mapboxgl.Marker({color: "#FF0000"})
            .setLngLat([arr[i].longitude, arr[i].latitude])
            .setPopup(popup)
            .addTo(map);

            }
            console.log(arr);
        }
    };

    xhr.open('GET', '/load/hotspots', true);
    xhr.send();
}

function checkIn(venueId = undefined) {
    var xhr = new XMLHttpRequest();
    var instance = M.Modal.getInstance(document.getElementById("checkin"));
    console.log("venue param", venueId);
    let venue = '';
    if(venueId) {
        venue = venueId;
    } else {
        venue = document.getElementById("venueID").value;
        document.getElementById("venueID").value = "";
        console.log("venue information", venue);
    }

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 404) {
            modalVue.invalidCheckin = true;
        } else if (this.readyState == 4 && this.status == 200) {
            console.log("sucess?");
            modalVue.invalidCheckin = false;
            instance.close();
            // loadHotspot();
            loadUser();
        }
    };

    xhr.open('POST', '/checkin', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({"v_id": venue}));
}

// Sending Emails
function sendEmailOne() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/emailOne', true);
    xhr.send();
}


function sendHotspotEmail() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("success");
        }
    };
    xhr.open('POST', '/emailAlert', true);
    xhr.send();
}

function delAccount() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("sucessfully deleted account");
            window.location.href = "/index.html";
        }
    };

    xhr.open('POST', '/users/delete', true);
    xhr.send();
}

function delVenue() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("sucessfully deleted venue & user");
            window.location.href = "/index.html";
        }
    };

    xhr.open('POST', '/users/delete/venue', true);
    xhr.send();
}

function delAccountHealth() {
    var delModal = M.Modal.getInstance(document.getElementById("deleteHealth"));
    var manageModal = M.Modal.getInstance(document.getElementById("manageUserHealth"));
    var user = document.getElementById("manageUserDropdown").value;
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("sucessfully deleted account");
            delModal.close();
            manageModal.close();
            document.getElementById("manageUserHealthForm").reset();
            loadHealthOfficial();
        }
    };

    xhr.open('POST', '/users/delete', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({'user': user}));
}

function createHotspot() {
    let hotspot = {
        venue: document.getElementById("createHotspotVenue").value,
        start: document.getElementById("createHotspotStartDate").value,
        cases: document.getElementById("createHotspotCases").value,
    };
    var instance = M.Modal.getInstance(document.getElementById("createHotspot"));
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log("Hotspot added");
            instance.close();
            loadHealthOfficial();
            loadVenuesHealthVenue();
            sendHotspotEmail();

        }
    };

    xhr.open('POST', '/hotspot/create', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(hotspot));
}