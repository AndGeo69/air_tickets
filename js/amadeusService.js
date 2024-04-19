'use strict'

const localhost = "http://localhost:8081/";

// Airport auto complete provided by amadeus
$(function () {
    $('.searchName').autocomplete({
        source: function (req, res) {
            $.ajax({
                url: localhost + "airportSearch/",
                dataType: "json",
                type: "GET",
                data: req,
                success: function (data) {
                    res($.map(data, function (el) {
                        return {
                            label: el.address.cityName + ' (' + el.iataCode + ')',
                            value: el.iataCode
                        }
                    }));
                },
                error: function (err) {
                    console.log(err.status);
                }
            });
        }
    });
}); 


document.querySelector('#searchBtn').addEventListener('click', function (evt) {
    if (flightMapList.length > 0) {
        flightMapList.forEach((flight) => {
            sendFlightsData(flight);
        })
    }
})

function sendFlightsData(data) {
    $.ajax({
        url: localhost + "getFlights",
        dataType: "text",
        type: "GET",
        data: data,
        success: function (res) {
            console.log("Received data from server: ");
            console.log(res);
        },
        error: function (err) {
            console.log(err.status);
        }
    });

}

