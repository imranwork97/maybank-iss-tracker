import GoogleMapReact from 'google-map-react'
import station from './rocket.png'

function Map({ center, zoom }) {
    const handleDefaultLocation = () => {
        if (center) {
            return {
                lat: center.latitude,
                lng: center.longitude
            }
        } else {
            return {
                lat: 3.14,
                lng: 101.69
            }
        }
    }
    return (
        <div className='Map-Container'>
            <GoogleMapReact
                boostrapURLKeys={{ key: 'AIzaSyCojEv3k2kJ9xBVyuDKzoL0OgpvBjcMCQM' }}
                draggable={false}
                center={handleDefaultLocation()}
                defaultZoom={zoom}
            >
                <img
                    src={station}
                    alt="ISS Station Icon"
                    className="station-icon"
                    lat={center.latitude}
                    lng={center.longitude}
                />

            </GoogleMapReact>
        </div>
    )
}
export default Map