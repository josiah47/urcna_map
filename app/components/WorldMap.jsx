import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
	Configure,
	InstantSearch,
	useClearRefinements,
	useCurrentRefinements,
	useHits,
	useInstantSearch,
	useRefinementList,
	useSearchBox,
} from 'react-instantsearch';
import { AdjustmentsHorizontalIcon, EnvelopeIcon, HomeIcon, InformationCircleIcon, MapPinIcon, PhoneIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { MapContainer, TileLayer, Marker, Polygon, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const iconMeta = {
	church: 'Church',
	'church-plant': 'Church Plant',
	foreign: 'Foreign',
	home: 'Home',
	prison: 'Prison',
};

const assetBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? (process.env.NODE_ENV === 'production' ? '/urcna_map' : '');
const assetPath = (path) => `${assetBasePath}${path}`;

const markerIconUrls = {
	church: assetPath('/icons/church.png'),
	'church-plant': assetPath('/icons/church-plant.png'),
	foreign: assetPath('/icons/foreign.png'),
	home: assetPath('/icons/home.png'),
	prison: assetPath('/icons/prison.png'),
};

const markerIconSizes = {
	church: [34, 58],
	'church-plant': [38, 58],
	foreign: [35, 58],
	home: [34, 58],
	prison: [34, 58],
};

const desktopInitialView = {
	center: [34, -55],
	zoom: 3.25,
	minZoom: 3,
};

const mobileInitialView = {
	center: [49, -100],
	zoom: 2.75,
	minZoom: 2.25,
};

const useMediaQuery = (query) => {
	const getMatches = useCallback(() => (
		typeof window !== 'undefined' && window.matchMedia(query).matches
	), [query]);
	const [matches, setMatches] = useState(getMatches);

	useEffect(() => {
		if (typeof window === 'undefined') return undefined;

		const mediaQuery = window.matchMedia(query);
		const updateMatches = () => setMatches(mediaQuery.matches);

		updateMatches();
		mediaQuery.addEventListener('change', updateMatches);

		return () => mediaQuery.removeEventListener('change', updateMatches);
	}, [query]);

	return matches;
};

const icons = Object.fromEntries(
	Object.entries(iconMeta).map(([type, name]) => [
		type,
		new L.Icon({
			name,
			iconUrl: markerIconUrls[type],
			iconSize: markerIconSizes[type],
			iconAnchor: [markerIconSizes[type][0] / 2, markerIconSizes[type][1]],
			popupAnchor: [0, -52],
			className: 'map-marker-icon',
		}),
	])
);

const Markers = [
	{
		"type": "church",
		"id": "186571",
		"position": [
			42.9804,
			-81.6007
		],
		"name": "Providence United Reformed Church of Strathroy",
		"location": "Strathroy, Ontario",
		"link": "https://www.providenceurc.com",
		"image": "",
		"classis": "Southwestern Ontario",
		"mailingAddress": {
			"street": "447 Second Street",
			"city": "Strathroy",
			"state": "ON",
			"zip": "N7G 3J1",
			"country": "Canada",
			"formatted": "447 Second Street\nStrathroy, ON N7G 3J1\nCanada"
		},
		"meetingAddress": {
			"street": "447 Second St.",
			"city": "Strathroy",
			"state": "ON",
			"zip": "N7G 3J1",
			"country": "Canada",
			"formatted": "447 Second St.\nStrathroy, ON N7G 3J1\nCanada"
		},
		"contact": {
			"ministers": [
				"Rev. Harry Zekveld   (519) 246-1261"
			],
			"phone": "(519) 245-3600",
			"fax": "",
			"email": "clerk@providenceurc.com",
			"website": "www.providenceurc.com"
		},
		"meetingInformation": "9:30 AM and 3:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1999",
		"joinedUrcYear": "1999",
		"clerk": "Elder George Bork (519) 331-1282",
		"clerkEmail": "clerk@providenceurc.com",
		"totalMembers": 391,
		"latitude": 42.9804,
		"longitude": -81.6007,
		"sourceColumns": {
			"primaryMinister": "Rev. Harry Zekveld",
			"minister": "Rev. Harry Zekveld   (519) 246-1261",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "192715",
		"position": [
			41.623631,
			-122.407844
		],
		"name": "Big Springs Community Church",
		"location": "Montague, California",
		"link": "https://www.bigspringsurc.com",
		"image": "",
		"classis": "Pacific Northwest",
		"mailingAddress": {
			"street": "7220 County Highway A12",
			"city": "Montague",
			"state": "CA",
			"zip": "96064",
			"country": "United States",
			"formatted": "7220 County Highway A12\nMontague, CA 96064\nUnited States"
		},
		"meetingAddress": {
			"street": "7220 County Highway A12",
			"city": "Montague",
			"state": "CA",
			"zip": "96064",
			"country": "United States",
			"formatted": "7220 County Highway A12\nMontague, CA 96064\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Nollie Malabuyo"
			],
			"phone": "(925) 435-8125",
			"fax": "",
			"email": "dvopilgrim@gmail.com",
			"website": "https://www.bigspringsurc.com"
		},
		"meetingInformation": "10:30 AM",
		"meetingDetails": "",
		"yearOrganized": "1993",
		"joinedUrcYear": "2014",
		"clerk": "Ken Joling",
		"clerkEmail": "dvopilgrim@gmail.com",
		"totalMembers": 24,
		"latitude": 41.623631,
		"longitude": -122.407844,
		"sourceColumns": {
			"primaryMinister": "Rev. Nollie Malabuyo",
			"minister": "Rev. Nollie Malabuyo",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186512",
		"position": [
			26.652566,
			-81.926665
		],
		"name": "Trinity Reformed Church of Cape Coral",
		"location": "Cape Coral, Florida",
		"link": "https://www.trinityurc.com",
		"image": "",
		"classis": "Eastern U.S.",
		"mailingAddress": {
			"street": "2220 Hancock Bridge Pkwy.",
			"city": "Cape Coral",
			"state": "FL",
			"zip": "33990",
			"country": "United States",
			"formatted": "2220 Hancock Bridge Pkwy.\nCape Coral, FL 33990\nUnited States"
		},
		"meetingAddress": {
			"street": "2220 Hancock Bridge Pkwy.",
			"city": "Cape Coral",
			"state": "FL",
			"zip": "33990",
			"country": "United States",
			"formatted": "2220 Hancock Bridge Pkwy.\nCape Coral, FL 33990\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Stephen Wetmore"
			],
			"phone": "(239) 574-1424",
			"fax": "",
			"email": "church@trinityurc.com",
			"website": "www.trinityurc.com"
		},
		"meetingInformation": "10:00 AM and 11:45 AM",
		"meetingDetails": "10:00 AM Expositional - 11:45 AM Confessional",
		"yearOrganized": "1978",
		"joinedUrcYear": "1996",
		"clerk": "Jason Russo",
		"clerkEmail": "Clerk@trinityurc.com",
		"totalMembers": 67,
		"latitude": 26.652566,
		"longitude": -81.926665,
		"sourceColumns": {
			"primaryMinister": "Rev. Stephen Wetmore",
			"minister": "Rev. Stephen Wetmore",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "470724",
		"position": [
			40.02439,
			-86.10696
		],
		"name": "Indy Reformed Church, Indianapolis IN",
		"location": "Westfield, Indiana",
		"link": "https://indyurc.org",
		"image": "",
		"classis": "Eastern U.S.",
		"mailingAddress": {
			"street": "10656 Sandpiper ct.",
			"city": "Noblesville",
			"state": "IN",
			"zip": "46060",
			"country": "United States",
			"formatted": "10656 Sandpiper ct.\nNoblesville, IN 46060\nUnited States"
		},
		"meetingAddress": {
			"street": "16231 Carey Rd.",
			"city": "Westfield",
			"state": "IN",
			"zip": "46060",
			"country": "United States",
			"formatted": "16231 Carey Rd.\nWestfield, IN 46060\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Austin Reifel"
			],
			"phone": "(661) 599-2556",
			"fax": "",
			"email": "indyreformed@gmail.com",
			"website": "indyurc.org"
		},
		"meetingInformation": "10:00AM and TBD",
		"meetingDetails": "Meeting at Carey Ridge Elementary in Westfield, IN",
		"yearOrganized": "N/A",
		"joinedUrcYear": "2021",
		"clerk": "Zeltenreich Clerk",
		"clerkEmail": "clerk@zeltenreich.org",
		"totalMembers": 42,
		"latitude": 40.02439,
		"longitude": -86.10696,
		"sourceColumns": {
			"primaryMinister": "Rev. Austin Reifel",
			"minister": "Rev. Austin Reifel",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "541417",
		"position": [
			52.107986,
			-106.670018
		],
		"name": "Covenant United Reformed Church in Saskatoon",
		"location": "Saskatoon, Saskatchewan",
		"link": "http://www.covenanturc.ca/",
		"image": "",
		"classis": "Western Canada",
		"mailingAddress": {
			"street": "Box 1037A",
			"city": "Warman",
			"state": "SK",
			"zip": "S0K 4S0",
			"country": "Canada",
			"formatted": "Box 1037A\nWarman, SK S0K 4S0\nCanada"
		},
		"meetingAddress": {
			"street": "1801 Lorne Ave.",
			"city": "Saskatoon",
			"state": "SK",
			"zip": "S0K 4S0",
			"country": "Canada",
			"formatted": "1801 Lorne Ave.\nSaskatoon, SK S0K 4S0\nCanada"
		},
		"contact": {
			"ministers": [
				"Vacant"
			],
			"phone": "(306) 222-8455",
			"fax": "",
			"email": "clerk.covenanturc@gmail.com",
			"website": "http://www.covenanturc.ca/"
		},
		"meetingInformation": "11:30AM and 6:00PM",
		"meetingDetails": "",
		"yearOrganized": "2023",
		"joinedUrcYear": "2023",
		"clerk": "Henk Vandenbrink",
		"clerkEmail": "clerk.covenanturc@gmail.com",
		"totalMembers": "",
		"latitude": 52.107986,
		"longitude": -106.670018,
		"sourceColumns": {
			"primaryMinister": "Vacant, (306) 222-8455",
			"minister": "Vacant",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "208376",
		"position": [
			40.723008,
			-74.068612
		],
		"name": "Grace Reformed Church of Jersey City",
		"location": "Jersey City, New Jersey",
		"link": "https://www.jerseycitygrace.org",
		"image": "",
		"classis": "Eastern U.S.",
		"mailingAddress": {
			"street": "910 Bergen Ave. #272",
			"city": "Jersey City",
			"state": "NJ",
			"zip": "7306",
			"country": "United States",
			"formatted": "910 Bergen Ave. #272\nJersey City, NJ 7306\nUnited States"
		},
		"meetingAddress": {
			"street": "240 Fairmount Ave.",
			"city": "Jersey City",
			"state": "NJ",
			"zip": "7306",
			"country": "United States",
			"formatted": "240 Fairmount Ave.\nJersey City, NJ 7306\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Samuel Perez"
			],
			"phone": "(917) 204-1775",
			"fax": "",
			"email": "jerseycitygrace@gmail.com",
			"website": "www.jerseycitygrace.org"
		},
		"meetingInformation": "10:00 AM and 11:00 AM",
		"meetingDetails": "",
		"yearOrganized": "2023",
		"joinedUrcYear": "2013",
		"clerk": "Andre Alves",
		"clerkEmail": "andrefaa@protonmail.com",
		"totalMembers": 52,
		"latitude": 40.723008,
		"longitude": -74.068612,
		"sourceColumns": {
			"primaryMinister": "Rev. Samuel Perez",
			"minister": "Rev. Samuel Perez",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186504",
		"position": [
			45.8002,
			-111.224
		],
		"name": "Belgrade United Reformed Church",
		"location": "Belgrade, Montana",
		"link": "https://www.urcbelgrade.com",
		"image": "",
		"classis": "Pacific Northwest",
		"mailingAddress": {
			"street": "P.O. Box 324",
			"city": "Belgrade",
			"state": "MT",
			"zip": "59714",
			"country": "United States",
			"formatted": "P.O. Box 324\nBelgrade, MT 59714\nUnited States"
		},
		"meetingAddress": {
			"street": "17333 Frontage Rd. West",
			"city": "Belgrade",
			"state": "MT",
			"zip": "59714",
			"country": "United States",
			"formatted": "17333 Frontage Rd. West\nBelgrade, MT 59714\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Paul Lindemulder  (406) 220-2343"
			],
			"phone": "(406) 220-2343",
			"fax": "",
			"email": "pastor@urcbelgrade.com",
			"website": "www.urcbelgrade.com"
		},
		"meetingInformation": "10:00 AM and 6:00 PM",
		"meetingDetails": "",
		"yearOrganized": "2001",
		"joinedUrcYear": "2002",
		"clerk": "Rev. Paul Lindemulder (406) 220-2343",
		"clerkEmail": "pastor@urcbelgrade.com",
		"totalMembers": 79,
		"latitude": 45.8002,
		"longitude": -111.224,
		"sourceColumns": {
			"primaryMinister": "Rev. Paul Lindemulder",
			"minister": "Rev. Paul Lindemulder  (406) 220-2343",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186590",
		"position": [
			46.3312,
			-119.996
		],
		"name": "The United Reformed Church of Sunnyside",
		"location": "Sunnyside, Washington",
		"link": "https://www.sunnysideurc.com",
		"image": "",
		"classis": "Pacific Northwest",
		"mailingAddress": {
			"street": "PMB #216, 633 Yakima Valley Highway",
			"city": "Sunnyside",
			"state": "WA",
			"zip": "98944",
			"country": "United States",
			"formatted": "PMB #216, 633 Yakima Valley Highway\nSunnyside, WA 98944\nUnited States"
		},
		"meetingAddress": {
			"street": "1750 Sheller Road",
			"city": "Sunnyside",
			"state": "WA",
			"zip": "98944",
			"country": "United States",
			"formatted": "1750 Sheller Road\nSunnyside, WA 98944\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Jeffrey S. Karel"
			],
			"phone": "(509) 728-5008",
			"fax": "",
			"email": "jeffrey.karel5@gmail.com",
			"website": "www.sunnysideurc.com"
		},
		"meetingInformation": "10:00 AM and 5:00 PM",
		"meetingDetails": "",
		"yearOrganized": "2008",
		"joinedUrcYear": "2008",
		"clerk": "Rev. Jeffrey Karel",
		"clerkEmail": "jeffrey.karel5@gmail.com",
		"totalMembers": 29,
		"latitude": 46.3312,
		"longitude": -119.996,
		"sourceColumns": {
			"primaryMinister": "Rev. Jeffrey Karel",
			"minister": "Rev. Jeffrey S. Karel",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186532",
		"position": [
			38.9508,
			-94.4799
		],
		"name": "Covenant Reformed Church of Kansas City",
		"location": "Kansas City, Missouri",
		"link": "https://www.covenantreformed.org",
		"image": "",
		"classis": "Central U.S.",
		"mailingAddress": {
			"street": "9511 Lane Ave",
			"city": "Kansas City",
			"state": "MO",
			"zip": "64134",
			"country": "United States",
			"formatted": "9511 Lane Ave\nKansas City, MO 64134\nUnited States"
		},
		"meetingAddress": {
			"street": "9511 Lane Ave",
			"city": "Kansas City",
			"state": "MO",
			"zip": "64134",
			"country": "United States",
			"formatted": "9511 Lane Ave\nKansas City, MO 64134\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Matthew Nuiver"
			],
			"phone": "(816) 765-0882",
			"fax": "",
			"email": "pastor@covenantreformed.org",
			"website": "www.covenantreformed.org"
		},
		"meetingInformation": "9:30 AM and 5:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1969",
		"joinedUrcYear": "1997",
		"clerk": "Gordon De Jong",
		"clerkEmail": "dejong.gordon@gmail.com",
		"totalMembers": 123,
		"latitude": 38.9508,
		"longitude": -94.4799,
		"sourceColumns": {
			"primaryMinister": "Rev. Matthew Nuiver",
			"minister": "Rev. Matthew Nuiver",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "257266",
		"position": [
			42.316944,
			-85.668596
		],
		"name": "Immanuel Fellowship Church of Kalamazoo",
		"location": "Kalamazoo, Michigan",
		"link": "https://www.reformedIFC.com",
		"image": "",
		"classis": "Michigan",
		"mailingAddress": {
			"street": "6015 West H Avenue",
			"city": "Kalamazoo",
			"state": "MI",
			"zip": "49009",
			"country": "United States",
			"formatted": "6015 West H Avenue\nKalamazoo, MI 49009\nUnited States"
		},
		"meetingAddress": {
			"street": "6015 West H Avenue",
			"city": "Kalamazoo",
			"state": "MI",
			"zip": "49009",
			"country": "United States",
			"formatted": "6015 West H Avenue\nKalamazoo, MI 49009\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. William Boekestein (616) 690-2948"
			],
			"phone": "(269) 375-4012",
			"fax": "",
			"email": "billboek@hotmail.com",
			"website": "www.reformedIFC.com"
		},
		"meetingInformation": "09:30 AM and 05:30 PM",
		"meetingDetails": "",
		"yearOrganized": "1975",
		"joinedUrcYear": "2016",
		"clerk": "Tim LaRoy",
		"clerkEmail": "reformedifc.clerk@gmail.com",
		"totalMembers": 182,
		"latitude": 42.316944,
		"longitude": -85.668596,
		"sourceColumns": {
			"primaryMinister": "Rev. William Boekestein",
			"minister": "Rev. William Boekestein (616) 690-2948",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186579",
		"position": [
			37.946809,
			-121.968818
		],
		"name": "Trinity United Reformed Church of Walnut Creek",
		"location": "Concord, California",
		"link": "https://www.trinityurcwc.org",
		"image": "",
		"classis": "Pacific Northwest",
		"mailingAddress": {
			"street": "P.O. Box 3120",
			"city": "Walnut Creek",
			"state": "CA",
			"zip": "94598-3120",
			"country": "United States",
			"formatted": "P.O. Box 3120\nWalnut Creek, CA 94598-3120\nUnited States"
		},
		"meetingAddress": {
			"street": "1092 Alberta Way",
			"city": "Concord",
			"state": "CA",
			"zip": "94598-3120",
			"country": "United States",
			"formatted": "1092 Alberta Way\nConcord, CA 94598-3120\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Joghinda S. Gangar  (925) 639-5313"
			],
			"phone": "(925) 639-5313",
			"fax": "",
			"email": "jwkamphuis@astound.net",
			"website": "www.trinityurcwc.org"
		},
		"meetingInformation": "10:00 AM and 5:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1996",
		"joinedUrcYear": "1997",
		"clerk": "Elder Gary Brockman (925) 681-3154",
		"clerkEmail": "clerk@trinityurcwc.org",
		"totalMembers": 85,
		"latitude": 37.946809,
		"longitude": -121.968818,
		"sourceColumns": {
			"primaryMinister": "Rev. Joghinda S. Gangar",
			"minister": "Rev. Joghinda S. Gangar  (925) 639-5313",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186588",
		"position": [
			42.8665,
			-85.7235
		],
		"name": "Bethany United Reformed Church",
		"location": "Wyoming, Michigan",
		"link": "http://www.bethanyurc.com",
		"image": "",
		"classis": "Michigan",
		"mailingAddress": {
			"street": "5401 Byron Center Ave., SW",
			"city": "Wyoming",
			"state": "MI",
			"zip": "49519",
			"country": "United States",
			"formatted": "5401 Byron Center Ave., SW\nWyoming, MI 49519\nUnited States"
		},
		"meetingAddress": {
			"street": "5401 Byron Center Ave., SW",
			"city": "Wyoming",
			"state": "MI",
			"zip": "49519",
			"country": "United States",
			"formatted": "5401 Byron Center Ave., SW\nWyoming, MI 49519\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Eric Van Der Molen (616) 534-0006"
			],
			"phone": "(616) 534-0006",
			"fax": "",
			"email": "bethany@bethanyurc.com",
			"website": "http://www.bethanyurc.com"
		},
		"meetingInformation": "9:30 AM and 5:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1953",
		"joinedUrcYear": "1995",
		"clerk": "Larry Koetje",
		"clerkEmail": "clerk@bethanyurc.com",
		"totalMembers": 412,
		"latitude": 42.8665,
		"longitude": -85.7235,
		"sourceColumns": {
			"primaryMinister": "Rev. Eric Van Der Molen",
			"minister": "Rev. Eric Van Der Molen (616) 534-0006",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "188849",
		"position": [
			46.858297,
			-114.040293
		],
		"name": "Covenant Reformed Church of Missoula",
		"location": "Missoula, Montana",
		"link": "https://www.missoulaurc.com",
		"image": "",
		"classis": "Pacific Northwest",
		"mailingAddress": {
			"street": "2512 Sunset Lane",
			"city": "Missoula",
			"state": "MT",
			"zip": "59804",
			"country": "United States",
			"formatted": "2512 Sunset Lane\nMissoula, MT 59804\nUnited States"
		},
		"meetingAddress": {
			"street": "2512 Sunset Lane",
			"city": "Missoula",
			"state": "MT",
			"zip": "59804",
			"country": "United States",
			"formatted": "2512 Sunset Lane\nMissoula, MT 59804\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Jared Beaird"
			],
			"phone": "(406) 203-2515",
			"fax": "",
			"email": "info@missoulaurc.com",
			"website": "www.missoulaurc.com"
		},
		"meetingInformation": "10:30 AM and 5:30 PM",
		"meetingDetails": "",
		"yearOrganized": "2012",
		"joinedUrcYear": "2012",
		"clerk": "Elder John Luhmann",
		"clerkEmail": "jwluhmann@gmail.com",
		"totalMembers": 42,
		"latitude": 46.858297,
		"longitude": -114.040293,
		"sourceColumns": {
			"primaryMinister": "Rev. Jared W Beaird",
			"minister": "Rev. Jared Beaird",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186865",
		"position": [
			50.4265,
			-104.634
		],
		"name": "Redeemer Reformation Church of Regina",
		"location": "Regina, Saskatchewan",
		"link": "https://www.redeemerchurch.ca",
		"image": "",
		"classis": "Western Canada",
		"mailingAddress": {
			"street": "3717 Hill Avenue",
			"city": "Regina",
			"state": "SK",
			"zip": "S4S 0X4",
			"country": "Canada",
			"formatted": "3717 Hill Avenue\nRegina, SK S4S 0X4\nCanada"
		},
		"meetingAddress": {
			"street": "3717 Hill Avenue",
			"city": "Regina",
			"state": "SK",
			"zip": "S4S 0X4",
			"country": "Canada",
			"formatted": "3717 Hill Avenue\nRegina, SK S4S 0X4\nCanada"
		},
		"contact": {
			"ministers": [
				"Vacant"
			],
			"phone": "(306) 585-1841",
			"fax": "",
			"email": "shanecwilliams83@gmail.com",
			"website": "www.redeemerchurch.ca"
		},
		"meetingInformation": "9:30 AM and 3:00 PM",
		"meetingDetails": "",
		"yearOrganized": "2021",
		"joinedUrcYear": "2010",
		"clerk": "Deacon Todd Girgulis",
		"clerkEmail": "lotuselans2@sasktel.net",
		"totalMembers": 82,
		"latitude": 50.4265,
		"longitude": -104.634,
		"sourceColumns": {
			"primaryMinister": "Vacant, (306) 737-5489",
			"minister": "Vacant",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "626901",
		"position": [
			43.615580882846,
			-96.78549342883
		],
		"name": "Providence Reformed Church Sioux Falls",
		"location": "Sioux Falls, South Dakota",
		"link": "https://www.providencesiouxfalls.com",
		"image": "",
		"classis": "Central U.S.",
		"mailingAddress": {
			"street": "400 E 41st St",
			"city": "Sioux Falls",
			"state": "SD",
			"zip": "57105",
			"country": "United States",
			"formatted": "400 E 41st St\nSioux Falls, SD 57105\nUnited States"
		},
		"meetingAddress": {
			"street": "47135 260th St",
			"city": "Sioux Falls",
			"state": "SD",
			"zip": "57105",
			"country": "United States",
			"formatted": "47135 260th St\nSioux Falls, SD 57105\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Benjamin Davenport"
			],
			"phone": "(605) 610-8394",
			"fax": "",
			"email": "providencesiouxfalls@gmail.com",
			"website": "www.providencesiouxfalls.com"
		},
		"meetingInformation": "10:00 AM and 05:00 PM",
		"meetingDetails": "Meeting at McCrossan Boys Ranch Visitor Center at 47135 260th St in Sioux Falls for AM worship.  Meeting with Christ Reformed Church at 400 E 41st Street in Sioux Falls for PM worship.",
		"yearOrganized": "N/A",
		"joinedUrcYear": "2024",
		"clerk": "Elder Mark Hoogwerf (Christ Reformed Church)",
		"clerkEmail": "clerk@christreformedsf.org",
		"totalMembers": "",
		"latitude": 43.615580882846,
		"longitude": -96.78549342883,
		"sourceColumns": {
			"primaryMinister": "Rev. Benjamin Davenport",
			"minister": "Rev. Benjamin Davenport",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186508",
		"position": [
			44.6455453,
			-75.674658
		],
		"name": "Bethel United Reformed Church of Brockville",
		"location": "Brockville, Ontario",
		"link": "https://www.brockville-urc.com",
		"image": "",
		"classis": "Ontario-East",
		"mailingAddress": {
			"street": "3938 County Road 26",
			"city": "Brockville",
			"state": "ON",
			"zip": "K6V 5T2",
			"country": "Canada",
			"formatted": "3938 County Road 26\nBrockville, ON K6V 5T2\nCanada"
		},
		"meetingAddress": {
			"street": "3938 County Road 26",
			"city": "Brockville",
			"state": "ON",
			"zip": "K6V 5T2",
			"country": "Canada",
			"formatted": "3938 County Road 26\nBrockville, ON K6V 5T2\nCanada"
		},
		"contact": {
			"ministers": [
				"Vacant (613) 808-7450"
			],
			"phone": "(613) 989-2743",
			"fax": "",
			"email": "brockvilleurc@gmail.com",
			"website": "www.brockville-urc.com"
		},
		"meetingInformation": "10:00 AM and 1:30 PM",
		"meetingDetails": "3938 Leeds and Grenville 26",
		"yearOrganized": "1997",
		"joinedUrcYear": "1997",
		"clerk": "Elder Henk Cazemier (613) 808-7450",
		"clerkEmail": "brockvilleurc@gmail.com",
		"totalMembers": 71,
		"latitude": 44.6455453,
		"longitude": -75.674658,
		"sourceColumns": {
			"primaryMinister": "Vacant, (613) 808-7450",
			"minister": "Vacant (613) 808-7450",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "413991",
		"position": [
			47.65811,
			-122.67111
		],
		"name": "Anchor of Hope Reformed Church",
		"location": "Silverdale, Washington",
		"link": "https://www.anchorofhopechurch.org",
		"image": "",
		"classis": "Pacific Northwest",
		"mailingAddress": {
			"street": "10625 Ridgetop Blvd",
			"city": "Silverdale",
			"state": "WA",
			"zip": "98383",
			"country": "United States",
			"formatted": "10625 Ridgetop Blvd\nSilverdale, WA 98383\nUnited States"
		},
		"meetingAddress": {
			"street": "10625 Ridgetop Blvd",
			"city": "Silverdale",
			"state": "WA",
			"zip": "98383",
			"country": "United States",
			"formatted": "10625 Ridgetop Blvd\nSilverdale, WA 98383\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Jacob Meadows"
			],
			"phone": "(360) 698-9487",
			"fax": "",
			"email": "pastor@anchorofhopechurch.org",
			"website": "www.anchorofhopechurch.org"
		},
		"meetingInformation": "10:00AM and 6:00PM",
		"meetingDetails": "",
		"yearOrganized": "1984",
		"joinedUrcYear": "2020",
		"clerk": "Jaloy Gustafson",
		"clerkEmail": "jg1965@embarqmail.com",
		"totalMembers": 52,
		"latitude": 47.65811,
		"longitude": -122.67111,
		"sourceColumns": {
			"primaryMinister": "Rev. Jacob Meadows",
			"minister": "Rev. Jacob Meadows",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186505",
		"position": [
			48.7999,
			-122.53
		],
		"name": "Bellingham URC",
		"location": "Bellingham, Washington",
		"link": "https://www.bellinghamurc.com",
		"image": "",
		"classis": "Pacific Northwest",
		"mailingAddress": {
			"street": "P.O. Box 31265",
			"city": "Bellingham",
			"state": "WA",
			"zip": "98227",
			"country": "United States",
			"formatted": "P.O. Box 31265\nBellingham, WA 98227\nUnited States"
		},
		"meetingAddress": {
			"street": "4454 Pacific Highway",
			"city": "Bellingham",
			"state": "WA",
			"zip": "98227",
			"country": "United States",
			"formatted": "4454 Pacific Highway\nBellingham, WA 98227\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Jason Vander Horst"
			],
			"phone": "(604) 614-2070",
			"fax": "",
			"email": "jzvanderhorst@gmail.com",
			"website": "www.bellinghamurc.com"
		},
		"meetingInformation": "10:30 AM and 6:00 PM",
		"meetingDetails": "",
		"yearOrganized": "2003",
		"joinedUrcYear": "2003",
		"clerk": "Elder Tom Rivers",
		"clerkEmail": "tommyrivers.burc@gmail.com",
		"totalMembers": 127,
		"latitude": 48.7999,
		"longitude": -122.53,
		"sourceColumns": {
			"primaryMinister": "Jason Vander Horst",
			"minister": "Rev. Jason Vander Horst",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "531507",
		"position": [
			34.43519,
			-118.5319
		],
		"name": "Santa Clarita United Reformed Church",
		"location": "Santa Clarita, California",
		"link": "https://www.SantaClaritaURC.org",
		"image": "",
		"classis": "Southwest U.S.",
		"mailingAddress": {
			"street": "25876 The Old Road, #126",
			"city": "Santa Clarita",
			"state": "CA",
			"zip": "91381",
			"country": "United States",
			"formatted": "25876 The Old Road, #126\nSanta Clarita, CA 91381\nUnited States"
		},
		"meetingAddress": {
			"street": "26860 Seco Canyon Road",
			"city": "Santa Clarita",
			"state": "CA",
			"zip": "91381",
			"country": "United States",
			"formatted": "26860 Seco Canyon Road\nSanta Clarita, CA 91381\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Dr. Lee Irons"
			],
			"phone": "(661) 434-1842",
			"fax": "",
			"email": "info@SantaClaritaURC.org",
			"website": "www.SantaClaritaURC.org"
		},
		"meetingInformation": "10:00 AM and 6:00 PM",
		"meetingDetails": "As of Feb. 2023, we are now in our own permanent space in the Reddy Plaza toward the furthest west end facing Seco Canyon road. Some parking is available immediately in front of our space. Ample additional parking is available east of our space in the same Reddy Plaza surrounding the Bank of America building.",
		"yearOrganized": "N/A",
		"joinedUrcYear": "2021",
		"clerk": "Michael Kiledjian",
		"clerkEmail": "info@santaclaritaurc.org",
		"totalMembers": "",
		"latitude": 34.43519,
		"longitude": -118.5319,
		"sourceColumns": {
			"primaryMinister": "Rev. Dr. Lee Irons",
			"minister": "Rev. Dr. Lee Irons",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "187343",
		"position": [
			49.214906,
			-122.922463
		],
		"name": "New Westminster United Reformed Church",
		"location": "New Westminster, British Columbia",
		"link": "https://www.newwesturc.ca",
		"image": "",
		"classis": "Western Canada",
		"mailingAddress": {
			"street": "701 6th Street",
			"city": "New Westminster",
			"state": "BC",
			"zip": "V3L 3C6",
			"country": "Canada",
			"formatted": "701 6th Street\nNew Westminster, BC V3L 3C6\nCanada"
		},
		"meetingAddress": {
			"street": "701 6th Street",
			"city": "New Westminster",
			"state": "BC",
			"zip": "V3L 3C6",
			"country": "Canada",
			"formatted": "701 6th Street\nNew Westminster, BC V3L 3C6\nCanada"
		},
		"contact": {
			"ministers": [
				"Rev. Gary Zekveld (778) 714-3215"
			],
			"phone": "(778) 714-3215",
			"fax": "",
			"email": "newwesturc@gmail.com",
			"website": "www.newwesturc.ca"
		},
		"meetingInformation": "9:00 AM and 6:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1990",
		"joinedUrcYear": "2011",
		"clerk": "Daniel Mallie",
		"clerkEmail": "newwesturc@gmail.com",
		"totalMembers": 45,
		"latitude": 49.214906,
		"longitude": -122.922463,
		"sourceColumns": {
			"primaryMinister": "Rev. Gary Zekveld",
			"minister": "Rev. Gary Zekveld (778) 714-3215",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "188336",
		"position": [
			48.949585,
			-122.547757
		],
		"name": "Covenant Grace Reformed Church Lynden WA",
		"location": "Lynden, Washington",
		"link": "https://www.covenantgracereformedchurch.org",
		"image": "",
		"classis": "Pacific Northwest",
		"mailingAddress": {
			"street": "1227 Loomis Trail Road",
			"city": "Lynden",
			"state": "WA",
			"zip": "98264",
			"country": "United States",
			"formatted": "1227 Loomis Trail Road\nLynden, WA 98264\nUnited States"
		},
		"meetingAddress": {
			"street": "1227 Loomis Trail Road",
			"city": "Lynden",
			"state": "WA",
			"zip": "98264",
			"country": "United States",
			"formatted": "1227 Loomis Trail Road\nLynden, WA 98264\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Dale J. Van Dyke"
			],
			"phone": "(360) 354-2781",
			"fax": "",
			"email": "clerkcgrchurch@outlook.com",
			"website": "www.covenantgracereformedchurch.org"
		},
		"meetingInformation": "10:00 AM and 6:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1988",
		"joinedUrcYear": "2012",
		"clerk": "Elder Jonathan Winslow (360) 770-8986",
		"clerkEmail": "clerkcgrchurch@outlook.com",
		"totalMembers": 76,
		"latitude": 48.949585,
		"longitude": -122.547757,
		"sourceColumns": {
			"primaryMinister": "Rev. Dale J. Van Dyke",
			"minister": "Rev. Dale J. Van Dyke",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186584",
		"position": [
			40.7289,
			-73.0978
		],
		"name": "West Sayville Reformed Bible Church",
		"location": "West Sayville, New York",
		"link": "https://www.wsrbc.org",
		"image": "",
		"classis": "Eastern U.S.",
		"mailingAddress": {
			"street": "31 Rollstone Ave.",
			"city": "West Sayville",
			"state": "NY",
			"zip": "11796",
			"country": "United States",
			"formatted": "31 Rollstone Ave.\nWest Sayville, NY 11796\nUnited States"
		},
		"meetingAddress": {
			"street": "31 Rollstone Ave.",
			"city": "West Sayville",
			"state": "NY",
			"zip": "11796",
			"country": "United States",
			"formatted": "31 Rollstone Ave.\nWest Sayville, NY 11796\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Andrew D. Eenigenburg (631) 589-9281 (s)"
			],
			"phone": "(631) 589-9281",
			"fax": "",
			"email": "office@wsrbc.org",
			"website": "www.wsrbc.org"
		},
		"meetingInformation": "9:30 AM and 1:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1876",
		"joinedUrcYear": "2000",
		"clerk": "Mathew Mathai  631-275-6735 (c)",
		"clerkEmail": "office@wsrbc.org",
		"totalMembers": 71,
		"latitude": 40.7289,
		"longitude": -73.0978,
		"sourceColumns": {
			"primaryMinister": "Rev. Andrew D. Eenigenburg",
			"minister": "Rev. Andrew D. Eenigenburg (631) 589-9281 (s)",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186526",
		"position": [
			43.5257,
			-96.3577
		],
		"name": "Hills United Reformed Church",
		"location": "Hills, Minnesota",
		"link": "https://www.hillsurc.com",
		"image": "",
		"classis": "Central U.S.",
		"mailingAddress": {
			"street": "P.O. Box 485",
			"city": "Hills",
			"state": "MN",
			"zip": "56138",
			"country": "United States",
			"formatted": "P.O. Box 485\nHills, MN 56138\nUnited States"
		},
		"meetingAddress": {
			"street": "410 S. Central Ave.",
			"city": "Hills",
			"state": "MN",
			"zip": "56138",
			"country": "United States",
			"formatted": "410 S. Central Ave.\nHills, MN 56138\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Praveen Muthusamy (219) 334-5213"
			],
			"phone": "(507) 962-3254",
			"fax": "",
			"email": "hillsurc@alliancecom.net",
			"website": "www.hillsurc.com"
		},
		"meetingInformation": "9:30 AM and 4:00 PM (Dec-March) 5:00PM April-Nov",
		"meetingDetails": "",
		"yearOrganized": "1914",
		"joinedUrcYear": "1998",
		"clerk": "Bruce Van Dyken",
		"clerkEmail": "hillsurcclerk34@gmail.com",
		"totalMembers": 69,
		"latitude": 43.5257,
		"longitude": -96.3577,
		"sourceColumns": {
			"primaryMinister": "Rev. Praveen Muthusamy",
			"minister": "Rev. Praveen Muthusamy (219) 334-5213",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186550",
		"position": [
			33.162875,
			-117.354554
		],
		"name": "Oceanside United Reformed Church",
		"location": "Carlsbad, California",
		"link": "https://www.oceansideurc.org",
		"image": "",
		"classis": "Southwest U.S.",
		"mailingAddress": {
			"street": "4140 Oceanside Blvd ste 159-153",
			"city": "Oceanside",
			"state": "CA",
			"zip": "92056",
			"country": "United States",
			"formatted": "4140 Oceanside Blvd ste 159-153\nOceanside, CA 92056\nUnited States"
		},
		"meetingAddress": {
			"street": "2605 Carlsbad Blvd.",
			"city": "Carlsbad",
			"state": "CA",
			"zip": "92056",
			"country": "United States",
			"formatted": "2605 Carlsbad Blvd.\nCarlsbad, CA 92056\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Daniel R. Hyde"
			],
			"phone": "(760) 803-0981",
			"fax": "",
			"email": "pastor@oceansideurc.org",
			"website": "www.oceansideurc.org"
		},
		"meetingInformation": "10:15 AM and 5:00 PM",
		"meetingDetails": "Chapel of the Army & Navy Academy on the back of property on the corner of Cypress St./Ocean St. (No address for the Chapel)",
		"yearOrganized": "2002",
		"joinedUrcYear": "2002",
		"clerk": "Duncan Lule'",
		"clerkEmail": "clerk@oceansideurc.org",
		"totalMembers": 91,
		"latitude": 33.162875,
		"longitude": -117.354554,
		"sourceColumns": {
			"primaryMinister": "Rev. Dr. Daniel R. Hyde",
			"minister": "Rev. Daniel R. Hyde",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186595",
		"position": [
			43.0846,
			-96.1755
		],
		"name": "Sioux Center United Reformed Church",
		"location": "Sioux Center, Iowa",
		"link": "https://www.siouxcenterurc.org",
		"image": "",
		"classis": "Central U.S.",
		"mailingAddress": {
			"street": "744 N. Main Ave.",
			"city": "Sioux Center",
			"state": "IA",
			"zip": "51250",
			"country": "United States",
			"formatted": "744 N. Main Ave.\nSioux Center, IA 51250\nUnited States"
		},
		"meetingAddress": {
			"street": "744 N. Main Ave.",
			"city": "Sioux Center",
			"state": "IA",
			"zip": "51250",
			"country": "United States",
			"formatted": "744 N. Main Ave.\nSioux Center, IA 51250\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Jon Bushnell"
			],
			"phone": "(712) 722-1965",
			"fax": "",
			"email": "pastor@siouxcenterurc.org",
			"website": "www.siouxcenterurc.org"
		},
		"meetingInformation": "9:30 AM and 5:00 PM",
		"meetingDetails": "",
		"yearOrganized": "2008",
		"joinedUrcYear": "2008",
		"clerk": "Elder Harlan Harmelink",
		"clerkEmail": "clerk@siouxcenterurc.org",
		"totalMembers": 229,
		"latitude": 43.0846,
		"longitude": -96.1755,
		"sourceColumns": {
			"primaryMinister": "Rev. Jon Bushnell",
			"minister": "Rev. Jon Bushnell",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186536",
		"position": [
			53.259212595003,
			-113.6327263463
		],
		"name": "Grace Reformed Church of Leduc",
		"location": "Leduc County, Alberta",
		"link": "https://www.graceleduc.org",
		"image": "",
		"classis": "Western Canada",
		"mailingAddress": {
			"street": "49445A Range Road 255",
			"city": "Leduc County",
			"state": "AB",
			"zip": "T4X 2K3",
			"country": "Canada",
			"formatted": "49445A Range Road 255\nLeduc County, AB T4X 2K3\nCanada"
		},
		"meetingAddress": {
			"street": ".",
			"city": "Leduc County",
			"state": "AB",
			"zip": "T4X 2K3",
			"country": "Canada",
			"formatted": ".\nLeduc County, AB T4X 2K3\nCanada"
		},
		"contact": {
			"ministers": [
				"Rev. Tad Groenendyk"
			],
			"phone": "(780) 986-7855",
			"fax": "",
			"email": "reformed.leduc@gmail.com",
			"website": "www.graceleduc.org"
		},
		"meetingInformation": "10:00 AM and 2:30 PM",
		"meetingDetails": "2 miles west of Leduc on Hwy 39, 1 mile south on RR 255 - https://goo.gl/maps/KcByQ7FcUxBrHA6U9",
		"yearOrganized": "1996",
		"joinedUrcYear": "1996",
		"clerk": "Ryan Olthof",
		"clerkEmail": "reformed.leduc@gmail.com",
		"totalMembers": 67,
		"latitude": 53.259212595003,
		"longitude": -113.6327263463,
		"sourceColumns": {
			"primaryMinister": "Rev. Tad Groenendyk",
			"minister": "Rev. Tad Groenendyk",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186518",
		"position": [
			42.91104,
			-79.62702
		],
		"name": "Grace Reformed Church of Dunnville",
		"location": "Dunnville, Ontario",
		"link": "https://www.dunnvilleurc.com",
		"image": "",
		"classis": "Ontario-East",
		"mailingAddress": {
			"street": "P.O. Box 85",
			"city": "Dunnville",
			"state": "ON",
			"zip": "N1A 2X1",
			"country": "Canada",
			"formatted": "P.O. Box 85\nDunnville, ON N1A 2X1\nCanada"
		},
		"meetingAddress": {
			"street": "514 George St.",
			"city": "Dunnville",
			"state": "ON",
			"zip": "N1A 2X1",
			"country": "Canada",
			"formatted": "514 George St.\nDunnville, ON N1A 2X1\nCanada"
		},
		"contact": {
			"ministers": [
				"Rev Pete Van't Hoff (613) 803-8690"
			],
			"phone": "(905) 774-6877",
			"fax": "",
			"email": "grace.clerk@gmail.com",
			"website": "www.dunnvilleurc.com"
		},
		"meetingInformation": "9:30 AM and 2:30 PM",
		"meetingDetails": "",
		"yearOrganized": "1992",
		"joinedUrcYear": "1995",
		"clerk": "Elder Dan Lindeboom (905) 317-6142",
		"clerkEmail": "grace.clerk@gmail.com",
		"totalMembers": 421,
		"latitude": 42.91104,
		"longitude": -79.62702,
		"sourceColumns": {
			"primaryMinister": "Rev Van't Hoff",
			"minister": "Rev Pete Van't Hoff (613) 803-8690",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186587",
		"position": [
			43.1243,
			-80.7356
		],
		"name": "Bethel United Reformed Church of Woodstock",
		"location": "Woodstock, Ontario",
		"link": "https://www.bethelurcwoodstock.com",
		"image": "",
		"classis": "Southwestern Ontario",
		"mailingAddress": {
			"street": "862 Alice Street",
			"city": "Woodstock",
			"state": "ON",
			"zip": "N4S 2J6",
			"country": "Canada",
			"formatted": "862 Alice Street\nWoodstock, ON N4S 2J6\nCanada"
		},
		"meetingAddress": {
			"street": "862 Alice Street",
			"city": "Woodstock",
			"state": "ON",
			"zip": "N4S 2J6",
			"country": "Canada",
			"formatted": "862 Alice Street\nWoodstock, ON N4S 2J6\nCanada"
		},
		"contact": {
			"ministers": [
				"Rev. James Sinke"
			],
			"phone": "(519) 533-1536",
			"fax": "",
			"email": "clerk@bethelurcwoodstock.com",
			"website": "www.bethelurcwoodstock.com"
		},
		"meetingInformation": "9:30 AM and 3:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1993",
		"joinedUrcYear": "1995",
		"clerk": "Elder Jason Baarda (519) 533-7898",
		"clerkEmail": "clerk@bethelurcwoodstock.com",
		"totalMembers": 250,
		"latitude": 43.1243,
		"longitude": -80.7356,
		"sourceColumns": {
			"primaryMinister": "Rev. James Sinke",
			"minister": "Rev. James Sinke",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186893",
		"position": [
			52.455863,
			-113.72363
		],
		"name": "Redeemer United Reformed Church of Lacombe",
		"location": "Lacombe, Alberta",
		"link": "https://www.redeemerurc.ca",
		"image": "",
		"classis": "Western Canada",
		"mailingAddress": {
			"street": "4519 - 46 Avenue",
			"city": "Lacombe",
			"state": "AB",
			"zip": "T4L 0G9",
			"country": "Canada",
			"formatted": "4519 - 46 Avenue\nLacombe, AB T4L 0G9\nCanada"
		},
		"meetingAddress": {
			"street": "4519 - 46 Avenue",
			"city": "Lacombe",
			"state": "AB",
			"zip": "T4L 0G9",
			"country": "Canada",
			"formatted": "4519 - 46 Avenue\nLacombe, AB T4L 0G9\nCanada"
		},
		"contact": {
			"ministers": [
				"Rev. Robert Van der Woerd"
			],
			"phone": "(403) 789-9035",
			"fax": "",
			"email": "clerk@redeemerurc.ca",
			"website": "www.redeemerurc.ca"
		},
		"meetingInformation": "10:00 AM and 2:30 PM",
		"meetingDetails": "",
		"yearOrganized": "2011",
		"joinedUrcYear": "2011",
		"clerk": "Elder Phil Wierenga",
		"clerkEmail": "clerk@redeemerurc.ca",
		"totalMembers": 311,
		"latitude": 52.455863,
		"longitude": -113.72363,
		"sourceColumns": {
			"primaryMinister": "Rev. Robert Van der Woerd",
			"minister": "Rev. Robert Van der Woerd",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186541",
		"position": [
			42.9788,
			-81.2388
		],
		"name": "Cornerstone United Reformed Church of London",
		"location": "London, Ontario",
		"link": "https://www.cornerstoneurc.ca",
		"image": "",
		"classis": "Southwestern Ontario",
		"mailingAddress": {
			"street": "180 Waterloo St.",
			"city": "London",
			"state": "ON",
			"zip": "N6B 2M9",
			"country": "Canada",
			"formatted": "180 Waterloo St.\nLondon, ON N6B 2M9\nCanada"
		},
		"meetingAddress": {
			"street": "180 Waterloo St.",
			"city": "London",
			"state": "ON",
			"zip": "N6B 2M9",
			"country": "Canada",
			"formatted": "180 Waterloo St.\nLondon, ON N6B 2M9\nCanada"
		},
		"contact": {
			"ministers": [
				"Rev. Steve Williamson"
			],
			"phone": "(519) 432-0808",
			"fax": "",
			"email": "clerk@cornerstoneurc.ca",
			"website": "www.cornerstoneurc.ca"
		},
		"meetingInformation": "10:00 AM and 3:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1992",
		"joinedUrcYear": "1995",
		"clerk": "Elder Eric Luth",
		"clerkEmail": "clerk@cornerstoneurc.ca",
		"totalMembers": 90,
		"latitude": 42.9788,
		"longitude": -81.2388,
		"sourceColumns": {
			"primaryMinister": "Rev. Steve Williamson",
			"minister": "Rev. Steve Williamson",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186549",
		"position": [
			40.738769199113,
			-73.98657711986
		],
		"name": "Messiah's Reformed Fellowship of New York",
		"location": "New York, New York",
		"link": "https://www.merfnyc.org",
		"image": "",
		"classis": "Eastern U.S.",
		"mailingAddress": {
			"street": "6823 Ft. Hamilton Pkwy, #136",
			"city": "Brooklyn",
			"state": "NY",
			"zip": "11219",
			"country": "United States",
			"formatted": "6823 Ft. Hamilton Pkwy, #136\nBrooklyn, NY 11219\nUnited States"
		},
		"meetingAddress": {
			"street": "61 Gramercy Park North",
			"city": "New York",
			"state": "NY",
			"zip": "11219",
			"country": "United States",
			"formatted": "61 Gramercy Park North\nNew York, NY 11219\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Dr. Daniel Ragusa"
			],
			"phone": "(646) 450-8849",
			"fax": "",
			"email": "contact@merfnyc.org",
			"website": "www.merfnyc.org"
		},
		"meetingInformation": "10:30 AM and 11:30 AM",
		"meetingDetails": "Calvary Church, 21st street and Park Avenue South",
		"yearOrganized": "2012",
		"joinedUrcYear": "2003",
		"clerk": "Willie Avery",
		"clerkEmail": "willie@merfnyc.org",
		"totalMembers": 170,
		"latitude": 40.738769199113,
		"longitude": -73.98657711986,
		"sourceColumns": {
			"primaryMinister": "Rev. Dr. Daniel Ragusa",
			"minister": "Rev. Dr. Daniel Ragusa",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186543",
		"position": [
			48.9554,
			-122.463
		],
		"name": "Lynden United Reformed Church",
		"location": "Lynden, Washington",
		"link": "https://www.lyndenurc.org",
		"image": "",
		"classis": "Pacific Northwest",
		"mailingAddress": {
			"street": "P.O. Box 593",
			"city": "Lynden",
			"state": "WA",
			"zip": "98264",
			"country": "United States",
			"formatted": "P.O. Box 593\nLynden, WA 98264\nUnited States"
		},
		"meetingAddress": {
			"street": "8650 Benson Rd.",
			"city": "Lynden",
			"state": "WA",
			"zip": "98264",
			"country": "United States",
			"formatted": "8650 Benson Rd.\nLynden, WA 98264\nUnited States"
		},
		"contact": {
			"ministers": [
				"Vacant",
				"Rev. Mark Vander Pol (360) 325-9696"
			],
			"phone": "(360) 656-6140",
			"fax": "",
			"email": "clerk@lyndenurc.org",
			"website": "www.lyndenurc.org"
		},
		"meetingInformation": "10:00 AM and 6:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1997",
		"joinedUrcYear": "1997",
		"clerk": "Elder Mark Hoekstra",
		"clerkEmail": "clerk@lyndenurc.org",
		"totalMembers": 479,
		"latitude": 48.9554,
		"longitude": -122.463,
		"sourceColumns": {
			"primaryMinister": "Vacant, (360) 656-6140",
			"minister": "Vacant",
			"minister2": "Rev. Mark Vander Pol (360) 325-9696"
		}
	},
	{
		"type": "church",
		"id": "186507",
		"position": [
			43.16375,
			-80.23952
		],
		"name": "Living Water Reformed Church of Brantford",
		"location": "Brantford, Ontario",
		"link": "https://www.livingwaterreformedchurch.com",
		"image": "",
		"classis": "Southwestern Ontario",
		"mailingAddress": {
			"street": "22 Holiday Drive",
			"city": "Brantford",
			"state": "ON",
			"zip": "N3R 7J4",
			"country": "Canada",
			"formatted": "22 Holiday Drive\nBrantford, ON N3R 7J4\nCanada"
		},
		"meetingAddress": {
			"street": "22 Holiday Drive",
			"city": "Brantford",
			"state": "ON",
			"zip": "N3R 7J4",
			"country": "Canada",
			"formatted": "22 Holiday Drive\nBrantford, ON N3R 7J4\nCanada"
		},
		"contact": {
			"ministers": [
				"Rev. Greg Bylsma"
			],
			"phone": "(289) 667-3667",
			"fax": "",
			"email": "clerk@livingwaterreformedchurch.com",
			"website": "www.livingwaterreformedchurch.com"
		},
		"meetingInformation": "10:00 AM and 4:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1992",
		"joinedUrcYear": "2006",
		"clerk": "Elder Dan VanDelden (905) 971-5158",
		"clerkEmail": "clerk@livingwaterreformedchurch.com",
		"totalMembers": 509,
		"latitude": 43.16375,
		"longitude": -80.23952,
		"sourceColumns": {
			"primaryMinister": "Rev. Greg Bylsma",
			"minister": "Rev. Greg Bylsma",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186720",
		"position": [
			48.4814,
			-122.335
		],
		"name": "Burlington United Reformed Church, Burlington",
		"location": "Burlington, Washington",
		"link": "https://www.burlingtonurc.org",
		"image": "",
		"classis": "Pacific Northwest",
		"mailingAddress": {
			"street": "778 N. Burlington Blvd.",
			"city": "Burlington",
			"state": "WA",
			"zip": "98233",
			"country": "United States",
			"formatted": "778 N. Burlington Blvd.\nBurlington, WA 98233\nUnited States"
		},
		"meetingAddress": {
			"street": "778 N. Burlington Blvd.",
			"city": "Burlington",
			"state": "WA",
			"zip": "98233",
			"country": "United States",
			"formatted": "778 N. Burlington Blvd.\nBurlington, WA 98233\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. James A Ogle"
			],
			"phone": "(562) 276-0318",
			"fax": "",
			"email": "burlingtonurc@gmail.com",
			"website": "www.burlingtonurc.org"
		},
		"meetingInformation": "10:00 AM and 5:30 PM",
		"meetingDetails": "",
		"yearOrganized": "1980",
		"joinedUrcYear": "2008",
		"clerk": "Jim Timmermans",
		"clerkEmail": "jmt0868@gmail.com",
		"totalMembers": 187,
		"latitude": 48.4814,
		"longitude": -122.335,
		"sourceColumns": {
			"primaryMinister": "Rev, James A Ogle",
			"minister": "Rev. James A Ogle",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186519",
		"position": [
			42.838492,
			-85.583853
		],
		"name": "Dutton United Reformed Church",
		"location": "Dutton, Michigan",
		"link": "https://www.duttonurc.org",
		"image": "",
		"classis": "Michigan",
		"mailingAddress": {
			"street": "6950 Hanna Lake Ave. SE",
			"city": "Caledonia",
			"state": "MI",
			"zip": "49316",
			"country": "United States",
			"formatted": "6950 Hanna Lake Ave. SE\nCaledonia, MI 49316\nUnited States"
		},
		"meetingAddress": {
			"street": "6950 Hanna Lake Ave. SE",
			"city": "Dutton",
			"state": "MI",
			"zip": "49316",
			"country": "United States",
			"formatted": "6950 Hanna Lake Ave. SE\nDutton, MI 49316\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Talman Wagenmaker"
			],
			"phone": "(616) 698-6850",
			"fax": "",
			"email": "office@duttonurc.org",
			"website": "www.duttonurc.org"
		},
		"meetingInformation": "9:30 AM and 5:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1915",
		"joinedUrcYear": "1999",
		"clerk": "Jon Verduin (616) 318-0608",
		"clerkEmail": "clerk@duttonurc.org; reformedguy@hotmail.com",
		"totalMembers": 427,
		"latitude": 42.838492,
		"longitude": -85.583853,
		"sourceColumns": {
			"primaryMinister": "Rev. Talman Wagenmaker",
			"minister": "Rev. Talman Wagenmaker",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186510",
		"position": [
			42.8317,
			-85.6245
		],
		"name": "Trinity United Reformed Church of Caledonia",
		"location": "Caledonia, Michigan",
		"link": "https://www.trinityurc.net",
		"image": "",
		"classis": "Michigan",
		"mailingAddress": {
			"street": "7350 Kalamazoo Ave. S.E.",
			"city": "Caledonia",
			"state": "MI",
			"zip": "49316",
			"country": "United States",
			"formatted": "7350 Kalamazoo Ave. S.E.\nCaledonia, MI 49316\nUnited States"
		},
		"meetingAddress": {
			"street": "7350 Kalamazoo Ave. S.E.",
			"city": "Caledonia",
			"state": "MI",
			"zip": "49316",
			"country": "United States",
			"formatted": "7350 Kalamazoo Ave. S.E.\nCaledonia, MI 49316\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Jacob London"
			],
			"phone": "(616) 554-5763",
			"fax": "",
			"email": "secretary@trinityurc.net",
			"website": "www.trinityurc.net"
		},
		"meetingInformation": "9:30 AM and 5:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1995",
		"joinedUrcYear": "1995",
		"clerk": "Steve Huisjen (616) 916-1682, steveh@danvoscc.com",
		"clerkEmail": "clerk@trinityurc.net",
		"totalMembers": 174,
		"latitude": 42.8317,
		"longitude": -85.6245,
		"sourceColumns": {
			"primaryMinister": "Rev. Jacob London",
			"minister": "Rev. Jacob London",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186506",
		"position": [
			43.6377,
			-116.334
		],
		"name": "Cloverdale United Reformed Church, Boise",
		"location": "Boise, Idaho",
		"link": "https://www.cloverdaleurc.org",
		"image": "",
		"classis": "Pacific Northwest",
		"mailingAddress": {
			"street": "3580 N. Cloverdale Rd.",
			"city": "Boise",
			"state": "ID",
			"zip": "83713",
			"country": "United States",
			"formatted": "3580 N. Cloverdale Rd.\nBoise, ID 83713\nUnited States"
		},
		"meetingAddress": {
			"street": "3580 N. Cloverdale Rd.",
			"city": "Boise",
			"state": "ID",
			"zip": "83713",
			"country": "United States",
			"formatted": "3580 N. Cloverdale Rd.\nBoise, ID 83713\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Russell Herman"
			],
			"phone": "(208) 375-4219",
			"fax": "",
			"email": "clerk@cloverdaleurc.org",
			"website": "www.cloverdaleurc.org"
		},
		"meetingInformation": "10:30 AM  and 6:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1979",
		"joinedUrcYear": "1997",
		"clerk": "Elder Jesse Groen (208) 861-3254",
		"clerkEmail": "clerk@cloverdaleurc.net",
		"totalMembers": 251,
		"latitude": 43.6377,
		"longitude": -116.334,
		"sourceColumns": {
			"primaryMinister": "Rev. Russell Herman",
			"minister": "Rev. Russell Herman",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186589",
		"position": [
			42.9761,
			-82.1641
		],
		"name": "Covenant Christian Church Wyoming ON",
		"location": "Wyoming, Ontario",
		"link": "https://www.covchristian.com",
		"image": "",
		"classis": "Southwestern Ontario",
		"mailingAddress": {
			"street": "P.O. Box 774",
			"city": "Wyoming",
			"state": "ON",
			"zip": "N0N 1T0",
			"country": "Canada",
			"formatted": "P.O. Box 774\nWyoming, ON N0N 1T0\nCanada"
		},
		"meetingAddress": {
			"street": "5783 Camlachie Rd.",
			"city": "Wyoming",
			"state": "ON",
			"zip": "N0N 1T0",
			"country": "Canada",
			"formatted": "5783 Camlachie Rd.\nWyoming, ON N0N 1T0\nCanada"
		},
		"contact": {
			"ministers": [
				"Rev. Tsjibbe deJong"
			],
			"phone": "(519) 845-0758",
			"fax": "",
			"email": "cccclerk@slicc.ca",
			"website": "www.covchristian.com"
		},
		"meetingInformation": "10:00 AM and 3:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1952",
		"joinedUrcYear": "1995",
		"clerk": "Brian Sipkens",
		"clerkEmail": "cccclerk@slicc.ca",
		"totalMembers": 284,
		"latitude": 42.9761,
		"longitude": -82.1641,
		"sourceColumns": {
			"primaryMinister": "Rev. Tsjibbe deJong",
			"minister": "Rev. Tsjibbe deJong",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186573",
		"position": [
			54.70905725,
			-127.05927954
		],
		"name": "Faith Reformed Church of Telkwa",
		"location": "Telkwa, British Columbia",
		"link": "https://www.telkwafaithurc.com",
		"image": "",
		"classis": "Western Canada",
		"mailingAddress": {
			"street": "P.O. Box 504",
			"city": "Telkwa",
			"state": "BC",
			"zip": "V0J 2X0",
			"country": "Canada",
			"formatted": "P.O. Box 504\nTelkwa, BC V0J 2X0\nCanada"
		},
		"meetingAddress": {
			"street": "1170 Highway 16",
			"city": "Telkwa",
			"state": "BC",
			"zip": "V0J 2X0",
			"country": "Canada",
			"formatted": "1170 Highway 16\nTelkwa, BC V0J 2X0\nCanada"
		},
		"contact": {
			"ministers": [
				"Rev. Kelvin Tiemstra (250) 643-8950"
			],
			"phone": "(250) 846-9710",
			"fax": "",
			"email": "frctclerk@gmail.com",
			"website": "www.telkwafaithurc.com"
		},
		"meetingInformation": "10:00 AM and 2:30 PM",
		"meetingDetails": "1170 Hwy 16 Telkwa BC",
		"yearOrganized": "1990",
		"joinedUrcYear": "1995",
		"clerk": "Aaron Shupe (250) 643-8752",
		"clerkEmail": "frctclerk@gmail.com",
		"totalMembers": 232,
		"latitude": 54.70905725,
		"longitude": -127.05927954,
		"sourceColumns": {
			"primaryMinister": "Rev. Kelvin Tiemstra",
			"minister": "Rev. Kelvin Tiemstra (250) 643-8950",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186551",
		"position": [
			34.034,
			-117.649
		],
		"name": "Ontario United Reformed Church",
		"location": "Ontario, California",
		"link": "https://www.ontariourc.org",
		"image": "",
		"classis": "Southwest U.S.",
		"mailingAddress": {
			"street": "205 East Philadelphia St.",
			"city": "Ontario",
			"state": "CA",
			"zip": "91761",
			"country": "United States",
			"formatted": "205 East Philadelphia St.\nOntario, CA 91761\nUnited States"
		},
		"meetingAddress": {
			"street": "205 East Philadelphia St.",
			"city": "Ontario",
			"state": "CA",
			"zip": "91761",
			"country": "United States",
			"formatted": "205 East Philadelphia St.\nOntario, CA 91761\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Taylor Kern (909) 362-1469",
				"Rev. Daniel Ventura (909) 272-1859"
			],
			"phone": "(909) 986-9889",
			"fax": "",
			"email": "ontariourc@gmail.com",
			"website": "www.ontariourc.org"
		},
		"meetingInformation": "English- 10:00 AM and 5:30 PM; Espanol- 11:30 AM",
		"meetingDetails": "",
		"yearOrganized": "1928",
		"joinedUrcYear": "1998",
		"clerk": "Rev. Taylor Kern (909) 362-1469",
		"clerkEmail": "pastortaylorkern@yahoo.com",
		"totalMembers": 169,
		"latitude": 34.034,
		"longitude": -117.649,
		"sourceColumns": {
			"primaryMinister": "Rev. Taylor Kern",
			"minister": "Rev. Taylor Kern (909) 362-1469",
			"minister2": "Rev. Daniel Ventura (909) 272-1859"
		}
	},
	{
		"type": "church",
		"id": "186538",
		"position": [
			49.7377,
			-112.829
		],
		"name": "Trinity Reformed Church of Lethbridge",
		"location": "Lethbridge, Alberta",
		"link": "https://www.trinityurc.ca",
		"image": "",
		"classis": "Western Canada",
		"mailingAddress": {
			"street": "1100 - 40th Ave. North",
			"city": "Lethbridge",
			"state": "AB",
			"zip": "T1H 6B7",
			"country": "Canada",
			"formatted": "1100 - 40th Ave. North\nLethbridge, AB T1H 6B7\nCanada"
		},
		"meetingAddress": {
			"street": "1100 40th Ave. North",
			"city": "Lethbridge",
			"state": "AB",
			"zip": "T1H 6B7",
			"country": "Canada",
			"formatted": "1100 40th Ave. North\nLethbridge, AB T1H 6B7\nCanada"
		},
		"contact": {
			"ministers": [
				"Rev. John van Eyk"
			],
			"phone": "(403) 327-6434",
			"fax": "",
			"email": "clerk@trinityurc.ca",
			"website": "www.trinityurc.ca"
		},
		"meetingInformation": "10:00 AM and 4:30 PM",
		"meetingDetails": "",
		"yearOrganized": "1950",
		"joinedUrcYear": "1995",
		"clerk": "Duane Konynenbelt (403) 330-8237",
		"clerkEmail": "clerk@trinityurc.ca",
		"totalMembers": 786,
		"latitude": 49.7377,
		"longitude": -112.829,
		"sourceColumns": {
			"primaryMinister": "Rev. John van Eyk",
			"minister": "Rev. John van Eyk",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186586",
		"position": [
			43.71914,
			-79.71092
		],
		"name": "Hope Reformed Church of Brampton",
		"location": "Brampton, Ontario",
		"link": "https://www.hopereformedchurch.ca",
		"image": "",
		"classis": "Ontario-East",
		"mailingAddress": {
			"street": "P.O. Box 36029",
			"city": "Brampton",
			"state": "ON",
			"zip": "L6S 6A3",
			"country": "Canada",
			"formatted": "P.O. Box 36029\nBrampton, ON L6S 6A3\nCanada"
		},
		"meetingAddress": {
			"street": "375 Clark Blvd",
			"city": "Brampton",
			"state": "ON",
			"zip": "L6S 6A3",
			"country": "Canada",
			"formatted": "375 Clark Blvd\nBrampton, ON L6S 6A3\nCanada"
		},
		"contact": {
			"ministers": [
				"Rev. John Bouwers (905) 872-6072"
			],
			"phone": "(905) 872-6072",
			"fax": "",
			"email": "clerk@hopereformedchurch.ca",
			"website": "www.hopereformedchurch.ca"
		},
		"meetingInformation": "10:00 AM and 4:00 PM",
		"meetingDetails": "Redeemer Lutheran Church",
		"yearOrganized": "1980",
		"joinedUrcYear": "2007",
		"clerk": "John Vogel (905) 809-8890",
		"clerkEmail": "clerk@hopereformedchurch.ca",
		"totalMembers": 70,
		"latitude": 43.71914,
		"longitude": -79.71092,
		"sourceColumns": {
			"primaryMinister": "Pastor John Bouwers",
			"minister": "Rev. John Bouwers (905) 872-6072",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186563",
		"position": [
			44.9548,
			-122.969
		],
		"name": "Immanuel's Reformed Church of Salem, OR",
		"location": "Salem, Oregon",
		"link": "https://www.immanuelsreformed.org",
		"image": "",
		"classis": "Pacific Northwest",
		"mailingAddress": {
			"street": "4653 Sunnyview Road NE",
			"city": "Salem",
			"state": "OR",
			"zip": "97305",
			"country": "United States",
			"formatted": "4653 Sunnyview Road NE\nSalem, OR 97305\nUnited States"
		},
		"meetingAddress": {
			"street": "4653 Sunnyview Road NE",
			"city": "Salem",
			"state": "OR",
			"zip": "97305",
			"country": "United States",
			"formatted": "4653 Sunnyview Road NE\nSalem, OR 97305\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Todd Joling (503) 586-3102"
			],
			"phone": "(503) 581-6764",
			"fax": "",
			"email": "toddjoling@gmail.com",
			"website": "www.immanuelsreformed.org"
		},
		"meetingInformation": "11:00 AM and 6:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1992",
		"joinedUrcYear": "1998",
		"clerk": "Gerrit Kroes (503) 931-7714",
		"clerkEmail": "kroes@aol.com",
		"totalMembers": 157,
		"latitude": 44.9548,
		"longitude": -122.969,
		"sourceColumns": {
			"primaryMinister": "Rev. Todd Joling",
			"minister": "Rev. Todd Joling (503) 586-3102",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186535",
		"position": [
			41.5667,
			-87.5626
		],
		"name": "Oak Glen United Reformed Church",
		"location": "Lansing, Illinois",
		"link": "https://www.oakglenurc.org",
		"image": "",
		"classis": "Central U.S.",
		"mailingAddress": {
			"street": "2244 Indiana Ave.",
			"city": "Lansing",
			"state": "IL",
			"zip": "60438",
			"country": "United States",
			"formatted": "2244 Indiana Ave.\nLansing, IL 60438\nUnited States"
		},
		"meetingAddress": {
			"street": "2244 Indiana Ave.",
			"city": "Lansing",
			"state": "IL",
			"zip": "60438",
			"country": "United States",
			"formatted": "2244 Indiana Ave.\nLansing, IL 60438\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Steve Oeverman"
			],
			"phone": "(708) 474-0172",
			"fax": "",
			"email": "clerk@oakglenurc.org",
			"website": "www.oakglenurc.org"
		},
		"meetingInformation": "9:30 AM and 5:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1947",
		"joinedUrcYear": "1996",
		"clerk": "Dan Bruinsma (312) 203-0368",
		"clerkEmail": "clerk@oakglenurc.org",
		"totalMembers": 295,
		"latitude": 41.5667,
		"longitude": -87.5626,
		"sourceColumns": {
			"primaryMinister": "Rev Steve Oeverman",
			"minister": "Rev. Steve Oeverman",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186583",
		"position": [
			42.4332,
			-92.9268
		],
		"name": "United Reformed Church of Wellsburg",
		"location": "Wellsburg, Iowa",
		"link": "",
		"image": "",
		"classis": "Central U.S.",
		"mailingAddress": {
			"street": "P.O. Box 10",
			"city": "Wellsburg",
			"state": "IA",
			"zip": "50680",
			"country": "United States",
			"formatted": "P.O. Box 10\nWellsburg, IA 50680\nUnited States"
		},
		"meetingAddress": {
			"street": "608 S. Adams",
			"city": "Wellsburg",
			"state": "IA",
			"zip": "50680",
			"country": "United States",
			"formatted": "608 S. Adams\nWellsburg, IA 50680\nUnited States"
		},
		"contact": {
			"ministers": [
				"Vacant"
			],
			"phone": "(641) 869-3633",
			"fax": "",
			"email": "davidpruin@gmail.com",
			"website": ""
		},
		"meetingInformation": "9:30 AM and 11:00 AM",
		"meetingDetails": "",
		"yearOrganized": "1919",
		"joinedUrcYear": "2001",
		"clerk": "Elder David Pruin",
		"clerkEmail": "davidpruin@gmail.com",
		"totalMembers": 35,
		"latitude": 42.4332,
		"longitude": -92.9268,
		"sourceColumns": {
			"primaryMinister": "Vacant, (641) 869-3633",
			"minister": "Vacant",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186514",
		"position": [
			43.0168,
			-85.9568
		],
		"name": "Eastmanville United Reformed Church",
		"location": "Coopersville, Michigan",
		"link": "https://www.eastmanvilleurc.org",
		"image": "",
		"classis": "Michigan",
		"mailingAddress": {
			"street": "6845 Leonard St.",
			"city": "Coopersville",
			"state": "MI",
			"zip": "49404",
			"country": "United States",
			"formatted": "6845 Leonard St.\nCoopersville, MI 49404\nUnited States"
		},
		"meetingAddress": {
			"street": "6845 Leonard St.",
			"city": "Coopersville",
			"state": "MI",
			"zip": "49404",
			"country": "United States",
			"formatted": "6845 Leonard St.\nCoopersville, MI 49404\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Jephthah Nobel (616) 437-6313"
			],
			"phone": "(616) 997-9554",
			"fax": "",
			"email": "jephnobel@gmail.com",
			"website": "www.eastmanvilleurc.org"
		},
		"meetingInformation": "9:30 AM and 5:30 PM",
		"meetingDetails": "",
		"yearOrganized": "1884",
		"joinedUrcYear": "1995",
		"clerk": "Elder Ken Langerak",
		"clerkEmail": "glppi@comcast.net",
		"totalMembers": 120,
		"latitude": 43.0168,
		"longitude": -85.9568,
		"sourceColumns": {
			"primaryMinister": "Rev. Jephthah Nobel",
			"minister": "Rev. Jephthah Nobel (616) 437-6313",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186503",
		"position": [
			41.326705,
			-87.615189
		],
		"name": "Faith United Reformed Church of Beecher",
		"location": "Beecher, Illinois",
		"link": "https://www.faithurc.org",
		"image": "",
		"classis": "Central U.S.",
		"mailingAddress": {
			"street": "P.O. Box 729",
			"city": "Beecher",
			"state": "IL",
			"zip": "60401",
			"country": "United States",
			"formatted": "P.O. Box 729\nBeecher, IL 60401\nUnited States"
		},
		"meetingAddress": {
			"street": "130 West Corning Rd.",
			"city": "Beecher",
			"state": "IL",
			"zip": "60401",
			"country": "United States",
			"formatted": "130 West Corning Rd.\nBeecher, IL 60401\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Nathan Voss"
			],
			"phone": "(708) 946-3210",
			"fax": "",
			"email": "elders@faithurc.org",
			"website": "www.faithurc.org"
		},
		"meetingInformation": "9:30 AM and 5:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1996",
		"joinedUrcYear": "1997",
		"clerk": "Elder Brian Sluiter",
		"clerkEmail": "elders@faithurc.org",
		"totalMembers": 230,
		"latitude": 41.326705,
		"longitude": -87.615189,
		"sourceColumns": {
			"primaryMinister": "Rev. Nathan Voss",
			"minister": "Rev. Nathan Voss",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186517",
		"position": [
			43.2733,
			-96.2344
		],
		"name": "Doon United Reformed Church, Doon, Iowa",
		"location": "Doon, Iowa",
		"link": "https://www.doonurc.org",
		"image": "",
		"classis": "Central U.S.",
		"mailingAddress": {
			"street": "608 Rice Ave.",
			"city": "Doon",
			"state": "IA",
			"zip": "51235",
			"country": "United States",
			"formatted": "608 Rice Ave.\nDoon, IA 51235\nUnited States"
		},
		"meetingAddress": {
			"street": "608 Rice Ave.",
			"city": "Doon",
			"state": "IA",
			"zip": "51235",
			"country": "United States",
			"formatted": "608 Rice Ave.\nDoon, IA 51235\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Daniel Hofland"
			],
			"phone": "(712) 470-6210",
			"fax": "",
			"email": "jrvanbeek@premieronline.net",
			"website": "www.doonurc.org"
		},
		"meetingInformation": "9:30 AM and 5:00 PM",
		"meetingDetails": "Services are at 9:30 A.M. and 5:00 P.M. except for the 3rd Sunday in December which is a 2:00 p.m. service followed by our church Christmas program. - Song Service on the 2nd and 4th Sunday evenings begins at 4:50 pm.",
		"yearOrganized": "1902",
		"joinedUrcYear": "1997",
		"clerk": "Elder Roger Tubergen 712-578-9984",
		"clerkEmail": "Clerk.doonurc@gmail.com",
		"totalMembers": 255,
		"latitude": 43.2733,
		"longitude": -96.2344,
		"sourceColumns": {
			"primaryMinister": "Daniel Hofland",
			"minister": "Rev. Daniel Hofland",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "188854",
		"position": [
			39.121758,
			-84.508583
		],
		"name": "Ascension Reformed Church of Cincinnati",
		"location": "Cincinnati, Ohio",
		"link": "http://ascensionreformed.org/",
		"image": "",
		"classis": "Eastern U.S.",
		"mailingAddress": {
			"street": "2147 Auburn Ave.",
			"city": "Cincinnati",
			"state": "OH",
			"zip": "45219",
			"country": "United States",
			"formatted": "2147 Auburn Ave.\nCincinnati, OH 45219\nUnited States"
		},
		"meetingAddress": {
			"street": "2147 Auburn Ave.",
			"city": "Cincinnati",
			"state": "OH",
			"zip": "45219",
			"country": "United States",
			"formatted": "2147 Auburn Ave.\nCincinnati, OH 45219\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Zachary Wyse"
			],
			"phone": "(513) 620-6212",
			"fax": "",
			"email": "pastor@ascensionreformed.org",
			"website": "http://ascensionreformed.org/"
		},
		"meetingInformation": "10:30 AM and 4:30 PM",
		"meetingDetails": "",
		"yearOrganized": "2019",
		"joinedUrcYear": "2013",
		"clerk": "Elder Donn Rubingh",
		"clerkEmail": "drrubingh@gmail.com",
		"totalMembers": 91,
		"latitude": 39.121758,
		"longitude": -84.508583,
		"sourceColumns": {
			"primaryMinister": "Rev. Zachary Wyse",
			"minister": "Rev. Zachary Wyse",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186567",
		"position": [
			41.4661,
			-87.4654
		],
		"name": "Community United Reformed Church",
		"location": "Schererville, Indiana",
		"link": "https://www.communityurc.org",
		"image": "",
		"classis": "Central U.S.",
		"mailingAddress": {
			"street": "8405 Alexander St.",
			"city": "Schererville",
			"state": "IN",
			"zip": "46375",
			"country": "United States",
			"formatted": "8405 Alexander St.\nSchererville, IN 46375\nUnited States"
		},
		"meetingAddress": {
			"street": "8405 Alexander St.",
			"city": "Schererville",
			"state": "IN",
			"zip": "46375",
			"country": "United States",
			"formatted": "8405 Alexander St.\nSchererville, IN 46375\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. David Klompien"
			],
			"phone": "(219) 365-9260",
			"fax": "",
			"email": "office@communityurc.org",
			"website": "www.communityurc.org"
		},
		"meetingInformation": "9:30 AM and 5:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1996",
		"joinedUrcYear": "1997",
		"clerk": "Bruce Aardsma",
		"clerkEmail": "Aardsma@gmail.com",
		"totalMembers": 356,
		"latitude": 41.4661,
		"longitude": -87.4654,
		"sourceColumns": {
			"primaryMinister": "Rev. David Klompien",
			"minister": "Rev. David Klompien",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186500",
		"position": [
			33.8277,
			-117.88
		],
		"name": "Christ Reformed Church, Anaheim",
		"location": "Anaheim, California",
		"link": "https://www.christreformed.org",
		"image": "",
		"classis": "Southwest U.S.",
		"mailingAddress": {
			"street": "P.O. Box 6287",
			"city": "Anaheim",
			"state": "CA",
			"zip": "92816-9998",
			"country": "United States",
			"formatted": "P.O. Box 6287\nAnaheim, CA 92816-9998\nUnited States"
		},
		"meetingAddress": {
			"street": "900 S. Sunkist St.",
			"city": "Anaheim",
			"state": "CA",
			"zip": "92816-9998",
			"country": "United States",
			"formatted": "900 S. Sunkist St.\nAnaheim, CA 92816-9998\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Dr. Daniel Borvan (714) 538-1057",
				"Rev. Brad Lenzner (714) 538-1057"
			],
			"phone": "(714) 538-1057",
			"fax": "",
			"email": "urcanaheim@aol.com",
			"website": "www.christreformed.org"
		},
		"meetingInformation": "Sun. 10:00 AM and 12:00 PM.",
		"meetingDetails": "Anaheim Seventh Day Adventist Church - 900 S. Sunkist St. - Anaheim, CA 92806",
		"yearOrganized": "1995",
		"joinedUrcYear": "1997",
		"clerk": "Jeff Tyler (562) 455-5588",
		"clerkEmail": "clerk@christreformed.org",
		"totalMembers": 400,
		"latitude": 33.8277,
		"longitude": -117.88,
		"sourceColumns": {
			"primaryMinister": "Rev. Dr. Daniel Borvan",
			"minister": "Rev. Dr. Daniel Borvan (714) 538-1057",
			"minister2": "Rev. Brad Lenzner (714) 538-1057"
		}
	},
	{
		"type": "church",
		"id": "186429",
		"position": [
			43.614409,
			-88.724367
		],
		"name": "Grace United Reformed Church of Waupun",
		"location": "Waupun, Wisconsin",
		"link": "https://www.WaupunGraceURC.org",
		"image": "",
		"classis": "Central U.S.",
		"mailingAddress": {
			"street": "601 Buwalda Drive",
			"city": "Waupun",
			"state": "WI",
			"zip": "53963",
			"country": "United States",
			"formatted": "601 Buwalda Drive\nWaupun, WI 53963\nUnited States"
		},
		"meetingAddress": {
			"street": "601 Buwalda Drive",
			"city": "Waupun",
			"state": "WI",
			"zip": "53963",
			"country": "United States",
			"formatted": "601 Buwalda Drive\nWaupun, WI 53963\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Paul Freswick"
			],
			"phone": "(920) 324-2924",
			"fax": "",
			"email": "pastor@waupungraceurc.org",
			"website": "www.WaupunGraceURC.org"
		},
		"meetingInformation": "9:30 AM and 5:30 PM",
		"meetingDetails": "",
		"yearOrganized": "1999",
		"joinedUrcYear": "1999",
		"clerk": "Elder David Kok",
		"clerkEmail": "elderkok@gmail.com",
		"totalMembers": 89,
		"latitude": 43.614409,
		"longitude": -88.724367,
		"sourceColumns": {
			"primaryMinister": "Rev. Paul Freswick",
			"minister": "Rev. Paul Freswick",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186658",
		"position": [
			45.406474,
			-122.634193
		],
		"name": "Grace United Reformed Church of Portland",
		"location": "Milwaukie, Oregon",
		"link": "https://www.graceunitedreformedchurch.org",
		"image": "",
		"classis": "Pacific Northwest",
		"mailingAddress": {
			"street": "2800 Concord Rd",
			"city": "Milwaukie",
			"state": "OR",
			"zip": "97267",
			"country": "United States",
			"formatted": "2800 Concord Rd\nMilwaukie, OR 97267\nUnited States"
		},
		"meetingAddress": {
			"street": "2800 Concord Rd",
			"city": "Milwaukie",
			"state": "OR",
			"zip": "97267",
			"country": "United States",
			"formatted": "2800 Concord Rd\nMilwaukie, OR 97267\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Josh Feil"
			],
			"phone": "(503) 984-1475",
			"fax": "",
			"email": "grace.urcna@gmail.com",
			"website": "www.graceunitedreformedchurch.org"
		},
		"meetingInformation": "9:30 AM and 5:00 PM",
		"meetingDetails": "",
		"yearOrganized": "2010",
		"joinedUrcYear": "2010",
		"clerk": "Rev. Josh Feil",
		"clerkEmail": "joshfeil@gmail.com",
		"totalMembers": 120,
		"latitude": 45.406474,
		"longitude": -122.634193,
		"sourceColumns": {
			"primaryMinister": "Rev. Josh Feil",
			"minister": "Rev. Josh Feil",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186575",
		"position": [
			43.7208,
			-79.5453
		],
		"name": "Covenant Reformed Church of Toronto",
		"location": "Toronto, Ontario",
		"link": "https://www.reformedtoronto.org",
		"image": "",
		"classis": "Ontario-East",
		"mailingAddress": {
			"street": "259 Albion Rd.",
			"city": "Toronto",
			"state": "ON",
			"zip": "M9W 3P1",
			"country": "Canada",
			"formatted": "259 Albion Rd.\nToronto, ON M9W 3P1\nCanada"
		},
		"meetingAddress": {
			"street": "265 Albion Rd.",
			"city": "Toronto",
			"state": "ON",
			"zip": "M9W 3P1",
			"country": "Canada",
			"formatted": "265 Albion Rd.\nToronto, ON M9W 3P1\nCanada"
		},
		"contact": {
			"ministers": [
				"Rev. Ben Verdonk"
			],
			"phone": "(416) 747-1179",
			"fax": "",
			"email": "reformedtoronto@gmail.com",
			"website": "www.reformedtoronto.org"
		},
		"meetingInformation": "10:00 AM and 4:30 PM",
		"meetingDetails": "",
		"yearOrganized": "1953",
		"joinedUrcYear": "1997",
		"clerk": "Elder Lawrence Simonse",
		"clerkEmail": "Covenant.URC.Clerk@gmail.com",
		"totalMembers": 202,
		"latitude": 43.7208,
		"longitude": -79.5453,
		"sourceColumns": {
			"primaryMinister": "Rev. Ben Verdonk",
			"minister": "Rev. Ben Verdonk",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186627",
		"position": [
			43.9017,
			-79.6553
		],
		"name": "Immanuel Reformed Church of Bolton",
		"location": "Bolton, Ontario",
		"link": "https://www.immanuelreformed.com",
		"image": "",
		"classis": "Ontario-East",
		"mailingAddress": {
			"street": "110 King St. W.",
			"city": "Bolton",
			"state": "ON",
			"zip": "L7E 1A2",
			"country": "Canada",
			"formatted": "110 King St. W.\nBolton, ON L7E 1A2\nCanada"
		},
		"meetingAddress": {
			"street": "110 King St. W",
			"city": "Bolton",
			"state": "ON",
			"zip": "L7E 1A2",
			"country": "Canada",
			"formatted": "110 King St. W\nBolton, ON L7E 1A2\nCanada"
		},
		"contact": {
			"ministers": [
				"Pastor Alexander Proudfoot"
			],
			"phone": "(416) 435-9961",
			"fax": "",
			"email": "clerk@immanuelreformed.com",
			"website": "www.immanuelreformed.com"
		},
		"meetingInformation": "9:30 AM and 3:30 PM",
		"meetingDetails": "",
		"yearOrganized": "1994",
		"joinedUrcYear": "2008",
		"clerk": "Elder Harold DeVisser",
		"clerkEmail": "clerk@immanuelreformed.com",
		"totalMembers": 123,
		"latitude": 43.9017,
		"longitude": -79.6553,
		"sourceColumns": {
			"primaryMinister": "Pastor Alexander Proudfoot",
			"minister": "Pastor Alexander Proudfoot",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "542400",
		"position": [
			43.5753731,
			-116.3799751
		],
		"name": "Providence Reformed Church, Meridian, ID",
		"location": "Meridian, Idaho",
		"link": "https://www.providenceurc.org/",
		"image": "",
		"classis": "Pacific Northwest",
		"mailingAddress": {
			"street": "1150 East Pienza Street",
			"city": "Meridian",
			"state": "ID",
			"zip": "83642",
			"country": "United States",
			"formatted": "1150 East Pienza Street\nMeridian, ID 83642\nUnited States"
		},
		"meetingAddress": {
			"street": "1150 E Pienza St",
			"city": "Meridian",
			"state": "ID",
			"zip": "83642",
			"country": "United States",
			"formatted": "1150 E Pienza St\nMeridian, ID 83642\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Kris Wassam"
			],
			"phone": "(208) 466-4444",
			"fax": "",
			"email": "info@providenceurc.org",
			"website": "www.providenceurc.org/"
		},
		"meetingInformation": "10:15 AM and 5:00 PM",
		"meetingDetails": "",
		"yearOrganized": "2024",
		"joinedUrcYear": "2022",
		"clerk": "Joe Aguirre (909) 230-0837",
		"clerkEmail": "joeaguirre0531@gmail.com",
		"totalMembers": "",
		"latitude": 43.5753731,
		"longitude": -116.3799751,
		"sourceColumns": {
			"primaryMinister": "Rev. Kristian Wassam",
			"minister": "Rev. Kris Wassam",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186553",
		"position": [
			44.504704,
			-79.551466
		],
		"name": "Grace United Reformed Church (of Simcoe County)",
		"location": "Oro-Medonte, Ontario",
		"link": "",
		"image": "",
		"classis": "Ontario-East",
		"mailingAddress": {
			"street": "P.O. Box 2668",
			"city": "Orillia",
			"state": "ON",
			"zip": "L3V 7C1",
			"country": "Canada",
			"formatted": "P.O. Box 2668\nOrillia, ON L3V 7C1\nCanada"
		},
		"meetingAddress": {
			"street": "80 15/16 Sideroad East",
			"city": "Oro-Medonte",
			"state": "ON",
			"zip": "L3V 7C1",
			"country": "Canada",
			"formatted": "80 15/16 Sideroad East\nOro-Medonte, ON L3V 7C1\nCanada"
		},
		"contact": {
			"ministers": [
				"Vacant"
			],
			"phone": "(705) 345-9544",
			"fax": "",
			"email": "graceurcclerk@gmail.com",
			"website": ""
		},
		"meetingInformation": "10:30 AM and 3:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1993",
		"joinedUrcYear": "1995",
		"clerk": "Mark Bandstra",
		"clerkEmail": "graceurcclerk@gmail.com",
		"totalMembers": 71,
		"latitude": 44.504704,
		"longitude": -79.551466,
		"sourceColumns": {
			"primaryMinister": "Vacant, (705) 345-9544",
			"minister": "Vacant",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "380779",
		"position": [
			47.289634,
			-122.578796
		],
		"name": "Gig Harbor United Reformed Church, Gig Harbor, WA",
		"location": "Gig Harbor, Washington",
		"link": "https://www.gigharborurc.org",
		"image": "",
		"classis": "Pacific Northwest",
		"mailingAddress": {
			"street": "P.O. Box 1535",
			"city": "Gig Harbor",
			"state": "WA",
			"zip": "98335-3535",
			"country": "United States",
			"formatted": "P.O. Box 1535\nGig Harbor, WA 98335-3535\nUnited States"
		},
		"meetingAddress": {
			"street": "3008 36th St NW",
			"city": "Gig Harbor",
			"state": "WA",
			"zip": "98335-3535",
			"country": "United States",
			"formatted": "3008 36th St NW\nGig Harbor, WA 98335-3535\nUnited States"
		},
		"contact": {
			"ministers": [
				"Vacant"
			],
			"phone": "(515) 535-3907",
			"fax": "",
			"email": "pastor@gigharborurc.org",
			"website": "www.gigharborurc.org"
		},
		"meetingInformation": "9:30 AM and 11:15 AM",
		"meetingDetails": "At Lighthouse Christian School in Navigator Hall on top level of school. - Enter parking lot off 36th Street. Enter main doors. Turn right in main hallway to find Navigator Hall.",
		"yearOrganized": "2023",
		"joinedUrcYear": "2019",
		"clerk": "Elder John Dautel",
		"clerkEmail": "jdautel@icloud.com",
		"totalMembers": 32,
		"latitude": 47.289634,
		"longitude": -122.578796,
		"sourceColumns": {
			"primaryMinister": "Vacant, (513) 535-3907",
			"minister": "Vacant",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186570",
		"position": [
			54.772646,
			-127.155302
		],
		"name": "Bethel Reformed Church of Smithers",
		"location": "Smithers, British Columbia",
		"link": "https://www.bethelsmithers.ca",
		"image": "",
		"classis": "Western Canada",
		"mailingAddress": {
			"street": "P.O. Box 3847",
			"city": "Smithers",
			"state": "BC",
			"zip": "V0J 2N0",
			"country": "Canada",
			"formatted": "P.O. Box 3847\nSmithers, BC V0J 2N0\nCanada"
		},
		"meetingAddress": {
			"street": "3115 Gould Place",
			"city": "Smithers",
			"state": "BC",
			"zip": "V0J 2N0",
			"country": "Canada",
			"formatted": "3115 Gould Place\nSmithers, BC V0J 2N0\nCanada"
		},
		"contact": {
			"ministers": [
				"Rev. Simon Lievaart (250) 877-7364"
			],
			"phone": "(250) 847-5100",
			"fax": "",
			"email": "bethelsmithers@gmail.com",
			"website": "www.bethelsmithers.ca"
		},
		"meetingInformation": "10:00 AM and 2:30 PM",
		"meetingDetails": "",
		"yearOrganized": "1992",
		"joinedUrcYear": "1995",
		"clerk": "Elder Aaron Adema (250) 847-0601",
		"clerkEmail": "clerk.bethelsmithers@gmail.com",
		"totalMembers": 215,
		"latitude": 54.772646,
		"longitude": -127.155302,
		"sourceColumns": {
			"primaryMinister": "Rev. Simon Lievaart",
			"minister": "Rev. Simon Lievaart (250) 877-7364",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186578",
		"position": [
			42.5666,
			-114.452
		],
		"name": "New Covenant United Reformed Church, Twin Falls",
		"location": "Twin Falls, Idaho",
		"link": "https://www.newcovenanturc.org",
		"image": "",
		"classis": "Pacific Northwest",
		"mailingAddress": {
			"street": "1306 Filer Ave. E.",
			"city": "Twin Falls",
			"state": "ID",
			"zip": "83301",
			"country": "United States",
			"formatted": "1306 Filer Ave. E.\nTwin Falls, ID 83301\nUnited States"
		},
		"meetingAddress": {
			"street": "1306 Filer Ave. E.",
			"city": "Twin Falls",
			"state": "ID",
			"zip": "83301",
			"country": "United States",
			"formatted": "1306 Filer Ave. E.\nTwin Falls, ID 83301\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Christopher Folkerts (208) 735-8285"
			],
			"phone": "(208) 735-8285",
			"fax": "",
			"email": "newcovenanturc@gmail.com",
			"website": "www.newcovenanturc.org"
		},
		"meetingInformation": "10:00 AM and 11:45 AM",
		"meetingDetails": "",
		"yearOrganized": "2006",
		"joinedUrcYear": "2006",
		"clerk": "Rick Prins",
		"clerkEmail": "frpr2017@gmail.com",
		"totalMembers": 57,
		"latitude": 42.5666,
		"longitude": -114.452,
		"sourceColumns": {
			"primaryMinister": "Rev. Christopher Folkerts",
			"minister": "Rev. Christopher Folkerts (208) 735-8285",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186572",
		"position": [
			49.111215,
			-122.74049
		],
		"name": "Surrey Covenant Reformed Church",
		"location": "Surrey, British Columbia",
		"link": "https://www.surreycovenantreformed.com",
		"image": "",
		"classis": "Western Canada",
		"mailingAddress": {
			"street": "17400 60 Ave.",
			"city": "Surrey",
			"state": "BC",
			"zip": "V3S 1T8",
			"country": "Canada",
			"formatted": "17400 60 Ave.\nSurrey, BC V3S 1T8\nCanada"
		},
		"meetingAddress": {
			"street": "17400 60th Ave.",
			"city": "Surrey",
			"state": "BC",
			"zip": "V3S 1T8",
			"country": "Canada",
			"formatted": "17400 60th Ave.\nSurrey, BC V3S 1T8\nCanada"
		},
		"contact": {
			"ministers": [
				"Rev. Michael Wall (403) 892-2783"
			],
			"phone": "(604) 574-1929",
			"fax": "",
			"email": "surreyurc@gmail.com",
			"website": "www.surreycovenantreformed.com"
		},
		"meetingInformation": "10:00 AM and 3:30 PM",
		"meetingDetails": "",
		"yearOrganized": "1987",
		"joinedUrcYear": "2001",
		"clerk": "Pete Schouten (778) 241-1547",
		"clerkEmail": "wpschout@gmail.com",
		"totalMembers": 87,
		"latitude": 49.111215,
		"longitude": -122.74049,
		"sourceColumns": {
			"primaryMinister": "Rev. Michael Wall",
			"minister": "Rev. Michael Wall (403) 892-2783",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186524",
		"position": [
			55.1782,
			-118.778
		],
		"name": "Covenant Reformed Church of Grande Prairie",
		"location": "Grande Prairie, Alberta",
		"link": "https://www.grandeprairieurc.org",
		"image": "",
		"classis": "Western Canada",
		"mailingAddress": {
			"street": "10803 94th St.",
			"city": "Grande Prairie",
			"state": "AB",
			"zip": "T8V 1Y8",
			"country": "Canada",
			"formatted": "10803 94th St.\nGrande Prairie, AB T8V 1Y8\nCanada"
		},
		"meetingAddress": {
			"street": "10803 94th St.",
			"city": "Grande Prairie",
			"state": "AB",
			"zip": "T8V 1Y8",
			"country": "Canada",
			"formatted": "10803 94th St.\nGrande Prairie, AB T8V 1Y8\nCanada"
		},
		"contact": {
			"ministers": [
				"Rev. Keith Giles (587) 202-5771"
			],
			"phone": "(587) 771-0374",
			"fax": "",
			"email": "clerk@grandeprairieurc.org",
			"website": "www.grandeprairieurc.org"
		},
		"meetingInformation": "10:30 AM and 03:00 PM",
		"meetingDetails": "",
		"yearOrganized": "2012",
		"joinedUrcYear": "1997",
		"clerk": "Peter Dykshoorn",
		"clerkEmail": "clerk@grandeprairieurc.org",
		"totalMembers": 38,
		"latitude": 55.1782,
		"longitude": -118.778,
		"sourceColumns": {
			"primaryMinister": "Rev Keith Giles",
			"minister": "Rev. Keith Giles (587) 202-5771",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186593",
		"position": [
			38.891277,
			-76.992974
		],
		"name": "Christ Reformed Church, Washington D.C.",
		"location": "Washington, District of Columbia",
		"link": "https://www.ChristReformedDC.org",
		"image": "",
		"classis": "Eastern U.S.",
		"mailingAddress": {
			"street": "P.O. Box 6135",
			"city": "Washington",
			"state": "DC",
			"zip": "20044",
			"country": "United States",
			"formatted": "P.O. Box 6135\nWashington, DC 20044\nUnited States"
		},
		"meetingAddress": {
			"street": "914 Massachusetts Avenue NE",
			"city": "Washington",
			"state": "DC",
			"zip": "20044",
			"country": "United States",
			"formatted": "914 Massachusetts Avenue NE\nWashington, DC 20044\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Dr. Brian J. Lee"
			],
			"phone": "(202) 656-1611",
			"fax": "",
			"email": "info@christreformeddc.org",
			"website": "www.ChristReformedDC.org"
		},
		"meetingInformation": "9:30 AM and 10:30 AM",
		"meetingDetails": "Christ Reformed Church meets at Capitol Hill Seventh Day Adventist Church. Our worship is at 10:30 am, preceded by a Catechism Service at 9:30 am.",
		"yearOrganized": "2016",
		"joinedUrcYear": "2007",
		"clerk": "Liam Harrell",
		"clerkEmail": "liam.harrell@christreformeddc.org",
		"totalMembers": 51,
		"latitude": 38.891277,
		"longitude": -76.992974,
		"sourceColumns": {
			"primaryMinister": "Rev. Brian J. Lee",
			"minister": "Rev. Dr. Brian J. Lee",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186566",
		"position": [
			43.799333,
			-79.313808
		],
		"name": "New Horizon United Reformed Church of Scarborough",
		"location": "Scarborough, Ontario",
		"link": "https://www.newhorizonchurch.ca",
		"image": "",
		"classis": "Southwestern Ontario",
		"mailingAddress": {
			"street": "4 Littleborough Court",
			"city": "Scarborough",
			"state": "ON",
			"zip": "M1C 4S6",
			"country": "Canada",
			"formatted": "4 Littleborough Court\nScarborough, ON M1C 4S6\nCanada"
		},
		"meetingAddress": {
			"street": "2300 Bridletowne Circle",
			"city": "Scarborough",
			"state": "ON",
			"zip": "M1C 4S6",
			"country": "Canada",
			"formatted": "2300 Bridletowne Circle\nScarborough, ON M1C 4S6\nCanada"
		},
		"contact": {
			"ministers": [
				"Rev. Mitchell Persaud   (416) 335-0958"
			],
			"phone": "(416) 335-0958",
			"fax": "",
			"email": "mitchellpersaud@gmail.com",
			"website": "www.newhorizonchurch.ca"
		},
		"meetingInformation": "1:00 PM and 2:45 PM",
		"meetingDetails": "",
		"yearOrganized": "N/A",
		"joinedUrcYear": "2006",
		"clerk": "Contact Supervising Church",
		"clerkEmail": "clerk@cornerstoneurc.ca",
		"totalMembers": 50,
		"latitude": 43.799333,
		"longitude": -79.313808,
		"sourceColumns": {
			"primaryMinister": "Rev. Mitchell Persaud",
			"minister": "Rev. Mitchell Persaud   (416) 335-0958",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186626",
		"position": [
			49.867721302341,
			-119.3646968534
		],
		"name": "Grace Reformed Church in Kelowna",
		"location": "Kelowna, British Columbia",
		"link": "https://www.gracereformedkelowna.com",
		"image": "",
		"classis": "Western Canada",
		"mailingAddress": {
			"street": "101-2293 Leckie Road",
			"city": "Kelowna",
			"state": "BC",
			"zip": "V1X 6Y5",
			"country": "Canada",
			"formatted": "101-2293 Leckie Road\nKelowna, BC V1X 6Y5\nCanada"
		},
		"meetingAddress": {
			"street": "1710 Garner Road",
			"city": "Kelowna",
			"state": "BC",
			"zip": "V1X 6Y5",
			"country": "Canada",
			"formatted": "1710 Garner Road\nKelowna, BC V1X 6Y5\nCanada"
		},
		"contact": {
			"ministers": [
				"Rev. James Roosma (250) 762-3998"
			],
			"phone": "(250) 762-3998",
			"fax": "",
			"email": "gracereformedkelowna@gmail.com",
			"website": "www.gracereformedkelowna.com"
		},
		"meetingInformation": "10:00 AM and 12:00 PM",
		"meetingDetails": "Orchard City Seventh-day Adventist Church building.",
		"yearOrganized": "1990",
		"joinedUrcYear": "2008",
		"clerk": "Elder Detmer Deddens",
		"clerkEmail": "dkdeddens@gmail.com",
		"totalMembers": 52,
		"latitude": 49.867721302341,
		"longitude": -119.3646968534,
		"sourceColumns": {
			"primaryMinister": "Rev. James Roosma",
			"minister": "Rev. James Roosma (250) 762-3998",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "581134",
		"position": [
			39.102763,
			-84.480424
		],
		"name": "Christ Reformed Church - Northern Kentucky",
		"location": "Bellevue, Kentucky",
		"link": "https://christreformednky.org",
		"image": "",
		"classis": "Eastern U.S.",
		"mailingAddress": {
			"street": "306 Center Street",
			"city": "Bellevue",
			"state": "KY",
			"zip": "41073",
			"country": "United States",
			"formatted": "306 Center Street\nBellevue, KY 41073\nUnited States"
		},
		"meetingAddress": {
			"street": "306 Center Street",
			"city": "Bellevue",
			"state": "KY",
			"zip": "41073",
			"country": "United States",
			"formatted": "306 Center Street\nBellevue, KY 41073\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Dr. J. Brandon Burks"
			],
			"phone": "(859) 466-3340",
			"fax": "",
			"email": "christreformednky@gmail.com",
			"website": "christreformednky.org"
		},
		"meetingInformation": "10:00 AM and 11:30 AM",
		"meetingDetails": "Our Communion Service is at 10:00 AM, and our Catechism Service follows our Communion Service after a short coffee break.",
		"yearOrganized": "N/A",
		"joinedUrcYear": "2024",
		"clerk": "Donn Rubingh",
		"clerkEmail": "drrubingh@gmail.com",
		"totalMembers": "",
		"latitude": 39.102763,
		"longitude": -84.480424,
		"sourceColumns": {
			"primaryMinister": "Rev. Dr. J. Brandon Burks",
			"minister": "Rev. Dr. J. Brandon Burks",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "651394",
		"position": [
			43.023852,
			-79.36338
		],
		"name": "Pelham United Reformed Church",
		"location": "Fenwick, Ontario",
		"link": "",
		"image": "",
		"classis": "Ontario-East",
		"mailingAddress": {
			"street": "1050 Church St.",
			"city": "Fenwick",
			"state": "ON",
			"zip": "L0S 1C0",
			"country": "Canada",
			"formatted": "1050 Church St.\nFenwick, ON L0S 1C0\nCanada"
		},
		"meetingAddress": {
			"street": "1050 Church St.",
			"city": "Fenwick",
			"state": "ON",
			"zip": "L0S 1C0",
			"country": "Canada",
			"formatted": "1050 Church St.\nFenwick, ON L0S 1C0\nCanada"
		},
		"contact": {
			"ministers": [
				"Vacant"
			],
			"phone": "(905) 658-6987",
			"fax": "",
			"email": "",
			"website": ""
		},
		"meetingInformation": "09:00AM and 02:30PM",
		"meetingDetails": "",
		"yearOrganized": "2025",
		"joinedUrcYear": "2025",
		"clerk": "Justin Snippe",
		"clerkEmail": "clerkpelhamurc@gmail.com",
		"totalMembers": "",
		"latitude": 43.023852,
		"longitude": -79.36338,
		"sourceColumns": {
			"primaryMinister": "Vacant, (905) 892-3081",
			"minister": "Vacant",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "466553",
		"position": [
			38.73989921,
			-85.37674
		],
		"name": "Madison Reformed Church (Indiana)",
		"location": "Madison, Indiana",
		"link": "https://www.madisonreformed.com",
		"image": "",
		"classis": "Eastern U.S.",
		"mailingAddress": {
			"street": "509 West St.",
			"city": "Madison",
			"state": "IN",
			"zip": "47250",
			"country": "United States",
			"formatted": "509 West St.\nMadison, IN 47250\nUnited States"
		},
		"meetingAddress": {
			"street": "309 E. 5th St",
			"city": "Madison",
			"state": "IN",
			"zip": "47250",
			"country": "United States",
			"formatted": "309 E. 5th St\nMadison, IN 47250\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Collin Welch"
			],
			"phone": "(812) 493-9133",
			"fax": "",
			"email": "contact@madisonreformed.com",
			"website": "www.madisonreformed.com"
		},
		"meetingInformation": "09:30 AM and 4:30 PM",
		"meetingDetails": "",
		"yearOrganized": "N/A",
		"joinedUrcYear": "2020",
		"clerk": "TBA",
		"clerkEmail": "TBA",
		"totalMembers": 33,
		"latitude": 38.73989921,
		"longitude": -85.37674,
		"sourceColumns": {
			"primaryMinister": "Rev. Collin Welch",
			"minister": "Rev. Collin Welch",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186556",
		"position": [
			41.407373,
			-92.951135
		],
		"name": "Covenant Reformed Church of Pella",
		"location": "Pella, Iowa",
		"link": "https://www.covenantpella.org",
		"image": "",
		"classis": "Central U.S.",
		"mailingAddress": {
			"street": "2805 Fifield Road",
			"city": "Pella",
			"state": "IA",
			"zip": "50219",
			"country": "United States",
			"formatted": "2805 Fifield Road\nPella, IA 50219\nUnited States"
		},
		"meetingAddress": {
			"street": "2805 Fifield Road",
			"city": "Pella",
			"state": "IA",
			"zip": "50219",
			"country": "United States",
			"formatted": "2805 Fifield Road\nPella, IA 50219\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Greg Lubbers (641) 780-3821"
			],
			"phone": "(641) 620-1777",
			"fax": "",
			"email": "pellacovenant@gmail.com",
			"website": "www.covenantpella.org"
		},
		"meetingInformation": "9:30 AM and 5:30 PM",
		"meetingDetails": "",
		"yearOrganized": "1866",
		"joinedUrcYear": "2003",
		"clerk": "Elder Steve Runner (641) 629-0391",
		"clerkEmail": "elder-clerk@covenantpella.org",
		"totalMembers": 443,
		"latitude": 41.407373,
		"longitude": -92.951135,
		"sourceColumns": {
			"primaryMinister": "Rev. Greg Lubbers",
			"minister": "Rev. Greg Lubbers (641) 780-3821",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186534",
		"position": [
			40.0747,
			-76.106
		],
		"name": "Zeltenreich Reformed Church of New Holland",
		"location": "New Holland, Pennsylvania",
		"link": "https://www.zeltenreich.org",
		"image": "",
		"classis": "Eastern U.S.",
		"mailingAddress": {
			"street": "752 Hollander Road",
			"city": "New Holland",
			"state": "PA",
			"zip": "17557",
			"country": "United States",
			"formatted": "752 Hollander Road\nNew Holland, PA 17557\nUnited States"
		},
		"meetingAddress": {
			"street": "752 Hollander Road",
			"city": "New Holland",
			"state": "PA",
			"zip": "17557",
			"country": "United States",
			"formatted": "752 Hollander Road\nNew Holland, PA 17557\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Robert M. Godfrey"
			],
			"phone": "(717) 354-9642",
			"fax": "",
			"email": "office@zeltenreich.org",
			"website": "www.zeltenreich.org"
		},
		"meetingInformation": "10:30 AM and 5:00 PM",
		"meetingDetails": "",
		"yearOrganized": "2006",
		"joinedUrcYear": "2006",
		"clerk": "Elder Preston Denlinger",
		"clerkEmail": "clerk@zeltenreich.org",
		"totalMembers": 96,
		"latitude": 40.0747,
		"longitude": -76.106,
		"sourceColumns": {
			"primaryMinister": "Rev. Robert M. Godfrey",
			"minister": "Rev. Robert M. Godfrey",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186513",
		"position": [
			34.0191,
			-117.671
		],
		"name": "First United Reformed Church of Chino",
		"location": "Chino, California",
		"link": "https://www.chinourc.org",
		"image": "",
		"classis": "Southwest U.S.",
		"mailingAddress": {
			"street": "6159 Riverside Drive",
			"city": "Chino",
			"state": "CA",
			"zip": "91710",
			"country": "United States",
			"formatted": "6159 Riverside Drive\nChino, CA 91710\nUnited States"
		},
		"meetingAddress": {
			"street": "6159 Riverside Drive",
			"city": "Chino",
			"state": "CA",
			"zip": "91710",
			"country": "United States",
			"formatted": "6159 Riverside Drive\nChino, CA 91710\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Bradd L. Nymeyer  (602) 550-6738",
				"Dr. Timothy R. Scheuers (909) 591-9111"
			],
			"phone": "(909) 591-9111",
			"fax": "",
			"email": "office@chinourc.org",
			"website": "www.chinourc.org"
		},
		"meetingInformation": "9:30 AM and 6:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1958",
		"joinedUrcYear": "1997",
		"clerk": "Elder Rich Rietkerk (951) 545-4133",
		"clerkEmail": "rjrietkerk81@verizon.net",
		"totalMembers": 337,
		"latitude": 34.0191,
		"longitude": -117.671,
		"sourceColumns": {
			"primaryMinister": "Rev. Bradd L. Nymeyer",
			"minister": "Rev. Bradd L. Nymeyer  (602) 550-6738",
			"minister2": "Dr. Timothy R. Scheuers (909) 591-9111"
		}
	},
	{
		"type": "church",
		"id": "188001",
		"position": [
			43.0357671,
			-85.6682554
		],
		"name": "Sovereign Grace United Reformed Church of Grand Rapids",
		"location": "Comstock Park, Michigan",
		"link": "https://www.sovereigngraceurc.org/",
		"image": "",
		"classis": "Michigan",
		"mailingAddress": {
			"street": "PO Box 132",
			"city": "Comstock Park",
			"state": "MI",
			"zip": "49321",
			"country": "United States",
			"formatted": "PO Box 132\nComstock Park, MI 49321\nUnited States"
		},
		"meetingAddress": {
			"street": "62 Lamoreux Dr. NE",
			"city": "Comstock Park",
			"state": "MI",
			"zip": "49321",
			"country": "United States",
			"formatted": "62 Lamoreux Dr. NE\nComstock Park, MI 49321\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Mitchell Dick"
			],
			"phone": "(616) 929-9170",
			"fax": "",
			"email": "info@sgurc.org",
			"website": "www.sovereigngraceurc.org/"
		},
		"meetingInformation": "9:30 AM and 5:00 PM",
		"meetingDetails": "We are located just off 131 and West River Drive.",
		"yearOrganized": "2011",
		"joinedUrcYear": "2010",
		"clerk": "Mr. Henry Gysen",
		"clerkEmail": "clerk@sgurc.org",
		"totalMembers": 53,
		"latitude": 43.0357671,
		"longitude": -85.6682554,
		"sourceColumns": {
			"primaryMinister": "Rev. Mitchell Dick",
			"minister": "Rev. Mitchell Dick",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186552",
		"position": [
			43.0118,
			-96.0609
		],
		"name": "Redeemer United Reformed Church of Orange City",
		"location": "Orange City, Iowa",
		"link": "https://www.redeemerurc.org",
		"image": "",
		"classis": "Central U.S.",
		"mailingAddress": {
			"street": "302 St. Paul Ave. SE",
			"city": "Orange City",
			"state": "IA",
			"zip": "51041",
			"country": "United States",
			"formatted": "302 St. Paul Ave. SE\nOrange City, IA 51041\nUnited States"
		},
		"meetingAddress": {
			"street": "302 St. Paul Ave. SE",
			"city": "Orange City",
			"state": "IA",
			"zip": "51041",
			"country": "United States",
			"formatted": "302 St. Paul Ave. SE\nOrange City, IA 51041\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Todd De Rooy"
			],
			"phone": "(712) 737-8749",
			"fax": "",
			"email": "redeemerurcclerk@gmail.com",
			"website": "www.redeemerurc.org"
		},
		"meetingInformation": "9:30 AM  and 6:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1994",
		"joinedUrcYear": "1995",
		"clerk": "Les Vander Plaats",
		"clerkEmail": "redeemerurcclerk@gmail.com",
		"totalMembers": 230,
		"latitude": 43.0118,
		"longitude": -96.0609,
		"sourceColumns": {
			"primaryMinister": "Rev. Todd De Rooy",
			"minister": "Rev. Todd De Rooy",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186523",
		"position": [
			43.0009,
			-85.7691
		],
		"name": "Walker United Reformed Church of Grand Rapids",
		"location": "Grand Rapids, Michigan",
		"link": "https://www.walkerurc.org",
		"image": "",
		"classis": "Michigan",
		"mailingAddress": {
			"street": "1941 Randall N.W.",
			"city": "Grand Rapids",
			"state": "MI",
			"zip": "49534",
			"country": "United States",
			"formatted": "1941 Randall N.W.\nGrand Rapids, MI 49534\nUnited States"
		},
		"meetingAddress": {
			"street": "1941 Randall Avenue N.W.",
			"city": "Grand Rapids",
			"state": "MI",
			"zip": "49534",
			"country": "United States",
			"formatted": "1941 Randall Avenue N.W.\nGrand Rapids, MI 49534\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Quentin Falkena"
			],
			"phone": "(616) 453-2960",
			"fax": "",
			"email": "clerk@walkerurc.org",
			"website": "www.walkerurc.org"
		},
		"meetingInformation": "9:30 AM and 5:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1912",
		"joinedUrcYear": "1997",
		"clerk": "Elder Neal Westfall  (951) 505-3151",
		"clerkEmail": "clerk@walkerurc.org",
		"totalMembers": 315,
		"latitude": 43.0009,
		"longitude": -85.7691,
		"sourceColumns": {
			"primaryMinister": "Quentin Falkena",
			"minister": "Rev. Quentin Falkena",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186533",
		"position": [
			46.206,
			-119.154
		],
		"name": "Grace United Reformed Church of Kennewick",
		"location": "Kennewick, Washington",
		"link": "https://www.graceurc.org",
		"image": "",
		"classis": "Pacific Northwest",
		"mailingAddress": {
			"street": "2500 W. 4th Ave",
			"city": "Kennewick",
			"state": "WA",
			"zip": "99336-3179",
			"country": "United States",
			"formatted": "2500 W. 4th Ave\nKennewick, WA 99336-3179\nUnited States"
		},
		"meetingAddress": {
			"street": "2500 W. 4th Ave",
			"city": "Kennewick",
			"state": "WA",
			"zip": "99336-3179",
			"country": "United States",
			"formatted": "2500 W. 4th Ave\nKennewick, WA 99336-3179\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Craig Davis  (509) 308-3763"
			],
			"phone": "(509) 586-6657",
			"fax": "",
			"email": "gurcclerk@graceurc.org",
			"website": "www.graceurc.org"
		},
		"meetingInformation": "10:00 AM and 5:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1997",
		"joinedUrcYear": "1999",
		"clerk": "Elder Andy Prein (509) 531-3546",
		"clerkEmail": "gurcclerk@graceurc.org",
		"totalMembers": 230,
		"latitude": 46.206,
		"longitude": -119.154,
		"sourceColumns": {
			"primaryMinister": "Rev. Craig Davis",
			"minister": "Rev. Craig Davis  (509) 308-3763",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186577",
		"position": [
			33.8312,
			-118.326
		],
		"name": "Grace United Reformed Church Torrance",
		"location": "Torrance, California",
		"link": "https://www.graceurctorrance.org",
		"image": "",
		"classis": "Southwest U.S.",
		"mailingAddress": {
			"street": "2400 W. Carson St. Suite 120",
			"city": "Torrance",
			"state": "CA",
			"zip": "90501",
			"country": "United States",
			"formatted": "2400 W. Carson St. Suite 120\nTorrance, CA 90501\nUnited States"
		},
		"meetingAddress": {
			"street": "2400 W. Carson St. Suite 120",
			"city": "Torrance",
			"state": "CA",
			"zip": "90501",
			"country": "United States",
			"formatted": "2400 W. Carson St. Suite 120\nTorrance, CA 90501\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Brian Cochran",
				"Rev. Drew Admiraal"
			],
			"phone": "(310) 782-7019",
			"fax": "",
			"email": "GraceURC@graceurctorrance.org",
			"website": "www.graceurctorrance.org"
		},
		"meetingInformation": "10:00 AM and 12:00 PM",
		"meetingDetails": "Entrance off back parking lot.",
		"yearOrganized": "1999",
		"joinedUrcYear": "2003",
		"clerk": "Elder Steve Perkins (310) 326-4230",
		"clerkEmail": "clerk@graceurctorrance.org",
		"totalMembers": 91,
		"latitude": 33.8312,
		"longitude": -118.326,
		"sourceColumns": {
			"primaryMinister": "Rev. Brian Cochran",
			"minister": "Rev. Brian Cochran",
			"minister2": "Rev. Drew Admiraal"
		}
	},
	{
		"type": "church",
		"id": "186753",
		"position": [
			41.5699,
			-75.5015
		],
		"name": "Covenant Reformed Church of Carbondale, Pennsylvania",
		"location": "Carbondale, Pennsylvania",
		"link": "http://www.covenantrc.org/",
		"image": "",
		"classis": "Eastern U.S.",
		"mailingAddress": {
			"street": "47 S. Church St.",
			"city": "Carbondale",
			"state": "PA",
			"zip": "18407",
			"country": "United States",
			"formatted": "47 S. Church St.\nCarbondale, PA 18407\nUnited States"
		},
		"meetingAddress": {
			"street": "47 S. Church St",
			"city": "Carbondale",
			"state": "PA",
			"zip": "18407",
			"country": "United States",
			"formatted": "47 S. Church St\nCarbondale, PA 18407\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Steve Arrick"
			],
			"phone": "(570) 282-6400",
			"fax": "",
			"email": "info@covenantrc.org",
			"website": "http://www.covenantrc.org/"
		},
		"meetingInformation": "9:30 AM and 11:00 AM",
		"meetingDetails": "",
		"yearOrganized": "1983",
		"joinedUrcYear": "2009",
		"clerk": "S. George Mall",
		"clerkEmail": "sgmall@echoes.net",
		"totalMembers": 44,
		"latitude": 41.5699,
		"longitude": -75.5015,
		"sourceColumns": {
			"primaryMinister": "Steve Arrick",
			"minister": "Rev. Steve Arrick",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186502",
		"position": [
			42.7691,
			-80.9679
		],
		"name": "Bethel United Reformed Church of Aylmer",
		"location": "Aylmer, Ontario",
		"link": "https://www.bethelurcaylmer.com",
		"image": "",
		"classis": "Southwestern Ontario",
		"mailingAddress": {
			"street": "P.O. Box 244",
			"city": "Springfield",
			"state": "ON",
			"zip": "N0L 2J0",
			"country": "Canada",
			"formatted": "P.O. Box 244\nSpringfield, ON N0L 2J0\nCanada"
		},
		"meetingAddress": {
			"street": "49823 Talbot Line (Hwy 3 East of Aylmer)",
			"city": "Aylmer",
			"state": "ON",
			"zip": "N0L 2J0",
			"country": "Canada",
			"formatted": "49823 Talbot Line (Hwy 3 East of Aylmer)\nAylmer, ON N0L 2J0\nCanada"
		},
		"contact": {
			"ministers": [
				"Rev. Martin Vogel"
			],
			"phone": "(519) 765-1500",
			"fax": "",
			"email": "clerk@bethelurcaylmer.com",
			"website": "www.bethelurcaylmer.com"
		},
		"meetingInformation": "9:30 AM and 3:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1991",
		"joinedUrcYear": "1995",
		"clerk": "Herm Westendorp",
		"clerkEmail": "clerk@bethelurcaylmer.com",
		"totalMembers": 275,
		"latitude": 42.7691,
		"longitude": -80.9679,
		"sourceColumns": {
			"primaryMinister": "Pastor Martin Vogel",
			"minister": "Rev. Martin Vogel",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186582",
		"position": [
			42.9939,
			-79.4803
		],
		"name": "Wellandport United Reformed Church",
		"location": "Wellandport, Ontario",
		"link": "http://www.wellandporturc.org",
		"image": "",
		"classis": "Ontario-East",
		"mailingAddress": {
			"street": "74082 Wellandport Road",
			"city": "Wellandport",
			"state": "ON",
			"zip": "L0R 2J0",
			"country": "Canada",
			"formatted": "74082 Wellandport Road\nWellandport, ON L0R 2J0\nCanada"
		},
		"meetingAddress": {
			"street": "74082 Wellandport Road",
			"city": "Wellandport",
			"state": "ON",
			"zip": "L0R 2J0",
			"country": "Canada",
			"formatted": "74082 Wellandport Road\nWellandport, ON L0R 2J0\nCanada"
		},
		"contact": {
			"ministers": [
				"Rev. Joel Dykstra   (905) 386-0737"
			],
			"phone": "(905) 386-0737",
			"fax": "",
			"email": "secretary.wurc@gmail.com",
			"website": "http://www.wellandporturc.org"
		},
		"meetingInformation": "9:30 AM and 2:30 PM",
		"meetingDetails": "",
		"yearOrganized": "1951",
		"joinedUrcYear": "1995",
		"clerk": "Elder Wilburt Feenstra (613) 640-0030",
		"clerkEmail": "clerk.wellandporturc@gmail.com",
		"totalMembers": 652,
		"latitude": 42.9939,
		"longitude": -79.4803,
		"sourceColumns": {
			"primaryMinister": "Rev. Joel Dykstra",
			"minister": "Rev. Joel Dykstra   (905) 386-0737",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "564570",
		"position": [
			50.44729942335,
			-119.1920800766
		],
		"name": "Providence Reformed Church of Armstrong",
		"location": "Armstong, British Columbia",
		"link": "",
		"image": "",
		"classis": "Western Canada",
		"mailingAddress": {
			"street": "PO Box 344",
			"city": "Abbotsford",
			"state": "BC",
			"zip": "V2T 6Z6",
			"country": "Canada",
			"formatted": "PO Box 344\nAbbotsford, BC V2T 6Z6\nCanada"
		},
		"meetingAddress": {
			"street": "2520 Patterson Avenue",
			"city": "Armstong",
			"state": "BC",
			"zip": "V2T 6Z6",
			"country": "Canada",
			"formatted": "2520 Patterson Avenue\nArmstong, BC V2T 6Z6\nCanada"
		},
		"contact": {
			"ministers": [
				"Scottie Wright"
			],
			"phone": "(604) 826-8854",
			"fax": "",
			"email": "clerk@abbotsfordurc.org",
			"website": ""
		},
		"meetingInformation": "10:00AM and 12:00PM",
		"meetingDetails": "Meeting at the Armstrong Senior's Activity Centre",
		"yearOrganized": "2026",
		"joinedUrcYear": "2023",
		"clerk": "Elder Gary Vane (604) 302-2509",
		"clerkEmail": "clerk@abbotsfordurc.org",
		"totalMembers": "",
		"latitude": 50.44729942335,
		"longitude": -119.1920800766,
		"sourceColumns": {
			"primaryMinister": "Scottie Wright",
			"minister": "Scottie Wright",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186509",
		"position": [
			42.7826,
			-85.6604
		],
		"name": "Covenant United Reformed Church, Byron Center MI",
		"location": "Byron Center, Michigan",
		"link": "https://www.covenanturc.com",
		"image": "",
		"classis": "Michigan",
		"mailingAddress": {
			"street": "58 100th St.",
			"city": "Byron Center",
			"state": "MI",
			"zip": "49315",
			"country": "United States",
			"formatted": "58 100th St.\nByron Center, MI 49315\nUnited States"
		},
		"meetingAddress": {
			"street": "58 100th St.",
			"city": "Byron Center",
			"state": "MI",
			"zip": "49315",
			"country": "United States",
			"formatted": "58 100th St.\nByron Center, MI 49315\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Rodney Kleyn"
			],
			"phone": "(616) 890-5950",
			"fax": "",
			"email": "clerk.curcb@gmail.com",
			"website": "www.covenanturc.com"
		},
		"meetingInformation": "9:30 AM and 5:30 PM",
		"meetingDetails": "",
		"yearOrganized": "1995",
		"joinedUrcYear": "1999",
		"clerk": "Elder Josh Nijenhuis",
		"clerkEmail": "clerk.curcb@gmail.com",
		"totalMembers": 146,
		"latitude": 42.7826,
		"longitude": -85.6604,
		"sourceColumns": {
			"primaryMinister": "Rev. Rodney Kleyn",
			"minister": "Rev. Rodney Kleyn",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "517753",
		"position": [
			40.722452,
			-124.216495
		],
		"name": "Christ the Redeemer Reformed Church of Eureka",
		"location": "Fields Landing, California",
		"link": "https://www.101church.com",
		"image": "",
		"classis": "Pacific Northwest",
		"mailingAddress": {
			"street": "PO Box 192",
			"city": "Fields Landing",
			"state": "CA",
			"zip": "95537",
			"country": "United States",
			"formatted": "PO Box 192\nFields Landing, CA 95537\nUnited States"
		},
		"meetingAddress": {
			"street": "510 Depot Rd.",
			"city": "Fields Landing",
			"state": "CA",
			"zip": "95537",
			"country": "United States",
			"formatted": "510 Depot Rd.\nFields Landing, CA 95537\nUnited States"
		},
		"contact": {
			"ministers": [
				"Pastor John M. Kistler"
			],
			"phone": "(707) 443-9005",
			"fax": "",
			"email": "kistlerj@msn.com",
			"website": "www.101church.com"
		},
		"meetingInformation": "11:00 AM and 5:30 PM",
		"meetingDetails": "Right off Highway 101, three miles south of Eureka, CA.",
		"yearOrganized": "2005",
		"joinedUrcYear": "2022",
		"clerk": "Pastor John Kistler",
		"clerkEmail": "kistlerj@msn.com",
		"totalMembers": 19,
		"latitude": 40.722452,
		"longitude": -124.216495,
		"sourceColumns": {
			"primaryMinister": "Rev. John Kistler",
			"minister": "Pastor John M. Kistler",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186557",
		"position": [
			33.51703,
			-112.03827
		],
		"name": "Phoenix United Reformed Church",
		"location": "Phoenix, Arizona",
		"link": "https://www.phoenixurc.org",
		"image": "",
		"classis": "Southwest U.S.",
		"mailingAddress": {
			"street": "PO Box 44996",
			"city": "Phoenix",
			"state": "AZ",
			"zip": "85064-44996",
			"country": "United States",
			"formatted": "PO Box 44996\nPhoenix, AZ 85064-44996\nUnited States"
		},
		"meetingAddress": {
			"street": "2002 E. Missouri Ave.",
			"city": "Phoenix",
			"state": "AZ",
			"zip": "85064-44996",
			"country": "United States",
			"formatted": "2002 E. Missouri Ave.\nPhoenix, AZ 85064-44996\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Michael Spotts (760) 277-3875",
				"Rev. Chris Smith (616) 239-6190"
			],
			"phone": "(480) 258-1358",
			"fax": "",
			"email": "clerk@phoenixurc.org",
			"website": "www.phoenixurc.org"
		},
		"meetingInformation": "9:30 AM and 5:30 PM",
		"meetingDetails": "",
		"yearOrganized": "1996",
		"joinedUrcYear": "1997",
		"clerk": "Rev. Chris Smith",
		"clerkEmail": "clerk@phoenixurc.org",
		"totalMembers": 346,
		"latitude": 33.51703,
		"longitude": -112.03827,
		"sourceColumns": {
			"primaryMinister": "Rev. Michael Spotts",
			"minister": "Rev. Michael Spotts (760) 277-3875",
			"minister2": "Rev. Chris Smith (616) 239-6190"
		}
	},
	{
		"type": "church",
		"id": "186544",
		"position": [
			41.530098,
			-87.569017
		],
		"name": "Lynwood United Reformed Church",
		"location": "Lynwood, Illinois",
		"link": "https://www.lynwoodurc.org",
		"image": "",
		"classis": "Central U.S.",
		"mailingAddress": {
			"street": "P.O. Box 685",
			"city": "Lansing",
			"state": "IL",
			"zip": "60438",
			"country": "United States",
			"formatted": "P.O. Box 685\nLansing, IL 60438\nUnited States"
		},
		"meetingAddress": {
			"street": "1990 East Glenwood-Dyer Rd.",
			"city": "Lynwood",
			"state": "IL",
			"zip": "60438",
			"country": "United States",
			"formatted": "1990 East Glenwood-Dyer Rd.\nLynwood, IL 60438\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Nick Alons"
			],
			"phone": "(708) 474-4100",
			"fax": "",
			"email": "pastoralons@yahoo.com",
			"website": "www.lynwoodurc.org"
		},
		"meetingInformation": "9:30 AM and 5:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1877",
		"joinedUrcYear": "1995",
		"clerk": "Elder Paul Dykstra",
		"clerkEmail": "paul_dykstra@comcast.net",
		"totalMembers": 236,
		"latitude": 41.530098,
		"longitude": -87.569017,
		"sourceColumns": {
			"primaryMinister": "Rev. Nick Alons",
			"minister": "Rev. Nick Alons",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "189417",
		"position": [
			38.897353,
			-104.811064
		],
		"name": "Covenant United Reformed Church, Colorado Springs",
		"location": "Colorado Springs, Colorado",
		"link": "https://www.urccovenant.org",
		"image": "",
		"classis": "Southwest U.S.",
		"mailingAddress": {
			"street": "8808 Wolf Lake Dr",
			"city": "Colorado Springs",
			"state": "CO",
			"zip": "80924",
			"country": "United States",
			"formatted": "8808 Wolf Lake Dr\nColorado Springs, CO 80924\nUnited States"
		},
		"meetingAddress": {
			"street": "4825 Mallow Rd.",
			"city": "Colorado Springs",
			"state": "CO",
			"zip": "80924",
			"country": "United States",
			"formatted": "4825 Mallow Rd.\nColorado Springs, CO 80924\nUnited States"
		},
		"contact": {
			"ministers": [
				"Vacant"
			],
			"phone": "(719) 314 - 9559",
			"fax": "",
			"email": "info@urccovenant.org",
			"website": "www.urccovenant.org"
		},
		"meetingInformation": "10:00 AM",
		"meetingDetails": "Meeting at Colorado Christian Schools.",
		"yearOrganized": "N/A",
		"joinedUrcYear": "2011",
		"clerk": "Chris Bunker",
		"clerkEmail": "info@urccovenant.org",
		"totalMembers": 32,
		"latitude": 38.897353,
		"longitude": -104.811064,
		"sourceColumns": {
			"primaryMinister": "Vacant, (412) 849-7675",
			"minister": "Vacant",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "472868",
		"position": [
			34.27871,
			-119.27749
		],
		"name": "Ventura Reformed",
		"location": "Ventura, California",
		"link": "https://www.venturareformed.org",
		"image": "",
		"classis": "Southwest U.S.",
		"mailingAddress": {
			"street": "78 Chrisman Ave.",
			"city": "Ventura",
			"state": "CA",
			"zip": "93001",
			"country": "United States",
			"formatted": "78 Chrisman Ave.\nVentura, CA 93001\nUnited States"
		},
		"meetingAddress": {
			"street": "78 Chrisman Ave.",
			"city": "Ventura",
			"state": "CA",
			"zip": "93001",
			"country": "United States",
			"formatted": "78 Chrisman Ave.\nVentura, CA 93001\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Adam Kaloostian"
			],
			"phone": "(805) 535-5502",
			"fax": "",
			"email": "adam.kaloostian@venturareformed.org",
			"website": "www.venturareformed.org"
		},
		"meetingInformation": "9:30 AM and 10:30 AM",
		"meetingDetails": "",
		"yearOrganized": "N/A",
		"joinedUrcYear": "2021",
		"clerk": "Rev. Adam Kaloostian (Pasadena URC clerk)",
		"clerkEmail": "adam.kaloostian@venturareformed.org",
		"totalMembers": 12,
		"latitude": 34.27871,
		"longitude": -119.27749,
		"sourceColumns": {
			"primaryMinister": "Rev. Adam Kaloostian",
			"minister": "Rev. Adam Kaloostian",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186574",
		"position": [
			48.3918,
			-89.275
		],
		"name": "United Reformed Church of Thunder Bay",
		"location": "Thunder Bay, Ontario",
		"link": "https://www.thunderbayurc.com",
		"image": "",
		"classis": "Western Canada",
		"mailingAddress": {
			"street": "P.O. Box 32012",
			"city": "Thunder Bay",
			"state": "ON",
			"zip": "P7E 0A1",
			"country": "Canada",
			"formatted": "P.O. Box 32012\nThunder Bay, ON P7E 0A1\nCanada"
		},
		"meetingAddress": {
			"street": "King's Highway 130",
			"city": "Thunder Bay",
			"state": "ON",
			"zip": "P7E 0A1",
			"country": "Canada",
			"formatted": "King's Highway 130\nThunder Bay, ON P7E 0A1\nCanada"
		},
		"contact": {
			"ministers": [
				"Rev. John Ysinga"
			],
			"phone": "(807) 939-1916 (unattended, at church building)",
			"fax": "",
			"email": "clerk@thunderbayurc.com",
			"website": "www.thunderbayurc.com"
		},
		"meetingInformation": "10:00 AM and 2:30 PM",
		"meetingDetails": "Highway 130, Fire #23 Thunder Bay",
		"yearOrganized": "2001",
		"joinedUrcYear": "2001",
		"clerk": "Elder Eric Bron (807) 629-0465",
		"clerkEmail": "clerk@thunderbayurc.com",
		"totalMembers": 266,
		"latitude": 48.3918,
		"longitude": -89.275,
		"sourceColumns": {
			"primaryMinister": "Rev. John Ysinga",
			"minister": "Rev. John Ysinga",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186580",
		"position": [
			41.3716,
			-74.4418
		],
		"name": "Hudson Valley United Reformed Church of New Hampton",
		"location": "New Hampton, New York",
		"link": "https://www.hvurc.org",
		"image": "",
		"classis": "Eastern U.S.",
		"mailingAddress": {
			"street": "1043 County Route 12",
			"city": "New Hampton",
			"state": "NY",
			"zip": "10958",
			"country": "United States",
			"formatted": "1043 County Route 12\nNew Hampton, NY 10958\nUnited States"
		},
		"meetingAddress": {
			"street": "1043 County Route 12",
			"city": "New Hampton",
			"state": "NY",
			"zip": "10958",
			"country": "United States",
			"formatted": "1043 County Route 12\nNew Hampton, NY 10958\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Kevin Hossink (845) 386-3155"
			],
			"phone": "(845) 355-2556",
			"fax": "",
			"email": "hossink@frontiernet.net",
			"website": "www.hvurc.org"
		},
		"meetingInformation": "9:30 AM and 6:00 PM",
		"meetingDetails": "",
		"yearOrganized": "2004",
		"joinedUrcYear": "2004",
		"clerk": "Jon Swart (845) 527-8830",
		"clerkEmail": "nop2687@hotmail.com",
		"totalMembers": 191,
		"latitude": 41.3716,
		"longitude": -74.4418,
		"sourceColumns": {
			"primaryMinister": "Rev. Kevin Hossink",
			"minister": "Rev. Kevin Hossink (845) 386-3155",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186530",
		"position": [
			43.144836,
			-79.367981
		],
		"name": "Immanuel United Reformed Church of Jordan",
		"location": "Jordan, Ontario",
		"link": "https://www.immanuelurc.com",
		"image": "",
		"classis": "Ontario-East",
		"mailingAddress": {
			"street": "P.O. Box 279",
			"city": "Jordan Station",
			"state": "ON",
			"zip": "L0R 1S0",
			"country": "Canada",
			"formatted": "P.O. Box 279\nJordan Station, ON L0R 1S0\nCanada"
		},
		"meetingAddress": {
			"street": "2900 Fourth Avenue",
			"city": "Jordan",
			"state": "ON",
			"zip": "L0R 1S0",
			"country": "Canada",
			"formatted": "2900 Fourth Avenue\nJordan, ON L0R 1S0\nCanada"
		},
		"contact": {
			"ministers": [
				"Rev. Ryan Swale"
			],
			"phone": "(905) 562-8223",
			"fax": "",
			"email": "clerk@immanuelurc.com",
			"website": "www.immanuelurc.com"
		},
		"meetingInformation": "9:30 AM and 3:30 PM",
		"meetingDetails": "",
		"yearOrganized": "1992",
		"joinedUrcYear": "1995",
		"clerk": "Elder Doug Douma",
		"clerkEmail": "clerk@immanuelurc.com",
		"totalMembers": 441,
		"latitude": 43.144836,
		"longitude": -79.367981,
		"sourceColumns": {
			"primaryMinister": "Rev. Ryan Swale",
			"minister": "Rev. Ryan Swale",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186527",
		"position": [
			42.919259,
			-86.080637
		],
		"name": "Faith United Reformed Church of West Olive",
		"location": "Holland, Michigan",
		"link": "https://www.faithurc.net",
		"image": "",
		"classis": "Michigan",
		"mailingAddress": {
			"street": "8270 120th Ave.",
			"city": "West Olive",
			"state": "MI",
			"zip": "49460",
			"country": "United States",
			"formatted": "8270 120th Ave.\nWest Olive, MI 49460\nUnited States"
		},
		"meetingAddress": {
			"street": "8270 120th Ave.",
			"city": "Holland",
			"state": "MI",
			"zip": "49460",
			"country": "United States",
			"formatted": "8270 120th Ave.\nHolland, MI 49460\nUnited States"
		},
		"contact": {
			"ministers": [
				"Vacant"
			],
			"phone": "(616) 875-7533",
			"fax": "",
			"email": "faithurcclerk@gmail.com",
			"website": "www.faithurc.net"
		},
		"meetingInformation": "9:30 AM and 5:20 PM",
		"meetingDetails": "",
		"yearOrganized": "1994",
		"joinedUrcYear": "1997",
		"clerk": "Tony Gruppen (616) 318-8633",
		"clerkEmail": "faithurcclerk@gmail.com",
		"totalMembers": 258,
		"latitude": 42.919259,
		"longitude": -86.080637,
		"sourceColumns": {
			"primaryMinister": "Vacant, (616) 875-7533",
			"minister": "Vacant",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186576",
		"position": [
			43.772197,
			-79.66285
		],
		"name": "The Hope Centre of Toronto",
		"location": "Brampton, Ontario",
		"link": "https://www.hopecentrebrampton.com",
		"image": "",
		"classis": "Southwestern Ontario",
		"mailingAddress": {
			"street": "72 Stevenson Road",
			"city": "Etobicoke",
			"state": "ON",
			"zip": "M9V 3J5",
			"country": "Canada",
			"formatted": "72 Stevenson Road\nEtobicoke, ON M9V 3J5\nCanada"
		},
		"meetingAddress": {
			"street": "8999 The Gore Road",
			"city": "Brampton",
			"state": "ON",
			"zip": "M9V 3J5",
			"country": "Canada",
			"formatted": "8999 The Gore Road\nBrampton, ON M9V 3J5\nCanada"
		},
		"contact": {
			"ministers": [
				"Rev. Anthony Zekveld      (416) 740-0543"
			],
			"phone": "(416) 740-0543",
			"fax": "",
			"email": "hopebrampton@gmail.com",
			"website": "www.hopecentrebrampton.com"
		},
		"meetingInformation": "12:30 PM and 2:00 PM",
		"meetingDetails": "",
		"yearOrganized": "N/A",
		"joinedUrcYear": "2008",
		"clerk": "Bakhshish Gill",
		"clerkEmail": "hopebrampton@gmail.com",
		"totalMembers": 29,
		"latitude": 43.772197,
		"longitude": -79.66285,
		"sourceColumns": {
			"primaryMinister": "Rev. Anthony Zekveld",
			"minister": "Rev. Anthony Zekveld      (416) 740-0543",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186516",
		"position": [
			41.581642,
			-93.524971
		],
		"name": "Providence Reformed Church of Des Moines",
		"location": "Des Moines, Iowa",
		"link": "https://www.providenceRC.org",
		"image": "",
		"classis": "Central U.S.",
		"mailingAddress": {
			"street": "3400 E. Euclid Avenue, Unit C",
			"city": "Des Moines",
			"state": "IA",
			"zip": "50317",
			"country": "United States",
			"formatted": "3400 E. Euclid Avenue, Unit C\nDes Moines, IA 50317\nUnited States"
		},
		"meetingAddress": {
			"street": "3400 E. Euclid Avenue, Unit C",
			"city": "Des Moines",
			"state": "IA",
			"zip": "50317",
			"country": "United States",
			"formatted": "3400 E. Euclid Avenue, Unit C\nDes Moines, IA 50317\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Jody James Lucero"
			],
			"phone": "(515) 707-8022",
			"fax": "",
			"email": "ProvRefChurch@gmail.com",
			"website": "www.providenceRC.org"
		},
		"meetingInformation": "9:30 AM and 4:30 PM",
		"meetingDetails": "",
		"yearOrganized": "2007",
		"joinedUrcYear": "2007",
		"clerk": "Elder Ron Dorin",
		"clerkEmail": "ProvRefChurch@gmail.com",
		"totalMembers": 66,
		"latitude": 41.581642,
		"longitude": -93.524971,
		"sourceColumns": {
			"primaryMinister": "Rev. Jody James Lucero",
			"minister": "Rev. Jody James Lucero",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186501",
		"position": [
			34.518935,
			-117.211628
		],
		"name": "High Desert United Reformed Church of Apple Valley",
		"location": "Victorville, California",
		"link": "https://www.highdeserturc.org",
		"image": "",
		"classis": "Southwest U.S.",
		"mailingAddress": {
			"street": "P. O. Box 3418",
			"city": "Victorville",
			"state": "CA",
			"zip": "92395",
			"country": "United States",
			"formatted": "P. O. Box 3418\nVictorville, CA 92395\nUnited States"
		},
		"meetingAddress": {
			"street": "Community Building, 12975 Rolling Ridge Dr.",
			"city": "Victorville",
			"state": "CA",
			"zip": "92395",
			"country": "United States",
			"formatted": "Community Building, 12975 Rolling Ridge Dr.\nVictorville, CA 92395\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Tom Morrison"
			],
			"phone": "(760) 951-0809",
			"fax": "",
			"email": "pastor@highdeserturc.org",
			"website": "www.highdeserturc.org"
		},
		"meetingInformation": "10:00 AM and 11:45 AM",
		"meetingDetails": "",
		"yearOrganized": "2004",
		"joinedUrcYear": "2004",
		"clerk": "Joseph Velasco",
		"clerkEmail": "bombi95@hotmail.com",
		"totalMembers": 122,
		"latitude": 34.518935,
		"longitude": -117.211628,
		"sourceColumns": {
			"primaryMinister": "Rev. Thomas M. Morrison",
			"minister": "Rev. Tom Morrison",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186564",
		"position": [
			43.1849,
			-95.6468
		],
		"name": "Cornerstone United Reformed Church of Sanborn",
		"location": "Sanborn, Iowa",
		"link": "https://www.cornerstone-urc.org",
		"image": "",
		"classis": "Central U.S.",
		"mailingAddress": {
			"street": "P.O. Box 544",
			"city": "Sanborn",
			"state": "IA",
			"zip": "51248",
			"country": "United States",
			"formatted": "P.O. Box 544\nSanborn, IA 51248\nUnited States"
		},
		"meetingAddress": {
			"street": "805 Sunrise Ave.",
			"city": "Sanborn",
			"state": "IA",
			"zip": "51248",
			"country": "United States",
			"formatted": "805 Sunrise Ave.\nSanborn, IA 51248\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Dan Donovan",
				"Rev. Elijah Anderson"
			],
			"phone": "(712) 729-3266",
			"fax": "",
			"email": "sanborncurc@gmail.com",
			"website": "www.cornerstone-urc.org"
		},
		"meetingInformation": "9:30 AM and 5:00 PM",
		"meetingDetails": "(East edge of town)",
		"yearOrganized": "1994",
		"joinedUrcYear": "1995",
		"clerk": "Elder Don DeBoer (712) 441-2967",
		"clerkEmail": "clerk.sanborncurc@gmail.com",
		"totalMembers": 383,
		"latitude": 43.1849,
		"longitude": -95.6468,
		"sourceColumns": {
			"primaryMinister": "Rev. Dan Donovan",
			"minister": "Rev. Dan Donovan",
			"minister2": "Rev. Elijah Anderson"
		}
	},
	{
		"type": "church",
		"id": "186894",
		"position": [
			41.7225,
			-87.7557
		],
		"name": "First United Reformed Church of Oak Lawn",
		"location": "Oak Lawn, Illinois",
		"link": "https://www.oaklawnurc.org",
		"image": "",
		"classis": "Central U.S.",
		"mailingAddress": {
			"street": "9401 S 54th Ave.",
			"city": "Oak Lawn",
			"state": "IL",
			"zip": "60453",
			"country": "United States",
			"formatted": "9401 S 54th Ave.\nOak Lawn, IL 60453\nUnited States"
		},
		"meetingAddress": {
			"street": "9350 S 54th Ave.",
			"city": "Oak Lawn",
			"state": "IL",
			"zip": "60453",
			"country": "United States",
			"formatted": "9350 S 54th Ave.\nOak Lawn, IL 60453\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Harold Miller"
			],
			"phone": "(708) 636-0758",
			"fax": "",
			"email": "oaklawnurc@gmail.com",
			"website": "www.oaklawnurc.org"
		},
		"meetingInformation": "9:30 AM and 5:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1915",
		"joinedUrcYear": "2009",
		"clerk": "Bill Regnerus",
		"clerkEmail": "oaklawnurc@gmail.com",
		"totalMembers": 104,
		"latitude": 41.7225,
		"longitude": -87.7557,
		"sourceColumns": {
			"primaryMinister": "Rev Harold Miller",
			"minister": "Rev. Harold Miller",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186632",
		"position": [
			43.9152,
			-78.6822
		],
		"name": "Salem United Reformed Church of Bowmanville",
		"location": "Bowmanville, Ontario",
		"link": "https://www.salemurc.org",
		"image": "",
		"classis": "Ontario-East",
		"mailingAddress": {
			"street": "Box 321",
			"city": "Bowmanville",
			"state": "ON",
			"zip": "L1C3L1",
			"country": "Canada",
			"formatted": "Box 321\nBowmanville, ON L1C3L1\nCanada"
		},
		"meetingAddress": {
			"street": "2607 Concession Road 4",
			"city": "Bowmanville",
			"state": "ON",
			"zip": "L1C3L1",
			"country": "Canada",
			"formatted": "2607 Concession Road 4\nBowmanville, ON L1C3L1\nCanada"
		},
		"contact": {
			"ministers": [
				"Vacant"
			],
			"phone": "(905) 263-8333",
			"fax": "",
			"email": "clerk@salemurc.org",
			"website": "www.salemurc.org"
		},
		"meetingInformation": "10:00 AM and 3:00 PM",
		"meetingDetails": "1/4 mile West of Liberty St. on 4th Concession",
		"yearOrganized": "1982",
		"joinedUrcYear": "2008",
		"clerk": "Elder Paul Lawton",
		"clerkEmail": "clerk@salemurc.org",
		"totalMembers": 115,
		"latitude": 43.9152,
		"longitude": -78.6822,
		"sourceColumns": {
			"primaryMinister": "Vacant, (905) 926-1692",
			"minister": "Vacant",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186581",
		"position": [
			40.927392,
			-74.231164
		],
		"name": "Preakness Valley United Reformed Church of Wayne, NJ",
		"location": "Wayne, New Jersey",
		"link": "https://www.pvurc.org",
		"image": "",
		"classis": "Eastern U.S.",
		"mailingAddress": {
			"street": "480 Valley Rd.",
			"city": "Wayne",
			"state": "NJ",
			"zip": "7470",
			"country": "United States",
			"formatted": "480 Valley Rd.\nWayne, NJ 7470\nUnited States"
		},
		"meetingAddress": {
			"street": "480 Valley Rd",
			"city": "Wayne",
			"state": "NJ",
			"zip": "7470",
			"country": "United States",
			"formatted": "480 Valley Rd\nWayne, NJ 7470\nUnited States"
		},
		"contact": {
			"ministers": [
				"Vacant"
			],
			"phone": "(973) 628-1313",
			"fax": "",
			"email": "pvconsistory@gmail.com",
			"website": "www.pvurc.org"
		},
		"meetingInformation": "9:30 AM and 6:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1933",
		"joinedUrcYear": "1998",
		"clerk": "Christopher Sweerus",
		"clerkEmail": "pvconsistory@gmail.com",
		"totalMembers": 180,
		"latitude": 40.927392,
		"longitude": -74.231164,
		"sourceColumns": {
			"primaryMinister": "Vacant, (973) 628-1313",
			"minister": "Vacant",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "578623",
		"position": [
			43.480529,
			-81.191564
		],
		"name": "Hope URC of Mitchell",
		"location": "Mitchell, Ontario",
		"link": "",
		"image": "",
		"classis": "Southwestern Ontario",
		"mailingAddress": {
			"street": "862 Alice St.",
			"city": "Woodstock",
			"state": "ON",
			"zip": "N4S 2J6",
			"country": "Canada",
			"formatted": "862 Alice St.\nWoodstock, ON N4S 2J6\nCanada"
		},
		"meetingAddress": {
			"street": "160 Wellington Street",
			"city": "Mitchell",
			"state": "ON",
			"zip": "N4S 2J6",
			"country": "Canada",
			"formatted": "160 Wellington Street\nMitchell, ON N4S 2J6\nCanada"
		},
		"contact": {
			"ministers": [
				"Vacant (519) 274-5706"
			],
			"phone": "(519) 274-5706",
			"fax": "",
			"email": "art.boekee@bwfeed.ca",
			"website": ""
		},
		"meetingInformation": "9:30AM and 3:00PM",
		"meetingDetails": "West Perth Municipal Building.    -  - Note: Location subject to change. Call 519-274-5706 or 519-276-1888 before attending church to confirm location.",
		"yearOrganized": "N/A",
		"joinedUrcYear": "2023",
		"clerk": "Art Boekee",
		"clerkEmail": "art.boekee@bwfeed.ca",
		"totalMembers": "",
		"latitude": 43.480529,
		"longitude": -81.191564,
		"sourceColumns": {
			"primaryMinister": "Vacant, (519) 440-6166",
			"minister": "Vacant (519) 274-5706",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "287726",
		"position": [
			43.112811,
			-79.086482
		],
		"name": "River of Life Reformed Church of Niagara Falls",
		"location": "Niagara Falls, Ontario",
		"link": "https://www.riveroflifeniagarafalls.com/",
		"image": "",
		"classis": "Ontario-East",
		"mailingAddress": {
			"street": "4189 Stanley Avenue",
			"city": "Niagara Falls",
			"state": "ON",
			"zip": "L2E 4Z2",
			"country": "Canada",
			"formatted": "4189 Stanley Avenue\nNiagara Falls, ON L2E 4Z2\nCanada"
		},
		"meetingAddress": {
			"street": "4189 Stanley Avenue",
			"city": "Niagara Falls",
			"state": "ON",
			"zip": "L2E 4Z2",
			"country": "Canada",
			"formatted": "4189 Stanley Avenue\nNiagara Falls, ON L2E 4Z2\nCanada"
		},
		"contact": {
			"ministers": [
				"Rev. Richard Bultje"
			],
			"phone": "(905) 348-7424",
			"fax": "",
			"email": "rbultje@icloud.com",
			"website": "www.riveroflifeniagarafalls.com/"
		},
		"meetingInformation": "10:30 AM and 1:30 PM",
		"meetingDetails": "",
		"yearOrganized": "N/A",
		"joinedUrcYear": "2014",
		"clerk": "Contact Supervising Church",
		"clerkEmail": "clerk.wellandporturc@gmail.com",
		"totalMembers": 63,
		"latitude": 43.112811,
		"longitude": -79.086482,
		"sourceColumns": {
			"primaryMinister": "Rev. Richard Bultje",
			"minister": "Rev. Richard Bultje",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "215092",
		"position": [
			43.581288,
			-116.214342
		],
		"name": "Dayspring United Reformed Church of Boise",
		"location": "Boise, Idaho",
		"link": "https://www.dayspringboise.com",
		"image": "",
		"classis": "Pacific Northwest",
		"mailingAddress": {
			"street": "2323 S Vista Ave.",
			"city": "Boise",
			"state": "ID",
			"zip": "83705",
			"country": "United States",
			"formatted": "2323 S Vista Ave.\nBoise, ID 83705\nUnited States"
		},
		"meetingAddress": {
			"street": "2323 S Vista Ave.",
			"city": "Boise",
			"state": "ID",
			"zip": "83705",
			"country": "United States",
			"formatted": "2323 S Vista Ave.\nBoise, ID 83705\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Jonathan S. Van Hoogen (208) 484-3700"
			],
			"phone": "(208) 484-3700",
			"fax": "",
			"email": "church@dayspringboise.com",
			"website": "www.dayspringboise.com"
		},
		"meetingInformation": "10:00 A.M. and 6:00 P.M.",
		"meetingDetails": "",
		"yearOrganized": "2014",
		"joinedUrcYear": "2014",
		"clerk": "Mr. Fin Dorough",
		"clerkEmail": "fdorough@gmail.com",
		"totalMembers": 68,
		"latitude": 43.581288,
		"longitude": -116.214342,
		"sourceColumns": {
			"primaryMinister": "Rev. Jonathan S. Van Hoogen",
			"minister": "Rev. Jonathan S. Van Hoogen (208) 484-3700",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186554",
		"position": [
			35.579,
			-76.6797
		],
		"name": "Covenant United Reformed Church of Pantego",
		"location": "Pantego, North Carolina",
		"link": "https://www.covenanturc.org",
		"image": "",
		"classis": "Eastern U.S.",
		"mailingAddress": {
			"street": "P.O. Box 9",
			"city": "Pantego",
			"state": "NC",
			"zip": "27860",
			"country": "United States",
			"formatted": "P.O. Box 9\nPantego, NC 27860\nUnited States"
		},
		"meetingAddress": {
			"street": "24599 Highway 264 East",
			"city": "Pantego",
			"state": "NC",
			"zip": "27860",
			"country": "United States",
			"formatted": "24599 Highway 264 East\nPantego, NC 27860\nUnited States"
		},
		"contact": {
			"ministers": [
				"Vacant"
			],
			"phone": "(252) 935-2002",
			"fax": "",
			"email": "clerkcovenant@gmail.com",
			"website": "www.covenanturc.org"
		},
		"meetingInformation": "9:30 AM and 5:30 PM",
		"meetingDetails": "",
		"yearOrganized": "1998",
		"joinedUrcYear": "1998",
		"clerk": "Craig DeHoog",
		"clerkEmail": "clerkcovenant@gmail.com",
		"totalMembers": 185,
		"latitude": 35.579,
		"longitude": -76.6797,
		"sourceColumns": {
			"primaryMinister": "Vacant, (252) 943-4494",
			"minister": "Vacant",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "632400",
		"position": [
			33.441944,
			-112.445287
		],
		"name": "Inheritance URC of Goodyear AZ",
		"location": "Goodyear, Arizona",
		"link": "https://www.inheritanceurc.org",
		"image": "",
		"classis": "Southwest U.S.",
		"mailingAddress": {
			"street": "2002 E Missouri Ave",
			"city": "Phoenix",
			"state": "AZ",
			"zip": "85016",
			"country": "United States",
			"formatted": "2002 E Missouri Ave\nPhoenix, AZ 85016\nUnited States"
		},
		"meetingAddress": {
			"street": "418 S Citrus Rd",
			"city": "Goodyear",
			"state": "AZ",
			"zip": "85016",
			"country": "United States",
			"formatted": "418 S Citrus Rd\nGoodyear, AZ 85016\nUnited States"
		},
		"contact": {
			"ministers": [
				"Gavin Poe"
			],
			"phone": "(520) 709-8940",
			"fax": "",
			"email": "",
			"website": "www.inheritanceurc.org"
		},
		"meetingInformation": "11:00 AM and 5:30 PM",
		"meetingDetails": "",
		"yearOrganized": "N/A",
		"joinedUrcYear": "2025",
		"clerk": "Rev. Chris Smith",
		"clerkEmail": "clerk@phoenixurc.org",
		"totalMembers": "",
		"latitude": 33.441944,
		"longitude": -112.445287,
		"sourceColumns": {
			"primaryMinister": "Gavin Poe",
			"minister": "Gavin Poe",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186562",
		"position": [
			43.179559,
			-79.256304
		],
		"name": "Trinity United Reformed Church of St. Catharines",
		"location": "St. Catharines, Ontario",
		"link": "https://www.trinity-urc.org",
		"image": "",
		"classis": "Ontario-East",
		"mailingAddress": {
			"street": "99 Scott Street",
			"city": "St. Catharines",
			"state": "ON",
			"zip": "L2N 1G8",
			"country": "Canada",
			"formatted": "99 Scott Street\nSt. Catharines, ON L2N 1G8\nCanada"
		},
		"meetingAddress": {
			"street": "99 Scott Street",
			"city": "St. Catharines",
			"state": "ON",
			"zip": "L2N 1G8",
			"country": "Canada",
			"formatted": "99 Scott Street\nSt. Catharines, ON L2N 1G8\nCanada"
		},
		"contact": {
			"ministers": [
				"Rev. Daniel Hamstra",
				"Rev. Thabet Megaly"
			],
			"phone": "(905) 935-8322",
			"fax": "",
			"email": "info@trinity-urc.org",
			"website": "https://www.trinity-urc.org"
		},
		"meetingInformation": "9:30 AM and 3:30 PM",
		"meetingDetails": "",
		"yearOrganized": "1964",
		"joinedUrcYear": "1995",
		"clerk": "Jonathan Reitsma",
		"clerkEmail": "council.clerk@trinity-urc.org",
		"totalMembers": 457,
		"latitude": 43.179559,
		"longitude": -79.256304,
		"sourceColumns": {
			"primaryMinister": "Pastor Daniel Hamstra",
			"minister": "Rev. Daniel Hamstra",
			"minister2": "Rev. Thabet Megaly"
		}
	},
	{
		"type": "church",
		"id": "406463",
		"position": [
			45.63415,
			-122.53305
		],
		"name": "Peace United Reformed Church, Vancouver WA",
		"location": "Vancouver, Washington",
		"link": "https://www.peaceurc.com",
		"image": "",
		"classis": "Pacific Northwest",
		"mailingAddress": {
			"street": "P.O. Box 87494",
			"city": "Vancouver",
			"state": "WA",
			"zip": "98687",
			"country": "United States",
			"formatted": "P.O. Box 87494\nVancouver, WA 98687\nUnited States"
		},
		"meetingAddress": {
			"street": "5602 E. Mill Plain Blvd.",
			"city": "Vancouver",
			"state": "WA",
			"zip": "98687",
			"country": "United States",
			"formatted": "5602 E. Mill Plain Blvd.\nVancouver, WA 98687\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Chris Coleman"
			],
			"phone": "(360) 506-8318",
			"fax": "",
			"email": "chris@peaceurc.com",
			"website": "www.peaceurc.com"
		},
		"meetingInformation": "10:00 AM and 05:00 PM",
		"meetingDetails": "",
		"yearOrganized": "2024",
		"joinedUrcYear": "2019",
		"clerk": "Chris Coleman",
		"clerkEmail": "chrisafari@gmail.com",
		"totalMembers": 32,
		"latitude": 45.63415,
		"longitude": -122.53305,
		"sourceColumns": {
			"primaryMinister": "Rev. Chris Coleman",
			"minister": "Rev. Chris Coleman",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186499",
		"position": [
			42.8126,
			-85.4363
		],
		"name": "Grace United Reformed Church of Alto",
		"location": "Alto, Michigan",
		"link": "https://graceurcmi.com/",
		"image": "",
		"classis": "Michigan",
		"mailingAddress": {
			"street": "9255 84th St. SE",
			"city": "Alto",
			"state": "MI",
			"zip": "49302",
			"country": "United States",
			"formatted": "9255 84th St. SE\nAlto, MI 49302\nUnited States"
		},
		"meetingAddress": {
			"street": "9255 84th St. SE",
			"city": "Alto",
			"state": "MI",
			"zip": "49302",
			"country": "United States",
			"formatted": "9255 84th St. SE\nAlto, MI 49302\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Doug Barnes"
			],
			"phone": "(616) 891-8440",
			"fax": "",
			"email": "secretary@graceurcmi.com",
			"website": "https://graceurcmi.com/"
		},
		"meetingInformation": "9:30 AM and 5:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1994",
		"joinedUrcYear": "1997",
		"clerk": "Elder Marv Mingerink",
		"clerkEmail": "rev.doug.barnes@gmail.com",
		"totalMembers": 195,
		"latitude": 42.8126,
		"longitude": -85.4363,
		"sourceColumns": {
			"primaryMinister": "Rev. Doug Barnes",
			"minister": "Rev. Doug Barnes",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "340928",
		"position": [
			43.131381,
			-80.258398
		],
		"name": "Redeeming Grace Reformed Church of Brantford",
		"location": "Brantford, Ontario",
		"link": "https://www.redeeminggrace.ca",
		"image": "",
		"classis": "Southwestern Ontario",
		"mailingAddress": {
			"street": "66 Port Street",
			"city": "Brantford",
			"state": "ON",
			"zip": "N3S 1Y4",
			"country": "Canada",
			"formatted": "66 Port Street\nBrantford, ON N3S 1Y4\nCanada"
		},
		"meetingAddress": {
			"street": "66 Port Street",
			"city": "Brantford",
			"state": "ON",
			"zip": "N3S 1Y4",
			"country": "Canada",
			"formatted": "66 Port Street\nBrantford, ON N3S 1Y4\nCanada"
		},
		"contact": {
			"ministers": [
				"Vacant"
			],
			"phone": "(905) 818-3018",
			"fax": "",
			"email": "clerk@redeeminggrace.ca",
			"website": "www.redeeminggrace.ca"
		},
		"meetingInformation": "9:30 AM and 4:00 PM",
		"meetingDetails": "Redeeming Grace Reformed Church",
		"yearOrganized": "2018",
		"joinedUrcYear": "2018",
		"clerk": "Bruce Vermeulen",
		"clerkEmail": "clerk@redeeminggrace.ca",
		"totalMembers": 214,
		"latitude": 43.131381,
		"longitude": -80.258398,
		"sourceColumns": {
			"primaryMinister": "Vacant, (289) 527-2563",
			"minister": "Vacant",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186540",
		"position": [
			39.588612,
			-104.883073
		],
		"name": "Coram Deo United Reformed Church Centennial",
		"location": "Centennial, Colorado",
		"link": "https://www.coramdeourc.org",
		"image": "",
		"classis": "Southwest U.S.",
		"mailingAddress": {
			"street": "7076 S. Alton Way, Bldg B",
			"city": "Centennial",
			"state": "CO",
			"zip": "80112",
			"country": "United States",
			"formatted": "7076 S. Alton Way, Bldg B\nCentennial, CO 80112\nUnited States"
		},
		"meetingAddress": {
			"street": "7076 S. Alton Way, Bldg. B",
			"city": "Centennial",
			"state": "CO",
			"zip": "80112",
			"country": "United States",
			"formatted": "7076 S. Alton Way, Bldg. B\nCentennial, CO 80112\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Derrick Vander Meulen  (808) 631-9321"
			],
			"phone": "(303) 221-0610",
			"fax": "",
			"email": "derrickvandermeulen@gmail.com",
			"website": "www.coramdeourc.org"
		},
		"meetingInformation": "9:00 AM and 11:45 AM",
		"meetingDetails": "",
		"yearOrganized": "2003",
		"joinedUrcYear": "2007",
		"clerk": "Elder Steven Cahail",
		"clerkEmail": "clerk@coramdeourc.org",
		"totalMembers": 87,
		"latitude": 39.588612,
		"longitude": -104.883073,
		"sourceColumns": {
			"primaryMinister": "Rev. Derrick Vander Meulen",
			"minister": "Rev. Derrick Vander Meulen  (808) 631-9321",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186547",
		"position": [
			44.07199,
			-73.172635
		],
		"name": "New Haven United Reformed Church",
		"location": "New Haven, Vermont",
		"link": "https://www.nhurc.org",
		"image": "",
		"classis": "Eastern U.S.",
		"mailingAddress": {
			"street": "P.O. Box 9",
			"city": "New Haven",
			"state": "VT",
			"zip": "5472",
			"country": "United States",
			"formatted": "P.O. Box 9\nNew Haven, VT 5472\nUnited States"
		},
		"meetingAddress": {
			"street": "1660 Ethan Allen Highway - Route 7",
			"city": "New Haven",
			"state": "VT",
			"zip": "5472",
			"country": "United States",
			"formatted": "1660 Ethan Allen Highway - Route 7\nNew Haven, VT 5472\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Andrew S. Knott  (616) 437-9813"
			],
			"phone": "(802) 388-1345",
			"fax": "",
			"email": "newhavenvturc@gmail.com",
			"website": "www.nhurc.org"
		},
		"meetingInformation": "10:00AM  and 6:30 PM",
		"meetingDetails": "",
		"yearOrganized": "1997",
		"joinedUrcYear": "1997",
		"clerk": "Rev. Andrew Knott (616) 437-9813",
		"clerkEmail": "asknott870@gmail.com",
		"totalMembers": 192,
		"latitude": 44.07199,
		"longitude": -73.172635,
		"sourceColumns": {
			"primaryMinister": "Rev. Andrew S. Knott",
			"minister": "Rev. Andrew S. Knott  (616) 437-9813",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186548",
		"position": [
			41.056246,
			-74.759196
		],
		"name": "Grace Reformed Bible Church",
		"location": "Newton, New Jersey",
		"link": "https://www.newtoncov.org",
		"image": "",
		"classis": "Eastern U.S.",
		"mailingAddress": {
			"street": "PO Box 279",
			"city": "Newton",
			"state": "NJ",
			"zip": "07860-0279",
			"country": "United States",
			"formatted": "PO Box 279\nNewton, NJ 07860-0279\nUnited States"
		},
		"meetingAddress": {
			"street": "23 Thompson Street",
			"city": "Newton",
			"state": "NJ",
			"zip": "07860-0279",
			"country": "United States",
			"formatted": "23 Thompson Street\nNewton, NJ 07860-0279\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Aaron Verhoef"
			],
			"phone": "(973) 383-9635",
			"fax": "",
			"email": "pastorverhoef@gmail.com",
			"website": "www.newtoncov.org"
		},
		"meetingInformation": "9:30 AM and 10:30 AM",
		"meetingDetails": "",
		"yearOrganized": "1943",
		"joinedUrcYear": "1997",
		"clerk": "John Jackson",
		"clerkEmail": "newtonlt3403@yahoo.com",
		"totalMembers": 96,
		"latitude": 41.056246,
		"longitude": -74.759196,
		"sourceColumns": {
			"primaryMinister": "Rev. Aaron G.Verhoef",
			"minister": "Rev. Aaron Verhoef",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186515",
		"position": [
			41.1946,
			-87.1971
		],
		"name": "Immanuel United Reformed Church of DeMotte",
		"location": "DeMotte, Indiana",
		"link": "https://www.immanuelurcdemotte.org",
		"image": "",
		"classis": "Central U.S.",
		"mailingAddress": {
			"street": "9991 W. 1200 N.",
			"city": "DeMotte",
			"state": "IN",
			"zip": "46310",
			"country": "United States",
			"formatted": "9991 W. 1200 N.\nDeMotte, IN 46310\nUnited States"
		},
		"meetingAddress": {
			"street": "9991 W. 1200 N.",
			"city": "DeMotte",
			"state": "IN",
			"zip": "46310",
			"country": "United States",
			"formatted": "9991 W. 1200 N.\nDeMotte, IN 46310\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Joel Wories"
			],
			"phone": "(219) 987-6247",
			"fax": "",
			"email": "immanuelurcsecretary@gmail.com",
			"website": "www.immanuelurcdemotte.org"
		},
		"meetingInformation": "10:00 AM and 5:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1995",
		"joinedUrcYear": "1997",
		"clerk": "Rudy Tolkamp",
		"clerkEmail": "immanuelurcclerk@gmail.com",
		"totalMembers": 205,
		"latitude": 41.1946,
		"longitude": -87.1971,
		"sourceColumns": {
			"primaryMinister": "Rev. Joel Wories",
			"minister": "Rev. Joel Wories",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "403534",
		"position": [
			42.33295,
			-122.87536
		],
		"name": "Cornerstone Christian Church, Medford, OR",
		"location": "Medford, Oregon",
		"link": "https://cccm.org",
		"image": "",
		"classis": "Pacific Northwest",
		"mailingAddress": {
			"street": "608 North Bartlett Street",
			"city": "Medford",
			"state": "OR",
			"zip": "97501",
			"country": "United States",
			"formatted": "608 North Bartlett Street\nMedford, OR 97501\nUnited States"
		},
		"meetingAddress": {
			"street": "608 N. Bartlett Street",
			"city": "Medford",
			"state": "OR",
			"zip": "97501",
			"country": "United States",
			"formatted": "608 N. Bartlett Street\nMedford, OR 97501\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Brad Lenzner",
				"Rev. Mark Delladio"
			],
			"phone": "(541) 773-8163",
			"fax": "",
			"email": "churchinfo@cccm.org",
			"website": "cccm.org"
		},
		"meetingInformation": "10:00 AM and 05:30 PM",
		"meetingDetails": "Parking and the main entrance are accessed from Pine St. and Maple St.",
		"yearOrganized": "1979",
		"joinedUrcYear": "2019",
		"clerk": "Deacon Rod Smith",
		"clerkEmail": "churchinfo@cccm.org",
		"totalMembers": 163,
		"latitude": 42.33295,
		"longitude": -122.87536,
		"sourceColumns": {
			"primaryMinister": "Rev. Brad Lenzner",
			"minister": "Rev. Brad Lenzner",
			"minister2": "Rev. Mark Delladio"
		}
	},
	{
		"type": "church",
		"id": "186565",
		"position": [
			32.8549,
			-116.972
		],
		"name": "Christ United Reformed Church, Santee CA",
		"location": "Santee, California",
		"link": "https://www.christurc.org",
		"image": "",
		"classis": "Southwest U.S.",
		"mailingAddress": {
			"street": "10333 Mast Blvd.",
			"city": "Santee",
			"state": "CA",
			"zip": "92071",
			"country": "United States",
			"formatted": "10333 Mast Blvd.\nSantee, CA 92071\nUnited States"
		},
		"meetingAddress": {
			"street": "10333 Mast Blvd.",
			"city": "Santee",
			"state": "CA",
			"zip": "92071",
			"country": "United States",
			"formatted": "10333 Mast Blvd.\nSantee, CA 92071\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. William C. Godfrey  (760) 807-0897"
			],
			"phone": "(619) 258-8500",
			"fax": "",
			"email": "clerk@christurc.org",
			"website": "www.christurc.org"
		},
		"meetingInformation": "9:30 AM and 6:00 PM",
		"meetingDetails": "",
		"yearOrganized": "2006",
		"joinedUrcYear": "2006",
		"clerk": "Elder James Villarino",
		"clerkEmail": "clerk@christurc.org",
		"totalMembers": 256,
		"latitude": 32.8549,
		"longitude": -116.972,
		"sourceColumns": {
			"primaryMinister": "Rev. William Godfrey",
			"minister": "Rev. William C. Godfrey  (760) 807-0897",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "581485",
		"position": [
			33.827949,
			-117.879973
		],
		"name": "Covenant Chinese Reformed Church Anaheim",
		"location": "Anaheim, California",
		"link": "https://www.ccreformed.org",
		"image": "",
		"classis": "Southwest U.S.",
		"mailingAddress": {
			"street": "PO Box 6287",
			"city": "Anaheim",
			"state": "CA",
			"zip": "92816-9998",
			"country": "United States",
			"formatted": "PO Box 6287\nAnaheim, CA 92816-9998\nUnited States"
		},
		"meetingAddress": {
			"street": "900 South Sunkist Street",
			"city": "Anaheim",
			"state": "CA",
			"zip": "92816-9998",
			"country": "United States",
			"formatted": "900 South Sunkist Street\nAnaheim, CA 92816-9998\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Yi Wang"
			],
			"phone": "(714) 538-1057",
			"fax": "",
			"email": "info@ccreformed.org",
			"website": "www.ccreformed.org"
		},
		"meetingInformation": "10:00AM and 12:00PM",
		"meetingDetails": "",
		"yearOrganized": "2026",
		"joinedUrcYear": "2019",
		"clerk": "Timothy Sun",
		"clerkEmail": "clerk@ccreformed.org",
		"totalMembers": "",
		"latitude": 33.827949,
		"longitude": -117.879973,
		"sourceColumns": {
			"primaryMinister": "Rev. Yi Wang",
			"minister": "Rev. Yi Wang",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186561",
		"position": [
			43.2164,
			-96.3012
		],
		"name": "Rock Valley United Reformed Church",
		"location": "Rock Valley, Iowa",
		"link": "https://www.rockvalleyurc.com",
		"image": "",
		"classis": "Central U.S.",
		"mailingAddress": {
			"street": "2485 300th St.",
			"city": "Rock Valley",
			"state": "IA",
			"zip": "51247",
			"country": "United States",
			"formatted": "2485 300th St.\nRock Valley, IA 51247\nUnited States"
		},
		"meetingAddress": {
			"street": "2485 300th St.",
			"city": "Rock Valley",
			"state": "IA",
			"zip": "51247",
			"country": "United States",
			"formatted": "2485 300th St.\nRock Valley, IA 51247\nUnited States"
		},
		"contact": {
			"ministers": [
				"Vacant"
			],
			"phone": "(712) 476-6050",
			"fax": "",
			"email": "clerk.rvurc@gmail.com",
			"website": "www.rockvalleyurc.com"
		},
		"meetingInformation": "9:30 AM and 6:00 PM",
		"meetingDetails": "",
		"yearOrganized": "2006",
		"joinedUrcYear": "2006",
		"clerk": "Elder Loren Kooiman (712) 470-1414",
		"clerkEmail": "clerk.rvurc@gmail.com",
		"totalMembers": 61,
		"latitude": 43.2164,
		"longitude": -96.3012,
		"sourceColumns": {
			"primaryMinister": "Vacant, (712) 476-6050",
			"minister": "Vacant",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186531",
		"position": [
			42.2547,
			-85.5704
		],
		"name": "Covenant United Reformed Church of Kalamazoo",
		"location": "Kalamazoo, Michigan",
		"link": "https://www.covenant-urc.org",
		"image": "",
		"classis": "Michigan",
		"mailingAddress": {
			"street": "3724 Lovers Lane",
			"city": "Kalamazoo",
			"state": "MI",
			"zip": "49001",
			"country": "United States",
			"formatted": "3724 Lovers Lane\nKalamazoo, MI 49001\nUnited States"
		},
		"meetingAddress": {
			"street": "3724 Lovers Lane",
			"city": "Kalamazoo",
			"state": "MI",
			"zip": "49001",
			"country": "United States",
			"formatted": "3724 Lovers Lane\nKalamazoo, MI 49001\nUnited States"
		},
		"contact": {
			"ministers": [
				"Chris Engelsma"
			],
			"phone": "(616) 259-0172",
			"fax": "",
			"email": "christopher.engelsma@tutamail.com",
			"website": "www.covenant-urc.org"
		},
		"meetingInformation": "9:30 AM and 5:30 PM",
		"meetingDetails": "",
		"yearOrganized": "1993",
		"joinedUrcYear": "1995",
		"clerk": "Marty Horjus",
		"clerkEmail": "christopher.engelsma@tutamail.com",
		"totalMembers": 121,
		"latitude": 42.2547,
		"longitude": -85.5704,
		"sourceColumns": {
			"primaryMinister": "Rev. Chris Engelsma",
			"minister": "Chris Engelsma",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186529",
		"position": [
			42.919722,
			-85.809098
		],
		"name": "Bethel United Reformed Church of Jenison",
		"location": "Jenison, Michigan",
		"link": "https://www.BethelJenison.com",
		"image": "",
		"classis": "Michigan",
		"mailingAddress": {
			"street": "8360 Cottonwood Dr.",
			"city": "Jenison",
			"state": "MI",
			"zip": "49428-9319",
			"country": "United States",
			"formatted": "8360 Cottonwood Dr.\nJenison, MI 49428-9319\nUnited States"
		},
		"meetingAddress": {
			"street": "8360 Cottonwood Dr.",
			"city": "Jenison",
			"state": "MI",
			"zip": "49428-9319",
			"country": "United States",
			"formatted": "8360 Cottonwood Dr.\nJenison, MI 49428-9319\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Wm. Jason Tuinstra (616) 717-1377",
				"Rev. Steve Postma (616) 457-4001 Ext. 3"
			],
			"phone": "(616) 457-4001",
			"fax": "",
			"email": "BethelJenison@gmail.com",
			"website": "www.BethelJenison.com"
		},
		"meetingInformation": "9:30 AM and 4:30 PM",
		"meetingDetails": "",
		"yearOrganized": "1995",
		"joinedUrcYear": "1996",
		"clerk": "Steve Postma",
		"clerkEmail": "sjpostma@gmail.com",
		"totalMembers": 370,
		"latitude": 42.919722,
		"longitude": -85.809098,
		"sourceColumns": {
			"primaryMinister": "Rev. Wm. Jason Tuinstra",
			"minister": "Rev. Wm. Jason Tuinstra (616) 717-1377",
			"minister2": "Rev. Steve Postma (616) 457-4001 Ext. 3"
		}
	},
	{
		"type": "church",
		"id": "186498",
		"position": [
			49.1204,
			-122.254
		],
		"name": "Immanuel Covenant Reformed Church of Abbotsford",
		"location": "Abbotsford, British Columbia",
		"link": "https://www.abbotsfordurc.org",
		"image": "",
		"classis": "Western Canada",
		"mailingAddress": {
			"street": "P.O Box 344",
			"city": "Abbotsford",
			"state": "BC",
			"zip": "V2T 6Z6",
			"country": "Canada",
			"formatted": "P.O Box 344\nAbbotsford, BC V2T 6Z6\nCanada"
		},
		"meetingAddress": {
			"street": "35063 Page Road",
			"city": "Abbotsford",
			"state": "BC",
			"zip": "V2T 6Z6",
			"country": "Canada",
			"formatted": "35063 Page Road\nAbbotsford, BC V2T 6Z6\nCanada"
		},
		"contact": {
			"ministers": [
				"Rev. Aaron van der Heiden"
			],
			"phone": "(604) 826-8854",
			"fax": "",
			"email": "abbotsfordurc@gmail.com",
			"website": "www.abbotsfordurc.org"
		},
		"meetingInformation": "10:00 AM and 3:30 PM",
		"meetingDetails": "",
		"yearOrganized": "1994",
		"joinedUrcYear": "2000",
		"clerk": "Rick Meyer (778) 548-4838",
		"clerkEmail": "abbotsfordurc@gmail.com",
		"totalMembers": 263,
		"latitude": 49.1204,
		"longitude": -122.254,
		"sourceColumns": {
			"primaryMinister": "Rev. Aaron van der Heiden",
			"minister": "Rev. Aaron van der Heiden",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186522",
		"position": [
			33.152881,
			-117.090941
		],
		"name": "Escondido United Reformed Church",
		"location": "Escondido, California",
		"link": "https://www.escondidourc.org",
		"image": "",
		"classis": "Southwest U.S.",
		"mailingAddress": {
			"street": "1864 N. Broadway",
			"city": "Escondido",
			"state": "CA",
			"zip": "92026",
			"country": "United States",
			"formatted": "1864 N. Broadway\nEscondido, CA 92026\nUnited States"
		},
		"meetingAddress": {
			"street": "1864 N. Broadway",
			"city": "Escondido",
			"state": "CA",
			"zip": "92026",
			"country": "United States",
			"formatted": "1864 N. Broadway\nEscondido, CA 92026\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Christopher J. Gordon (760) 745-2735",
				"Rev. Angelo Contreras (209) 968-8861"
			],
			"phone": "(760) 745-1679",
			"fax": "",
			"email": "office@escondidourc.org",
			"website": "www.escondidourc.org"
		},
		"meetingInformation": "9:30 AM and 5:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1954",
		"joinedUrcYear": "1997",
		"clerk": "Mark Dirksen (909) 437-5445",
		"clerkEmail": "mark.dirksen@escondidourc.org",
		"totalMembers": 524,
		"latitude": 33.152881,
		"longitude": -117.090941,
		"sourceColumns": {
			"primaryMinister": "Rev. Christopher Gordon",
			"minister": "Rev. Christopher J. Gordon (760) 745-2735",
			"minister2": "Rev. Angelo Contreras (209) 968-8861"
		}
	},
	{
		"type": "church",
		"id": "403763",
		"position": [
			40.973426909943,
			-75.25028672331
		],
		"name": "Pocono Reformed Bible Church",
		"location": "Stroudsburg, Pennsylvania",
		"link": "https://www.poconoreformedbiblechurch.com",
		"image": "",
		"classis": "Eastern U.S.",
		"mailingAddress": {
			"street": "13530 Spruce Cabin Road",
			"city": "Cresco",
			"state": "PA",
			"zip": "18326",
			"country": "United States",
			"formatted": "13530 Spruce Cabin Road\nCresco, PA 18326\nUnited States"
		},
		"meetingAddress": {
			"street": "7164 Business Route 209",
			"city": "Stroudsburg",
			"state": "PA",
			"zip": "18326",
			"country": "United States",
			"formatted": "7164 Business Route 209\nStroudsburg, PA 18326\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Nicholas L. Costanzo"
			],
			"phone": "(570) 994-9494",
			"fax": "",
			"email": "ncostanzoprbc@gmail.com",
			"website": "www.poconoreformedbiblechurch.com"
		},
		"meetingInformation": "10:00 AM",
		"meetingDetails": "While WE MAY BE MOVING SHORTLY, our current worship space is located in the lower level of the Wilkins Better Homes and Gardens Business Campus which is just minutes from Route 80 and near the traffic light at the intersection of Business Route 209 and Shafers School House Road.",
		"yearOrganized": "2023",
		"joinedUrcYear": "2019",
		"clerk": "Elder Tim Malefyt",
		"clerkEmail": "tjmalefyt@yahoo.com",
		"totalMembers": "N/A",
		"latitude": 40.973426909943,
		"longitude": -75.25028672331,
		"sourceColumns": {
			"primaryMinister": "Rev. Richard J. Kuiken",
			"minister": "Rev. Nicholas L. Costanzo",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186520",
		"position": [
			41.436575,
			-87.438336
		],
		"name": "Redeemer United Reformed Church, St. John, IN",
		"location": "Saint John, Indiana",
		"link": "https://www.redeemerurc.com",
		"image": "",
		"classis": "Central U.S.",
		"mailingAddress": {
			"street": "10681 Park PL",
			"city": "Saint John",
			"state": "IN",
			"zip": "46373",
			"country": "United States",
			"formatted": "10681 Park PL\nSaint John, IN 46373\nUnited States"
		},
		"meetingAddress": {
			"street": "10681 Park Place",
			"city": "Saint John",
			"state": "IN",
			"zip": "46373",
			"country": "United States",
			"formatted": "10681 Park Place\nSaint John, IN 46373\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Steve Swets"
			],
			"phone": "(708) 935-6283",
			"fax": "",
			"email": "Secretary@redeemerurc.com",
			"website": "www.redeemerurc.com"
		},
		"meetingInformation": "9:00 AM and 5:00 PM",
		"meetingDetails": "",
		"yearOrganized": "2005",
		"joinedUrcYear": "2006",
		"clerk": "Ryan Knoll",
		"clerkEmail": "clerk@redeemerurc.com",
		"totalMembers": 262,
		"latitude": 41.436575,
		"longitude": -87.438336,
		"sourceColumns": {
			"primaryMinister": "Rev. Steve Swets",
			"minister": "Rev. Steve Swets",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186585",
		"position": [
			49.972091,
			-97.059081
		],
		"name": "Providence Reformed Church of Winnipeg",
		"location": "East St Paul, Manitoba",
		"link": "https://www.providencereformed.net",
		"image": "",
		"classis": "Western Canada",
		"mailingAddress": {
			"street": "P.O.Box 28044 RPO North Kildonan",
			"city": "Winnipeg",
			"state": "MB",
			"zip": "R2G 4E9",
			"country": "Canada",
			"formatted": "P.O.Box 28044 RPO North Kildonan\nWinnipeg, MB R2G 4E9\nCanada"
		},
		"meetingAddress": {
			"street": "2615 Henderson Hwy",
			"city": "East St Paul",
			"state": "MB",
			"zip": "R2G 4E9",
			"country": "Canada",
			"formatted": "2615 Henderson Hwy\nEast St Paul, MB R2G 4E9\nCanada"
		},
		"contact": {
			"ministers": [
				"Rev. Richard Anjema"
			],
			"phone": "(204) 654-1729",
			"fax": "",
			"email": "clerk@providencereformed.net",
			"website": "www.providencereformed.net"
		},
		"meetingInformation": "9:30 AM and 4:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1991",
		"joinedUrcYear": "1996",
		"clerk": "Elder Mark Hordyk",
		"clerkEmail": "clerk@providencereformed.net",
		"totalMembers": 288,
		"latitude": 49.972091,
		"longitude": -97.059081,
		"sourceColumns": {
			"primaryMinister": "Rev. Richard Anjema",
			"minister": "Rev. Richard Anjema",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "502326",
		"position": [
			61.099398519343,
			-149.8523573766
		],
		"name": "Redeemer United Reformed Church, Anchorage, AK",
		"location": "Anchorage, Alaska",
		"link": "http://www.akredeemer.org/",
		"image": "",
		"classis": "Pacific Northwest",
		"mailingAddress": {
			"street": "1612 Ocean View Dr",
			"city": "Anchorage",
			"state": "AK",
			"zip": "99515",
			"country": "United States",
			"formatted": "1612 Ocean View Dr\nAnchorage, AK 99515\nUnited States"
		},
		"meetingAddress": {
			"street": "1612 Ocean View Dr",
			"city": "Anchorage",
			"state": "AK",
			"zip": "99515",
			"country": "United States",
			"formatted": "1612 Ocean View Dr\nAnchorage, AK 99515\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Joseph V�radi"
			],
			"phone": "(907) 317-9635",
			"fax": "",
			"email": "info@akredeemer.org",
			"website": "http://www.akredeemer.org/"
		},
		"meetingInformation": "12:30 PM and 2:30 PM",
		"meetingDetails": "The church building is owned by a local Lutheran church Christ Our Savior Lutheran Church",
		"yearOrganized": "2011",
		"joinedUrcYear": "2022",
		"clerk": "Alex Troll",
		"clerkEmail": "atrollak@gmail.com",
		"totalMembers": 32,
		"latitude": 61.099398519343,
		"longitude": -149.8523573766,
		"sourceColumns": {
			"primaryMinister": "Rev. Joseph V�radi",
			"minister": "Rev. Joseph V�radi",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186542",
		"position": [
			40.3786,
			-105.132
		],
		"name": "Calvary United Reformed Church, Loveland",
		"location": "Loveland, Colorado",
		"link": "https://calvaryurc.org",
		"image": "",
		"classis": "Southwest U.S.",
		"mailingAddress": {
			"street": "3901 14th St. S.W.",
			"city": "Loveland",
			"state": "CO",
			"zip": "80537",
			"country": "United States",
			"formatted": "3901 14th St. S.W.\nLoveland, CO 80537\nUnited States"
		},
		"meetingAddress": {
			"street": "3901 14th St. S.W.",
			"city": "Loveland",
			"state": "CO",
			"zip": "80537",
			"country": "United States",
			"formatted": "3901 14th St. S.W.\nLoveland, CO 80537\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Brian Vos (616) 260-0208"
			],
			"phone": "(970) 667-0603",
			"fax": "",
			"email": "office@calvaryurc.org",
			"website": "https://calvaryurc.org"
		},
		"meetingInformation": "10:00 AM and 6:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1979",
		"joinedUrcYear": "1997",
		"clerk": "Elder Dan Mattson",
		"clerkEmail": "daniel.lee.mattson@gmail.com",
		"totalMembers": 117,
		"latitude": 40.3786,
		"longitude": -105.132,
		"sourceColumns": {
			"primaryMinister": "Rev. Brian Vos",
			"minister": "Rev. Brian Vos (616) 260-0208",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "189684",
		"position": [
			36.8075,
			-119.73608
		],
		"name": "Covenant United Reformed Church of Fresno",
		"location": "Fresno, California",
		"link": "https://www.fresnourc.com",
		"image": "",
		"classis": "Pacific Northwest",
		"mailingAddress": {
			"street": "2775 E. Shaw Ave.",
			"city": "Fresno",
			"state": "CA",
			"zip": "93710",
			"country": "United States",
			"formatted": "2775 E. Shaw Ave.\nFresno, CA 93710\nUnited States"
		},
		"meetingAddress": {
			"street": "2775 E. Shaw Ave.",
			"city": "Fresno",
			"state": "CA",
			"zip": "93710",
			"country": "United States",
			"formatted": "2775 E. Shaw Ave.\nFresno, CA 93710\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. David Inks"
			],
			"phone": "(559) 276-7382",
			"fax": "",
			"email": "westminsteropc@comcast.net",
			"website": "www.fresnourc.com"
		},
		"meetingInformation": "9:30 AM and 11:00 AM",
		"meetingDetails": "We are located behind (or south of) Doghouse Grill across the street from Save Mart Center.",
		"yearOrganized": "1999",
		"joinedUrcYear": "1999",
		"clerk": "Elder Vladimir Mikulesku",
		"clerkEmail": "mikulesku@gmail.com",
		"totalMembers": 58,
		"latitude": 36.8075,
		"longitude": -119.73608,
		"sourceColumns": {
			"primaryMinister": "Rev. David W. Inks",
			"minister": "Rev. David Inks",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186555",
		"position": [
			34.144473,
			-118.039779
		],
		"name": "Pasadena United Reformed Church",
		"location": "South Pasadena, California",
		"link": "https://www.pasadenaurc.org",
		"image": "",
		"classis": "Southwest U.S.",
		"mailingAddress": {
			"street": "P.O. Box 1737",
			"city": "Monrovia",
			"state": "CA",
			"zip": "91017",
			"country": "United States",
			"formatted": "P.O. Box 1737\nMonrovia, CA 91017\nUnited States"
		},
		"meetingAddress": {
			"street": "1515 Garfield Ave",
			"city": "South Pasadena",
			"state": "CA",
			"zip": "91017",
			"country": "United States",
			"formatted": "1515 Garfield Ave\nSouth Pasadena, CA 91017\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Movses S. Janbazian   (626) 437-4944",
				"Rev. Adam Kaloostian"
			],
			"phone": "(626) 437-4944",
			"fax": "",
			"email": "mjanbazian@verizon.net",
			"website": "www.pasadenaurc.org"
		},
		"meetingInformation": "9:30 AM and 11:10 AM",
		"meetingDetails": "Catechism Service 9:30 in Modular Room - Regular Service 11:10 in Main Sanctuary - Youth Catechism 10:45 in Room 1",
		"yearOrganized": "2001",
		"joinedUrcYear": "2001",
		"clerk": "Rev Adam Kaloostian",
		"clerkEmail": "adam.kaloostian@venturareformed.org",
		"totalMembers": 97,
		"latitude": 34.144473,
		"longitude": -118.039779,
		"sourceColumns": {
			"primaryMinister": "Rev. Movses S. Janbazian",
			"minister": "Rev. Movses S. Janbazian   (626) 437-4944",
			"minister2": "Rev. Adam Kaloostian"
		}
	},
	{
		"type": "church",
		"id": "186546",
		"position": [
			54.121687,
			-114.420608
		],
		"name": "Emmanuel Reformed Church of Neerlandia",
		"location": "Barrhead, Alberta",
		"link": "https://www.emmanuelurc.org",
		"image": "",
		"classis": "Western Canada",
		"mailingAddress": {
			"street": "Box 4641, STN Main",
			"city": "Barrhead",
			"state": "AB",
			"zip": "T7N 1A5",
			"country": "Canada",
			"formatted": "Box 4641, STN Main\nBarrhead, AB T7N 1A5\nCanada"
		},
		"meetingAddress": {
			"street": "5102 60th Street",
			"city": "Barrhead",
			"state": "AB",
			"zip": "T7N 1A5",
			"country": "Canada",
			"formatted": "5102 60th Street\nBarrhead, AB T7N 1A5\nCanada"
		},
		"contact": {
			"ministers": [
				"Pastor Matthew Van der Woerd"
			],
			"phone": "(250) 877-8302",
			"fax": "",
			"email": "neerlandiaurc@xplornet.com",
			"website": "www.emmanuelurc.org"
		},
		"meetingInformation": "11:00 AM and 1:00 PM",
		"meetingDetails": "located at 5102-60th Street in Barrhead.",
		"yearOrganized": "1992",
		"joinedUrcYear": "1995",
		"clerk": "Mr. Jan Harink",
		"clerkEmail": "neerlandiaurc@xplornet.com",
		"totalMembers": 155,
		"latitude": 54.121687,
		"longitude": -114.420608,
		"sourceColumns": {
			"primaryMinister": "Pastor Matthew Van de Woerd",
			"minister": "Pastor Matthew Van der Woerd",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186528",
		"position": [
			42.88617,
			-85.86978
		],
		"name": "Cornerstone United Reformed Church of Hudsonville",
		"location": "Hudsonville, Michigan",
		"link": "https://www.cornerstoneurc.com",
		"image": "",
		"classis": "Michigan",
		"mailingAddress": {
			"street": "6442 36th Avenue",
			"city": "Hudsonville",
			"state": "MI",
			"zip": "49426",
			"country": "United States",
			"formatted": "6442 36th Avenue\nHudsonville, MI 49426\nUnited States"
		},
		"meetingAddress": {
			"street": "6442 36th Ave.",
			"city": "Hudsonville",
			"state": "MI",
			"zip": "49426",
			"country": "United States",
			"formatted": "6442 36th Ave.\nHudsonville, MI 49426\nUnited States"
		},
		"contact": {
			"ministers": [
				"Vacant: Call accepted by Rev. Greg Lubbers",
				"Dr. Jared Poulton"
			],
			"phone": "(616) 669-2190",
			"fax": "",
			"email": "office@cornerstoneurc.com",
			"website": "www.cornerstoneurc.com"
		},
		"meetingInformation": "9:30 AM and 5:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1987",
		"joinedUrcYear": "1995",
		"clerk": "Gerald Nuiver 616-889-3089",
		"clerkEmail": "office@cornerstoneurc.com",
		"totalMembers": 451,
		"latitude": 42.88617,
		"longitude": -85.86978,
		"sourceColumns": {
			"primaryMinister": "Vacant, (616) 669-2190",
			"minister": "Vacant: Call accepted by Rev. Greg Lubbers",
			"minister2": "Dr. Jared Poulton"
		}
	},
	{
		"type": "church",
		"id": "186559",
		"position": [
			52.609302,
			-113.633774
		],
		"name": "Parkland United Reformed Church of Ponoka",
		"location": "Ponoka, Alberta",
		"link": "https://www.parklandurc.org",
		"image": "",
		"classis": "Western Canada",
		"mailingAddress": {
			"street": "P.O. Box 4066",
			"city": "Ponoka",
			"state": "AB",
			"zip": "T4J 1R5",
			"country": "Canada",
			"formatted": "P.O. Box 4066\nPonoka, AB T4J 1R5\nCanada"
		},
		"meetingAddress": {
			"street": ".",
			"city": "Ponoka",
			"state": "AB",
			"zip": "T4J 1R5",
			"country": "Canada",
			"formatted": ".\nPonoka, AB T4J 1R5\nCanada"
		},
		"contact": {
			"ministers": [
				"Rev James Folkerts"
			],
			"phone": "(403) 783-1888",
			"fax": "",
			"email": "clerk@parklandurc.org",
			"website": "www.parklandurc.org"
		},
		"meetingInformation": "10:00 AM and 2:30 PM",
		"meetingDetails": "4.5 miles South of Ponoka on Hwy 2A          1/4 miles West on Spruce Road",
		"yearOrganized": "1993",
		"joinedUrcYear": "1996",
		"clerk": "Elder Peter Bevaart (403) 358-9985",
		"clerkEmail": "clerk@parklandurc.org",
		"totalMembers": 309,
		"latitude": 52.609302,
		"longitude": -113.633774,
		"sourceColumns": {
			"primaryMinister": "Rev. James Folkerts",
			"minister": "Rev James Folkerts",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186545",
		"position": [
			43.58995,
			-116.646759
		],
		"name": "Christ Reformed Church of Nampa",
		"location": "Nampa, Idaho",
		"link": "https://www.christreformednampa.org",
		"image": "",
		"classis": "Pacific Northwest",
		"mailingAddress": {
			"street": "12693 Orchard Ave.",
			"city": "Nampa",
			"state": "ID",
			"zip": "83651",
			"country": "United States",
			"formatted": "12693 Orchard Ave.\nNampa, ID 83651\nUnited States"
		},
		"meetingAddress": {
			"street": "12693 Orchard Ave.",
			"city": "Nampa",
			"state": "ID",
			"zip": "83651",
			"country": "United States",
			"formatted": "12693 Orchard Ave.\nNampa, ID 83651\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Nick Smith (208) 466-4444"
			],
			"phone": "(208) 466-4444",
			"fax": "",
			"email": "office@christreformednampa.org",
			"website": "www.christreformednampa.org"
		},
		"meetingInformation": "10:15 AM and 5:00 PM",
		"meetingDetails": "",
		"yearOrganized": "2002",
		"joinedUrcYear": "2002",
		"clerk": "Elder Ernest DeGroot (208) 989-5408",
		"clerkEmail": "clerk@christreformednampa.org",
		"totalMembers": 285,
		"latitude": 43.58995,
		"longitude": -116.646759,
		"sourceColumns": {
			"primaryMinister": "Rev. Nick Smith",
			"minister": "Rev. Nick Smith (208) 466-4444",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186539",
		"position": [
			43.7318,
			-80.9538
		],
		"name": "Immanuel United Reformed Church of Listowel",
		"location": "Listowel, Ontario",
		"link": "https://www.urclistowel.com",
		"image": "",
		"classis": "Southwestern Ontario",
		"mailingAddress": {
			"street": "P.O. Box 55",
			"city": "Listowel",
			"state": "ON",
			"zip": "N4W 3H2",
			"country": "Canada",
			"formatted": "P.O. Box 55\nListowel, ON N4W 3H2\nCanada"
		},
		"meetingAddress": {
			"street": "750 Davidson Avenue North",
			"city": "Listowel",
			"state": "ON",
			"zip": "N4W 3H2",
			"country": "Canada",
			"formatted": "750 Davidson Avenue North\nListowel, ON N4W 3H2\nCanada"
		},
		"contact": {
			"ministers": [
				"Vacant"
			],
			"phone": "(519) 291-6286",
			"fax": "",
			"email": "consistoryclerk@urclistowel.com",
			"website": "www.urclistowel.com"
		},
		"meetingInformation": "10:00 am and 2:30 pm",
		"meetingDetails": "",
		"yearOrganized": "2002",
		"joinedUrcYear": "2002",
		"clerk": "Elder Joel Kidd (289)991-2809",
		"clerkEmail": "consistoryclerk@urclistowel.com",
		"totalMembers": 84,
		"latitude": 43.7318,
		"longitude": -80.9538,
		"sourceColumns": {
			"primaryMinister": "Vacant, (519) 998-1025",
			"minister": "Vacant",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "523812",
		"position": [
			49.785711618506,
			-112.1459532018
		],
		"name": "Taber United Reformed Church",
		"location": "Taber, Alberta",
		"link": "https://Taberurc.com",
		"image": "",
		"classis": "Western Canada",
		"mailingAddress": {
			"street": "4619-56 Avenue",
			"city": "Taber, Alberta",
			"state": "AB",
			"zip": "T1G 1G8",
			"country": "Canada",
			"formatted": "4619-56 Avenue\nTaber, Alberta, AB T1G 1G8\nCanada"
		},
		"meetingAddress": {
			"street": "4619-56 Avenue",
			"city": "Taber",
			"state": "AB",
			"zip": "T1G 1G8",
			"country": "Canada",
			"formatted": "4619-56 Avenue\nTaber, AB T1G 1G8\nCanada"
		},
		"contact": {
			"ministers": [
				"Rev. Barry Beukema"
			],
			"phone": "(825) 967-7057",
			"fax": "",
			"email": "taberurc@gmail.com",
			"website": "Taberurc.com"
		},
		"meetingInformation": "10:30 AM and 2:00 PM",
		"meetingDetails": "",
		"yearOrganized": "2022",
		"joinedUrcYear": "2022",
		"clerk": "Mathys Pastink",
		"clerkEmail": "Clerktaberurc@gmail.com",
		"totalMembers": 64,
		"latitude": 49.785711618506,
		"longitude": -112.1459532018,
		"sourceColumns": {
			"primaryMinister": "Rev Barry Beukema",
			"minister": "Rev. Barry Beukema",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186511",
		"position": [
			51.0651,
			-114.234
		],
		"name": "Bethel United Reformed Church of Calgary",
		"location": "Calgary, Alberta",
		"link": "https://www.bethelurc.org",
		"image": "",
		"classis": "Western Canada",
		"mailingAddress": {
			"street": "730 - 101 St. SW",
			"city": "Calgary",
			"state": "AB",
			"zip": "T3H 3Z5",
			"country": "Canada",
			"formatted": "730 - 101 St. SW\nCalgary, AB T3H 3Z5\nCanada"
		},
		"meetingAddress": {
			"street": "730 - 101 St. SW",
			"city": "Calgary",
			"state": "AB",
			"zip": "T3H 3Z5",
			"country": "Canada",
			"formatted": "730 - 101 St. SW\nCalgary, AB T3H 3Z5\nCanada"
		},
		"contact": {
			"ministers": [
				"Rev. Keith Davis (403) 973-3877"
			],
			"phone": "(403) 249-9971",
			"fax": "",
			"email": "office@bethelurc.org",
			"website": "www.bethelurc.org"
		},
		"meetingInformation": "9:30 AM and 5:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1992",
		"joinedUrcYear": "1995",
		"clerk": "Elder Kevin Pasveer (403) 470-7275",
		"clerkEmail": "clerk@bethelurc.org",
		"totalMembers": 376,
		"latitude": 51.0651,
		"longitude": -114.234,
		"sourceColumns": {
			"primaryMinister": "Rev. Keith W. Davis",
			"minister": "Rev. Keith Davis (403) 973-3877",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186525",
		"position": [
			43.2086,
			-79.9284
		],
		"name": "Rehoboth United Reformed Church of Hamilton ON",
		"location": "Ancaster, Ontario",
		"link": "https://www.rehobothurc.ca",
		"image": "",
		"classis": "Southwestern Ontario",
		"mailingAddress": {
			"street": "77 Glancaster Rd.",
			"city": "Ancaster",
			"state": "ON",
			"zip": "L9G 3K9",
			"country": "Canada",
			"formatted": "77 Glancaster Rd.\nAncaster, ON L9G 3K9\nCanada"
		},
		"meetingAddress": {
			"street": "77 Glancaster Rd.",
			"city": "Ancaster",
			"state": "ON",
			"zip": "L9G 3K9",
			"country": "Canada",
			"formatted": "77 Glancaster Rd.\nAncaster, ON L9G 3K9\nCanada"
		},
		"contact": {
			"ministers": [
				"Vacant",
				"Rev. Jeremy Veldman (905) 574-5527"
			],
			"phone": "(905) 574-5527",
			"fax": "",
			"email": "rurcsecretary@gmail.com",
			"website": "www.rehobothurc.ca"
		},
		"meetingInformation": "10:00 AM and 4:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1992",
		"joinedUrcYear": "1995",
		"clerk": "Charlie Fluit",
		"clerkEmail": "correspondingclerk@gmail.com",
		"totalMembers": 303,
		"latitude": 43.2086,
		"longitude": -79.9284,
		"sourceColumns": {
			"primaryMinister": "Rev. Jeremy Veldman",
			"minister": "Vacant",
			"minister2": "Rev. Jeremy Veldman (905) 574-5527"
		}
	},
	{
		"type": "church",
		"id": "186569",
		"position": [
			43.533935,
			-96.722035
		],
		"name": "Christ Reformed Church Sioux Falls",
		"location": "Sioux Falls, South Dakota",
		"link": "https://www.ChristReformedSF.org",
		"image": "",
		"classis": "Central U.S.",
		"mailingAddress": {
			"street": "400 E. 41st St",
			"city": "Sioux Falls",
			"state": "SD",
			"zip": "57105",
			"country": "United States",
			"formatted": "400 E. 41st St\nSioux Falls, SD 57105\nUnited States"
		},
		"meetingAddress": {
			"street": "400 E. 41st St",
			"city": "Sioux Falls",
			"state": "SD",
			"zip": "57105",
			"country": "United States",
			"formatted": "400 E. 41st St\nSioux Falls, SD 57105\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Joseph Hamm"
			],
			"phone": "(605) 330-0271",
			"fax": "",
			"email": "info@christreformedsf.org",
			"website": "www.ChristReformedSF.org"
		},
		"meetingInformation": "10:00 AM and 5:00 PM",
		"meetingDetails": "",
		"yearOrganized": "2016",
		"joinedUrcYear": "2016",
		"clerk": "Elder Adam Sturlaugson",
		"clerkEmail": "clerk@christreformedsf.org",
		"totalMembers": 161,
		"latitude": 43.533935,
		"longitude": -96.722035,
		"sourceColumns": {
			"primaryMinister": "Rev. Joseph Hamm",
			"minister": "Rev. Joseph Hamm",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "187975",
		"position": [
			43.173756,
			-79.394539
		],
		"name": "Adoration United Reformed Church of Vineland",
		"location": "Vineland Station, Ontario",
		"link": "https://www.adorationurc.ca",
		"image": "",
		"classis": "Ontario-East",
		"mailingAddress": {
			"street": "4402 Victoria Ave",
			"city": "Vineland Station",
			"state": "ON",
			"zip": "L0R 2E0",
			"country": "Canada",
			"formatted": "4402 Victoria Ave\nVineland Station, ON L0R 2E0\nCanada"
		},
		"meetingAddress": {
			"street": "4402 Victoria Ave",
			"city": "Vineland Station",
			"state": "ON",
			"zip": "L0R 2E0",
			"country": "Canada",
			"formatted": "4402 Victoria Ave\nVineland Station, ON L0R 2E0\nCanada"
		},
		"contact": {
			"ministers": [
				"Rev. Bryce De Zwarte"
			],
			"phone": "(905) 380-0914",
			"fax": "",
			"email": "clerk@adorationurc.ca",
			"website": "www.adorationurc.ca"
		},
		"meetingInformation": "9:30 AM and 3:30 PM",
		"meetingDetails": "",
		"yearOrganized": "2011",
		"joinedUrcYear": "2011",
		"clerk": "David Vuyk",
		"clerkEmail": "clerk@adorationurc.ca",
		"totalMembers": 243,
		"latitude": 43.173756,
		"longitude": -79.394539,
		"sourceColumns": {
			"primaryMinister": "Rev. Bryce De Zwarte",
			"minister": "Rev. Bryce De Zwarte",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186521",
		"position": [
			53.5676,
			-113.489
		],
		"name": "Cornerstone United Reformed Church of Edmonton",
		"location": "Edmonton, Alberta",
		"link": "https://www.cornerstoneurcedmonton.com",
		"image": "",
		"classis": "Western Canada",
		"mailingAddress": {
			"street": "11610 - 95A St.",
			"city": "Edmonton",
			"state": "AB",
			"zip": "T5G 1P8",
			"country": "Canada",
			"formatted": "11610 - 95A St.\nEdmonton, AB T5G 1P8\nCanada"
		},
		"meetingAddress": {
			"street": "11610 - 95A St. NW",
			"city": "Edmonton",
			"state": "AB",
			"zip": "T5G 1P8",
			"country": "Canada",
			"formatted": "11610 - 95A St. NW\nEdmonton, AB T5G 1P8\nCanada"
		},
		"contact": {
			"ministers": [
				"Rev. Jeremy Vander Lei"
			],
			"phone": "(780) 474-5091",
			"fax": "",
			"email": "clerk@cornerstoneurcedmonton.com",
			"website": "www.cornerstoneurcedmonton.com"
		},
		"meetingInformation": "10:00 AM and 4:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1989",
		"joinedUrcYear": "1995",
		"clerk": "Elder Reuben DeBoer",
		"clerkEmail": "clerk@cornerstoneurcedmonton.com",
		"totalMembers": 384,
		"latitude": 53.5676,
		"longitude": -113.489,
		"sourceColumns": {
			"primaryMinister": "Rev. Jeremy Vander Lei",
			"minister": "Rev. Jeremy Vander Lei",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186591",
		"position": [
			46.359104,
			-63.272331
		],
		"name": "United Reformed Church of PEI",
		"location": "Ebenezer, Prince Edward Island",
		"link": "https://www.peiurc.org",
		"image": "",
		"classis": "Ontario-East",
		"mailingAddress": {
			"street": "29 Donald Drive",
			"city": "Charlottetown",
			"state": "PE",
			"zip": "C1E 1Z5",
			"country": "Canada",
			"formatted": "29 Donald Drive\nCharlottetown, PE C1E 1Z5\nCanada"
		},
		"meetingAddress": {
			"street": "1191 New Glasgow Road",
			"city": "Ebenezer",
			"state": "PE",
			"zip": "C1E 1Z5",
			"country": "Canada",
			"formatted": "1191 New Glasgow Road\nEbenezer, PE C1E 1Z5\nCanada"
		},
		"contact": {
			"ministers": [
				"Rev. Maurice Luimes, Interim"
			],
			"phone": "(902) 629-1755",
			"fax": "",
			"email": "peiurc@yahoo.com",
			"website": "www.peiurc.org"
		},
		"meetingInformation": "11:00 AM and 6:00 PM",
		"meetingDetails": "Beginning on June 28, 2026, Sunday worship services will be at 11:00 am and 6:00 pm at the New Glasgow Road Presbyterian Church located at 1191 New Glasgow Road, Ebenezer, PE, C1E 0T2.",
		"yearOrganized": "2007",
		"joinedUrcYear": "2009",
		"clerk": "Solke De Boer",
		"clerkEmail": "solkedb@hotmail.com",
		"totalMembers": 79,
		"latitude": 46.359104,
		"longitude": -63.272331,
		"sourceColumns": {
			"primaryMinister": "Rev. Maurice Luimes-interim (905) 531-7998",
			"minister": "Rev. Maurice Luimes, Interim",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "681475",
		"position": [
			44.992129,
			-93.348488
		],
		"name": "Redeemer Reformed Church, Golden Valley, MN",
		"location": "Golden Valley, Minnesota",
		"link": "https://redeemerreformed.org/",
		"image": "",
		"classis": "Central U.S.",
		"mailingAddress": {
			"street": "1300 Lilac Dr N",
			"city": "Golden Valley",
			"state": "MN",
			"zip": "55422",
			"country": "United States",
			"formatted": "1300 Lilac Dr N\nGolden Valley, MN 55422\nUnited States"
		},
		"meetingAddress": {
			"street": "1300 Lilac Dr N",
			"city": "Golden Valley",
			"state": "MN",
			"zip": "55422",
			"country": "United States",
			"formatted": "1300 Lilac Dr N\nGolden Valley, MN 55422\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Caleb Janson"
			],
			"phone": "(218) 316-4409",
			"fax": "",
			"email": "pastor@redeemerreformed.org",
			"website": "https://redeemerreformed.org/"
		},
		"meetingInformation": "10:15 AM and 5:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1998",
		"joinedUrcYear": "2026",
		"clerk": "Rob Kangas",
		"clerkEmail": "clerk@redeemerreformed.org",
		"totalMembers": "",
		"latitude": 44.992129,
		"longitude": -93.348488,
		"sourceColumns": {
			"primaryMinister": "Rev. Caleb Janson",
			"minister": "Rev. Caleb Janson",
			"minister2": ""
		}
	},
	{
		"type": "church",
		"id": "186558",
		"position": [
			40.9642,
			-74.2951
		],
		"name": "Pompton Plains Reformed Bible Church Pompton Plains",
		"location": "Pompton Plains, New Jersey",
		"link": "https://www.pprbc.org",
		"image": "",
		"classis": "Eastern U.S.",
		"mailingAddress": {
			"street": "415 Boulevard",
			"city": "Pompton Plains",
			"state": "NJ",
			"zip": "7444",
			"country": "United States",
			"formatted": "415 Boulevard\nPompton Plains, NJ 7444\nUnited States"
		},
		"meetingAddress": {
			"street": "415 Boulevard",
			"city": "Pompton Plains",
			"state": "NJ",
			"zip": "7444",
			"country": "United States",
			"formatted": "415 Boulevard\nPompton Plains, NJ 7444\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Justin D. Nobel",
				"Rev. Israel Quaresma"
			],
			"phone": "(973) 835-4784",
			"fax": "",
			"email": "office@pprbc.org",
			"website": "www.pprbc.org"
		},
		"meetingInformation": "9:30 AM and 5:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1955",
		"joinedUrcYear": "1995",
		"clerk": "Elder Robert Woudenberg",
		"clerkEmail": "clerk@pprbc.org",
		"totalMembers": 388,
		"latitude": 40.9642,
		"longitude": -74.2951,
		"sourceColumns": {
			"primaryMinister": "Rev. Justin Nobel",
			"minister": "Rev. Justin D. Nobel",
			"minister2": "Rev. Israel Quaresma"
		}
	},
	{
		"type": "church",
		"id": "186634",
		"position": [
			36.3129,
			-119.365
		],
		"name": "Trinity URC, Visalia",
		"location": "Visalia, California",
		"link": "https://www.trinityurcvisalia.com",
		"image": "",
		"classis": "Pacific Northwest",
		"mailingAddress": {
			"street": "6400 W Walnut Ave",
			"city": "Visalia",
			"state": "CA",
			"zip": "93277",
			"country": "United States",
			"formatted": "6400 W Walnut Ave\nVisalia, CA 93277\nUnited States"
		},
		"meetingAddress": {
			"street": "6400 W Walnut Ave",
			"city": "Visalia",
			"state": "CA",
			"zip": "93277",
			"country": "United States",
			"formatted": "6400 W Walnut Ave\nVisalia, CA 93277\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Jacques Roets (219) 718-3809",
				"Rev. John Kirby (707) 694-7643"
			],
			"phone": "(559) 636-2540",
			"fax": "",
			"email": "office@trinityurcvisalia.org",
			"website": "www.trinityurcvisalia.com"
		},
		"meetingInformation": "9:30 AM and 6:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1990",
		"joinedUrcYear": "2008",
		"clerk": "Elder Jake Soerens (559) 802-2179",
		"clerkEmail": "clerk@trinityurcvisalia.org",
		"totalMembers": 559,
		"latitude": 36.3129,
		"longitude": -119.365,
		"sourceColumns": {
			"primaryMinister": "Rev. Jacques Roets",
			"minister": "Rev. Jacques Roets (219) 718-3809",
			"minister2": "Rev. John Kirby (707) 694-7643"
		}
	},
	{
		"type": "church",
		"id": "186568",
		"position": [
			43.3246,
			-80.2048
		],
		"name": "Zion United Reformed Church of Sheffield",
		"location": "Sheffield, Ontario",
		"link": "https://www.zurch.ca",
		"image": "",
		"classis": "Southwestern Ontario",
		"mailingAddress": {
			"street": "1238 Old Hwy 8",
			"city": "Sheffield",
			"state": "ON",
			"zip": "L0R 1Z0",
			"country": "Canada",
			"formatted": "1238 Old Hwy 8\nSheffield, ON L0R 1Z0\nCanada"
		},
		"meetingAddress": {
			"street": "1238 Old Hwy 8",
			"city": "Sheffield",
			"state": "ON",
			"zip": "L0R 1Z0",
			"country": "Canada",
			"formatted": "1238 Old Hwy 8\nSheffield, ON L0R 1Z0\nCanada"
		},
		"contact": {
			"ministers": [
				"Rev. Al Bezuyen"
			],
			"phone": "(519) 624-9416",
			"fax": "",
			"email": "zionadmin@zurch.ca",
			"website": "www.zurch.ca"
		},
		"meetingInformation": "9:30 AM and 3:00 PM",
		"meetingDetails": "",
		"yearOrganized": "1991",
		"joinedUrcYear": "1995",
		"clerk": "Elder Tim Westerveld (519) 998-2355",
		"clerkEmail": "clerk@zurch.ca",
		"totalMembers": 329,
		"latitude": 43.3246,
		"longitude": -80.2048,
		"sourceColumns": {
			"primaryMinister": "Rev. Al Bezuyen",
			"minister": "Rev. Al Bezuyen",
			"minister2": ""
		}
	},
	{
		"type": "foreign",
		"position": [
			9.9281,
			-84.0907
		],
		"name": "Bill & Aletha Green",
		"location": "San Jose, Costa Rica",
		"link": "https://www.urcnamissions.org/foreign-missions/san-jose",
		"image": "https://static.wixstatic.com/media/e5dbaa_61a7ae35801e4d15a05f65c7b4b5aefd~mv2.jpg"
	},
	{
		"type": "foreign",
		"position": [
			-0.1807,
			-78.4678
		],
		"name": "Rev. Pablo Landazuri",
		"location": "Quito, Ecuador",
		"link": "https://www.urcnamissions.org/foreign-missions/quito",
		"image": "https://static.wixstatic.com/media/e5dbaa_91606edc1a004c72a55bc27f93227b13~mv2.jpg"
	},
	{
		"type": "foreign",
		"position": [
			0.3265,
			-79.462
		],
		"name": "Josh & Michelle Vogel",
		"location": "Quinindé, Ecuador",
		"link": "https://www.urcnamissions.org/foreign-missions/quininde",
		"image": "https://static.wixstatic.com/media/e5dbaa_23b840fdce754d049b47601cd3cf34f9~mv2.png"
	},
	{
		"type": "foreign",
		"position": [
			14.4514,
			-87.6375
		],
		"name": "Rev. Ernie Langendoen",
		"location": "Comayagua, Honduras",
		"link": "https://www.urcnamissions.org/foreign-missions/comayagua",
		"image": "https://static.wixstatic.com/media/e5dbaa_189a0829a29b4531b64770542554d812~mv2.png"
	},
	{
		"type": "foreign",
		"position": [
			45.4642,
			9.19
		],
		"name": "Rev. Michael Brown",
		"location": "Milan, Italy",
		"link": "https://www.urcnamissions.org/foreign-missions/milan",
		"image": "https://static.wixstatic.com/media/e5dbaa_c0e56d64ed0749c18921eaad35a8cba1~mv2.jpeg"
	},
	{
		"type": "foreign",
		"position": [
			43.1107,
			12.3908
		],
		"name": "Rev. Andrea Ferrari",
		"location": "Perugia, Italy",
		"link": "https://www.urcnamissions.org/foreign-missions/perugia",
		"image": "https://static.wixstatic.com/media/e5dbaa_585e78aa41b744f9aa8d990d0c24c364~mv2.jpg"
	},
	{
		"type": "foreign",
		"position": [
			21.5083,
			-104.8946
		],
		"name": "Rev. Matt Van Dyken",
		"location": "Tepic, Mexico",
		"link": "https://www.urcnamissions.org/foreign-missions/tepic",
		"image": "https://static.wixstatic.com/media/e5dbaa_e50ef0d75f1a4989a3727eecae62d425~mv2.png"
	},
	{
		"type": "foreign",
		"position": [
			44.4268,
			26.1025
		],
		"name": "Rev. Mihai Corcea",
		"location": "Bucharest, Romania",
		"link": "https://www.urcnamissions.org/foreign-missions/bucharest",
		"image": "https://static.wixstatic.com/media/e5dbaa_0a19d5fbdac44fd6ba7ca050dbd5aa70~mv2.jpg"
	},
	{
		"type": "foreign",
		"position": [
			38.4237,
			27.1428
		],
		"name": "Rev. Cagdas Coskun",
		"location": "Izmir, Turkey",
		"link": "https://www.urcnamissions.org/foreign-missions/izmir",
		"image": "https://static.wixstatic.com/media/e5dbaa_8299b81b8c034858a14570496d1067cd~mv2.png"
	},
	{
		"type": "prison",
		"position": [
			25.6364345,
			-80.3107892
		],
		"name": "MINTS International Seminary",
		"location": "Miami, USA/ Worldwide",
		"link": "https://www.urcnamissions.org/foreign-missions/mints",
		"image": "https://static.wixstatic.com/media/e5dbaa_168d2625ec5643ef9384920d8d449366~mv2.png"
	},
	{
		"type": "prison",
		"position": [
			41.7075,
			-86.895
		],
		"name": "Divine Hope Reformed Bible Seminary",
		"location": "Illinois and Indiana, USA",
		"link": "https://www.urcnamissions.org/domestic-missions/divine-hope-reformed-bible-seminary",
		"image": "https://static.wixstatic.com/media/e5dbaa_0e5c7207d15b44e498e8b589d6311a7f~mv2.png"
	},
	{
		"type": "prison",
		"position": [
			52.4682,
			-113.7366
		],
		"name": "Redemption Prison Ministry",
		"location": "Lacombe, Canada",
		"link": "https://www.urcnamissions.org/home-missions/redemption-prison",
		"image": "https://static.wixstatic.com/media/e5dbaa_70d0116e3ac44c799c0d520287c1f2de~mv2.png"
	},
	{
		"type": "home",
		"position": [
			39.7684,
			-86.1581
		],
		"name": "Rev. Austin Reifel",
		"location": "Indianapolis, USA",
		"link": "https://www.urcnamissions.org/home-missions/rev-austin-reifel",
		"image": "https://static.wixstatic.com/media/e5dbaa_fade2a173ed74e3a997668688814ef50~mv2.png"
	},
	{
		"type": "home",
		"position": [
			37.705,
			-92.1236
		],
		"name": "Rev. Andrew Spriensma",
		"location": "Fort Leonard Wood, USA",
		"link": "https://www.urcnamissions.org/domestic-missions/rev.-andrew-spriensma",
		"image": "https://static.wixstatic.com/media/e5dbaa_7dbcca80fe7043d6b90e293968e8813f~mv2.png"
	},
	{
		"type": "home",
		"position": [
			43.8509,
			-79.0204
		],
		"name": "Rev. Brian Zegers",
		"location": "Ajax, Canada",
		"link": "https://www.urcnamissions.org/home-missions/rev-brian-zegers",
		"image": "https://static.wixstatic.com/media/e5dbaa_3ff8febcc90a4df39b42b54a2eae1cb8~mv2.jpg"
	},
	{
		"type": "home",
		"position": [
			47.328,
			-122.5808
		],
		"name": "Rev. Caleb Janson",
		"location": "Gig Harbor, USA",
		"link": "https://www.urcnamissions.org/home-missions/rev-caleb-janson",
		"image": "https://static.wixstatic.com/media/e5dbaa_e45a512584984d79b615e38d4b23f8af~mv2.png"
	},
	{
		"type": "home",
		"position": [
			45.6387,
			-122.6615
		],
		"name": "Rev. Chris Coleman",
		"location": "Vancouver, USA",
		"link": "https://www.urcnamissions.org/home-missions/rev-chris-coleman",
		"image": "https://static.wixstatic.com/media/e5dbaa_117dda6ea6df499893c7f14b31f72248~mv2.png"
	},
	{
		"type": "home",
		"position": [
			38.7359,
			-85.3794
		],
		"name": "Rev. Collin Welch",
		"location": "Madison, USA",
		"link": "https://www.urcnamissions.org/home-missions/rev-collin-welch",
		"image": "https://static.wixstatic.com/media/e5dbaa_b5a400a03dc2410f94c8a367345ebc20~mv2.jpg"
	},
	{
		"type": "home",
		"position": [
			43.7765,
			-79.2318
		],
		"name": "Rev. Mitch Persaud",
		"location": "Scarborough, Canada",
		"link": "https://www.urcnamissions.org/home-missions/rev-mitch-persaud",
		"image": "https://static.wixstatic.com/media/e5dbaa_4b93f7f4111a4558a1ea69079dc444fa~mv2.png"
	},
	{
		"type": "home",
		"position": [
			41.5933,
			-120.1869
		],
		"name": "Rev. Nollie Malabuyo",
		"location": "Big Springs, USA",
		"link": "https://www.urcnamissions.org/home-missions/rev-nollie-malabuyo",
		"image": "https://static.wixstatic.com/media/e5dbaa_1e51ab0c533841ea935a177f01418e7e~mv2.png"
	},
	{
		"type": "home",
		"position": [
			43.0896,
			-79.0849
		],
		"name": "Rev. Rich Bultje",
		"location": "Niagara Falls, Canada",
		"link": "https://www.urcnamissions.org/home-missions/rev-rich-bultje",
		"image": "https://static.wixstatic.com/media/e5dbaa_114e0cb83ab24b5291876b8bf2556237~mv2.jpeg"
	},
	{
		"type": "home",
		"position": [
			34.0633,
			-117.6509
		],
		"name": "Rev. Taylor Kern",
		"location": "Ontario, USA",
		"link": "https://www.urcnamissions.org/home-missions/rev-taylor-kern",
		"image": "https://static.wixstatic.com/media/e5dbaa_33290e9c6ab7482caac4cae107c48f93~mv2.png"
	},
	{
		"type": "home",
		"position": [
			43.1594,
			-79.2469
		],
		"name": "Rev. Thabet",
		"location": "St. Catharines, Canada",
		"link": "https://www.urcnamissions.org/home-missions/rev-thabet",
		"image": "https://static.wixstatic.com/media/e5dbaa_28712984e37442c5837155c70316ddf5~mv2.png"
	},
	{
		"type": "home",
		"position": [
			43.651,
			-79.347
		],
		"name": "Rev. Tony Zekveld",
		"location": "Toronto, Canada",
		"link": "https://www.urcnamissions.org/home-missions/rev-tony-zekveld",
		"image": "https://static.wixstatic.com/media/e5dbaa_39121872a2084ac8ae69e2215a18c052~mv2.jpeg"
	},
	{
		"type": "home",
		"position": [
			33.8366,
			-117.9143
		],
		"name": "Rev. Yi Wang",
		"location": "Anaheim, USA",
		"link": "https://www.urcnamissions.org/home-missions/rev-yi-wang",
		"image": "https://static.wixstatic.com/media/e5dbaa_76ce2feada58444a8dabd817b29cfa1a~mv2.jpeg"
	}
];

const typeLabels = {
	church: 'Churches',
	'church-plant': 'Church Plants',
	foreign: 'Foreign Missions',
	home: 'Home Missions',
	prison: 'Ministries',
};

const infoBubbleLabels = {
	foreign: 'Foreign',
	home: 'Home',
	prison: 'Ministries',
};

const normalize = (value) => value.toLowerCase().trim();

const markerKey = (marker) => marker.id ? `${marker.type}-${marker.id}` : `${marker.type}-${marker.name}-${marker.location}`;

const wrappedMarkerKey = (marker) => `${markerKey(marker)}-${marker.wrapOffset ?? 0}`;

const getRegion = (location) => {
	const parts = location.split(',').map((part) => part.trim()).filter(Boolean);
	return parts.length > 1 ? parts[parts.length - 1] : '';
};

const getCountry = (marker) => marker.meetingAddress?.country || marker.mailingAddress?.country || '';

const isDisplayMarker = (marker) => marker.name !== '.' && marker.location !== '.';

const CLUSTER_RADIUS = 42;
const MIN_CLUSTER_RADIUS = 4;
const SPREAD_CLUSTER_ZOOM = 13;
const SPREAD_MARKER_RADIUS = 22;

const markerSearchText = (marker) => [
	marker.name,
	marker.location,
	typeLabels[marker.type],
	getCountry(marker),
	getRegion(marker.location),
	marker.classis,
	marker.meetingInformation,
	marker.mailingAddress?.formatted,
	marker.meetingAddress?.formatted,
	marker.contact?.ministers?.join(' '),
	marker.contact?.phone,
	marker.contact?.email,
	marker.contact?.website,
	marker.meetingDetails,
	marker.yearOrganized,
	marker.joinedUrcYear,
	marker.clerk,
	marker.clerkEmail,
	marker.totalMembers?.toString(),
].filter(Boolean).join(' ');

const createSearchHit = (marker) => ({
	...marker,
	objectID: markerKey(marker),
	typeLabel: typeLabels[marker.type] ?? marker.type,
	country: getCountry(marker),
	region: getRegion(marker.location),
	searchText: normalize(markerSearchText(marker)),
});

const readFacetFilters = (facetFilters = []) => {
	const refinements = {};
	const filters = Array.isArray(facetFilters) ? facetFilters.flat() : [facetFilters];

	for (const filter of filters) {
		if (typeof filter !== 'string') continue;
		const separator = filter.indexOf(':');
		if (separator === -1) continue;

		const attribute = filter.slice(0, separator);
		const value = filter.slice(separator + 1);
		refinements[attribute] = refinements[attribute] ?? new Set();
		refinements[attribute].add(value);
	}

	return refinements;
};

const matchesRefinements = (hit, refinements, ignoredAttribute = '') => {
	return Object.entries(refinements).every(([attribute, values]) => {
		if (attribute === ignoredAttribute) return true;
		if (values.size === 0) return true;
		return values.has(String(hit[attribute] ?? ''));
	});
};

const facetCounts = (hits, attribute) => {
	return hits.reduce((facets, hit) => {
		const value = hit[attribute];
		if (!value) return facets;

		facets[value] = (facets[value] ?? 0) + 1;
		return facets;
	}, {});
};

const createLocalSearchClient = (hits) => ({
	search(requests) {
		return Promise.resolve({
			results: requests.map(({ params = {} }) => {
				const query = normalize(params.query ?? '');
				const refinements = readFacetFilters(params.facetFilters);
				const page = Number(params.page ?? 0);
				const hitsPerPage = Number(params.hitsPerPage ?? 500);
				const searchedHits = hits.filter((hit) => {
					const matchesQuery = !query || hit.searchText.includes(query);

					return matchesQuery && matchesRefinements(hit, refinements);
				});
				const facetHits = (attribute) => hits.filter((hit) => {
					const matchesQuery = !query || hit.searchText.includes(query);

					return matchesQuery && matchesRefinements(hit, refinements, attribute);
				});
				const offset = page * hitsPerPage;

				return {
					hits: searchedHits.slice(offset, offset + hitsPerPage),
					nbHits: searchedHits.length,
					page,
					nbPages: Math.max(1, Math.ceil(searchedHits.length / hitsPerPage)),
					hitsPerPage,
					processingTimeMS: 0,
					query: params.query ?? '',
					params: '',
					facets: {
						type: facetCounts(facetHits('type'), 'type'),
						country: facetCounts(facetHits('country'), 'country'),
						region: facetCounts(facetHits('region'), 'region'),
						classis: facetCounts(facetHits('classis'), 'classis'),
					},
				};
			}),
		});
	},
	searchForFacetValues() {
		return Promise.resolve([]);
	},
});

const SearchInput = ({ total, onInteraction, onReset }) => {
	const { query, refine } = useSearchBox();
	const { results } = useInstantSearch();
	const { refine: clearRefinements, canRefine } = useClearRefinements();
	const canClear = canRefine || query.length > 0;
	const resultCount = results?.nbHits ?? total;

	return (
		<label className="map-searchbox input input-sm w-full">
			<svg className="map-searchbox__icon h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true">
				<g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
					<circle cx="11" cy="11" r="8"></circle>
					<path d="m21 21-4.3-4.3"></path>
				</g>
			</svg>
			<input
				type="search"
				className="map-searchbox__field grow"
				value={query}
				aria-label="Search locations"
				onChange={(event) => {
					onInteraction();
					refine(event.target.value);
				}}
				placeholder="Church, city, classis, minister"
			/>
			{canClear ? (
				<button
					type="button"
					className="map-searchbox__clear kbd kbd-sm"
					aria-label="Clear search and filters"
					onClick={() => {
						onReset();
						refine('');
						clearRefinements();
					}}
				>
					×
				</button>
			) : null}
			<span className="map-searchbox__summary">{resultCount} of {total}</span>
		</label>
	);
};

const SearchPanelToggle = ({ isOpen, hidden, onToggle }) => {
	const { query } = useSearchBox();
	const { items } = useCurrentRefinements();
	const hasActiveSearch = query.trim().length > 0 || items.some((item) => item.refinements.length > 0);

	if (hidden) return null;

	return (
		<button
			type="button"
			className={`map-panel-toggle map-panel-toggle--floating btn btn-sm ${hasActiveSearch ? 'map-panel-toggle--active' : ''}`}
			aria-expanded={isOpen}
			aria-controls="map-search-panel"
			aria-label="Show search"
			onClick={onToggle}
		>
			<AdjustmentsHorizontalIcon className="map-panel-toggle__icon" aria-hidden="true" />
		</button>
	);
};

const FacetSelect = ({ attribute, label, allLabel, labelForValue, onInteraction }) => {
	const { items, refine } = useRefinementList({
		attribute,
		limit: 200,
		sortBy: ['name:asc'],
	});
	const selectedItem = items.find((item) => item.isRefined);

	return (
		<label className="form-control w-full">
			{label ? <span className="label-text text-xs font-bold uppercase text-base-content/70">{label}</span> : null}
			<select
				className="select select-sm w-full"
				value={selectedItem?.value ?? 'all'}
				onChange={(event) => {
					onInteraction();
					if (selectedItem) refine(selectedItem.value);
					if (event.target.value !== 'all') refine(event.target.value);
				}}
			>
				<option value="all">{allLabel}</option>
				{items.map((item) => (
					<option key={item.value} value={item.value}>
						{labelForValue?.(item.value) ?? item.label} ({item.count})
					</option>
				))}
			</select>
		</label>
	);
};

const CategoryRefinementList = ({ onInteraction }) => {
	const { items, refine } = useRefinementList({
		attribute: 'type',
		limit: 20,
		sortBy: ['name:asc'],
	});

	return (
		<fieldset className="map-category-refinement">
			<div className="map-category-refinement__items">
				{items.map((item) => (
					<label key={item.value} className="label map-category-refinement__item">
						<input
							type="checkbox"
							className="checkbox checkbox-sm"
							checked={item.isRefined}
							onChange={() => {
								onInteraction();
								refine(item.value);
							}}
						/>
						<span className="map-category-refinement__label">{typeLabels[item.value] ?? item.label}</span>
						<span className="badge badge-ghost badge-sm">{item.count}</span>
					</label>
				))}
			</div>
		</fieldset>
	);
};

const ClassisFacetSelect = ({ onInteraction }) => {
	const { items, refine } = useRefinementList({
		attribute: 'classis',
		limit: 200,
		sortBy: ['name:asc'],
	});
	const selectedItem = items.find((item) => item.isRefined);

	const selectClassis = (value) => {
		onInteraction();
		if (selectedItem) refine(selectedItem.value);
		if (value !== 'all') refine(value);
	};

	return (
		<label className="form-control w-full map-classis-select-control">
			<select
				className="select select-sm w-full map-classis-select"
				value={selectedItem?.value ?? 'all'}
				style={selectedItem ? classisSoftStyle(selectedItem.value) : undefined}
				onChange={(event) => selectClassis(event.target.value)}
			>
				<option value="all">All classes</option>
				{items.map((item) => (
					<option key={item.value} value={item.value} style={classisSoftStyle(item.value)}>
						{item.label} ({item.count})
					</option>
				))}
			</select>
		</label>
	);
};

const ClassisOutlineToggle = ({ checked, onChange }) => (
	<label className="label map-classis-toggle">
		<span className="map-classis-toggle__text">Outline</span>
		<input
			type="checkbox"
			className="checkbox"
			checked={checked}
			onChange={(event) => onChange(event.target.checked)}
		/>
	</label>
);

const SearchResults = ({ selectedKey, onOpenDetails, onHitsChange }) => {
	const { hits } = useHits();
	const resultRefs = useRef(new Map());

	useEffect(() => {
		onHitsChange(hits);
	}, [hits, onHitsChange]);

	useEffect(() => {
		if (!selectedKey) return;
		const selectedResult = resultRefs.current.get(selectedKey);
		if (!selectedResult) return;

		selectedResult.scrollIntoView({
			behavior: 'smooth',
			block: 'center',
		});
		selectedResult.focus({ preventScroll: true });
	}, [selectedKey]);

	if (hits.length === 0) {
		return (
			<div className="map-results" aria-live="polite">
				<div className="map-empty alert">No locations match those filters.</div>
			</div>
		);
	}

	return (
		<ul className="map-results list" aria-live="polite">
			{hits.map((marker) => {
				const key = markerKey(marker);
				const isSelected = key === selectedKey;

				const handleSelect = () => onOpenDetails(key);

				return (
					<li
						key={key}
						ref={(element) => {
							if (element) {
								resultRefs.current.set(key, element);
							} else {
								resultRefs.current.delete(key);
							}
						}}
						role="button"
						tabIndex={0}
						aria-current={isSelected ? 'true' : undefined}
						className={`map-result list-row ${isSelected ? 'map-result--selected' : ''}`}
						onClick={handleSelect}
						onKeyDown={(event) => {
							if (event.key === 'Enter' || event.key === ' ') {
								event.preventDefault();
								handleSelect();
							}
						}}
					>
						<span className="map-result__icon-slot" aria-hidden="true">
							{markerSupportsClassisColor(marker) ? (
								<span
									className="map-result__icon map-result__icon--classis"
									style={{
										'--marker-color': classisColor(marker.classis),
										'--marker-icon-url': `url('${markerIconUrls[marker.type]}')`,
									}}
								/>
							) : (
								<img
									className="map-result__icon"
									src={markerIconUrls[marker.type]}
									alt=""
								/>
							)}
						</span>
						<span className="map-result__content">
							<span className="map-result__name">{marker.name}</span>
							<span className="map-result__location">{marker.location}</span>
						</span>
					</li>
				);
			})}
		</ul>
	);
};

const MapClickClear = ({ onClear }) => {
	useMapEvents({
		click: () => onClear(),
	});

	return null;
};

const RemoveLeafletAttributionPrefix = () => {
	const map = useMap();

	useEffect(() => {
		map.attributionControl.setPrefix(false);
	}, [map]);

	return null;
};

const MapFocus = ({ marker }) => {
	const map = useMap();

	useEffect(() => {
		if (!map || !marker) return;

		map.setView(marker.position, Math.max(map.getZoom(), 8), {
			animate: true,
			duration: 0.45,
		});
	}, [map, marker]);

	return null;
};

const DefaultMapView = ({ center, zoom, enabled }) => {
	const map = useMap();

	useEffect(() => {
		if (!enabled || !map) return;

		map.setView(center, zoom, {
			animate: false,
		});
	}, [center, enabled, map, zoom]);

	return null;
};

const addressLines = (address) => address?.formatted?.split('\n').filter(Boolean) ?? [];

const churchAdditionalFields = (marker) => [
	['Year Organized', marker.yearOrganized],
	['Joined URC / Planted', marker.joinedUrcYear],
	['Total Members', marker.totalMembers],
].filter(([, value]) => value !== undefined && value !== null && value !== '');

const phonePattern = /(?:\+?1[\s.-]?)?(?:\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}/;

const extractPhone = (value) => value?.match(phonePattern)?.[0] ?? '';

const stripPhone = (value) => (
	value
		?.replace(phonePattern, '')
		.replace(/\s{2,}/g, ' ')
		.replace(/\s*,\s*$/, '')
		.trim()
);

const phoneHref = (phone) => `tel:${phone.replace(/[^\d+]/g, '')}`;

const directionsUrl = (marker) => {
	const address = marker.meetingAddress;
	const query = address?.formatted?.replace(/\n/g, ', ') || marker.location;

	return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

const ChurchMeetingDetails = ({ marker }) => (
	<div className="church-popup__grid church-meeting-details">
		<section>
			<h3>Meeting Information</h3>
			{marker.meetingInformation ? <p>{marker.meetingInformation}</p> : null}
			{marker.meetingDetails ? <p>{marker.meetingDetails}</p> : null}
			{marker.updated ? <p className="church-popup__updated">Updated {marker.updated}</p> : null}
		</section>

		<section>
			<a className="btn btn-xs church-directions-link" href={directionsUrl(marker)} target="_blank" rel="noopener noreferrer">
				<MapPinIcon className="church-directions-link__icon" aria-hidden="true" />
				<span>Driving Directions</span>
			</a>
		</section>

		<section>
			<h3>Meeting At</h3>
			{addressLines(marker.meetingAddress).map((line) => (
				<p key={line}>{line}</p>
			))}
		</section>
	</div>
);

const ChurchContactDetails = ({ marker }) => {
	const ministers = marker.contact?.ministers ?? [];
	const ministerName = ministers.map((minister) => stripPhone(minister)).filter(Boolean).join(', ');
	const ministerPhone = marker.contact?.phone || ministers.map(extractPhone).find(Boolean);
	const clerkName = stripPhone(marker.clerk);
	const clerkPhone = extractPhone(marker.clerk);

	return (
		<div className="church-contact">
			<dl className="church-contact__list">
				{ministerName ? (
					<div className="church-contact__row">
						<dt>Minister:</dt>
						<dd>
							<span>{ministerName}</span>
							{marker.contact?.email ? (
								<a className="btn btn-ghost btn-circle btn-xs church-contact__icon-link" href={`mailto:${marker.contact.email}`} aria-label={`Email minister at ${marker.contact.email}`}>
									<EnvelopeIcon aria-hidden="true" />
								</a>
							) : null}
							{ministerPhone ? (
								<a className="btn btn-ghost btn-circle btn-xs church-contact__icon-link" href={phoneHref(ministerPhone)} aria-label={`Call minister at ${ministerPhone}`}>
									<PhoneIcon aria-hidden="true" />
								</a>
							) : null}
						</dd>
					</div>
				) : null}

				{clerkName ? (
					<div className="church-contact__row">
						<dt>Clerk:</dt>
						<dd>
							<span>{clerkName}</span>
							{marker.clerkEmail ? (
								<a className="btn btn-ghost btn-circle btn-xs church-contact__icon-link" href={`mailto:${marker.clerkEmail}`} aria-label={`Email clerk at ${marker.clerkEmail}`}>
									<EnvelopeIcon aria-hidden="true" />
								</a>
							) : null}
							{clerkPhone ? (
								<a className="btn btn-ghost btn-circle btn-xs church-contact__icon-link" href={phoneHref(clerkPhone)} aria-label={`Call clerk at ${clerkPhone}`}>
									<PhoneIcon aria-hidden="true" />
								</a>
							) : null}
						</dd>
					</div>
				) : null}

				{marker.contact?.fax ? (
					<div className="church-contact__row">
						<dt>Fax:</dt>
						<dd>{marker.contact.fax}</dd>
					</div>
				) : null}

				{marker.link ? (
					<div className="church-contact__row">
						<dt>Website:</dt>
						<dd><a className="link link-primary" href={marker.link} target="_blank" rel="noopener noreferrer">{marker.contact?.website || marker.link}</a></dd>
					</div>
				) : null}
			</dl>

			<section>
				<h3>Mailing Address</h3>
				{addressLines(marker.mailingAddress).map((line) => (
					<p key={line}>{line}</p>
				))}
			</section>
		</div>
	);
};

const ChurchInfoDetails = ({ marker }) => {
	const additionalFields = churchAdditionalFields(marker);

	return additionalFields.length > 0 ? (
		<div className="church-popup__grid">
			<dl className="church-contact__list church-popup__wide">
				{additionalFields.map(([label, value]) => (
					<div className="church-contact__row" key={label}>
						<dt>{label}:</dt>
						<dd>{value}</dd>
					</div>
				))}
			</dl>
		</div>
	) : (
		<div className="map-empty alert">No additional information available.</div>
	);
};

const churchInfoTabs = [
	{ id: 'meeting', label: 'Meeting', Icon: HomeIcon },
	{ id: 'contact', label: 'Contact', Icon: PhoneIcon },
	{ id: 'info', label: 'Info', Icon: InformationCircleIcon },
];

const defaultInfoTabs = [
	{ id: 'info', label: 'Info', Icon: InformationCircleIcon },
];

const hasMarkerPhoto = (marker) => Boolean(marker.image?.trim());

const markerInfoTabs = (marker) => {
	const tabs = marker.type === 'church' ? [...churchInfoTabs] : [...defaultInfoTabs];

	if (hasMarkerPhoto(marker)) {
		tabs.push({ id: 'photo', label: 'Photo', Icon: PhotoIcon });
	}

	return tabs;
};

const effectiveMarkerTab = (marker, activeTab) => {
	const tabs = markerInfoTabs(marker);
	return tabs.some((tab) => tab.id === activeTab) ? activeTab : tabs[0].id;
};

const MarkerPhotoDetails = ({ marker }) => (
	<div className="mission-details">
		<img className="mission-details__image" alt="" src={marker.image} loading="lazy"/>
	</div>
);

const DefaultInfoDetails = ({ marker }) => (
	<div className="church-popup__grid">
		<dl className="church-contact__list church-popup__wide">
			<div className="church-contact__row">
				<dt>Location:</dt>
				<dd>{marker.location}</dd>
			</div>
			{marker.link ? (
				<div className="church-contact__row">
					<dt>Website:</dt>
					<dd><a className="link link-primary" href={marker.link} target="_blank" rel="noopener noreferrer">{marker.link}</a></dd>
				</div>
			) : null}
		</dl>
	</div>
);

const ChurchDetails = ({ marker, activeTab }) => {
	if (activeTab === 'photo') return <MarkerPhotoDetails marker={marker} />;
	if (activeTab === 'contact') return <ChurchContactDetails marker={marker} />;
	if (activeTab === 'info') return <ChurchInfoDetails marker={marker} />;

	return <ChurchMeetingDetails marker={marker} />;
};

const MarkerDetails = ({ marker, activeTab }) => {
	if (activeTab === 'photo') return <MarkerPhotoDetails marker={marker} />;
	if (marker.type === 'church') return <ChurchDetails marker={marker} activeTab={activeTab} />;

	return <DefaultInfoDetails marker={marker} />;
};

const MarkerInfoDock = ({ activeTab, classis, tabs, onClose, onTabChange }) => (
	<nav
		className="dock dock-sm map-info-panel__dock"
		style={classis ? { '--classis-color': classisColor(classis) } : undefined}
		aria-label="Marker information sections"
	>
		<button
			type="button"
			className="map-info-panel__dock-close"
			aria-label="Close marker information"
			onClick={onClose}
		>
			<XMarkIcon className="map-info-panel__dock-icon" aria-hidden="true" />
			<span className="dock-label">Close</span>
		</button>
		{tabs.map(({ id, label, Icon }) => (
			<button
				key={id}
				type="button"
				className={activeTab === id ? 'dock-active' : ''}
				aria-current={activeTab === id ? 'page' : undefined}
				onClick={() => onTabChange(id)}
			>
				<Icon className="map-info-panel__dock-icon" aria-hidden="true" />
				<span className="dock-label">{label}</span>
			</button>
		))}
	</nav>
);

const MarkerInfoSummary = ({ marker }) => {
	const infoBubbleLabel = infoBubbleLabels[marker.type];

	return (
		<div className="church-info-card card bg-base-100 rounded-none">
			<div className="card-body">
				<h2 className="card-title">{marker.name}</h2>
				<div className="church-info-card__meta">
					<span>{marker.location}</span>
					{marker.classis ? (
						<span className="badge badge-soft church-info-card__classis" style={{ '--classis-color': classisColor(marker.classis) }}>
							{marker.classis}
						</span>
					) : infoBubbleLabel ? (
						<span className="badge badge-soft church-info-card__type">
							{infoBubbleLabel}
						</span>
					) : null}
				</div>
			</div>
		</div>
	);
};

const MarkerInfoPanel = ({ marker, activeTab, onClose, onTabChange }) => {
	if (!marker) return null;
	const tabs = markerInfoTabs(marker);
	const visibleTab = effectiveMarkerTab(marker, activeTab);

	return (
		<aside className="map-info-panel" aria-label={`${marker.name} information`}>
			<div className="church-popup card bg-base-200 rounded-none">
				<MarkerInfoSummary marker={marker} />
				<div className="map-info-panel__body">
					<MarkerDetails marker={marker} activeTab={visibleTab} />
				</div>
				<MarkerInfoDock
					activeTab={visibleTab}
					classis={marker.classis}
					tabs={tabs}
					onClose={onClose}
					onTabChange={onTabChange}
				/>
			</div>
		</aside>
	);
};

const createClusterIcon = (count) => L.divIcon({
	className: 'map-cluster-marker',
	html: `<span>${count}</span>`,
	iconSize: [30, 30],
	iconAnchor: [15, 15],
});

const classisBoundaryColors = [
	'#1d4ed8',
	'#047857',
	'#b45309',
	'#be123c',
	'#6d28d9',
	'#0f766e',
	'#a21caf',
	'#4338ca',
];

const hashString = (value) => {
	let hash = 0;

	for (let index = 0; index < value.length; index += 1) {
		hash = ((hash << 5) - hash) + value.charCodeAt(index);
		hash |= 0;
	}

	return Math.abs(hash);
};

const classisColor = (classis) => classisBoundaryColors[hashString(classis) % classisBoundaryColors.length];

const classisSoftStyle = (classis) => {
	const color = classisColor(classis);

	return {
		backgroundColor: `color-mix(in oklab, ${color} 16%, transparent)`,
		color,
	};
};

const coloredMarkerIconCache = new Map();

const markerSupportsClassisColor = (marker) => marker.classis && ['church', 'church-plant'].includes(marker.type);

const classisMarkerIcon = (marker) => {
	if (!markerSupportsClassisColor(marker)) return icons[marker.type];

	const cacheKey = `${marker.type}-${marker.classis}`;
	if (coloredMarkerIconCache.has(cacheKey)) return coloredMarkerIconCache.get(cacheKey);

	const [width, height] = markerIconSizes[marker.type];
	const icon = L.divIcon({
		className: 'map-marker-icon map-marker-icon--classis',
		html: `<span class="map-marker-icon__mask" style="--marker-color: ${classisColor(marker.classis)}; --marker-icon-url: url('${markerIconUrls[marker.type]}');"></span>`,
		iconSize: [width, height],
		iconAnchor: [width / 2, height],
		popupAnchor: [0, -52],
	});

	coloredMarkerIconCache.set(cacheKey, icon);
	return icon;
};

const cross = (origin, a, b) => (
	(a.lng - origin.lng) * (b.lat - origin.lat) -
	(a.lat - origin.lat) * (b.lng - origin.lng)
);

const convexHull = (points) => {
	if (points.length <= 3) return points;

	const sorted = [...points].sort((a, b) => a.lng - b.lng || a.lat - b.lat);
	const lower = [];

	for (const point of sorted) {
		while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0) {
			lower.pop();
		}
		lower.push(point);
	}

	const upper = [];

	for (let index = sorted.length - 1; index >= 0; index -= 1) {
		const point = sorted[index];

		while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0) {
			upper.pop();
		}
		upper.push(point);
	}

	return [...lower.slice(0, -1), ...upper.slice(0, -1)];
};

const createClassisBoundaries = (markers) => {
	const classisGroups = new Map();

	for (const marker of markers) {
		if (marker.type !== 'church' || !marker.classis) continue;

		if (!classisGroups.has(marker.classis)) {
			classisGroups.set(marker.classis, []);
		}

		classisGroups.get(marker.classis).push({
			lat: marker.position[0],
			lng: marker.position[1],
		});
	}

	return Array.from(classisGroups.entries())
		.map(([classis, points]) => ({
			classis,
			points: convexHull(points),
			color: classisColor(classis),
		}))
		.filter((boundary) => boundary.points.length >= 3);
};

const ClassisBoundaries = ({ boundaries }) => (
	<>
		{boundaries.map((boundary) => (
			<Polygon
				key={boundary.classis}
				positions={boundary.points.map((point) => [point.lat, point.lng])}
				pathOptions={{
					color: boundary.color,
					fillColor: boundary.color,
					fillOpacity: 0.05,
					opacity: 0.75,
					weight: 2,
					dashArray: '8 6',
				}}
				interactive={false}
			/>
		))}
	</>
);

const FitVisibleMarkers = ({ markers, enabled }) => {
	const map = useMap();
	const markerKey = useMemo(() => markers.map((marker) => `${marker.lat},${marker.lng}`).join('|'), [markers]);
	const lastFitMarkerKey = useRef('');

	useEffect(() => {
		if (!map || markers.length === 0) return;
		if (!enabled) {
			lastFitMarkerKey.current = markerKey;
			return;
		}
		if (markerKey === lastFitMarkerKey.current) return;

		lastFitMarkerKey.current = markerKey;

		if (markers.length === 1) {
			map.setView([markers[0].lat, markers[0].lng], Math.max(map.getZoom(), 8), {
				animate: true,
				duration: 0.35,
			});
			return;
		}

		const bounds = L.latLngBounds(markers.map((marker) => [marker.lat, marker.lng]));
		map.fitBounds(bounds, {
			animate: true,
			duration: 0.35,
			maxZoom: 9,
			padding: [50, 50],
		});
	}, [enabled, map, markerKey, markers]);

	return null;
};

const clusterMarkers = (map, markers) => {
	const groups = [];
	const zoom = map.getZoom();
	const clusterRadius = Math.max(MIN_CLUSTER_RADIUS, CLUSTER_RADIUS - (zoom * 2.4));

	for (const marker of markers) {
		const point = map.latLngToLayerPoint(marker.position);
		const group = groups.find((candidate) => point.distanceTo(candidate.center) < clusterRadius);

		if (group) {
			group.markers.push(marker);
			const count = group.markers.length;
			group.center = L.point(
				(group.center.x * (count - 1) + point.x) / count,
				(group.center.y * (count - 1) + point.y) / count
			);
		} else {
			groups.push({
				key: wrappedMarkerKey(marker),
				center: point,
				markers: [marker],
			});
		}
	}

	return groups.map((group) => {
		if (group.markers.length === 1) {
			return {
				key: wrappedMarkerKey(group.markers[0]),
				type: 'marker',
				marker: group.markers[0],
			};
		}

		if (zoom >= SPREAD_CLUSTER_ZOOM) {
			return group.markers.map((marker, index) => {
				const angle = (Math.PI * 2 * index) / group.markers.length;
				const spreadPoint = L.point(
					group.center.x + Math.cos(angle) * SPREAD_MARKER_RADIUS,
					group.center.y + Math.sin(angle) * SPREAD_MARKER_RADIUS
				);

				return {
					key: `${wrappedMarkerKey(marker)}-spread`,
					type: 'marker',
					marker: {
						...marker,
						position: map.layerPointToLatLng(spreadPoint),
					},
				};
			});
		}

		const bounds = L.latLngBounds(group.markers.map((marker) => marker.position));

		return {
			key: group.key,
			type: 'cluster',
			count: group.markers.length,
			position: map.layerPointToLatLng(group.center),
			bounds,
		};
	}).flat();
};

const MarkerLayer = memo(function MarkerLayer({ markers, onClusterSelect, onMarkerSelect }) {
	const [mapTick, setMapTick] = useState(0);
	const map = useMapEvents({
		zoomend: () => setMapTick((tick) => tick + 1),
		moveend: () => setMapTick((tick) => tick + 1),
	});
	const markerItems = useMemo(() => clusterMarkers(map, markers), [map, markers, mapTick]);

	return markerItems.map((item) => {
		if (item.type === 'cluster') {
			return (
				<Marker
					key={item.key}
					position={item.position}
					icon={createClusterIcon(item.count)}
					zIndexOffset={1000}
					eventHandlers={{
						click: () => {
							onClusterSelect();
							map.fitBounds(item.bounds, {
								animate: true,
								duration: 0.85,
								easeLinearity: 0.18,
								maxZoom: item.count <= 2 ? 16 : Math.min(map.getZoom() + 3, 16),
								padding: [60, 60],
							});
						},
					}}
				/>
			);
		}

		const marker = item.marker;

		return (
			<Marker
				key={item.key}
				position={marker.position}
				icon={classisMarkerIcon(marker)}
				eventHandlers={{
					click: (event) => {
						L.DomEvent.stopPropagation(event);
						onMarkerSelect(markerKey(marker));
					},
				}}
			/>
		);
	});
});

const FitBoundsButton = ({ markers }) => {
	const map = useMap();
	const markersRef = useRef(markers);

	useEffect(() => {
		markersRef.current = markers;
	}, [markers]);

	useEffect(() => {
		if (!map) return;

		const FitButton = L.Control.extend({
			onAdd: function () {
				const div = L.DomUtil.create('div', 'map-controls');
				const toolbar = L.DomUtil.create('div', 'map-controls__toolbar join', div);
				L.DomEvent.disableClickPropagation(div);
				L.DomEvent.disableScrollPropagation(div);

				const zoomInButton = L.DomUtil.create('button', 'map-controls__button map-controls__button--icon btn btn-sm join-item', toolbar);
				zoomInButton.type = 'button';
				zoomInButton.innerHTML = '+';
				zoomInButton.setAttribute('aria-label', 'Zoom in');

				L.DomEvent.on(zoomInButton, 'click', () => {
					map.zoomIn();
				});

				const zoomOutButton = L.DomUtil.create('button', 'map-controls__button map-controls__button--icon btn btn-sm join-item', toolbar);
				zoomOutButton.type = 'button';
				zoomOutButton.innerHTML = '&minus;';
				zoomOutButton.setAttribute('aria-label', 'Zoom out');

				L.DomEvent.on(zoomOutButton, 'click', () => {
					map.zoomOut();
				});

				const button = L.DomUtil.create('button', 'map-controls__button map-controls__button--reset btn btn-sm join-item', toolbar);
				button.type = 'button';
				button.innerHTML = 'Reset Zoom';

				L.DomEvent.on(button, 'click', () => {
					const currentMarkers = markersRef.current;
					if (currentMarkers.length > 0) {
						const bounds = L.latLngBounds(currentMarkers.map((m) => [m.lat, m.lng]));
						map.fitBounds(bounds, { padding: [50, 50] });
					}
				});

				return div;
			},
		});

		const fitBoundsControl = new FitButton({ position: "bottomright" });
		map.addControl(fitBoundsControl);

		return () => map.removeControl(fitBoundsControl);
	}, [map]);

	return null;
};

const WorldMap = () => {
	const allMarkers = useMemo(() => Markers.filter(isDisplayMarker), []);
	const searchHits = useMemo(() => allMarkers.map(createSearchHit), [allMarkers]);
	const searchClient = useMemo(() => createLocalSearchClient(searchHits), [searchHits]);
	const isMobileMap = useMediaQuery('(pointer: coarse), (max-width: 820px)');
	const initialView = isMobileMap ? mobileInitialView : desktopInitialView;
	const [filteredMarkers, setFilteredMarkers] = useState(searchHits);
	const [selectedKey, setSelectedKey] = useState('');
	const [focusKey, setFocusKey] = useState('');
	const [activeInfoTab, setActiveInfoTab] = useState('meeting');
	const [showClassisOutlines, setShowClassisOutlines] = useState(false);
	const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
	const clearSelection = useCallback(() => {
		setSelectedKey('');
		setFocusKey('');
	}, []);
	const resetSearchAndFilters = useCallback(() => {
		setSelectedKey('');
		setFocusKey('');
		setShowClassisOutlines(false);
	}, []);
	const selectMarker = useCallback((key) => {
		setSelectedKey(key);
		setFocusKey('');
		setIsMobilePanelOpen(false);
	}, []);
	const openMarkerDetails = useCallback((key) => {
		setSelectedKey(key);
		setFocusKey(key);
		setIsMobilePanelOpen(false);
	}, []);
	const handleHitsChange = useCallback((hits) => {
		setFilteredMarkers(hits);
	}, []);

	const selectedMarker = useMemo(() => {
		return filteredMarkers.find((marker) => markerKey(marker) === selectedKey) ?? null;
	}, [filteredMarkers, selectedKey]);

	const focusedMarker = useMemo(() => {
		return filteredMarkers.find((marker) => markerKey(marker) === focusKey) ?? null;
	}, [filteredMarkers, focusKey]);

	const boundsMarkers = useMemo(() => {
		return filteredMarkers.map((marker) => ({ lat: marker.position[0], lng: marker.position[1] }));
	}, [filteredMarkers]);

	const isShowingAllMarkers = filteredMarkers.length === searchHits.length;
	const shouldFitVisibleMarkers = !selectedMarker && !(isMobileMap && isShowingAllMarkers);
	const shouldUseDefaultMobileView = isMobileMap && isShowingAllMarkers;

	const wrappedMarkers = useMemo(() => {
		return filteredMarkers.flatMap((marker) => {
			return [-360, 0, 360].map((wrapOffset) => ({
				...marker,
				wrapOffset,
				position: [marker.position[0], marker.position[1] + wrapOffset],
			}));
		});
	}, [filteredMarkers]);

	const classisBoundaries = useMemo(() => createClassisBoundaries(filteredMarkers), [filteredMarkers]);

	return (
		<InstantSearch searchClient={searchClient} indexName="urcna_locations" future={{ preserveSharedStateOnUnmount: true }}>
			<Configure hitsPerPage={500} facets={['type', 'country', 'region', 'classis']} />
			<div className={`map-shell ${isMobilePanelOpen ? 'map-shell--panel-open' : 'map-shell--panel-closed'}`}>
				<aside id="map-search-panel" className="map-sidebar" aria-label="Map search and results">
					<div className="map-filters">
						<div className="map-search-filter-row">
							<button
								type="button"
								className="map-panel-toggle map-panel-toggle--inline btn btn-sm"
								aria-expanded={isMobilePanelOpen}
								aria-controls="map-search-panel"
								aria-label="Hide search"
								onClick={() => setIsMobilePanelOpen(false)}
							>
								<XMarkIcon className="map-panel-toggle__icon" aria-hidden="true" />
							</button>
							<SearchInput total={allMarkers.length} onInteraction={clearSelection} onReset={resetSearchAndFilters} />
						</div>
						<div className="map-filter-columns">
							<div className="map-filter-checkbox-column">
								<CategoryRefinementList onInteraction={clearSelection} />
							</div>
							<div className="map-filter-select-column">
								<FacetSelect
									attribute="country"
									allLabel="All countries"
									onInteraction={clearSelection}
								/>
								<FacetSelect
									attribute="region"
									allLabel="States/Provinces"
									onInteraction={clearSelection}
								/>
								<div className="map-classis-filter-row">
									<ClassisFacetSelect onInteraction={clearSelection} />
									<ClassisOutlineToggle checked={showClassisOutlines} onChange={setShowClassisOutlines} />
								</div>
							</div>
						</div>
					</div>

					<SearchResults
						selectedKey={selectedKey}
						onOpenDetails={openMarkerDetails}
						onHitsChange={handleHitsChange}
					/>
				</aside>

				<div className="map-canvas">
					<SearchPanelToggle
						isOpen={isMobilePanelOpen}
						hidden={Boolean(selectedMarker)}
						onToggle={() => setIsMobilePanelOpen((isOpen) => !isOpen)}
					/>
					<MapContainer
						center={initialView.center}
						zoom={initialView.zoom}
						style={{ height: '100%', width: '100%' }}
						zoomControl={false}
						preferCanvas
						worldCopyJump
						minZoom={initialView.minZoom}
						zoomSnap={0.25}
						wheelDebounceTime={60}
						wheelPxPerZoomLevel={90}
					>
						<FitBoundsButton markers={boundsMarkers} />
						<DefaultMapView center={mobileInitialView.center} zoom={mobileInitialView.zoom} enabled={shouldUseDefaultMobileView} />
						<FitVisibleMarkers markers={boundsMarkers} enabled={shouldFitVisibleMarkers} />
						<RemoveLeafletAttributionPrefix />

						<TileLayer
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
							updateWhenIdle
							updateWhenZooming={false}
							keepBuffer={4}
							maxNativeZoom={19}
						/>

						{showClassisOutlines ? <ClassisBoundaries boundaries={classisBoundaries} /> : null}
						<MapClickClear onClear={clearSelection} />
						<MarkerLayer markers={wrappedMarkers} onClusterSelect={clearSelection} onMarkerSelect={selectMarker} />
						<MapFocus marker={focusedMarker} />
					</MapContainer>
					{selectedMarker ? (
						<MarkerInfoPanel
							key={markerKey(selectedMarker)}
							marker={selectedMarker}
							activeTab={activeInfoTab}
							onClose={clearSelection}
							onTabChange={setActiveInfoTab}
						/>
					) : null}
				</div>
			</div>
		</InstantSearch>
	);
};

export default WorldMap;
