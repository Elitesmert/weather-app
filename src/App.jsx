import React, {useEffect, useState, useRef} from 'react'
import axios from 'axios'
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Image,
  Skeleton,
  Accordion,
  AccordionItem,
} from '@nextui-org/react'
import {IoLocationOutline} from 'react-icons/io5'
import {AsyncPaginate} from 'react-select-async-paginate'
import {geoApiOptions, GEO_API_URL} from './api/geoApi'
import {OPENWEATHER_URL, OPENWEATHER_API, OPENWEATHER_FORECAST_URL} from './api/openweather'
import CardFooterContent from './component/CardFooterContent'

export default function App() {
  const [weatherAll, setWeatherAll] = useState({})
  const [weatherForecast, setWeatherForecast] = useState({})
  const [isLoaded, setIsLoaded] = useState(true)
  const [bg, setBg] = useState('weather')
  const [search, setSearch] = useState(null)

  const WEEK_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const bgImage = `https://source.unsplash.com/1920x1080/?${bg}`

  const dayInAWeek = new Date().getDay()
  const forecastDays = WEEK_DAYS.slice(dayInAWeek, WEEK_DAYS.length).concat(
    WEEK_DAYS.slice(0, dayInAWeek)
  )

  const weatherIcons = () => {
    switch (weatherAll.weather[0].description) {
      case 'scattered clouds':
        return 'partly-cloudy-day'
      case 'broken clouds':
        return 'partly-cloudy-day'
      case 'clear sky':
        return 'clear-day'
      case 'few clouds':
        return 'cloudy'
      case 'overcast clouds':
        return 'overcast'
      case 'haze':
        return 'haze'
      default:
        return 'not-available'
    }
  }
  const weatherForecastIcons = (icon) => {
    switch (icon) {
      case 'scattered clouds':
        return 'partly-cloudy-day'
      case 'broken clouds':
        return 'partly-cloudy-day'
      case 'clear sky':
        return 'clear-day'
      case 'few clouds':
        return 'cloudy'
      case 'overcast clouds':
        return 'overcast'
      default:
        return 'not-available'
    }
  }

  const loadOptions = (inputValue) => {
    return fetch(
      `${GEO_API_URL}/cities?minPopulation=250000&limit=10&namePrefix=${inputValue}`,
      geoApiOptions
    )
      .then((res) => res.json())
      .then((res) => {
        return {
          options: res.data.map((city) => {
            return {
              value: `${city.latitude} ${city.longitude}`,
              label: `${city.name}, ${city.countryCode}`,
            }
          }),
        }
      })
  }

  const handleOnChange = async (searchCity) => {
    setSearch(searchCity)
    const [lat, lon] = searchCity.value.split(' ')
    const [city, country] = searchCity.label.split(', ')

    // OpenWeather API
    await axios
      .get(`${OPENWEATHER_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API}`)
      .then((res) => {
        // Handle response
        setWeatherAll(res.data)
        setIsLoaded(true)
      })
      .catch((err) => {
        // console.error(err)
      })

    // OpenWeather Forecast API
    await axios
      .get(
        `${OPENWEATHER_FORECAST_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API}`
      )
      .then((res) => {
        setWeatherForecast(res.data)
      })
      .catch((err) => {
        // console.error(err)
      })
    const lowerCase = (text) => {
      const words = text.toLowerCase().split(' ')
      return words.join('')
    }

    setBg(lowerCase(city))
  }

  return (
    <Skeleton
      isLoaded={isLoaded}
      style={{backgroundImage: `url(${bgImage})`}}
      className='relative bg-no-repeat bg-cover w-full min-h-screen max-h-fit text-white flex justify-center items-center'
    >
      <div className='absolute bg-black/60 h-full w-full top-0 left-0 z-0'></div>
      <AsyncPaginate
        className='text-black z-20'
        placeholder='Search for city'
        debounceTimeout={600}
        value={search}
        loadOptions={loadOptions}
        onChange={handleOnChange}
      />

      <Card className='w-96 mt-5'>
        <CardHeader className='pb-0 pt-2 px-4 flex-col items-center'>
          <div className='flex items-center w-full'>
            <p className='uppercase font-bold ml-auto flex gap-2 items-center'>
              <IoLocationOutline size={24} />
              {weatherAll.sys ? `${weatherAll.name}, ${weatherAll.sys.country}` : weatherAll.name}
            </p>
            {weatherAll.weather ? (
              <div className='ml-auto flex flex-col items-center'>
                <Image
                  width={50}
                  alt='NextUI hero Image'
                  src={`/weather-icons/fill/all/${weatherIcons()}.svg`}
                ></Image>
              </div>
            ) : null}
          </div>
        </CardHeader>
        <CardBody>
          <div className='flex-col flex gap-5'>
            <div className='font-bold text-7xl flex'>
              {weatherAll.main ? weatherAll.main.temp.toFixed() : null}
              <span className='text-4xl'>°C</span>
            </div>
            <div className='font-bold capitalize'>
              {weatherAll.weather ? weatherAll.weather[0].description : null}
            </div>
          </div>
        </CardBody>
        <CardFooter className='flex justify-around border-t-2 p-0'>
          <CardFooterContent
            src={`/weather-icons/fill/all/thermometer.svg`}
            title='Feels Like'
            content={weatherAll.main ? weatherAll.main.feels_like : null}
          />
          <CardFooterContent
            variant='middle'
            src={`/weather-icons/fill/all/humidity.svg`}
            title='Humidity'
            content={weatherAll.main ? weatherAll.main.humidity : null}
          />
          <CardFooterContent
            src={`/weather-icons/fill/all/windsock.svg`}
            title='Wind Speed'
            content={weatherAll.wind ? weatherAll.wind.speed : null}
          />
        </CardFooter>
      </Card>
      <Card className='bg-transparent shadow-none overflow-visible mt-5'>
        <Accordion variant='splitted'>
          {weatherForecast.list
            ? weatherForecast.list.splice(0, 7).map((day, index) => {
                let icon = day.weather[0].description
                const capitalized = (text) => {
                  const words = text.toLowerCase().split(' ')
                  const capitalizedWords = words.map((word) => {
                    return word.charAt(0).toUpperCase() + word.slice(1)
                  })
                  return capitalizedWords.join(' ')
                }
                return (
                  <AccordionItem
                    key={index}
                    aria-label={forecastDays[index]}
                    title={`${forecastDays[index]} ${capitalized(icon)}`}
                    subtitle={`Max: ${Math.round(day.main.temp_max)}°C / Min: ${Math.round(
                      day.main.temp_min
                    )}°C`}
                    startContent={
                      <Image
                        className='h-10'
                        src={`/weather-icons/fill/all/${weatherForecastIcons(icon)}.svg`}
                      />
                    }
                  >
                    <label>{day.weather[0].description}</label>
                    <label>
                      Max:{Math.round(day.main.temp_max)}°C / Min:{Math.round(day.main.temp_min)}°C
                    </label>
                  </AccordionItem>
                )
              })
            : null}
        </Accordion>
      </Card>
    </Skeleton>
  )
}
