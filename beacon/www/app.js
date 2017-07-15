
	
        testAjax = function()
        {
	    //alert("IN")
var hookurl = 'http://140.116.223.100:8080/'
            $.ajax({
		url: hookurl + 'polls/beaconAPI/',
		type: 'post',
		data: {
		  'ID': "801-19012-493"
		},
		dataType: 'json',
		success: function (data) {
		  //alert('sss')
		  if(data.is_beacon)
		  {
		    $("#btt").text('YES')
		  }
		  else
			$("#btt").text('NO')
		},
		failure: function(data){
		    alert("SSSSS");
		}
		
	      });
        }

$("#btt").click(testAjax);
// Application object.
var app = {}

// Regions that define which page to show for each beacon.
app.beaconRegions2 =
[
	{
		id: 'page-feet',
		uuid:'B01BCFC0-8F4B-11E5-A837-0821A8FF9A66',
		major: 19012,
		minor: 49333
		
	}
	
]
app.beaconRegions =
[
	{
		id: 'page-feet',
		uuid:'B01BCFC0-8F4B-11E5-A837-0821A8FF9A66',
		major: 19012,
		minor: 49333
	},
	{
		id: 'page-shoulders',
		uuid:'D3556E50-C856-11e3-8408-0221A885EF40',
		major: 54028,
		minor: 60999
		
	},
	{
		id: 'page-face',
		uuid:'D3556E50-C856-11e3-8408-0221A885EF40',
		major: 28662,
		minor: 43089
	}
]

// Currently displayed page.
app.currentPage = 'page-default'

app.initialize = function()
{
	document.addEventListener(
		'deviceready',
		app.onDeviceReady,
		false)
	//document.getElementById("txtt").innerHTML="FFFF"
	//cordova.plugins.BluetoothStatus.initPlugin()
	app.gotoPage(app.currentPage)
}
app.test = function()
{
	document.getElementById("txtt").innerHTML="433FFF"
}
// Called when Cordova are plugins initialised,
// the iBeacon API is now available.
app.onDeviceReady = function()
{
	// Specify a shortcut for the location manager that
	// has the iBeacon functions.
	window.locationManager = cordova.plugins.locationManager
	
	// Start tracking beacons!
	app.startScanForBeacons()
}

app.startScanForBeacons = function()
{
	alert('startScanForBeacons')

	// The delegate object contains iBeacon callback functions.
	// The delegate object contains iBeacon callback functions.
	var delegate = new cordova.plugins.locationManager.Delegate()

	delegate.didDetermineStateForRegion = function(pluginResult)
	{
		//alert('didDetermineStateForRegion: ' + JSON.stringify(pluginResult))
	}

	delegate.didStartMonitoringForRegion = function(pluginResult)
	{
		//alert('didStartMonitoringForRegion:' + JSON.stringify(pluginResult))
	}

	delegate.didRangeBeaconsInRegion = function(pluginResult)
	{
		//myApp.alert('didRangeBeaconsInRegion: ' + JSON.stringify(pluginResult))
		app.didRangeBeaconsInRegion(pluginResult)
	}
	
	delegate.didEnterRegion = function(pluginResult)
	{
		//app.didEnterRegion(pluginResult)
	}

	// Set the delegate object to use.
	locationManager.setDelegate(delegate)
	
	locationManager.requestAlwaysAuthorization()
	//alert(cordova.plugins.BluetoothStatus.iosAuthorized)
	//alert(tt)
	// Start monitoring and ranging our beacons.
	for (var r in app.beaconRegions)
	{
		var region = app.beaconRegions[r]

		var beaconRegion = new locationManager.BeaconRegion(
			region.id, region.uuid, region.major, region.minor)
		
		// Start monitoring.
		locationManager.startMonitoringForRegion(beaconRegion)
			.fail(app.test())
			.done()

		// Start ranging.
		locationManager.startRangingBeaconsInRegion(beaconRegion)
			.fail()
			.done()
	}
}

app.didEnterRegion = function(pluginResult)
{
	if (0 == pluginResult.beacons.length)
	{
		return
	}
	var IDs = []
	
	for(var i=0; i<pluginResult.beacons.length;i++)
	{
		var beacon = pluginResult.beacons[i]
		var uuid = beacon.uuid
		var major = beacon.major
		var minor = beacon.minor
		
		var shortUUID = app.mappingShortUUID(uuid)
		
		//The ID on the SPOT platform
		var ID = shortUUID +'-'+ major +'-'+ minor
		//alert(beacon.uuid)
		IDs.push(ID)
	}
	
	///////////////
	//Further operations
	//AJAX Django
	app.testAjax(IDs[0])
}

app.testAjax = function(shortID)
{
    //alert(shortID)

var hookurl = 'http://140.116.223.100:8080/'
    $.ajax({
	url: hookurl + 'polls/beaconAPI/',
	type: 'post',
	data: {
	  'ID': shortID
	},
	dataType: 'json',
	success: function (data) {
	  //alert('sss')
	  if(data.is_beacon)
	  {
		//alert(data.ID)
	    $("#lb_t").text(data.ID)
	  }
	  //else
		//$("#lb").text('NO')
	},
	failure: function(data){
	    alert("SSSSS")
	}
	
      });
}

app.mappingShortUUID = function(UUID)
{
	var shortUUID = ""
	UUID = UUID.toUpperCase()
	if(UUID == "B01BCFC0-8F4B-11E5-A837-0821A8FF9A66")
		shortUUID = "801"
	else if(UUID == "B01BCFC0-8F4B-11E5-A837-0821A8FFFFFF")
		shortUUID = "995801"
	else if(UUID == "d3556e50-c856-11e3-8408-0221a885ef40")
		shortUUID = "1"
	else if(UUID == "4408D700-8CC3-42E6-94D5-ADA446CF2D72")
		shortUUID = "2"
	else if(UUID == "D3556E50-C856-11E3-8408-0221A8FFEF40")
		shortUUID = "1"
	else if(UUID == "D3556E50-C856-11E3-8408-0221A8FFFFFF")
		shortUUID = "9951"
	else if(UUID == "D3556E50-C856-11E3-8408-0221A885FFFF")
		shortUUID = "9951"
	
	return shortUUID
	
}
// Display pages depending of which beacon is close.
app.didRangeBeaconsInRegion = function(pluginResult)
{	
	
	//alert("test"+pluginResult.beacons.length)
	// There must be a beacon within range.
	if (0 == pluginResult.beacons.length)
	{
		return
	}

	// Our regions are defined so that there is one beacon per region.
	// Get the first (and only) beacon in range in the region.
	var beacon = pluginResult.beacons[0]

	// The region identifier is the page id.
	var pageId = pluginResult.region.identifier

	//console.log('ranged beacon: ' + pageId + ' ' + beacon.proximity)

	// If the beacon is close and represents a new page, then show the page.
	if ((beacon.proximity == 'ProximityImmediate' )
		&& app.currentPage != pageId)
	{
		app.gotoPage(pageId)
		//alert(beacon.major+beacon.uuid) 
		app.didEnterRegion(pluginResult)
		return
	}

	// If the beacon represents the current page but is far away,
	// then show the default page.
	if ((beacon.proximity == 'ProximityFar' || beacon.proximity == 'ProximityUnknown'|| beacon.proximity == 'ProximityNear')
		&& app.currentPage == pageId)
	{
		app.gotoPage('page-default')
		
		return
	}
}

app.gotoPage = function(pageId)
{
	app.hidePage(app.currentPage)
	app.showPage(pageId)
	app.currentPage = pageId
}

app.showPage = function(pageId)
{
	document.getElementById(pageId).style.display = 'block'
}

app.hidePage = function(pageId)
{
	document.getElementById(pageId).style.display = 'none'
}

// Set up the application.
app.initialize()
