/* eslint-disable */
export const displayMap = (locations = []) => {
  mapboxgl.accessToken =
    'pk.eyJ1Ijoiam9uYXNzY2htZWR0bWFubiIsImEiOiJjam54ZmM5N3gwNjAzM3dtZDNxYTVlMnd2In0.ytpI7V7w7cyT1Kq5rT9Z1A';

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/jonasschmedtmann/cjvi9q8jd04mi1cpgmg7ev3dy',
    scrollZoom: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    if (
      !loc ||
      !Array.isArray(loc.coordinates) ||
      loc.coordinates.length !== 2
    ) {
      console.warn('Invalid location coordinates:', loc);
      return;
    }

    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(
        `<p>Day ${loc.day || '?'}: ${loc.description || 'No description'}</p>`
      )
      .addTo(map);

    bounds.extend(loc.coordinates);
  });

  if (locations.length > 0) {
    map.fitBounds(bounds, {
      padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100
      }
    });
  }
};
