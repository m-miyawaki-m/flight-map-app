// src/services/flightService.ts
import axios from 'axios'

export const fetchFlightData = async (icao24: string) => {
  const res = await axios.get(`https://opensky-network.org/api/tracks/all?icao24=${icao24}&time=0`)
  return res.data
}
