// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// create tab group
//var tabGroup = Titanium.UI.createTabGroup();
//Create player window
var win1 = Titanium.UI.createWindow({  
    title:'Playing from songs',
    backgroundColor:'#606060'
});


//Media control
var mediaControls = require("de.codewave.ti.mediacontrols");
var mediaControlsView = mediaControls.createView({left:0,top:0,right:0,bottom:0});
var nowPlayingInfo = mediaControls.createNowPlayingInfo();
mediaControlsView.addEventListener("remoteControlPlay", function() {
	Titanium.API.info("Remote control 'play'.");
	player.play();
	nowPlayingInfo.setPlaybackRate(1);
	playButton.backgroundImage = "UIImages/pause.png";
});
mediaControlsView.addEventListener("remoteControlPause", function() {
	Titanium.API.info("Remote control 'pause'.");
	playButton.backgroundImage = "UIImages/play.png";
	player.pause();
	nowPlayingInfo.setPlaybackRate(0);
}); 
mediaControlsView.addEventListener("remoteControlStop", function() {
	Titanium.API.info("Remote control 'stop'.");
	player.stop();
    nowPlayingInfo.clear();
}); 
mediaControlsView.addEventListener("remoteControlPreviousTrack", function() {
	Titanium.API.info("Remote control 'previous track'.");
	previous();
});
mediaControlsView.addEventListener("remoteControlNextTrack", function() {
	Titanium.API.info("Remote control 'next track'.");
	nextSong();
}); 


function getRandomInt(min, max) { //Returns a random integer between given values
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function animateThumb(){
	//Thumb animation when touching
	for(i=0;i<5;i++){
		slider.thumbImage = "/thumbAnimation/thumbanimation"+(i+1)+".png";
		setTimeout(function(){},100);
	}
}
function thumbReverse(){
	//Reverse Thumb Animation
	for(i=5;i>0;i--){
		slider.thumbImage = "/thumbAnimation/thumbanimation"+i+".png";
		setTimeout(function(){},100);
	}
	slider.thumbImage = "UIImages/thumb2.png";
}
function setTitle(){
	//Set Music Title
	songTitle.text = songs[musicindex].title;
	nowPlayingInfo.setTitle(songs[musicindex].title);
	nowPlayingInfo.setArtist(songs[musicindex].artist);
	nowPlayingInfo.setPlaybackDuration(player.getDuration());
	nowPlayingInfo.setArtwork("Img/"+songs[musicindex].image);
	songTitle.width = Ti.Platform.displayCaps.platformWidth*0.6;
	songTitle.height = 30;
	albumImage.image = "Img/"+songs[musicindex].image;
	artistTitle.text = songs[musicindex].artist;
	if(musicindex==Object.keys(songs).length-1){
		nextAlbumImage.image = "Img/"+songs[0].image;
	}else{
		nextAlbumImage.image = "Img/"+songs[musicindex+1].image;
	}
	if(musicindex==0){
		prevAlbumImage.image = "Img/"+songs[Object.keys(songs).length-1].image;
	}else{
		prevAlbumImage.image = "Img/"+songs[musicindex-1].image;
	}
}
var randomPlaylist = [];
function createRandomPlaylist(){
	//Create a random array containing the songs in a random order
	size = Object.keys(originalPlaylist).length;
	randomPlaylist = null;
	randomPlaylist = [];
	value = 0;
	copyPlaylist = originalPlaylist.slice();
	randomPlaylist[0] = copyPlaylist[musicindex];
	copyPlaylist.splice(musicindex,1);
	for(i=0;i<size-1;i++){
		value = Math.round(Math.random()*(Object.keys(copyPlaylist).length-1));
		randomPlaylist.push(copyPlaylist[value]);
		copyPlaylist.splice(value,1);
	}
	
	songs = null;
	songs = randomPlaylist;
	
}
var originalPlaylist = [];
originalPlaylist.push({
	title: "Running Wild (Project 46 Remix)",
	artist: "Morgan Page ft. The Oddictions, Britt Daley",
	file: {url: "songs/sound2.mp3"},
	image: "rw.png"
});
originalPlaylist.push({
	title: "Hands to Myself (Ftampa Bootleg)",
	artist: "Selena Gomez",
	file: {url: "songs/sound3.mp3"},
	image: "Htm.png"
});
originalPlaylist.push({
	title: "S.I.D.H.A.N.",
	artist: "FTampa",
	file:{url: "songs/SIDHAN.mp3"},
	image: "Sidhan.png"
});
originalPlaylist.push({
	title: "Feels (KSHMR Remix)",
	artist: "Kiara",
	file: {url: "songs/Feels RMX.mp3"},
	image: "Feels.png"
});
var albumImage = Ti.UI.createImageView({ // ImageView for album image
	image: "Img/bidolibido.png",
	width: Ti.Platform.displayCaps.platformWidth*0.75,
	bottom: Ti.Platform.displayCaps.platformWidth*0.63,
	borderColor: 'black',
	borderWidth: 1
});
albumImage.addEventListener('swipe',function(e){ // Next/Previous song using swipe
	if(e.direction=='left'){
		//Next song
		nextSong();
	}else if(e.direction=='right'){
		//Previous song
		previous();
	}else if(e.direction=='down'){
		win1.close();
	}
});
var backImage = Ti.UI.createImageView({ // ImageView for background image
	image: "Img/background.png",
	width: Ti.Platform.displayCaps.platformWidth,
	height: Ti.Platform.displayCaps.platformHeight
});
var backSlider = Ti.UI.createImageView({ // ImageView for slide background **NEEDED BECAUSE OF BUG USING CUSTOM SLIDER IMAGES
	image: 'Img/slidebarback.png',
	left:32,
	bottom: 174
});
var nextAlbumImage = Ti.UI.createImageView({ // ImageView for next song album image
	image: "Img/bidolibido.png",
	width: Ti.Platform.displayCaps.platformWidth*0.68,
	bottom: Ti.Platform.displayCaps.platformWidth*0.66,
	right: '-60%',
	opacity: 0.5,
	borderColor: 'black',
	borderWidth: 1
});
var prevAlbumImage = Ti.UI.createImageView({ // ImageView for previous song album image
	image: "Img/bidolibido.png",
	width: Ti.Platform.displayCaps.platformWidth*0.68,
	bottom: Ti.Platform.displayCaps.platformWidth*0.66,
	left: '-60%',
	opacity: 0.5,
	borderColor: 'black',
	borderWidth: 1
});
var songs = originalPlaylist.slice(); // Create an array of songs based on the originalPlaylist array
function nextSong(){ //Skips current song
	if(musicindex==Object.keys(songs).length-1){
		//If is last song, goes back to first
		player.stop();
		player = Ti.Media.createSound(songs[0].file);
		player.allowBackground = true;
		player.setTime = 0;
		player.play();
		nowPlayingInfo.setPlaybackRate(1);
		addplayerEventListener();
		playButton.backgroundImage = "UIImages/pause.png";
		musicindex = 0;
		setTitle();
	}else{
		//If it is not last song, goes to the next one
		player.stop();
		player = Ti.Media.createSound(songs[musicindex+1].file);
		player.allowBackground = true;
		player.setTime = 0;
		player.play();
		nowPlayingInfo.setPlaybackRate(1);
		addplayerEventListener();
		playButton.backgroundImage = "UIImages/pause.png";
		musicindex += 1;
		setTitle();
	}
}
function previous(){ //Goes to previous soung
	if(player.getTime()<5000 || !player.isPlaying()){
		//Less than 5s, previous song
		if(musicindex==0){
			//first song, play last song
			player.stop();
			player = Ti.Media.createSound(songs[Object.keys(songs).length-1].file);
			player.allowBackground = true;
			player.setTime = 0;
			player.play();
			nowPlayingInfo.setPlaybackRate(1);
			addplayerEventListener();
			playButton.backgroundImage = "UIImages/pause.png";
			musicindex = Object.keys(songs).length-1;
			songTitle.text = songs[musicindex].title;
			setTitle();
		}else{
			//not first song, play previous
			player.stop();
			player = Ti.Media.createSound(songs[musicindex-1].file);
			player.allowBackground = true;
			player.setTime = 0;
			player.play();
			nowPlayingInfo.setPlaybackRate(1);
			addplayerEventListener();
			playButton.backgroundImage = "UIImages/pause.png";
			musicindex -= 1;
			songTitle.text = songs[musicindex].title;
			setTitle();
		}
	}else{
		//More than 5s, rewind the song
		player.stop();
		player.play();
		nowPlayingInfo.setPlaybackRate(1);
	}
}
function convertToMinutes(seconds){ //Convert from seconds to minutes:seconds
	minutes = 0;
	secondsf= 0;
	if(seconds !=0){
	minutes = Math.round(seconds/60.0-(seconds%60)/60);
	secondsf = Math.round(seconds - minutes*60);
	}
	if(secondsf.toString().length==1){
		return (minutes+":0"+secondsf);
	}else{
		return (minutes+":"+secondsf);
	}
}
var playButton = Titanium.UI.createButton({ // playButton Object
	title:'',
	bottom: 20,
	height: 80,
	width: 80,
	backgroundImage: "UIImages/play.png"
});
var nextButton = Ti.UI.createButton({ // nextButton Object
	title: '',
	bottom: 20,
	height: 80,
	width: 80,
	right: 106,
	backgroundImage: "UIImages/next.png"
});
var prevButton = Ti.UI.createButton({ // prevButton Object
	title: '',
	bottom: 20,
	height: 80,
	width: 80,
	left: 107,
	backgroundImage: "UIImages/previous.png"
});
var repeatButton = Ti.UI.createButton({ // repeatButton Object
	title: '',
	bottom: 33,
	height:50,
	right: 30,
	width: 75,
	backgroundImage: "UIImages/repeat.png"
});
repeat = false; // Repeat is off by default
repeatButton.addEventListener('click', function(e){ // Repeat on/off event listener
	// Activate/Deactivate repeat
	if(repeat==false){
		//repeatButton.title = 'Repeat: ON';
		repeatButton.backgroundImage = "UIImages/repeatactivate.png";
		repeat = true;
	}else{
		//repeatButton.title = 'Repeat: OFF';
		repeatButton.backgroundImage = "UIImages/repeat.png";
		repeat = false;
	}
});
var shuffleButton = Ti.UI.createButton({ // shuffleButton Object
	title: '',
	bottom: 33,
	height: 50,
	width: 75,
	left: 30,
	backgroundImage: "UIImages/shuffle.png"
});
shuffle = false; // Shuffle is off for default
shuffleButton.addEventListener('click',function(e){ // Activate/Deactivate shuffle
	if(shuffle==false){
		createRandomPlaylist();
		musicindex = 0;
		shuffle = true;
		//shuffleButton.title = "Shuffle: ON";
		shuffleButton.backgroundImage = "UIImages/shuffleactivate.png";
		setTitle();
	}else{
		already = false;
		for(i =0;i<Object.keys(songs).length;i++){
			if(songs[musicindex].title==originalPlaylist[i].title && already==false){
				musicindex = i;
				already = true;
			} 
		}
		songs = null;
		songs = originalPlaylist.slice();
		shuffle = false;
		//shuffleButton.title = "Shuffle: OFF";
		shuffleButton.backgroundImage = "UIImages/shuffle.png";
		setTitle();
	}
});
var musicindex = 0; // This variable is the current song index
var player = Titanium.Media.createSound({url: "songs/sound2.mp3", allowBackground: true}); // Create a new sound called player
Titanium.Media.audioSessionCategory = Titanium.Media.AUDIO_SESSION_CATEGORY_PLAYBACK; // Set audioSessionCategory
Titanium.Media.audioSessionMode = Titanium.Media.AUDIO_SESSION_MODE_PLAYBACK; // Set audioSessionMode
player.allowBackground = true; // Theoretically allows background, but not working
playButton.addEventListener('click', function(e){ // Add event listener to play/pause button
	// Play/Stop the song
	if(player.isPlaying()){
		playButton.backgroundImage = "UIImages/play.png";
		player.pause();
		nowPlayingInfo.setPlaybackRate(0);
	} else{
		playButton.backgroundImage = "UIImages/pause.png";
		player.play();
		nowPlayingInfo.setPlaybackRate(1);
	}
});
function addplayerEventListener(){ // Function to add complete event listener to player
	player.addEventListener('complete', function(e){
	// Called when the song ends
	if(musicindex<(Object.keys(songs).length-1) || repeat==true ){
		nextSong();
	}else{
		musicindex = 0;
		player = Ti.Media.createSound(songs[0].file);
		player.allowBackground = true;
		playButton.backgroundImage = "UIImages/play.png";
		songTitle.text = songs[0].title;
		setTitle();
	}
	clearInterval(nextinterval);
});	
}
addplayerEventListener(); // Calls the addplayerEventListener
var slider = Ti.UI.createSlider({ // Slider Object
	bottom:150,
	min:0,
	max:100,
	width: '90%',
	thumbImage:'UIImages/thumb2.png',
	backgroundLeftCap: 100,
	leftTrackImage: "UIImages/teste1.png",
	rightTrackImage: "UIImages/test6.png"
});
var label = Ti.UI.createLabel({ // Elapsed time label Object
	text:'0',
	textAlign:'center',
	bottom: 130,
	left: 25,
	color: 'white',
	font: {fontSize: 14, fontFamily: 'LiberationSerif'}
});
var songTitle = Ti.UI.createLabel({ // Song title label Object
	text: 'Title',
	textAlign:'center',
	color: 'white',
	bottom:125,
	font:{fontSize:18, fontFamily: 'LiberationSerif'}
});
var artistTitle = Ti.UI.createLabel({ // Artist title Label Object
	text: 'Artist',
	color: 'white',
	textAlign: 'center',
	bottom:110,
	font: {fontSize: 12, fontFamily: 'LiberationSerif'}
});
var remaining = Ti.UI.createLabel({ // Remaining time label Object
	text:'0:00',
	color: 'white',
	textAlign:'center',
	bottom: 130,
	right: 25,
	font: {fontSize: 14, fontFamily: 'LiberationSerif'}
});
var touching = false; // Feedback variable if user is touching slider thumb or not
var lastPosition = 0; // lastPosition variable is used to check if the slider position changed, and if not, let the music keep playing 
time=setInterval(function(){ // Update the elapsed ,remaining time and slider position, if user change the slider position, it changes the song elapsed time
label.text = convertToMinutes(Math.round(player.getTime()/1000.0));
remaining.text = "-"+convertToMinutes(Math.round(player.getDuration()-player.getTime()/1000.0));
nowPlayingInfo.setElapsedPlaybackTime(Math.round(player.getTime()/1000.0));

if(touching==false){// If user is not touching, set slider value to elapsed time/ duration
	slider.value = player.getTime()/(player.getDuration()*1000)*100;
}
if(touching==true){// If user is touching, set the song elapsed time to slider value*duration
	if(lastPosition!=slider.value){
		player.setTime(slider.value*10.0*player.getDuration());
		//label.text = convertToMinutes(Math.round(player.getTime()/1000.0));
		//remaining.text = "-"+convertToMinutes(Math.round(player.getDuration()-player.getTime()/1000.0)); 
		lastPosition = slider.value;
	}
}
},200);
nextButton.addEventListener('singletap', function(e){ // Next song button event listener
	nextSong();
});
prevButton.addEventListener('singletap', function(e){ // Previous song button event listener
	previous();
});

nextinterval = 0; // Next interval will be used as a looping event to increase playing speed when holding nextButton, it is declared here so it can be acessed outside the event listener *SCOPE
nextButton.addEventListener('longpress', function(e){ // Event Listener for long press of nextButton, increases playing speed
		count = 0; 
		value = 1000;
		nextinterval = setInterval(function(){
			if(count>=10){
				value = 10000; 
			}
			if(player.getDuration()*1000-player.getTime()>value){
				player.setTime(player.getTime()+value);
			}else{
				if(musicindex<Object.keys(songs).length-1 || repeat==true){
					nextSong();
				}else{
					musicindex = 0;
					player = Ti.Media.createSound(songs[0].file);
					player.allowBackground = true;
					playButton.backgroundImage = "UIImages/play.png";
					setTitle();
				}
				clearInterval(nextinterval);
			}
			count += 1;
		},100);
});
nextButton.addEventListener('touchend', function(e){ // Event Listener for releasing nextButton, clear the looping interval
	clearInterval(nextinterval);
});
previnterval = 0; // prev interval will be used as a looping event to rewind song when holding prevButton, it is declared here so it can be acessed outside the event listener *SCOPE
prevButton.addEventListener('longpress', function(e){ // Event Listener for long press of prevButton, rewinds the song
	count = 0;
	value = 1200;
	previnterval = setInterval(function(){
		if(count>=10) value = 10200;
		if(player.getTime()>value){
			player.setTime(player.getTime()-value);
		}else{
			player.setTime(0);
		}
		count +=1;
	},100);	
});
prevButton.addEventListener('touchend', function(e){ // Event Listener for releasing prevButton, clear the looping interval
	clearInterval(previnterval);
});
slider.addEventListener('touchend', function(e){ // Event Listener for releasing slider thumb, animate thumb going back to normal and set touching to false
	touching = false;
	thumbReverse();
});
slider.addEventListener('touchstart', function(e){ // Event Listener for start touching slider thumb, animate thumb going to selected state and set touching to true
	touching = true;
	animateThumb();
});
setTitle(); // Set title and other relevant information according to now playing song
// Add Objects to win1
win1.add(mediaControlsView);
win1.add(backImage);
win1.add(label);
win1.add(backSlider);
win1.add(slider);
win1.add(nextButton);
win1.add(prevButton);
win1.add(playButton);
win1.add(remaining);
win1.add(songTitle);
win1.add(repeatButton);
win1.add(shuffleButton);
win1.add(nextAlbumImage);
win1.add(prevAlbumImage);
win1.add(albumImage);
win1.add(artistTitle);

//Create win2 -> song selector window
var win2 = Titanium.UI.createWindow({  
    title:'Song list',
    backgroundColor:'#fff'
});
var listView = Ti.UI.createListView();// listView Object
var sections = [];// Array Sections
var section = Ti.UI.createListSection({}); // Create an unnamed section
var musics = []; // Array musics
for(i=0; i<Object.keys(songs).length;i++ ){ // Loop songs array, get song names and store them on musics array
	musics.push({properties: {title: songs[i].title}});
}
section.setItems(musics); // Set section items
sections.push(section); // Set sections
listView.sections = sections; // Add sections to listView
listView.addEventListener('itemclick', function(e){ // Event Listener for clicking on a song on listView
	if(shuffle==false) musicindex2 = e.itemIndex;
	else{
		already = false;
		for(i = 0;i<Object.keys(songs).length;i++){
			if(songs[i].title == originalPlaylist[e.itemIndex].title && already==false){
				musicindex2 = i;
				already = true;
			}
		}
	}
	if(musicindex!=musicindex2){
		player.stop();
		player = Ti.Media.createSound(songs[musicindex2].file);
		player.allowBackground = true;
		player.setTime = 0;
		player.play();
		nowPlayingInfo.setPlaybackRate(1);
		addplayerEventListener();
		playButton.backgroundImage = "UIImages/pause.png";
		musicindex = musicindex2;
		setTitle();
		if(shuffle==true){
		already = false;
		for(i =0;i<Object.keys(songs).length;i++){
			if(songs[musicindex].title==originalPlaylist[i].title && already==false){
				musicindex = i;
				already = true;
			} 
		}
		songs = null;
		songs = originalPlaylist.slice();
		createRandomPlaylist();
		musicindex = 0;
		}
		win3.openWindow(win1, {animated:true});
	} else {
		player.play();
		nowPlayingInfo.setPlaybackRate(1);
		playButton.backgroundImage = "UIImages/pause.png";
		win3.openWindow(win1, {animated:true});
	}
});
win2.add(listView); // Add listView to win2

var win3 = Ti.UI.iOS.createNavigationWindow({ // Create the navigationWindow
	window: win2
	});
win3.open(); // Open Navigation Window
var btnRight = Ti.UI.createButton({ title: 'Now Playing' }); // Now Playing button -> Go to from songs list to player
win2.setRightNavButton(btnRight); // Add Now Playing button to navigation bar
btnRight.addEventListener('click',function(e){ // Event listener for now playing button
		win3.openWindow(win1, {animated:true});
});

// added during app creation. this will automatically login to
// ACS for your application and then fire an event (see below)
// when connected or errored. if you do not use ACS in your
// application as a client, you should remove this block
(function(){
var ACS = require('ti.cloud'),
    env = Ti.App.deployType.toLowerCase() === 'production' ? 'production' : 'development',
    username = Ti.App.Properties.getString('acs-username-'+env),
    password = Ti.App.Properties.getString('acs-password-'+env);

// if not configured, just return
if (!env || !username || !password) { return; }
/**
 * Appcelerator Cloud (ACS) Admin User Login Logic
 *
 * fires login.success with the user as argument on success
 * fires login.failed with the result as argument on error
 */
ACS.Users.login({
	login:username,
	password:password,
}, function(result){
	if (env==='development') {
		Ti.API.info('ACS Login Results for environment `'+env+'`:');
		Ti.API.info(result);
	}
	if (result && result.success && result.users && result.users.length){
		Ti.App.fireEvent('login.success',result.users[0],env);
	} else {
		Ti.App.fireEvent('login.failed',result,env);
	}
});

})();

