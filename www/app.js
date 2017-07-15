
	

// Application object.
var app = {}
app.hookurl = 'http://140.116.223.100:8080/'

testAjax = function()
{

	//var original_text = $("#lb_t").text()
	//var hookurl = 'http://140.116.223.100:8080/'
    $.ajax({
		url: app.hookurl + 'beacons/beaconAPI/',
		type: 'post',
		data: {
		  'ID': "801-19012-49333"
		},
		dataType: 'json',
		success: function (data) {
		  
		  if(data.is_beacon)
		  {
			//alert(data.ID)
		    $("#lb_t").text('Got response: YES')
		  }else
		  {
		  	$("#lb_t").text('Got response: NO')
		  }
		},
		error: function(err){
		   	$("#lb_t").text('ERROR')
		}
  	});
}

$("#btt").click(testAjax);

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
		id: 'tainan',
		uuid:'B01BCFC0-8F4B-11E5-A837-0821A8FF9A66'
	},
	{
		id: 'tainan_lowbattery',
		uuid:'B01BCFC0-8F4B-11E5-A837-0821A8FFFFFF'		
	},
	{
		id: 'test1',
		uuid:'D3556E50-C856-11E3-8408-0221A885EF40'
	},
	{
		id: 'test2',
		uuid:'4408D700-8CC3-42E6-94D5-ADA446CF2D72'
	},
	{
		id: 'test3',
		uuid:'D3556E50-C856-11E3-8408-0221A8FFEF40'
	},
	{
		id: 'test4',
		uuid:'D3556E50-C856-11E3-8408-0221A8FFFFFF'
	},
	{
		id: 'test5',
		uuid:'D3556E50-C856-11E3-8408-0221A885FFFF'
	}
]



app.initialize = function()
{
	document.addEventListener(
		'deviceready',
		app.onDeviceReady,
		false)
	document.addEventListener("online", app.onOnline, false);
	document.addEventListener("offline", app.onOffline, false);

	//document.getElementById("txtt").innerHTML="FFFF"
	//cordova.plugins.BluetoothStatus.initPlugin()
	//app.gotoPage(app.currentPage)
}
app.test = function()
{
	document.getElementById("txtt").innerHTML="433FFF"
}
// Called when Cordova are plugins initialised,
// the iBeacon API is now available.
app.checkConnection = function() {
    var networkState = navigator.connection.type;

    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.CELL]     = 'Cell generic connection';
    states[Connection.NONE]     = 'No network connection';

    //alert('Connection type: ' + states[networkState]);
    if(states[networkState] == 'No network connection')
    	return false
    else
    	return true
}


app.onOnline = function() {
    // Handle the online event
    
    $("#li_status").text("Searching..")
    app.startScanForBeacons()
}

app.onOffline = function() {
    // Handle the online event
    $("#li_status").text("Connection lost!!")
    app.stopScanForBeacons();
}
app.onDeviceReady = function()
{
	// Specify a shortcut for the location manager that
	// has the iBeacon functions.
	window.locationManager = cordova.plugins.locationManager
	//Only works for android
	locationManager.isBluetoothEnabled()
    .then(function(isEnabled){
        console.log("isEnabled: " + isEnabled);
        if (!isEnabled) {
        	if(device.platform == 'Android'){
        		if(confirm('Enable Bluetooth?'))
            		locationManager.enableBluetooth();
            	
        	}
            else
            	alert('Please turn on Bluetooth!')        
        }
    })
    .fail(function(e) { console.error(e); })
    .done();
    

    app.setIBeaconCallback() 
	// Start tracking beacons!
	if(app.checkConnection())
		app.startScanForBeacons()
	else{
		alert('No network!')
		$("#li_status").text("Connection lost!!")
	}
}


app.setIBeaconCallback = function()
{
	//alert('startScanForBeacons')

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
	delegate.didExitRegion = function(pluginResult)
	{

	}

	// Set the delegate object to use.
	locationManager.setDelegate(delegate)
	//IOS authorization
	locationManager.requestAlwaysAuthorization()
	
	
}
app.startScanForBeacons = function()
{
	// Start monitoring and ranging our beacons.
	for (var r in app.beaconRegions)
	{
		var region = app.beaconRegions[r]

		var beaconRegion = new locationManager.BeaconRegion(
			region.id, region.uuid, region.major, region.minor)
		
		// Start monitoring.
		locationManager.startMonitoringForRegion(beaconRegion)
			.fail()
			.done()

		// Start ranging.
		locationManager.startRangingBeaconsInRegion(beaconRegion)
			.fail()
			.done()
	}
}

app.stopScanForBeacons = function()
{
	// Start monitoring and ranging our beacons.
	for (var r in app.beaconRegions)
	{
		var region = app.beaconRegions[r]

		var beaconRegion = new locationManager.BeaconRegion(
			region.id, region.uuid, region.major, region.minor)
		
		// Start monitoring.
		locationManager.stopMonitoringForRegion(beaconRegion)
			.fail()
			.done()

		// Start ranging.
		locationManager.stopRangingBeaconsInRegion(beaconRegion)
			.fail()
			.done()
	}
}
app.transformToPlatformID = function(beacon)
{
	//var hookurl = 'http://140.116.223.100:8080/'
	var uuid = beacon.uuid
	var major = beacon.major
	var minor = beacon.minor
	
	var shortUUID = app.mappingShortUUID(uuid)
	
	//The ID on the SPOT platform
	var ID = shortUUID +'-'+ major +'-'+ minor
	return ID
	//var original_text = $("#lb_t").text() + '\n'
	///////////////
	//Further operations
	//AJAX Django.
	//app.testSend(ID)
}

app.requestToServer = function(shortID)
{
	//var hookurl = 'http://140.116.223.100:8080/'
	$.ajax({
		url: app.hookurl + 'beacons/beaconAPI/',
		type: 'post',
		data: {
		  'ID': shortID
		},
		dataType: 'json',
		//headers: {'Access-Control-Allow-Origin':'*'},
		success: function (data) {
		  //alert('sss')
		  //$("#lb_t").text("AAA")
		  if(data.is_beacon)
		  {
			//alert(data.ID)
		    //$("#lb_t").text(data.ID + 'YES')
		    $('#B'+shortID).text(shortID + ' Matched')
		  }else{
		  	//$("#lb_t").text(data.ID +'NO')
		  	$('#B'+shortID).text(shortID + ' NotMatched')
		  }
		  
			
		},
		error: function(err){
			$("#B"+shortID).remove()
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
	else if(UUID == "D3556E50-C856-11E3-8408-0221A885EF40")
		shortUUID = "1"
	else if(UUID == "4408D700-8CC3-42E6-94D5-ADA446CF2D72")
		shortUUID = "2"
	else if(UUID == "D3556E50-C856-11E3-8408-0221A8FFEF40")
		shortUUID = "1"
	else if(UUID == "D3556E50-C856-11E3-8408-0221A8FFFFFF")
		shortUUID = "9951"
	else if(UUID == "D3556E50-C856-11E3-8408-0221A885FFFF")
		shortUUID = "9951"
	else
		shortUUID = "000"
	
	return shortUUID
	
}
//Stores iBeacons
app.beaconList = {}

// Display pages depending of which beacon is close.
app.didRangeBeaconsInRegion = function(pluginResult)
{	
	
	//alert("test"+pluginResult.beacons.length)
	// There must be a beacon within range.
	if (0 == pluginResult.beacons.length)
	{
		return
	}

	for (var i=0;i < pluginResult.beacons.length ; i++)
	{
		var beacon = pluginResult.beacons[i]

		// The region identifier is the page id.
		//var pageId = pluginResult.region.identifier

		//console.log('ranged beacon: ' + pageId + ' ' + beacon.proximity)
		var platformID = app.transformToPlatformID(beacon)
		// If the beacon is close and represents a new page, then show the page.
		if ((beacon.proximity == 'ProximityImmediate' ))
		{
			//PAGE switch just for showcase
			//app.gotoPage(pageId)
			///alert(pageId)
			//$("#lb_t").text(pageId)
			//////Define your actions here
			if(!app.beaconList['B'+platformID]){
				$("#list-Beacon ul li:last").append('<li id=B'+platformID+'>'+platformID+' Verifying..</li>')
				//$("#B"+platformID).text("TESTTS")
				//app.beaconList[platformID] = true
				app.beaconList['B'+platformID] = true
			
				app.requestToServer(platformID)
				$("#lb_t").text('DEBUG'+pluginResult.beacons.length)
			}



			
		}

		// If the beacon represents the current page but is far away,
		// then show the default page.
		if (beacon.proximity == 'ProximityFar' || beacon.proximity == 'ProximityUnknown'|| beacon.proximity == 'ProximityNear')
			//&& app.currentPage == pageId)
		{
			//app.gotoPage('page-default')
			
			///////Define your actions here
			if(app.beaconList['B'+platformID]){
				$("#B"+platformID).remove()
				app.beaconList['B'+platformID] = false
			}




			
		}
	}

	return
	
}

app.gotoPage = function(pageId)
{
	//app.hidePage(app.currentPage)
	//app.showPage(pageId)
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
