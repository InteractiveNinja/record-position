<script lang="ts">
    import './page.css'
    import {onMount} from 'svelte';

    let position: GeolocationPosition | null = $state(null);

    onMount(() => {
        if ("geolocation" in navigator) {
            /* geolocation is available */
            navigator.geolocation.watchPosition((p) => {
                position = p;
            })
        } else {
            console.error("geolocation is not supported");
            /* geolocation IS NOT available */
        }
    });

    function record() {

    }
</script>

<div class="flex">
    <h1>Positions-Tool</h1>
    <input placeholder="Beschreibung"/>
    <h1>Aktuelle Position Daten</h1>
    <p>latitude: {position?.coords.latitude}</p>
    <p>longitude: {position?.coords.longitude}</p>
    <p>accuracy: {position?.coords.accuracy}</p>
    <p>altitude: {position?.coords.altitude}</p>
    <p>altitudeAccuracy: {position?.coords.altitudeAccuracy}</p>
    <p>heading: {position?.coords.heading}</p>
    <button onclick={record()}>Save Recording</button>
</div>
