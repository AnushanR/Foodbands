// initialize firebase
var config = {
    apiKey: "AIzaSyCdjdBm4TTXUdWX8bReLomK5OwDO5-MlMw",
    authDomain: "group-project-a22b4.firebaseapp.com",
    databaseURL: "https://group-project-a22b4.firebaseio.com",
    projectId: "group-project-a22b4",
    storageBucket: "",
    messagingSenderId: "650973955832"
};

firebase.initializeApp(config);

// variable to reference the database
var db = firebase.database();
var appName = "foodbands"
var dbEvents = db.ref(appName + "/favorite_events");
var dbRestaurants = db.ref(appName + "/favorite_restaurants");

// API keys
var ticketAPIKey = "St6LLaUsXbGYGELnzZl0vbtvfd1miIQ3";
var zomatoAPIKey = "c70c0c3366ca4b16cc49af8b36b454ee";
var googleAPIKey = "AIzaSyAIAdHWFfcdCYUzzm-ovrNGl65ROhRiwuw";

// choose pre-determined image dimensions for event
var eventImgWidth = 640;
var eventImgHeight = 427;

var genreIds = {
    "Country": "KnvZfZ7vAv6",
    "Hip-Hop/Rap": "KnvZfZ7vAv1",
    "Jazz": "KnvZfZ7vAvE",
    "Metal": "KnvZfZ7vAvt",
    "Pop": "KnvZfZ7vAev",
    "R&B": "KnvZfZ7vAee",
    "Rock": "KnvZfZ7vAeA"
}
// AJAX call to Ticketmaster
function fetchEvents(city, genre, numResults, callback) {

    var ticketQueryURL = "https://app.ticketmaster.com/discovery/v2/events?" +
        "apikey=" + ticketAPIKey +
        "&size=" + numResults +
        "&city=" + city +
        "&countryCode=" + "CA" +
        "&classificationName=" + "music" +
        "&genreId=" + genreIds[genre];

    $.ajax({
        type: "GET",
        url: ticketQueryURL,
        cache: false,
        success: function (response) {
            console.log(ticketQueryURL);
            console.log(response);
            callback(response._embedded.events);
        },
        error: function (xhr, status, err) {
            console.log(xhr);
            console.log(status);
            console.log(err);
        }
    });
}

// adds events from the TicketMaster API call to the HTML
function addEvents(events) {
    $(".event-wrapper").remove();
    $(".restaurant-wrapper").remove();
    var eventsArray = []; // to prevent duplicates
    // loop over all events
    for (i = 0; i < events.length; i++) {
        var event = events[i]; // grab current event in the loop
        if (!eventsArray.includes(event.name)) {
            eventsArray.push(event.name);
            var newEvent = $("<div>").addClass("event"); // create new element with class "event"
            // function to filter array of images to return only the desired width and height (in px)
            function grabImage(array, imgWidth, imgHeight) {
                return $.grep(array, function (n) {
                    return (n.width === imgWidth && n.height === imgHeight);
                });
            }

            // add information on the event to the new element
            newEvent.attr({
                // event metadata
                "data-name": event.name,
                "data-id": event.id,
                "data-url": event.url,

                // event image
                "data-image": grabImage(event.images, eventImgWidth, eventImgHeight)[0].url,
                // genre data
                "data-genre-id": event.classifications[0].genre.id,
                "data-genre-name": event.classifications[0].genre.name,
                "data-segment-id": event.classifications[0].segment.id,
                "data-segment-name": event.classifications[0].segment.name,
                // date data
                "data-start-datetime": event.dates.start.dateTime,
                "data-start-localdate": event.dates.start.localDate,
                "data-start-localtime": event.dates.start.localTime,
                "data-timezone": event.dates.timezone,

                // venue data
                "data-lat": event._embedded.venues[0].location.latitude,
                "data-long": event._embedded.venues[0].location.longitude,
                "data-venue-url": event._embedded.venues[0].url,
                "data-venue-name": event._embedded.venues[0].name,
                "data-venue-address": event._embedded.venues[0].address.line1,
                "data-venue-postcode": event._embedded.venues[0].postalCode,
                "data-venue-city": event._embedded.venues[0].city.name,
                "data-venue-state": event._embedded.venues[0].state.name,
                "data-venue-country": event._embedded.venues[0].country.name
            });

            // not all events have subgenres, so check if it exists before adding
            if (event.classifications[0].subgenre !== undefined) {
                newEvent.attr("data-subgenre-id", event.classifications[0].subgenre.id);
                newEvent.attr("data-subgenre-name", event.classifications[0].subgenre.name);
            }

            // add content for the event
            // restaurant and favorite buttons

            var eventURL = newEvent.attr("data-url");

            // event image
            var newImg = $("<img>").attr("src", newEvent.attr("data-image")).addClass("event-image");

            // event text
            var venue = $("<p>").text(newEvent.attr("data-venue-name")).addClass("venue-text");
            var name = $("<p>").text(newEvent.attr("data-name")).addClass("band-title");
            var date = $("<p>").text(moment(newEvent.attr("data-start-localdate")).format("ll")).addClass("date-text");
            var newBtn1 = $("<a class='btn btn-primary' href='" + eventURL + "' role='button'>Buy Tickets</a>");
            var newBtn2 = $("<button>Favorite</button>").addClass("btn-favorite btn btn-default btn-download");

            // create event wrapper so that results can be shown below the event
            var restaurantWrapper = $("<div>").addClass("restaurant-wrapper container");

            // restaurantWrapper

            // add 3 restaurants to the event wrapper
            fetchRestaurants(newEvent.attr("data-lat"), newEvent.attr("data-long"), 0, 3, restaurantWrapper, addRestaurants);
            var line = $("<hr>").addClass("style1");
            var overall = $("<div>").addClass("event-wrapper container");
            var eventWrapper = $("<div>").addClass("container py-3");
            var eventCard = $("<div>").addClass("card");
            var eventRow = $("<div>").addClass("row");
            var col1 = $("<div>").addClass("col-md-7");
            var col2 = $("<div>").addClass("col-md-5 px-3");
            newEvent.addClass("card-block px-3");
            newEvent.append(
                name,
                venue,
                date,
                newBtn1,
                newBtn2
            );
            newEvent.appendTo(col2);
            newImg.appendTo(col1);
            eventRow.append(col1, col2);
            eventCard.append(eventRow);
            eventCard.appendTo(eventWrapper);
            overall.append(eventWrapper, restaurantWrapper, line);
            overall.appendTo($("#results"));

        }
    }
}

// AJAX call to Zomato to get nearby restaurants
// takes in latitude and longitude and passes the response to the callback function
function fetchRestaurants(lat, long, start, count, targetDiv, callback) {
    var zomatoQueryURL = "https://developers.zomato.com/api/v2.1/search?" +
        "start=" + start +
        "&sort=real_distance&order=asc" +
        "&count=" + count +
        "&lat=" + lat +
        "&lon=" + long;
    $.ajax({
        type: "GET",
        url: zomatoQueryURL,
        headers: {
            "user-key": zomatoAPIKey
        },
        success: function (response) {
            console.log(zomatoQueryURL);
            console.log(response);
            callback(response, lat, long, targetDiv);
        },
        error: function (xhr, status, err) {
            console.log(xhr);
            console.log(status);
            console.log(err);
        }
    });
}

// note: reviews not implemented yet
// AJAX call to Zomato: takes in restaurant ID 
// passes the response containing reviews to the callback function
function fetchRestaurantReviews(resId, callback) {
    var zomatoQueryURL = "https://developers.zomato.com/api/v2.1/reviews?" +
        "res_id=" + resId;
    $.ajax({
        type: "GET",
        url: zomatoQueryURL,
        headers: {
            "user-key": zomatoAPIKey
        },
        success: function (response) {
            console.log(zomatoQueryURL);
            console.log(response);
            callback(response);
        },
        error: function (xhr, status, err) {
            console.log(xhr);
            console.log(status);
            console.log(err);
        }
    });
}

// adds restaurants from the Zomato API call to the HTML
function addRestaurants(data, lat, long, targetDiv) {
    function distance(lat1, long1, lat2, long2) {
        function toRad(a) {
            return Math.PI * a / 180;
        }
        var radlat1 = toRad(lat1);
        var radlat2 = toRad(lat2);
        var theta = long1 - long2;
        var radtheta = toRad(theta);
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        acosDist = Math.acos(dist)
        fdist = acosDist * 60 * 1.1515 * 1.609344 * 180 / Math.PI
        return fdist;
    }
    var restaurants = data.restaurants;
    var row = $("<div>").addClass("row");
    row.appendTo(targetDiv);
    // loop over all restaurants
    for (i = 0; i < restaurants.length; i++) {
        var restaurant = restaurants[i].restaurant; // grab current restaurant in the loop
        var newRestaurant = $("<div>").addClass("restaurant"); // create new element class "restaurant"
        // add information on the restaurant to the new element
        newRestaurant.attr({
            // restaurant metadata
            "data-name": restaurant.name,
            "data-id": restaurant.id,
            "data-url": restaurant.url,
            "data-image": restaurant.featured_image, // need code to handle non-available images

            // food data
            "data-cuisines": restaurant.cuisines,
            "data-menu-url": restaurant.menu_url,

            // cost/price data
            "data-cost": restaurant.average_cost_for_two,
            "data-currency": restaurant.currency,
            "data-price-range": restaurant.price_range,

            // location data
            "data-address": restaurant.location.address,
            "data-lat": restaurant.location.latitude,
            "data-long": restaurant.location.longitude,

            "data-event-lat": lat,
            "data-event-long": long,

            // rating data
            "data-rating": restaurant.user_rating.aggregate_rating,
            "data-rating-color": restaurant.user_rating.rating_color,
            "data-rating-text": restaurant.user_rating.rating_text,
            "data-rating-votes": restaurant.user_rating.votes,
        });

        newRestaurant.addClass("card-body");
        var restaurantURL = newRestaurant.attr("data-url");
        var col = $("<div>").addClass("col-md-4");
        var card = $("<div>").addClass("card");
        var imgSource;
        if (newRestaurant.attr("data-image") === "") {
            // imgSource = "https://via.placeholder.com/350x225";
           
            imgSource =  "https://image.ibb.co/gYLUL9/placeholder.jpg";
        } else {
            imgSource = newRestaurant.attr("data-image");
        }
        var img = $("<img>").addClass("card-img-top food-image").attr("src", imgSource);
        card.append(img, newRestaurant);

        // add content for the restaurant
        // var distance =  distance(
        //     newRestaurant.attr("data-lat"), 
        //     newRestaurant.attr("data-long"), 
        //     newRestaurant.attr("data-event-lat"), 
        //     newRestaurant.attr("data-event-long"));
        var newBtn2 = $("<button>Favorite</button>").addClass("btn-favorite btn btn-default btn-download");
        var newBtn1 = $("<a>").addClass("btn btn-default btn-download").text("View Restaurant");
        newBtn1.attr("href", restaurantURL);
        var title = $("<h5>").addClass("card-title").text(newRestaurant.attr("data-name"));
        var address = $("<p>").text(newRestaurant.attr("data-address")).addClass("food-address");
        var rating = $("<p>").text("Average Rating: " + newRestaurant.attr("data-rating")).addClass("date-text");
        var cuisines = $("<p>").text(newRestaurant.attr("data-cuisines")).addClass("date-text");

        // append the content to the new div
        newRestaurant.append(
            title,
            address,
            // distance,
            cuisines,
            rating,
            newBtn1,
            newBtn2
        );

        // append the new restaurant to the targetDiv

        card.appendTo(col);
        col.appendTo(row);

    }

}

// generate genre buttons
Object.keys(genreIds).forEach(function (key) {
    var newBtn = $("<button>").addClass("btn btn-primary");
    newBtn.html(key);
    newBtn.attr("data-genre", key);
    newBtn.addClass("btn-genre");
    newBtn.appendTo($("#genres"));
})

$(".btn-genre").on("click", function () {
    console.log($(this).attr("data-genre"));
    fetchEvents("toronto", $(this).attr("data-genre"), 10, addEvents);
})

$(document).on("click", ".btn-find-restaurants", function () {
    console.log("feed me button pressed");
    var event = $(this).parent(); // grab the event div
    var lat = event.attr("data-lat");
    var long = event.attr("data-long");
    fetchRestaurants(lat, long, 0, 3, addRestaurants);
});

$(document).on("click", ".btn-favorite", function () {
    event.preventDefault();
    console.log("favorite button pressed");

    // check if button belongs to event or restaurant
    var parent = $(this).parent();
    if (parent.hasClass("event")) {
        var type = "event";
    } else if (parent.hasClass("restaurant")) {
        var type = "restaurant";
    }

    // push to Firebase accordingly
    pushDB(type, parent.attr("data-id"), parent.attr("data-name"));
});

function pushDB(type, id, name) {
    if (type === "event") {
        dbEvents.push({
            eventId: id,
            eventName: name
        });
    } else if (type === "restaurant") {
        dbRestaurants.push({
            restaurantId: id,
            restaurantName: name
        });
    }
}

// update firebase
dbEvents.on("child_added", function (snapshot) {
    var sv = snapshot.val();
    console.log(sv.id);
    console.log(sv.name);
    // code to update list
}, function (error) {
    console.log(error);
});

dbRestaurants.on("child_added", function (snapshot) {
    var sv = snapshot.val();
    console.log(sv.id);
    console.log(sv.name);
    // code to update list
}, function (error) {
    console.log(error);
});