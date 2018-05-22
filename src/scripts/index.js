
import $ from 'jquery';
import 'moment'
import 'fullcalendar';
import 'fullcalendar/dist/fullcalendar.css';
import 'fullcalendar/dist/locale/zh-cn';
// import 'fullcalendar/fullcalendar.css'

$(function(){

    const CLIENT_ID = '75762723705-6nhd7p78ua931uahehp1qu06uls4dj58.apps.googleusercontent.com';
    const API_KEY = 'AIzaSyCei6QH8WjNDJOonwzyKkVCVKtEGuaG0Y0';
    const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
    const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

    let authorizeButton = document.getElementById('authorize-button');
    let signoutButton = document.getElementById('signout-button');

    /**
     *  On load, called to load the auth2 library and API client library.
     */
    function handleClientLoad() {
        gapi.load('client:auth2', initClient);
    }

    /**
     *  Initializes the API client library and sets up sign-in state
     *  listeners.
     */
    function initClient() {
        gapi.client.init({
            apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES
        }).then(function () {
            // Listen for sign-in state changes.
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

            // Handle the initial sign-in state.
            updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            authorizeButton.onclick = handleAuthClick;
            signoutButton.onclick = handleSignoutClick;
        });
    }


    function initFullCalendar(options) {
        $('#calendar').fullCalendar({
            locale: 'zh',
            defaultView: 'agendaWeek',
            slotLabelFormat: 'H(:mm)点',
            ...options
        });
    }


    /**
     *  Called when the signed in status changes, to update the UI
     *  appropriately. After a sign-in, the API is called.
     */
    function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
            authorizeButton.style.display = 'none';
            signoutButton.style.display = 'block';
            listUpcomingEvents();
        } else {
            authorizeButton.style.display = 'block';
            signoutButton.style.display = 'none';
        }
    }

    /**
     *  Sign in the user upon button click.
     */
    function handleAuthClick(event) {
        gapi.auth2.getAuthInstance().signIn();
    }

    /**
     *  Sign out the user upon button click.
     */
    function handleSignoutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
    }

    /**
     * Print the summary and start datetime/date of the next ten events in
     * the authorized user's calendar. If no events are found an
     * appropriate message is printed.
     */
    function listUpcomingEvents() {
        gapi.client.calendar.events.list({
            'calendarId': 'primary',
            'timeMin': (new Date()).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 100,
            'orderBy': 'startTime'
        }).then(function(response) {

            let events = response.result.items;
            if (events.length > 0) {
                initFullCalendar({
                events: events.map((event) => {
                    return {
                        title: event.summary,
                        start: event.start.date,
                        end: event.end.date
                    }
                })
                });
            } else {
                alert('没有日历数据')
            }
        });
    }
    
    handleClientLoad();

    // function insertGoogleApi() {
    //     let script = document.createElement('script');
    //     script.src = 'https://apis.google.com/js/api.js';

    //     script.onload = function() {
    //         handleClientLoad();
    //     };
    //     // script.onreadystatechange = function(){
    //     //     if (this.readyState === 'complete') handleClientLoad()
    //     // };
    //     document.body.appendChild(script);
    // }
    // insertGoogleApi();
});