/* eslint no-new: 0 */
import gmaps from 'google-maps';
import $ from 'jquery';

export default function initGmaps (selector = '.media-map__location', APIKey = undefined) {
    const $el = $(selector);
    const el = $el[0];

    if (!el) return;

    if (APIKey) {
        gmaps.KEY = APIKey;
    }

    const [lat, lng] = $el.attr('data-latlng').split(',').map(val => parseFloat(val));
    const latlng = {lat, lng};

    // Set up your styles here
    const styles = [
        {
            "elementType": "geometry",
            "stylers": [
                {
                    "visibility": "simplified"
                },
                {
                    "hue": "#ff0000"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "transit.station",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative",
            "stylers": [
                {
                    "visibility": "simplified"
                }
            ]
        },
        {
            "featureType": "water",
            "stylers": [
                {
                    "color": "#f3f3f3"
                },
                {
                    "visibility": "on"
                }
            ]
        }
    ]

    gmaps.load(google => {
        const opts = {
            center: latlng,
            zoom: 3,
            zoomControl: true,
            zoomControlOptions: {
                style: google.maps.ZoomControlStyle.SMALL,
            },
            disableDoubleClickZoom: false,
            mapTypeControl: false,
            scaleControl: false,
            scrollwheel: false,
            panControl: true,
            streetViewControl: false,
            draggable: true,
            overviewMapControl: false,
            overviewMapControlOptions: {
                opened: false,
            },
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: styles,
        };
        const locations = $('.media-map__location__point')
            .map(function() {
                const [lat, lng] = $(this).data('latlng').split(',').map(val => parseFloat(val));
                const latlng = {lat, lng};
                return {
                    title: $(this).data('title'),
                    desc: '',
                    tel: '',
                    email: '',
                    web: '',
                    position: latlng,
                    icon: '/assets/img/map-pin.png',
                };
            })
            .get();

        const map = new google.maps.Map(el, opts);

        // Based on https://www.aspsnippets.com/Articles/Google-Maps-API-V3-Center-and-Zoom-to-fit-all-markers-on-Google-Maps.aspx

        var latlngbounds = new google.maps.LatLngBounds();

        for (var i = 0; i < locations.length; i++) {
            var data = locations[i];
            var myLatlng = new google.maps.LatLng(data.position);
            var location = new google.maps.Marker({
                position: myLatlng,
                map: map,
                title: data.title,
                icon: data.icon,
                desc: data.desc,
                tel: data.tel,
                email: data.email,
                web: data.web,
            });
            latlngbounds.extend(location.position);
        }

        //Get the boundaries of the Map.
        var bounds = new google.maps.LatLngBounds();

        //Center map and adjust Zoom based on the position of all markers.
        map.setCenter(latlngbounds.getCenter());
        map.fitBounds(latlngbounds);

    });

}
