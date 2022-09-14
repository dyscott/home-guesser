// Manages scraping house information, displaying them, and storing their coordinates

var trueLat;
var trueLng;

// Returns a HTMLDocument for the provided URL path
async function getDocumentFromUrl(url) {
    const response = await fetch('https://zillow.com/' + url, {
        method: "GET",
        headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Encoding': 'gzip, deflate, sdch, br',
            'Accept-Language': 'en-GB,en;q=0.8,en-US;q=0.6,ml;q=0.4',
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36"
        }
    });
    return new DOMParser().parseFromString(await response.text(), "text/html");
}

// Returns a random two letter state code (NY, VA, MT, etc.)
function getRandomState() {
    const states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DC", "DE", "FL", "GA",
        "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
        "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
        "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
        "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

    return states[Math.floor(Math.random() * states.length)];
}

// Returns the image URL and coordinates of a specific house
async function getHouseDetails(url) {
    const pageDocument = await getDocumentFromUrl(url)

    const apolloData = JSON.parse(pageDocument.getElementById("hdpApolloPreloadedData").innerHTML)
    const apiCache = JSON.parse(apolloData.apiCache)
    const fullQueryKey = Object.keys(apiCache)[1]
    const propertyData = apiCache[fullQueryKey].property

    return [propertyData.hiResImageLink, propertyData.latitude, propertyData.longitude]

}

// Returns the image URL and coordinates of a random house
async function getRandomHouse() {
    try {
        // Get a random state and page number
        const state = getRandomState()
        const page = Math.ceil(Math.random() * 10)

        const pageDocument = await getDocumentFromUrl(state + "/houses/" + page + "_p/")
        const houseIds = Array.from(pageDocument.getElementsByClassName("list-card_not-saved")).map(element => element.id.replace("zpid_", "") + "_zpid")
        
        // Select a random house
        const house = houseIds[Math.floor(Math.random() * houseIds.length)]
        
        const details = await getHouseDetails("homedetails/" + house);
        return details;
    } catch(error) {
        // If we get an error, retry
        await new Promise(r => setTimeout(r, 2000)); // Wait to avoid getting a captcha
        return getRandomHouse();
    }
}

// Called after every new round, replaces the current house and coordinates
async function newHouse() {
    const house = await getRandomHouse();

    const image = document.createElement("img");
    image.src = house[0];

    document.getElementById("image").replaceChildren(image);

    trueLat = house[1];
    trueLng = house[2];
}

