// The module encapsulates the Google People API functionality.
// Authentication occurs in the following order:
// 1.  Checks if current user authorized application in procedure, checkAuth.
// 2.  Sends results of check to procedure, handleAuthResult.
// 3a.  If authorization already exists, loads Google People API.
// 3b.  If authorization does not already exist, ...
// ... Wait for user to send a request to authenticate (button click, ...).
// 4.  The procedure, handleAuthClick, launches an authentication window for the Google API.
// 5.  The results of the authentication process get sent to the procedure, handleAuthResult.
// 6.  Proceeds with step 3a / 3b.

// Global variables.

// The Client ID can be retrieved from the project in the Google
// Developer Console, https://console.developers.google.com
var g_strClientID = '.apps.googleusercontent.com'; // Add rest of key through function.  Place contents of first portion of key in file.

// Scope of permissions to allow.
var g_strScope = ["https://www.googleapis.com/auth/contacts.readonly"];

function checkAuth()
	
	{
	// The procedure checks if the current user has authorized the application.
	// The procedure gets called when instantiating the Google API, during the load process.
	// The call to load the script, apis.google.com/js/client.js, sets the procedure to executing during the onload event.
	// The result of the authentication check gets sent to the procedure, handleAuthResult.
	
	// Check if current user authorized application.
	// Send results to procedure, handleAuthResult.
    gapi.auth.authorize(
		{
        'client_id': loadKeyFile(),
        'scope': g_strScope.join(' '),
        'immediate': true
        }, handleAuthResult);
    }
	
function onSuccess(googleUser) {
      
    }
    function onFailure(error) {
      
    }

	
// objAuthResult = Authorization result (token object).
function handleAuthResult(objAuthResult)

	{
	// The procedure handles the response from the authorization server.
	// The procedure gets called either when loading the Google API or after the user attempts to authenticate.
	// The procedure determines whether to use an existing token or continue with step 2 of the authentication process.
	// The process also can get called a second time, if authentication initially fails.
    
	try
		{
		var authorizeDiv;
		
		authorizeDiv = document.getElementById('authorize-div');
		
		// If token exists, then...
		if (objAuthResult && !objAuthResult.error)
			
			{
			// Token exists or authentication successful.
			
			// Hide auth UI, then load client library.
			authorizeDiv.style.display = 'none';
			
			// Load the Google People API.
			loadPeopleApi();
			}
		else
			
			{
			// Either token did not exist upon load or authentication failed.
			// Need to authenticate.
			
			// Show auth UI, allowing the user to initiate authorization by
			// clicking authorize button.
			authorizeDiv.style.display = 'inline';
			}
			
		} // End ... try.
		
	catch(err)
		{
		alert("error:  " + err);
		}
		
    }
	
function loadKeyFile()

	{
	// Recommend obfuscating this and any encryption procedures.
		
	// The function fetches and returns the important portion of the Google client client.
	// Decryption occurs after reading the key file.
		
	var oFrame; // Reference to iFrame containing contents of text file with Google client key.
	var strDecryptedKey; // Decrypted Google client key.
	var strRawContents; // Text file contents.
	
	// Get reference to iFrame containing contents of text file with Google client key.
	oFrame = document.getElementById("frmGoogleKey");
	
	// Get contents of text file with Google client key.
	strRawContents = oFrame.contentWindow.document.body.childNodes[0].innerHTML;
	
	// Add decryption process here (assuming file contains encrypted key).
	//strDecryptedKey = decryptText(strRawContents);
	
	// Build full Google client key.
	//return strDecryptedKey + g_strClientID;
	return strRawContents + g_strClientID;
	}
	
function handleAuthClick()

	{
	// The procedure initializes the authorization flow, launching the authentication window.
	// The results of the authentication process get sent to the procedure, handleAuthResult.
	// Step 1 of the authorization process.
	
	// Change background color of sign-in rectangle.
	mouseClickGoogleLogin();
	
	// Get client ID.
	//readClientID();
	
	// Launch authentication window for Google API.
	// Send results to procedure, handleAuthResult.
	gapi.auth.authorize(
		{client_id: loadKeyFile(), scope: g_strScope, immediate: false},
		handleAuthResult);
	return false;
	}
	
function loadPeopleApi()

	{
	// The procedure loads the Google People client library.  If available, gets list names of ten connections.
	// Occurs after successful authentication / use of token.
	
	// Load Google People client library.
	// Call procedure, listConnectionNames, to get list names of ten connections.
	gapi.client.load('https://people.googleapis.com/$discovery/rest', 'v1', listConnectionNames);
	}
	
// strMessage = Message text to be placed in pre-element.
function appendPre(strMessage)
	
	{
    // The procedure appends the passed text to the preformatted text tab.
	// The passed message exists as a text node.
	
	var objPre; // Reference to preformatted text tab in web page that will contain results of Google API operations.
	var objTextContent; // One line of content to add to preformatted text tab, stored as a text node.
	
	// Get reference to preformatted text tab.
	objPre = document.getElementById('output');
	
	// Create object containing one line of text (with passed string and carriage return).
	objTextContent = document.createTextNode(strMessage + '\n');
	
	// Add (append) text node object to preformatted text tab.
	objPre.appendChild(objTextContent);
	}
	
function listConnectionNames()

	{
	// The procedure prints the display name, if available, for ten connections.
	
	var objConnections; // Connection information object.
	var objPerson; // Object containing details about a single contact.
	var objRequest; // Object related to request sent to Google API for connection information.
	
	// Put together request to get details for ten connections.
	objRequest = gapi.client.people.people.connections.list(
		{
		'resourceName': 'people/me',
		'pageSize': 10
		});

	// Execute request to get details for ten connections.
	// Use callback function to handle results.
	objRequest.execute(
		// objResponse = Object containing response from Google API.
		function(objResponse)
			{
			// The function loops through the connections returned by Google API.
			// The function calls the procedure, appendPre, for each connection.
			// The function, appendPre, appends the display name of the connection as a text node in a preformatted text tag.
			
			// Get reference to connections returned in response.
			objConnections = objResponse.connections;
			
			// Add a line to the text output, "Connections".
			appendPre('Connections below:');

			// If one or more connections found, then...
			if (objConnections.length > 0)
				
				{
				// One or more connections found.
				
				// Loop through connections.
				for (i = 0; i < objConnections.length; i++)
					{
					// Get reference to current connection in loop.
					objPerson = objConnections[i];
					
					// If display name exists for connection, then...
					if (objPerson.names && objPerson.names.length > 0)
						{
						// Display name exists for current connection.
						
						// Add display name to the text output.
						appendPre(objPerson.names[0].displayName)
						}
					else 
						{
						// Display name does not exist for current connection.
						
						// Add warning that no display name exists for connection to text output.
						appendPre("No display name found for connection.");
						}
					}
				} // End ... If one or more connections found.
			
			else
			
				{
				// No connections found.
				// Add warning to text output that no connections exist.
				appendPre('No connections found.');
				}
			}); // End of objRequest execution functionality.
			
	// Display button allowing for logging out of Google API.
	document.getElementById("logout-button").style.visibility = "visible";
	}
	
function logoutGoogleAPI()

	{
	// The procedure creates and uses a hidden iframe to log out of Google.
		
	var obj_iFrame; // Reference to iframe to use to log out of Google.
	var strHTML; // HTML to use within iframe.
	
	// Create iframe element.
	obj_iFrame = document.createElement('iframe');
	
	// Store text to use as HTML within iframe.
	strHTML = '<script type="text/javascript" src="https://accounts.google.com/logout"></script>';
	
	// Set iframe to not appear.
	obj_iFrame.style.display = "none";
	
	// Append iframe to web page.
	document.body.appendChild(obj_iFrame);
	
	// Open the iframe for editing.
	obj_iFrame.contentWindow.document.open();
	
	// Write the contents of the iframe.
	obj_iFrame.contentWindow.document.write(strHTML);
	
	// Close the reference to the iframe.
	obj_iFrame.contentWindow.document.close();
	
	// Hide button allowing for logging out of Google API.
	document.getElementById("logout-button").style.visibility = "hidden";
	
	// Show paragraph indicating the logout occurred.
	document.getElementById("logged-out").style.visibility = "visible";
	}
	
function rolloverGoogleLogin()

	{
	// The procedure occurs when the user rolls over the Google login button.
	// The procedure darkens the gradient borders for the button.
	// The procedure also returns the background color of the right portion of the button to its original color.
	document.getElementById("authorize-div").style.mozborderimage = "-moz-linear-gradient(rgb(66, 133, 235), rgb(26, 93, 204)) stretch";
	document.getElementById("authorize-div").style.WebkitBorderImage = "-webkit-linear-gradient(rgb(66, 133, 235), rgb(26, 93, 204)) stretch"; 
	document.getElementById("authorize-div").style.borderImage = "linear-gradient(rgb(66, 133, 235), rgb(26, 93, 204)) 4 4 stretch";
	document.getElementById("google_box_right_id").style.backgroundColor = "RGB(66, 133, 244)";
	}
	
function mouseLeaveGoogleLogin()

	{
	// The procedure occurs when the user leaves the Google login button.
	// The procedure lightens the gradient borders for the button -- returning them to their original properties.
	// The procedure also returns the background color of the right portion of the button to its original color.
	document.getElementById("authorize-div").style.mozborderimage = "-moz-linear-gradient(rgb(86, 153, 255), rgb(46, 113, 224)) stretch";
	document.getElementById("authorize-div").style.WebkitBorderImage = "-webkit-linear-gradient(rgb(86, 153, 255), rgb(46, 113, 224)) stretch"; 
	document.getElementById("authorize-div").style.borderImage = "linear-gradient(rgb(86, 153, 255), rgb(46, 113, 224)) 4 4 stretch";
	document.getElementById("google_box_right_id").style.backgroundColor = "RGB(66, 133, 244)";
	}
	
function mouseClickGoogleLogin()

	{
	// The procedure occurs when the user rolls over the Google login button.
	// The procedure darkens the gradient borders for the button.
	// The procedure darkens the background color of the right portion of the button.
	document.getElementById("authorize-div").style.mozborderimage = "-moz-linear-gradient(rgb(86, 153, 255), rgb(46, 113, 224)) stretch";
	document.getElementById("authorize-div").style.WebkitBorderImage = "-webkit-linear-gradient(rgb(86, 153, 255), rgb(46, 113, 224)) stretch"; 
	document.getElementById("authorize-div").style.borderImage = "linear-gradient(rgb(86, 153, 255), rgb(46, 113, 224)) 4 4 stretch";
	document.getElementById("google_box_right_id").style.backgroundColor = "RGB(36, 103, 214)";
	}
	
/*
<a href="#" onclick="signOut();">Sign out</a>
<script>
  function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }
</script>
*/