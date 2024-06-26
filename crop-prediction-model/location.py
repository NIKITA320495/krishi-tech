import requests
import geocoder

def get_location_from_ip():
    try:
        g = geocoder.ip('me')
        latlng = g.latlng
        if latlng:
            return latlng[0], latlng[1]  # Latitude, Longitude
        else:
            print("Failed to fetch location from IP.")
            return None, None
    except Exception as e:
        print(f"Error fetching location from IP: {e}")
        return None, None

def get_weather_data(lat, long, api_key):
    url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={long}&units=metric&appid={api_key}"
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for HTTP errors (4xx or 5xx)
        data = response.json()
        
        temperature = data['main'].get('temp')
        humidity = data['main'].get('humidity')
        
        # Check if 'rain' key exists and then get '1h' rainfall, default to 0 if not present
        rainfall = 0
        if 'rain' in data and '1h' in data['rain']:
            rainfall = data['rain']['1h']
        
        return temperature, humidity, rainfall
    
    except requests.exceptions.HTTPError as http_err:
        print(f"HTTP error occurred: {http_err}")
    except requests.exceptions.RequestException as req_err:
        print(f"Request error occurred: {req_err}")
    except ValueError as val_err:
        print(f"Value error occurred: {val_err}")
    except KeyError as key_err:
        print(f"Key error occurred: {key_err}")
    except Exception as err:
        print(f"Other error occurred: {err}")
    
    return None, None, None

def get_soil_data(latitude, longitude):
    rest_url = "https://rest.isric.org"
    prop_query_url = f"{rest_url}/soilgrids/v2.0/properties/query"
    prop1 = {"property":"phh2o","depth":"0-5cm","value":"mean"}
    prop2={"property":"nitrogen","depth":"5-15cm","value":"mean"}
    p1={"lat":latitude,"lon":longitude}
    res1=requests.get(prop_query_url,params={**p1 , **prop1})
    res2=requests.get(prop_query_url,params={**p1 , **prop2})
    ph=res1.json()['properties']["layers"][0]["depths"][0]["values"]
    nitrogen=res2.json()['properties']["layers"][0]["depths"][0]["values"]
    return ph,nitrogen

def main():
    latitude, longitude = get_location_from_ip()
    if latitude is not None and longitude is not None:
        print(f"Latitude: {latitude}, Longitude: {longitude}")
    else:
        print("Failed to fetch location.")
    api_key = 'c22109f9a9c43b3bf6aed69688189ec6'
    
    try:
        temperature, humidity, rainfall = get_weather_data(latitude, longitude, api_key)
        ph_value , nitrogen = get_soil_data(latitude, longitude)
        
        if ph_value is not None:
            print(f"pH value: {ph_value}")
            print(f"Nitrogen: {nitrogen}")
        
        if temperature is not None and humidity is not None:
            print(f"Temperature: {temperature}°C")
            print(f"Humidity: {humidity}%")
            if rainfall is not None:
                print(f"Rainfall: {rainfall}mm")
            else:
                print("No rainfall data available")
        else:
            print('Failed to fetch weather data')
    
    except Exception as e:
        print(f"An error occurred: {e}")
   

if __name__ == "__main__":
    main()
