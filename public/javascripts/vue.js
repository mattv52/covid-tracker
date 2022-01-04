var vue = new Vue({
  el: "#app",
  data: {
    userAccount: [],
    healthOfficial: false,
    venueOwner: false,
    user: true,
    userCheckins: [],
    venueCheckins: [],
    google: false,
    allVenues: [],
    allUsers: [],
    // emailExists: false
  }
});

var modalVue = new Vue ({
  el: "#modals",
  data: {
    invalidCheckin: false,
    notHotspotVenue: [],
    hotspotVenue: [],
    allVenues: [],
    allUsers: [],
  }
})