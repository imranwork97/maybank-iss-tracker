import './App.css'
import Map from './Map' //import Map.js
import { useState, useEffect } from 'react' //import react
import axios from 'axios'
import Geocode from 'react-geocode'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

function App() {

    const [pastLocation, setPastLocation] = useState("")

    const [selectedDate, setSelectedDate] = useState(new Date())

    const [issData, setIssData] = useState("")
    const [locationName, setLocationName] = useState("")
    const { latitude, longitude, timestamp, velocity } = issData

    const cDate = new Date(timestamp * 1000);
    const issDate = cDate.getDate() + "/" + (cDate.getMonth() + 1) + "/" + cDate.getFullYear()
    const issTime = cDate.getHours() + ":" + String(cDate.getMinutes()).padStart(2, "0") + ":" + cDate.getSeconds()

    const tableData = [
        { name: "Latitude", value: latitude ? latitude.toFixed(3) : "" },
        { name: "Longitude", value: longitude ? longitude.toFixed(3) : "" },
        { name: "Date", value:  issDate !== "NaN/NaN/NaN" ? issDate : "Loading" },
        { name: "Time", value: issTime !== "NaN:NaN:NaN" ? issTime : "Loading"},
        { name: "City", value: locationName ? locationName : "Above the Sea"},
        { name: "Velocity", value: velocity ? velocity.toFixed(3) + "km / h" : "" },
    ]

    const onChangeDateHandler = (date) => {
        setSelectedDate(date)
        console.log(date)
        fetchIssDataInterval(date)
        }

    const getAddress = (lat, long) => {
        // Google Maps Geocoding API
        Geocode.setApiKey("AIzaSyCojEv3k2kJ9xBVyuDKzoL0OgpvBjcMCQM");

        // set response language. Defaults to english.
        Geocode.setLanguage("en");

        // Get address from latitude & longitude.
        Geocode.fromLatLng(lat, long).then(
            (response) => {
                const address = response.results[0].formatted_address;
                let city, state, country;
                for (let i = 0; i < response.results[0].address_components.length; i++) {
                    for (let j = 0; j < response.results[0].address_components[i].types.length; j++) {
                        switch (response.results[0].address_components[i].types[j]) {
                            case "locality":
                                city = response.results[0].address_components[i].long_name;
                                break;
                            case "administrative_area_level_1":
                                state = response.results[0].address_components[i].long_name;
                                break;
                            case "country":
                                country = response.results[0].address_components[i].long_name;
                                break;
                        }
                    }
                }
                
                setLocationName(country);
                
                
            },
            (error) => {
                console.error(error);
            }
        );
    };
    const fetchIssDataInterval = async (date) => {
        const formattedTimeStamp = parseInt(new Date(date).getTime() / 1000) + "&units=miles"
        const issUrl = `https://api.wheretheiss.at/v1/satellites/25544/positions?timestamps=${formattedTimeStamp}`;
        const response = await fetch(issUrl);
        const data = await response.json();
        setPastLocation(data[0])
        console.log(data[0])
    };


    const getLoc = async () => {
        const res = await axios.get('https://api.wheretheiss.at/v1/satellites/25544.json')
        const data = await res.data
        setIssData(data)
        getAddress(data.latitude, data.longitude)
        
    }

    useEffect(() => {
        const timer = setInterval(() => {
            getLoc();
        }, 2000);
        return () => {
            clearInterval(timer);
        };
    }, [])

    return (

            <div className='app'>
            <div className='info'>
                <h1>
                    ISS Tracker
                </h1>
                <table>
                    {
                        tableData.map((index) => {
                            return (
                                <tr>
                                    <th>
                                        {
                                            index.name
                                        }
                                    </th>
                                    <td>
                                        {
                                            index.value
                                        }
                                        
                                    </td>
                                </tr>
                                )
                        })
                    }
                </table>
            <div className='datetime'>
                    <label
                        className='datelbl'>
                        Choose Date:
                    </label>
                    <DatePicker
                        dateFormat="dd.MM.yyyy hh:mm aa"
                        selected={selectedDate}
                        onChange={(date) => onChangeDateHandler(date)}
                        maxDate={new Date()}
                        showPopperArrow={false}
                        placeholderText="Select date and time"
                        showTimeSelect
                        isClearable
                        disabledKeyboardNavigation
                    />
                    
                      
                </div>
                <div>
                    <label
                        className='tbllbl'>
                        Previous Location
                    </label>
                    <table className='tblPreLoc'>
                        <tr>
                            <th> Latitude</th>
                            <th> Longitude</th>
                            </tr>
                        <tr>
                            <td> {pastLocation.latitude ? pastLocation.latitude.toFixed(3) : ""}</td>
                            <td> {pastLocation.longitude ? pastLocation.longitude.toFixed(3) : ""}</td>
                            
                        </tr>
                    </table>
                </div>
            </div>
            {issData ? <Map center={issData} zoom={4} /> : null}
            </div>
            
    )
}
export default App;
