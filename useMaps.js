// elenco dei cap ammessi
// var caps = [
//   '20121',
//   '20122',
//   '20123',
//   '20124',
//   '20129',
//   '20135',
//   '20136',
//   '20144',
//   '20145',
//   '20146',
//   '20149',
//   '20151',
//   '20154',
//   '20159',
// ];

export default (caps, onCheckShippingCoverage) => {
  var placeSearch, autocomplete;

  var componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_2: 'short_name',
    country: 'short_name',
    postal_code: 'short_name',
  };

  window.initAutocomplete = function initAutocomplete() {
    autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('route_street_number'),
      { types: ['geocode'] }
    );
    autocomplete.setFields(['address_component']);
    autocomplete.addListener('place_changed', () => fillInAddress(caps));
    autocomplete.setComponentRestrictions({ country: 'it' });

    // con questo evento ascoltiamo le immissioni manuali nell' input
    // ed anche l'auto-fill del browser
    document
      .querySelector('[data-address="postal_code"]')
      .addEventListener('input', function () {
        checkShippingCoverage(
          caps,
          document.querySelector('[data-address="postal_code"]').value
        );
      });
    document
      .querySelector('[data-address="postal_code"]')
      .addEventListener('keydown', function () {
        checkShippingCoverage(
          caps,
          document.querySelector('[data-address="postal_code"]').value
        );
      });
    document
      .querySelector('[data-address="postal_code"]')
      .addEventListener('blur', function () {
        checkShippingCoverage(
          caps,
          document.querySelector('[data-address="postal_code"]').value
        );
      });
  };

  // controllo del cap corrente
  function checkShippingCoverage(caps, postal_code) {
    // se in lista o minore di 5 caratteri o campo vuoto -> non mostra errore
    // altrimenti -> mostra errore
    if (
      caps.includes(postal_code) ||
      postal_code.length < 5 ||
      !postal_code.length
    ) {
      onCheckShippingCoverage(true);
      // document.querySelector('#area-check-pass').style.display = 'block';
      document.querySelector('#area-check-error').style.display = 'none';
      // document.querySelector('#btn-checkout').style.display = 'block';
    } else {
      onCheckShippingCoverage(false);
      // document.querySelector('#area-check-pass').style.display = 'none';
      document.querySelector('#area-check-error').style.display = 'block';
      // document.querySelector('#btn-checkout').style.display = 'none';
    }
  }

  function fillInAddress(caps) {
    var place = autocomplete.getPlace();

    let route;
    let street_number;
    for (var i = 0; i < place.address_components.length; i++) {
      var addressType = place.address_components[i].types[0];
      if (componentForm[addressType]) {
        var val = place.address_components[i][componentForm[addressType]];
        switch (addressType) {
          case 'route':
            route = val;
            break;
          case 'street_number':
            street_number = val;
            break;
          case 'country':
            document.querySelector('[data-address="country"]').value = val;
            break;
          default:
            document.querySelector(
              `[data-address='${addressType}']`
            ).value = val;
        }
        if (addressType === 'postal_code') {
          checkShippingCoverage(val);
        }
      }
    }

    // se il numero civico e' presente
    // concatena via e numero civico nello stesso input
    const route_street_number = street_number
      ? `${route}, ${street_number}`
      : route;
    if (route_street_number) {
      document.querySelector(
        `[data-address='route_street_number']`
      ).value = route_street_number;
    }
  }

  function geolocate() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        var geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        var circle = new google.maps.Circle({
          center: geolocation,
          radius: position.coords.accuracy,
        });
        autocomplete.setBounds(circle.getBounds());
      });
    }
  }
};

/* <script
  async
  src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAWDAlwUG-CInbppjWfuIjdocPX-zUzAxU&libraries=places&callback=initAutocomplete"></script>; */
