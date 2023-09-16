import React, {useEffect, useState, useRef} from 'react'
import axios from 'axios'
import {Card, CardBody, CardFooter, CardHeader, Image, Input, Skeleton} from '@nextui-org/react'
import {IoLocationOutline} from 'react-icons/io5'
import {AiOutlineSearch} from 'react-icons/ai'

export default function App() {
  const [weatherAll, setWeatherAll] = useState({})
  const [weather4Day, setWeather4Day] = useState({})
  const [isLoaded, setIsLoaded] = useState(true)
  const [location, setLocation] = useState('')
  const [bg, setBg] = useState('weather')

  let api = 'db6c2a00de491a7370fcb41710e0d55b'
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${api}`
  const url_4day = `http://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${api}`
  const bgImage = `https://source.unsplash.com/1920x1080/?${bg}`

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
      default:
        return 'not-available'
    }
  }
  const searchLocation = (e) => {
    if (e.key === 'Enter') {
      setBg(location)

      // First API
      axios
        .get(url)
        .then((res) => {
          // Handle response
          setWeatherAll(res.data)
          setIsLoaded(true)
        })
        .catch((err) => {
          // console.error(err)
        })

      // Second API
      axios
        .get(url_4day)
        .then((res) => {
          setWeather4Day(res.data)
        })
        .catch((err) => {
          // console.error(err)
        })
      setLocation('')
    }
  }
  console.log(weather4Day)

  return (
    <Skeleton
      isLoaded={isLoaded}
      style={{backgroundImage: `url(${bgImage})`}}
      className='relative bg-no-repeat bg-cover w-full h-screen text-white flex justify-center items-center'
    >
      <div className='absolute bg-black/60 h-screen w-full top-0 left-0'></div>
      <Input
        classNames={{
          base: 'max-w-full sm:max-w-96 h-10',
          mainWrapper: 'h-full',
          input: 'text-small',
          inputWrapper:
            'h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20',
        }}
        value={location}
        onChange={(e) => {
          setLocation(e.target.value)
        }}
        onKeyPress={searchLocation}
        placeholder='Enter a city name'
        size='sm'
        type='search'
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
            <p className='font-bold text-7xl flex'>
              {weatherAll.main ? weatherAll.main.temp.toFixed() : null}
              <span className='text-4xl'>°C</span>
            </p>
            <p className='font-bold capitalize'>
              {weatherAll.weather ? weatherAll.weather[0].description : null}
            </p>
          </div>
        </CardBody>
        <CardFooter className='flex justify-around border-t-2 p-0'>
          <div className='w-full items-center flex flex-col'>
            <h6>Feels Like</h6>
            <p className='flex items-center'>
              <Image className='h-10' src={`/weather-icons/fill/all/thermometer.svg`} />
              {weatherAll.main ? weatherAll.main.feels_like : null}
            </p>
          </div>
          <div className='w-full items-center flex flex-col border-x-2'>
            <h6>Humidity</h6>
            <p className='flex items-center'>
              <Image className='h-10' src={`/weather-icons/fill/all/humidity.svg`} />
              {weatherAll.main ? weatherAll.main.humidity : null}
            </p>
          </div>
          <div className='w-full items-center flex flex-col'>
            <h6>Wind Speed</h6>
            <p className='flex items-center'>
              <Image className='h-10' src={`/weather-icons/fill/all/windsock.svg`} />
              {weatherAll.wind ? weatherAll.wind.speed : null}
            </p>
          </div>
        </CardFooter>
      </Card>
    </Skeleton>
  )
}
