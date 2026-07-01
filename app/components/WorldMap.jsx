import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
	Configure,
	InstantSearch,
	useClearRefinements,
	useHits,
	useInstantSearch,
	useRefinementList,
	useSearchBox,
} from 'react-instantsearch';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const iconMeta = {
	church: 'Church',
	'church-plant': 'Church Plant',
	foreign: 'Foreign',
	home: 'Home',
	prison: 'Prison',
};

const markerIconUrls = {
	church: '/icons/church.png',
	'church-plant': '/icons/church-plant.png',
	foreign: '/icons/foreign.png',
	home: '/icons/home.png',
	prison: '/icons/prison.png',
};

const markerIconSizes = {
	church: [34, 58],
	'church-plant': [38, 58],
	foreign: [35, 58],
	home: [34, 58],
	prison: [34, 58],
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
		"id": "187975",
		"position": [
			43.173756,
			-79.394539
		],
		"name": "Adoration United Reformed Church",
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
		"updated": "06/18/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "01/07/2025",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "188854",
		"position": [
			39.121758,
			-84.508583
		],
		"name": "Ascension Reformed Church",
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
		"updated": "03/17/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
				"Rev. Paul Lindemulder (406) 220-2343"
			],
			"phone": "(406) 220-2343",
			"fax": "",
			"email": "pastor@urcbelgrade.com",
			"website": "www.urcbelgrade.com"
		},
		"meetingInformation": "10:00 AM and 6:00 PM",
		"updated": "01/18/2025",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186505",
		"position": [
			48.7999,
			-122.53
		],
		"name": "Bellingham United Reformed Church",
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
			"zip": "98226",
			"country": "United States",
			"formatted": "4454 Pacific Highway\nBellingham, WA 98226\nUnited States"
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
		"updated": "02/23/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "12/20/2024",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186570",
		"position": [
			54.772646,
			-127.155302
		],
		"name": "Bethel Reformed Church",
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
			"fax": "(250) 847-2901",
			"email": "bethelsmithers@gmail.com",
			"website": "www.bethelsmithers.ca"
		},
		"meetingInformation": "10:00 AM and 2:30 PM",
		"updated": "12/05/2025",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
			"zip": "N5H 2R1",
			"country": "Canada",
			"formatted": "49823 Talbot Line (Hwy 3 East of Aylmer)\nAylmer, ON N5H 2R1\nCanada"
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
		"updated": "01/05/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "02/23/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "06/12/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "03/25/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
			"fax": "(519) 425-0618",
			"email": "clerk@bethelurcwoodstock.com",
			"website": "www.bethelurcwoodstock.com"
		},
		"meetingInformation": "9:30 AM and 3:00 PM",
		"updated": "05/13/2025",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "192715",
		"position": [
			41.623631,
			-122.407844
		],
		"name": "Big Springs United Reformed Church",
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
		"updated": "01/12/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186720",
		"position": [
			48.4814,
			-122.335
		],
		"name": "Burlington United Reformed Church",
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
		"updated": "06/28/2025",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186542",
		"position": [
			40.3786,
			-105.132
		],
		"name": "Calvary United Reformed Church",
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
			"fax": "(970) 667-0603",
			"email": "office@calvaryurc.org",
			"website": "https://calvaryurc.org"
		},
		"meetingInformation": "10:00 AM and 6:00 PM",
		"updated": "05/02/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186500",
		"position": [
			33.8277,
			-117.88
		],
		"name": "Christ Reformed Church of Anaheim, California",
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
			"zip": "92806",
			"country": "United States",
			"formatted": "900 S. Sunkist St.\nAnaheim, CA 92806\nUnited States"
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
		"updated": "03/17/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "581134",
		"position": [
			39.102763,
			-84.480424
		],
		"name": "Christ Reformed Church of Bellevue",
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
		"updated": "06/11/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "05/22/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186569",
		"position": [
			43.533935,
			-96.722035
		],
		"name": "Christ Reformed Church of Sioux Falls",
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
		"updated": "06/17/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186593",
		"position": [
			38.891277,
			-76.992974
		],
		"name": "Christ Reformed Church of Washington D.C.",
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
			"zip": "20002",
			"country": "United States",
			"formatted": "914 Massachusetts Avenue NE\nWashington, DC 20002\nUnited States"
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
		"updated": "12/27/2025",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "517753",
		"position": [
			40.722452,
			-124.216495
		],
		"name": "Christ the Redeemer Reformed Church",
		"location": "Eureka, California",
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
		"updated": "01/05/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186565",
		"position": [
			32.8549,
			-116.972
		],
		"name": "Christ United Reformed Church of Santee",
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
				"Rev. William C. Godfrey (760) 807-0897"
			],
			"phone": "(619) 258-8500",
			"fax": "",
			"email": "clerk@christurc.org",
			"website": "www.christurc.org"
		},
		"meetingInformation": "9:30 AM and 6:00 PM",
		"updated": "04/13/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186506",
		"position": [
			43.6377,
			-116.334
		],
		"name": "Cloverdale United Reformed Church",
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
		"meetingInformation": "10:30 AM and 6:00 PM",
		"updated": "07/08/2025",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "10/01/2025",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186540",
		"position": [
			39.588612,
			-104.883073
		],
		"name": "Coram Deo United Reformed Church",
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
				"Rev. Derrick Vander Meulen (808) 631-9321"
			],
			"phone": "(303) 221-0610",
			"fax": "",
			"email": "derrickvandermeulen@gmail.com",
			"website": "www.coramdeourc.org"
		},
		"meetingInformation": "9:00 AM and 11:45 AM",
		"updated": "02/05/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "403534",
		"position": [
			42.33295,
			-122.87536
		],
		"name": "Cornerstone Christian Church of Medford",
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
		"updated": "02/24/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "06/20/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
			"fax": "(616) 669-4321",
			"email": "office@cornerstoneurc.com",
			"website": "www.cornerstoneurc.com"
		},
		"meetingInformation": "9:30 AM and 5:00 PM",
		"updated": "05/18/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "03/17/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "01/09/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "581485",
		"position": [
			33.827949,
			-117.879973
		],
		"name": "Covenant Chinese Reformed Church",
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
			"zip": "92806",
			"country": "United States",
			"formatted": "900 South Sunkist Street\nAnaheim, CA 92806\nUnited States"
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
		"updated": "03/14/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186589",
		"position": [
			42.9761,
			-82.1641
		],
		"name": "Covenant Christian Church",
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
		"updated": "11/05/2025",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "188336",
		"position": [
			48.949585,
			-122.547757
		],
		"name": "Covenant Grace Reformed Church",
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
		"updated": "01/10/2025",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186753",
		"position": [
			41.5699,
			-75.5015
		],
		"name": "Covenant Reformed Church of Carbondale",
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
		"updated": "01/05/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "12/27/2025",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "02/23/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "12/21/2024",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "02/23/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "11/06/2025",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186509",
		"position": [
			42.7826,
			-85.6604
		],
		"name": "Covenant United Reformed Church of Byron Center",
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
		"updated": "02/23/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "189417",
		"position": [
			38.897353,
			-104.811064
		],
		"name": "Covenant United Reformed Church of Colorado Springs",
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
			"zip": "80907",
			"country": "United States",
			"formatted": "4825 Mallow Rd.\nColorado Springs, CO 80907\nUnited States"
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
		"updated": "01/07/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "05/08/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "03/18/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "02/23/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "541417",
		"position": [
			52.107986,
			-106.670018
		],
		"name": "Covenant United Reformed Church of Saskatoon",
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
			"zip": "S7H 1Y5",
			"country": "Canada",
			"formatted": "1801 Lorne Ave.\nSaskatoon, SK S7H 1Y5\nCanada"
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
		"updated": "02/12/2024",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "215092",
		"position": [
			43.581288,
			-116.214342
		],
		"name": "Dayspring Reformed Church",
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
		"updated": "02/23/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186517",
		"position": [
			43.2733,
			-96.2344
		],
		"name": "Doon United Reformed Church",
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
		"updated": "02/23/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "02/23/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "08/14/2025",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186546",
		"position": [
			54.121687,
			-114.420608
		],
		"name": "Emmanuel Reformed Church of Neerlandia",
		"location": "Neerlandia, Alberta",
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
			"zip": "T7N 1A1",
			"country": "Canada",
			"formatted": "5102 60th Street\nBarrhead, AB T7N 1A1\nCanada"
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
		"updated": "05/11/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
			"fax": "(844) 269-8282",
			"email": "office@escondidourc.org",
			"website": "www.escondidourc.org"
		},
		"meetingInformation": "9:30 AM and 5:00 PM",
		"updated": "04/01/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "07/09/2025",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "08/24/2025",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186527",
		"position": [
			42.919259,
			-86.080637
		],
		"name": "Faith United Reformed Church of Holland",
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
		"updated": "02/23/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
				"Rev. Bradd L. Nymeyer (602) 550-6738",
				"Dr. Timothy R. Scheuers (909) 591-9111"
			],
			"phone": "(909) 591-9111",
			"fax": "",
			"email": "office@chinourc.org",
			"website": "www.chinourc.org"
		},
		"meetingInformation": "9:30 AM and 6:00 PM",
		"updated": "03/17/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
			"fax": "(708) 422-1428 call first",
			"email": "oaklawnurc@gmail.com",
			"website": "www.oaklawnurc.org"
		},
		"meetingInformation": "9:30 AM and 5:00 PM",
		"updated": "01/09/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "380779",
		"position": [
			47.289634,
			-122.578796
		],
		"name": "Gig Harbor United Reformed Church",
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
			"zip": "98335",
			"country": "United States",
			"formatted": "3008 36th St NW\nGig Harbor, WA 98335\nUnited States"
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
		"updated": "02/23/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
			"zip": "07860",
			"country": "United States",
			"formatted": "23 Thompson Street\nNewton, NJ 07860\nUnited States"
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
		"updated": "02/18/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
			"zip": "V1P 1E5",
			"country": "Canada",
			"formatted": "1710 Garner Road\nKelowna, BC V1P 1E5\nCanada"
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
		"updated": "05/08/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
			"zip": "07306",
			"country": "United States",
			"formatted": "910 Bergen Ave. #272\nJersey City, NJ 07306\nUnited States"
		},
		"meetingAddress": {
			"street": "240 Fairmount Ave.",
			"city": "Jersey City",
			"state": "NJ",
			"zip": "07306",
			"country": "United States",
			"formatted": "240 Fairmount Ave.\nJersey City, NJ 07306\nUnited States"
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
		"updated": "12/30/2023",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186536",
		"position": [
			53.259212595003,
			-113.6327263463
		],
		"name": "Grace Reformed Church of Leduc",
		"location": "Leduc, Alberta",
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
		"updated": "02/05/2025",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186518",
		"position": [
			42.91104,
			-79.62702
		],
		"name": "Grace Reformed Church, Dunnville",
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
		"updated": "04/05/2025",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
			"zip": "L0L 2E0",
			"country": "Canada",
			"formatted": "80 15/16 Sideroad East\nOro-Medonte, ON L0L 2E0\nCanada"
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
		"updated": "06/22/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "01/21/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
				"Rev. Craig Davis (509) 308-3763"
			],
			"phone": "(509) 586-6657",
			"fax": "",
			"email": "gurcclerk@graceurc.org",
			"website": "www.graceurc.org"
		},
		"meetingInformation": "10:00 AM and 5:00 PM",
		"updated": "01/04/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186658",
		"position": [
			45.406474,
			-122.634193
		],
		"name": "Grace United Reformed Church of Portland",
		"location": "Portland, Oregon",
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
		"updated": "02/23/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186577",
		"position": [
			33.8312,
			-118.326
		],
		"name": "Grace United Reformed Church of Torrance",
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
		"updated": "01/04/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
			"fax": "(920) 324-2924",
			"email": "pastor@waupungraceurc.org",
			"website": "www.WaupunGraceURC.org"
		},
		"meetingInformation": "9:30 AM and 5:30 PM",
		"updated": "10/28/2025",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186501",
		"position": [
			34.518935,
			-117.211628
		],
		"name": "High Desert United Reformed Church",
		"location": "Apple Valley, California",
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
		"updated": "01/08/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
			"fax": "Call first",
			"email": "hillsurc@alliancecom.net",
			"website": "www.hillsurc.com"
		},
		"meetingInformation": "9:30 AM and 4:00 PM (Dec-March) 5:00PM April-Nov",
		"updated": "01/13/2025",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186586",
		"position": [
			43.71914,
			-79.71092
		],
		"name": "Hope Reformed Church",
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
			"zip": "L6T 2E2",
			"country": "Canada",
			"formatted": "375 Clark Blvd\nBrampton, ON L6T 2E2\nCanada"
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
		"updated": "07/14/2025",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
			"zip": "N0K1N0",
			"country": "Canada",
			"formatted": "160 Wellington Street\nMitchell, ON N0K1N0\nCanada"
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
		"updated": "01/12/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186580",
		"position": [
			41.3716,
			-74.4418
		],
		"name": "Hudson Valley United Reformed Church",
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
			"fax": "(845) 355-2556",
			"email": "hossink@frontiernet.net",
			"website": "www.hvurc.org"
		},
		"meetingInformation": "9:30 AM and 6:00 PM",
		"updated": "01/08/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186498",
		"position": [
			49.1204,
			-122.254
		],
		"name": "Immanuel Covenant Reformed Church",
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
			"zip": "V3G 1N8",
			"country": "Canada",
			"formatted": "35063 Page Road\nAbbotsford, BC V3G 1N8\nCanada"
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
		"updated": "03/27/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "10/25/2024",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "11/18/2025",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "03/03/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
			"fax": "(905) 562-8221",
			"email": "clerk@immanuelurc.com",
			"website": "www.immanuelurc.com"
		},
		"meetingInformation": "9:30 AM and 3:30 PM",
		"updated": "01/08/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "06/05/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186563",
		"position": [
			44.9548,
			-122.969
		],
		"name": "Immanuel's Reformed Church of Salem",
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
		"updated": "07/23/2025",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "470724",
		"position": [
			40.02439,
			-86.10696
		],
		"name": "Indy Reformed Church",
		"location": "Indianapolis, Indiana",
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
			"zip": "46074",
			"country": "United States",
			"formatted": "16231 Carey Rd.\nWestfield, IN 46074\nUnited States"
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
		"updated": "02/14/2023",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "632400",
		"position": [
			33.441944,
			-112.445287
		],
		"name": "Inheritance URC",
		"location": "Phoenix, Arizona",
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
			"zip": "85338",
			"country": "United States",
			"formatted": "418 S Citrus Rd\nGoodyear, AZ 85338\nUnited States"
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
		"updated": "01/13/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186507",
		"position": [
			43.16375,
			-80.23952
		],
		"name": "Living Water Reformed Church",
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
		"updated": "05/26/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "02/23/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
			"zip": "60411",
			"country": "United States",
			"formatted": "1990 East Glenwood-Dyer Rd.\nLynwood, IL 60411\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Nick Alons"
			],
			"phone": "(708) 474-4100",
			"fax": "(708) 474-7761",
			"email": "pastoralons@yahoo.com",
			"website": "www.lynwoodurc.org"
		},
		"meetingInformation": "9:30 AM and 5:00 PM",
		"updated": "01/06/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "466553",
		"position": [
			38.73989921,
			-85.37674
		],
		"name": "Madison Reformed Church",
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
		"updated": "12/31/2025",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186549",
		"position": [
			40.738769199113,
			-73.98657711986
		],
		"name": "Messiah's Reformed Fellowship",
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
			"zip": "10010",
			"country": "United States",
			"formatted": "61 Gramercy Park North\nNew York, NY 10010\nUnited States"
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
		"updated": "06/11/2025",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186578",
		"position": [
			42.5666,
			-114.452
		],
		"name": "New Covenant United Reformed Church",
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
		"updated": "12/20/2025",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
			"zip": "05472",
			"country": "United States",
			"formatted": "P.O. Box 9\nNew Haven, VT 05472\nUnited States"
		},
		"meetingAddress": {
			"street": "1660 Ethan Allen Highway - Route 7",
			"city": "New Haven",
			"state": "VT",
			"zip": "05472",
			"country": "United States",
			"formatted": "1660 Ethan Allen Highway - Route 7\nNew Haven, VT 05472\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Andrew S. Knott (616) 437-9813"
			],
			"phone": "(802) 388-1345",
			"fax": "(802) 388-1345",
			"email": "newhavenvturc@gmail.com",
			"website": "www.nhurc.org"
		},
		"meetingInformation": "10:00AM and 6:30 PM",
		"updated": "02/06/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186566",
		"position": [
			43.799333,
			-79.313808
		],
		"name": "New Horizon United Reformed Church",
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
			"zip": "M1W 2L2",
			"country": "Canada",
			"formatted": "2300 Bridletowne Circle\nScarborough, ON M1W 2L2\nCanada"
		},
		"contact": {
			"ministers": [
				"Rev. Mitchell Persaud (416) 335-0958"
			],
			"phone": "(416) 335-0958",
			"fax": "",
			"email": "mitchellpersaud@gmail.com",
			"website": "www.newhorizonchurch.ca"
		},
		"meetingInformation": "1:00 PM and 2:45 PM",
		"updated": "12/27/2025",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "01/10/2025",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
			"fax": "(708) 474-0172",
			"email": "clerk@oakglenurc.org",
			"website": "www.oakglenurc.org"
		},
		"meetingInformation": "9:30 AM and 5:00 PM",
		"updated": "03/17/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186550",
		"position": [
			33.162875,
			-117.354554
		],
		"name": "Oceanside United Reformed Church",
		"location": "Oceanside, California",
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
			"zip": "92008",
			"country": "United States",
			"formatted": "2605 Carlsbad Blvd.\nCarlsbad, CA 92008\nUnited States"
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
		"updated": "02/04/2025",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "02/23/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186559",
		"position": [
			52.609302,
			-113.633774
		],
		"name": "Parkland Reformed Church",
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
			"fax": "(403) 783-6879",
			"email": "clerk@parklandurc.org",
			"website": "www.parklandurc.org"
		},
		"meetingInformation": "10:00 AM and 2:30 PM",
		"updated": "06/17/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186555",
		"position": [
			34.144473,
			-118.039779
		],
		"name": "Pasadena United Reformed Church",
		"location": "Pasadena, California",
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
			"zip": "91030",
			"country": "United States",
			"formatted": "1515 Garfield Ave\nSouth Pasadena, CA 91030\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Movses S. Janbazian (626) 437-4944",
				"Rev. Adam Kaloostian"
			],
			"phone": "(626) 437-4944",
			"fax": "",
			"email": "mjanbazian@verizon.net",
			"website": "www.pasadenaurc.org"
		},
		"meetingInformation": "9:30 AM and 11:10 AM",
		"updated": "05/08/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "406463",
		"position": [
			45.63415,
			-122.53305
		],
		"name": "Peace United Reformed Church",
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
			"zip": "98661",
			"country": "United States",
			"formatted": "5602 E. Mill Plain Blvd.\nVancouver, WA 98661\nUnited States"
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
		"updated": "01/20/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "12/30/2025",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
			"zip": "85016",
			"country": "United States",
			"formatted": "2002 E. Missouri Ave.\nPhoenix, AZ 85016\nUnited States"
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
		"updated": "01/06/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "403763",
		"position": [
			40.973426909943,
			-75.25028672331
		],
		"name": "Pocono Reformed Bible Church",
		"location": "East Stroudsburg, Pennsylvania",
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
			"zip": "18360",
			"country": "United States",
			"formatted": "7164 Business Route 209\nStroudsburg, PA 18360\nUnited States"
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
		"updated": "04/08/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186558",
		"position": [
			40.9642,
			-74.2951
		],
		"name": "Pompton Plains Reformed Bible Church",
		"location": "Pompton Plains, New Jersey",
		"link": "https://www.pprbc.org",
		"image": "",
		"classis": "Eastern U.S.",
		"mailingAddress": {
			"street": "415 Boulevard",
			"city": "Pompton Plains",
			"state": "NJ",
			"zip": "07444",
			"country": "United States",
			"formatted": "415 Boulevard\nPompton Plains, NJ 07444\nUnited States"
		},
		"meetingAddress": {
			"street": "415 Boulevard",
			"city": "Pompton Plains",
			"state": "NJ",
			"zip": "07444",
			"country": "United States",
			"formatted": "415 Boulevard\nPompton Plains, NJ 07444\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Justin D. Nobel",
				"Rev. Israel Quaresma"
			],
			"phone": "(973) 835-4784",
			"fax": "(973) 835-4778",
			"email": "office@pprbc.org",
			"website": "www.pprbc.org"
		},
		"meetingInformation": "9:30 AM and 5:00 PM",
		"updated": "06/24/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186581",
		"position": [
			40.927392,
			-74.231164
		],
		"name": "Preakness Valley United Reformed Church",
		"location": "Wayne, New Jersey",
		"link": "https://www.pvurc.org",
		"image": "",
		"classis": "Eastern U.S.",
		"mailingAddress": {
			"street": "480 Valley Rd.",
			"city": "Wayne",
			"state": "NJ",
			"zip": "07470",
			"country": "United States",
			"formatted": "480 Valley Rd.\nWayne, NJ 07470\nUnited States"
		},
		"meetingAddress": {
			"street": "480 Valley Rd",
			"city": "Wayne",
			"state": "NJ",
			"zip": "07470",
			"country": "United States",
			"formatted": "480 Valley Rd\nWayne, NJ 07470\nUnited States"
		},
		"contact": {
			"ministers": [
				"Vacant"
			],
			"phone": "(973) 628-1313",
			"fax": "(973) 628-1316",
			"email": "pvconsistory@gmail.com",
			"website": "www.pvurc.org"
		},
		"meetingInformation": "9:30 AM and 6:00 PM",
		"updated": "01/09/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "564570",
		"position": [
			50.44729942335,
			-119.1920800766
		],
		"name": "Providence Covenant Reformed Church",
		"location": "Armstrong, British Columbia",
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
			"zip": "V0E1B0",
			"country": "Canada",
			"formatted": "2520 Patterson Avenue\nArmstong, BC V0E1B0\nCanada"
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
		"updated": "03/26/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "01/08/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "542400",
		"position": [
			43.5753731,
			-116.3799751
		],
		"name": "Providence Reformed Church of Meridian",
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
		"updated": "11/19/2025",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "626901",
		"position": [
			43.615580882846,
			-96.78549342883
		],
		"name": "Providence Reformed Church of Sioux Falls",
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
			"zip": "57107",
			"country": "United States",
			"formatted": "47135 260th St\nSioux Falls, SD 57107\nUnited States"
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
		"updated": "01/15/2025",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186585",
		"position": [
			49.972091,
			-97.059081
		],
		"name": "Providence Reformed Church of Winnipeg",
		"location": "Winnipeg, Manitoba",
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
			"zip": "R2E 0C4",
			"country": "Canada",
			"formatted": "2615 Henderson Hwy\nEast St Paul, MB R2E 0C4\nCanada"
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
		"updated": "04/24/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
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
				"Rev. Harry Zekveld (519) 246-1261"
			],
			"phone": "(519) 245-3600",
			"fax": "",
			"email": "clerk@providenceurc.com",
			"website": "www.providenceurc.com"
		},
		"meetingInformation": "9:30 AM and 3:00 PM",
		"updated": "01/11/2023",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186865",
		"position": [
			50.4265,
			-104.634
		],
		"name": "Redeemer Reformation Church",
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
		"updated": "03/17/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "06/23/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "502326",
		"position": [
			61.099398519343,
			-149.8523573766
		],
		"name": "Redeemer United Reformed Church of Anchorage",
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
				"Rev. Joseph Váradi"
			],
			"phone": "(907) 317-9635",
			"fax": "",
			"email": "info@akredeemer.org",
			"website": "http://www.akredeemer.org/"
		},
		"meetingInformation": "12:30 PM and 2:30 PM",
		"updated": "04/28/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "05/13/2025",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"meetingInformation": "9:30 AM and 6:00 PM",
		"updated": "01/03/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186520",
		"position": [
			41.436575,
			-87.438336
		],
		"name": "Redeemer United Reformed Church of Saint John",
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
		"updated": "04/23/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "340928",
		"position": [
			43.131381,
			-80.258398
		],
		"name": "Redeeming Grace Reformed Church",
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
		"updated": "02/04/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186525",
		"position": [
			43.2086,
			-79.9284
		],
		"name": "Rehoboth United Reformed Church",
		"location": "Hamilton, Ontario",
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
		"updated": "06/17/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "287726",
		"position": [
			43.112811,
			-79.086482
		],
		"name": "River of Life United Reformed Church",
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
		"updated": "01/09/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "03/17/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186632",
		"position": [
			43.9152,
			-78.6822
		],
		"name": "Salem United Reformed Church",
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
			"zip": "L1C 3L1",
			"country": "Canada",
			"formatted": "2607 Concession Road 4\nBowmanville, ON L1C 3L1\nCanada"
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
		"updated": "01/09/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
			"zip": "91350",
			"country": "United States",
			"formatted": "26860 Seco Canyon Road\nSanta Clarita, CA 91350\nUnited States"
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
		"updated": "01/09/2025",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "02/07/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "188001",
		"position": [
			43.0357671,
			-85.6682554
		],
		"name": "Sovereign Grace United Reformed Church",
		"location": "Grand Rapids, Michigan",
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
		"updated": "01/03/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "02/23/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "06/08/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186576",
		"position": [
			43.772197,
			-79.66285
		],
		"name": "The Hope Centre (Congregation)",
		"location": "Toronto, Ontario",
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
			"zip": "L6P 2P7",
			"country": "Canada",
			"formatted": "8999 The Gore Road\nBrampton, ON L6P 2P7\nCanada"
		},
		"contact": {
			"ministers": [
				"Rev. Anthony Zekveld (416) 740-0543"
			],
			"phone": "(416) 740-0543",
			"fax": "",
			"email": "hopebrampton@gmail.com",
			"website": "www.hopecentrebrampton.com"
		},
		"meetingInformation": "12:30 PM and 2:00 PM",
		"updated": "01/08/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "02/23/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "07/10/2025",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "02/23/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "04/27/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186634",
		"position": [
			36.3129,
			-119.365
		],
		"name": "Trinity United Reformed Church of Visalia",
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
		"updated": "06/25/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186579",
		"position": [
			37.946809,
			-121.968818
		],
		"name": "Trinity United Reformed Church of Walnut Creek",
		"location": "Walnut Creek, California",
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
			"zip": "94521",
			"country": "United States",
			"formatted": "1092 Alberta Way\nConcord, CA 94521\nUnited States"
		},
		"contact": {
			"ministers": [
				"Rev. Joghinda S. Gangar (925) 639-5313"
			],
			"phone": "(925) 639-5313",
			"fax": "",
			"email": "jwkamphuis@astound.net",
			"website": "www.trinityurcwc.org"
		},
		"meetingInformation": "10:00 AM and 5:00 PM",
		"updated": "11/06/2024",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186591",
		"position": [
			46.359104,
			-63.272331
		],
		"name": "United Reformed Church of PEI",
		"location": "Charlottetown, Prince Edward Island",
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
			"zip": "C1E 0T2",
			"country": "Canada",
			"formatted": "1191 New Glasgow Road\nEbenezer, PE C1E 0T2\nCanada"
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
		"updated": "06/22/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186590",
		"position": [
			46.3312,
			-119.996
		],
		"name": "United Reformed Church of Sunnyside",
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
		"updated": "01/31/2024",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
			"zip": "P7K 0C9",
			"country": "Canada",
			"formatted": "King's Highway 130\nThunder Bay, ON P7K 0C9\nCanada"
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
		"updated": "01/08/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "08/03/2025",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "01/07/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
	},
	{
		"type": "church",
		"id": "186523",
		"position": [
			43.0009,
			-85.7691
		],
		"name": "Walker United Reformed Church",
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
			"fax": "(616) 453-2960",
			"email": "clerk@walkerurc.org",
			"website": "www.walkerurc.org"
		},
		"meetingInformation": "9:30 AM and 5:00 PM",
		"updated": "01/03/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
				"Rev. Joel Dykstra (905) 386-0737"
			],
			"phone": "(905) 386-0737",
			"fax": "",
			"email": "secretary.wurc@gmail.com",
			"website": "http://www.wellandporturc.org"
		},
		"meetingInformation": "9:30 AM and 2:30 PM",
		"updated": "01/05/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
			"fax": "(631) 589-9281",
			"email": "office@wsrbc.org",
			"website": "www.wsrbc.org"
		},
		"meetingInformation": "9:30 AM and 1:00 PM",
		"updated": "01/13/2025",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "01/02/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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
		"updated": "06/25/2026",
		"source": "https://www.urcna.org/sysfiles/member/family/urcna_report.cfm?memberid=1651&public=1"
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

const normalize = (value) => value.toLowerCase().trim();

const markerKey = (marker) => `${marker.name}-${marker.location}`;

const wrappedMarkerKey = (marker) => `${markerKey(marker)}-${marker.wrapOffset ?? 0}`;

const wrapPositionNear = (position, targetLng) => {
	const [lat, lng] = position;
	const wrapOffset = Math.round((targetLng - lng) / 360) * 360;

	return [lat, lng + wrapOffset];
};

const getRegion = (location) => {
	const parts = location.split(',').map((part) => part.trim()).filter(Boolean);
	return parts.length > 1 ? parts[parts.length - 1] : '';
};

const isDisplayMarker = (marker) => marker.name !== '.' && marker.location !== '.';

const CLUSTER_RADIUS = 42;

const markerSearchText = (marker) => [
	marker.name,
	marker.location,
	typeLabels[marker.type],
	getRegion(marker.location),
	marker.classis,
	marker.meetingInformation,
	marker.mailingAddress?.formatted,
	marker.meetingAddress?.formatted,
	marker.contact?.ministers?.join(' '),
	marker.contact?.phone,
	marker.contact?.email,
	marker.contact?.website,
].filter(Boolean).join(' ');

const createSearchHit = (marker) => ({
	...marker,
	objectID: markerKey(marker),
	typeLabel: typeLabels[marker.type] ?? marker.type,
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

const matchesRefinements = (hit, refinements) => {
	return Object.entries(refinements).every(([attribute, values]) => {
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
						type: facetCounts(searchedHits, 'type'),
						region: facetCounts(searchedHits, 'region'),
					},
				};
			}),
		});
	},
	searchForFacetValues() {
		return Promise.resolve([]);
	},
});

const SearchInput = ({ onInteraction }) => {
	const { query, refine } = useSearchBox();
	const { refine: clearRefinements, canRefine } = useClearRefinements();
	const canClear = canRefine || query.length > 0;

	return (
		<label>
			<span>Search</span>
			<div className="map-searchbox">
				<input
					type="search"
					value={query}
					onChange={(event) => {
						onInteraction();
						refine(event.target.value);
					}}
					placeholder="Church, city, classis, minister"
				/>
				{canClear ? (
					<button
						type="button"
						className="map-searchbox__clear"
						aria-label="Clear search and filters"
						onClick={() => {
							onInteraction();
							refine('');
							clearRefinements();
						}}
					>
						×
					</button>
				) : null}
			</div>
		</label>
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
		<label>
			<span>{label}</span>
			<select
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

const SearchSummary = ({ total }) => {
	const { results } = useInstantSearch();

	return <p>{results?.nbHits ?? total} of {total} locations</p>;
};

const SearchResults = ({ selectedKey, onSelect, onOpenDetails, onHitsChange }) => {
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

	return (
		<div className="map-results" aria-live="polite">
			{hits.length === 0 ? (
				<div className="map-empty">No locations match those filters.</div>
			) : (
				hits.map((marker) => {
					const key = markerKey(marker);
					const isSelected = key === selectedKey;

					const handleSelect = () => onSelect(key);

					return (
						<div
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
							aria-selected={isSelected}
							className={`map-result ${isSelected ? 'map-result--selected' : ''}`}
							onClick={handleSelect}
							onKeyDown={(event) => {
								if (event.key === 'Enter' || event.key === ' ') {
									event.preventDefault();
									handleSelect();
								}
							}}
						>
							<span className="map-result__name">{marker.name}</span>
							<span className="map-result__location">{marker.location}</span>
							<span className="map-result__icon-slot">
								<button
									type="button"
									className="map-result__icon-button"
									aria-label={`Show information for ${marker.name}`}
									onClick={(event) => {
										event.stopPropagation();
										onOpenDetails(key);
									}}
								>
									<img
										className="map-result__icon"
										src={markerIconUrls[marker.type]}
										alt=""
									/>
								</button>
							</span>
						</div>
					);
				})
			)}
		</div>
	);
};

const MapFocus = ({ marker, openPopupKey, markerRefs, onPopupOpened }) => {
	const map = useMap();

	useEffect(() => {
		if (!map || !marker) return;
		const center = map.getCenter();
		const wrappedPosition = wrapPositionNear(marker.position, center.lng);
		const zoom = Math.max(map.getZoom(), 8);

		map.setView(wrappedPosition, zoom, {
			animate: true,
			duration: 0.4,
		});

		if (openPopupKey === markerKey(marker)) {
			const openPopupWrapOffset = Math.round((wrappedPosition[1] - marker.position[1]) / 360) * 360;
			const timeoutId = window.setTimeout(() => {
				const markerRef = markerRefs.current.get(`${openPopupKey}-${openPopupWrapOffset}`);
				markerRef?.openPopup();
				onPopupOpened();
			}, 450);

			return () => window.clearTimeout(timeoutId);
		}
	}, [map, marker, markerRefs, onPopupOpened, openPopupKey]);

	return null;
};

const addressLines = (address) => address?.formatted?.split('\n').filter(Boolean) ?? [];

const directionsUrl = (marker) => {
	const address = marker.meetingAddress;
	const query = address?.formatted?.replace(/\n/g, ', ') || marker.location;

	return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
};

const ChurchPopup = ({ marker }) => {
	const ministers = marker.contact?.ministers ?? [];

	return (
		<div className="church-popup">
			<div className="church-popup__header">
				<span>Church Information</span>
			</div>
			<h2>{marker.name}</h2>
			<div className="church-popup__grid">
				<section>
					<h3>Mailing Address</h3>
					{addressLines(marker.mailingAddress).map((line) => (
						<p key={line}>{line}</p>
					))}
				</section>

				<section>
					<h3>Meeting At</h3>
					{addressLines(marker.meetingAddress).map((line) => (
						<p key={line}>{line}</p>
					))}
					<a href={directionsUrl(marker)} target="_blank" rel="noopener noreferrer">
						View Map & Driving Directions
					</a>
				</section>

				<section>
					<h3>Contact Information</h3>
					{ministers.length > 0 ? (
						<p><strong>Minister:</strong> {ministers.join(', ')}</p>
					) : null}
					{marker.contact?.email ? (
						<p><strong>Email:</strong> <a href={`mailto:${marker.contact.email}`}>{marker.contact.email}</a></p>
					) : null}
					{marker.contact?.phone ? (
						<p><strong>Phone:</strong> {marker.contact.phone}</p>
					) : null}
					{marker.contact?.fax ? (
						<p><strong>Fax:</strong> {marker.contact.fax}</p>
					) : null}
					{marker.link ? (
						<p><strong>Website:</strong> <a href={marker.link} target="_blank" rel="noopener noreferrer">{marker.contact?.website || marker.link}</a></p>
					) : null}
				</section>

				<section>
					<h3>Meeting Information</h3>
					{marker.meetingInformation ? <p>{marker.meetingInformation}</p> : null}
					{marker.classis ? (
						<div className="church-popup__stacked">
							<h3>Classis</h3>
							<p>{marker.classis}</p>
						</div>
					) : null}
					{marker.updated ? <p className="church-popup__updated">Updated {marker.updated}</p> : null}
				</section>
			</div>
		</div>
	);
};

const DefaultPopup = ({ marker }) => (
	<div className="flex flex-col items-center gap-5 p-2 md:flex-row md:gap-8 rounded-2xl">
		{marker.image ? (
			<div>
				<img className="shadow-xl rounded-md" alt="" src={marker.image} loading="lazy"/>
			</div>
		) : null}
		<div className="flex flex-col items-center md:items-start">
			<span className="text-2xl font-medium">{marker.name}</span>
			<span className="font-medium text-sky-500">{marker.location}</span>
			<a href={marker.link} target="_blank" rel="noopener noreferrer" className="text-sky-700 underline">Learn More</a>
		</div>
	</div>
);

const createClusterIcon = (count) => L.divIcon({
	className: 'map-cluster-marker',
	html: `<span>${count}</span>`,
	iconSize: [30, 30],
	iconAnchor: [15, 15],
});

const clusterMarkers = (map, markers) => {
	const groups = [];

	for (const marker of markers) {
		const point = map.latLngToLayerPoint(marker.position);
		const group = groups.find((candidate) => point.distanceTo(candidate.center) < CLUSTER_RADIUS);

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

		const bounds = L.latLngBounds(group.markers.map((marker) => marker.position));

		return {
			key: group.key,
			type: 'cluster',
			count: group.markers.length,
			position: map.layerPointToLatLng(group.center),
			bounds,
		};
	});
};

const MarkerLayer = memo(function MarkerLayer({ markers, markerRefs, onMarkerSelect }) {
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
							map.fitBounds(item.bounds, {
								animate: true,
								maxZoom: Math.min(map.getZoom() + 3, 12),
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
				key={wrappedMarkerKey(marker)}
				position={marker.position}
				icon={icons[marker.type]}
				ref={(instance) => {
					if (instance) markerRefs.current.set(wrappedMarkerKey(marker), instance);
				}}
				eventHandlers={{
					click: () => {
						onMarkerSelect(markerKey(marker));
					},
				}}
			>
				<Popup>
					{marker.type === 'church' ? <ChurchPopup marker={marker} /> : <DefaultPopup marker={marker} />}
				</Popup>
			</Marker>
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
				const toolbar = L.DomUtil.create('div', 'map-controls__toolbar', div);
				L.DomEvent.disableClickPropagation(div);
				L.DomEvent.disableScrollPropagation(div);

				const zoomInButton = L.DomUtil.create('button', 'map-controls__button map-controls__button--icon', toolbar);
				zoomInButton.type = 'button';
				zoomInButton.innerHTML = '+';
				zoomInButton.setAttribute('aria-label', 'Zoom in');

				L.DomEvent.on(zoomInButton, 'click', () => {
					map.zoomIn();
				});

				const zoomOutButton = L.DomUtil.create('button', 'map-controls__button map-controls__button--icon', toolbar);
				zoomOutButton.type = 'button';
				zoomOutButton.innerHTML = '&minus;';
				zoomOutButton.setAttribute('aria-label', 'Zoom out');

				L.DomEvent.on(zoomOutButton, 'click', () => {
					map.zoomOut();
				});

				const button = L.DomUtil.create('button', 'map-controls__button map-controls__button--reset', toolbar);
				button.type = 'button';
				button.innerHTML = 'Reset Zoom';

				L.DomEvent.on(button, 'click', () => {
					const currentMarkers = markersRef.current;
					if (currentMarkers.length > 0) {
						const bounds = L.latLngBounds(currentMarkers.map((m) => [m.lat, m.lng]));
						map.fitBounds(bounds, { padding: [50, 50] });
					}
				});

				const legendList = L.DomUtil.create('div', 'map-controls__legend', div);

				for (const icon of Object.values(icons)) {
					const row = L.DomUtil.create('div', 'map-controls__legend-row', legendList);
					const legend = L.DomUtil.create('img', 'map-controls__legend-icon', row);
					legend.src = icon.options.iconUrl;
					legend.alt = '';

					row.appendChild(document.createTextNode(icon.options.name));
				}

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
	const [filteredMarkers, setFilteredMarkers] = useState(searchHits);
	const [selectedKey, setSelectedKey] = useState('');
	const [openPopupKey, setOpenPopupKey] = useState('');
	const markerRefs = useRef(new Map());
	const clearSelection = useCallback(() => {
		setSelectedKey('');
		setOpenPopupKey('');
	}, []);
	const selectMarker = useCallback((key) => {
		setSelectedKey(key);
		setOpenPopupKey('');
	}, []);
	const openMarkerDetails = useCallback((key) => {
		setSelectedKey(key);
		setOpenPopupKey(key);
	}, []);
	const handlePopupOpened = useCallback(() => {
		setOpenPopupKey('');
	}, []);
	const handleHitsChange = useCallback((hits) => {
		setFilteredMarkers(hits);
	}, []);

	const selectedMarker = useMemo(() => {
		return filteredMarkers.find((marker) => markerKey(marker) === selectedKey) ?? null;
	}, [filteredMarkers, selectedKey]);

	const boundsMarkers = useMemo(() => {
		return filteredMarkers.map((marker) => ({ lat: marker.position[0], lng: marker.position[1] }));
	}, [filteredMarkers]);

	const wrappedMarkers = useMemo(() => {
		return filteredMarkers.flatMap((marker) => {
			return [-360, 0, 360].map((wrapOffset) => ({
				...marker,
				wrapOffset,
				position: [marker.position[0], marker.position[1] + wrapOffset],
			}));
		});
	}, [filteredMarkers]);

	return (
		<InstantSearch searchClient={searchClient} indexName="urcna_locations" future={{ preserveSharedStateOnUnmount: true }}>
			<Configure hitsPerPage={500} facets={['type', 'region']} />
			<div className="map-shell">
				<aside className="map-sidebar" aria-label="Map search and results">
					<div className="map-sidebar__header">
						<h1>URCNA Map</h1>
						<SearchSummary total={allMarkers.length} />
					</div>

					<div className="map-filters">
						<SearchInput onInteraction={clearSelection} />
						<FacetSelect
							attribute="type"
							label="Category"
							allLabel="All categories"
							labelForValue={(value) => typeLabels[value] ?? value}
							onInteraction={clearSelection}
						/>
						<FacetSelect
							attribute="region"
							label="State / Province"
							allLabel="All regions"
							onInteraction={clearSelection}
						/>
					</div>

					<SearchResults
						selectedKey={selectedKey}
						onSelect={selectMarker}
						onOpenDetails={openMarkerDetails}
						onHitsChange={handleHitsChange}
					/>
				</aside>

				<div className="map-canvas">
					<MapContainer
						center={[34, -55]}
						zoom={3.25}
						style={{ height: '100%', width: '100%' }}
						zoomControl={false}
						preferCanvas
						worldCopyJump
						minZoom={3}
						zoomSnap={0.25}
						wheelDebounceTime={60}
						wheelPxPerZoomLevel={90}
					>
						<FitBoundsButton markers={boundsMarkers} />

						<TileLayer
							url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
							updateWhenIdle
							updateWhenZooming={false}
							keepBuffer={4}
							maxNativeZoom={19}
						/>

						<MarkerLayer markers={wrappedMarkers} markerRefs={markerRefs} onMarkerSelect={selectMarker} />
						<MapFocus
							marker={selectedMarker}
							openPopupKey={openPopupKey}
							markerRefs={markerRefs}
							onPopupOpened={handlePopupOpened}
						/>
					</MapContainer>
				</div>
			</div>
		</InstantSearch>
	);
};

export default WorldMap;
