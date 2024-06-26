
import requests

p1={"lat":39.1813855,"lon":-77.1827295}
p2={"lat":39.1825835,"lon":-77.1828465}

rest_url = "https://rest.isric.org"
prop_query_url = f"{rest_url}/soilgrids/v2.0/properties/query"

props = {"property":"phh2o","depth":"0-5cm","value":"mean"}

res1=requests.get(prop_query_url,params={**p1 , **props})
print(res1.json()['properties']["layers"][0]["depths"][0]["values"])
#p1 --> {'mean': 462} 

res2=requests.get(prop_query_url,params={**p2 , **props})
print(res2.json()['properties']["layers"][0]["depths"][0]["values"])
#p2 --> {'mean': None}