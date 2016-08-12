# WikiWhat App

Search for a Wikipedia page and compare the changes from revision to revision.

[Use the App Here](https://wikiwhat.herokuapp.com/)
[Repo](https://github.com/jkarlovich/WikiWhat)

##Approach
The first thing I tried to do was set up my routes involving my API calls.  The Eventful API was very frustrating because some of the keys in the opject returned would be an array in some restults and a key/value pair in another and sometimes null, so a lot of if...else statements needed to be put into place to display the restults correctly.  From there, I set up my Google Places API call.  From there, I set up my profile results and my delete buttons.  Then I added the map.  Lots of styling happened at the end but some was done along the way as well.  Tried to work on responsive design as well.

##Credits:
  * [diff.js](https://github.com/kpdecker/jsdiff)
  * [wtf_wikipedia](https://github.com/spencermountain/wtf_wikipedia#demo)
  * [Bootstrap](http://getbootstrap.com/)
  * [Google Fonts](https://www.google.com/fonts)
  * [Angular](https://angularjs.org/)
  * [Express](http://expressjs.com/)


##Known Issues:
  * Idealy I would have wanted the page to look just like Wikipedia, formatted the same way with images and links in tact.  There were a couple of issues with this.  Getting the info from the mediawiki api comes in what is called 'wikitext'.  There are a few wikitext parsers that can parse the data into html which will format the text, but there are many characters that aren't touched by the parser, and when it comes time to render the html, there are extra brackets and tags as well as url addresses.  The best choice was to parse the wikitext into plaintext, but of course that takes out the formatting.  I tried to replace new line characters \n from the wikitext into <br> tags to at least return the next paragraph on the next line, but for somereason, it wouldn't render.
  * I also tried to fix the formating problem by choosing one Wikipedia page and downloading the xml, having my boyfriend run the revisions through a script in the commandline that parsed it, and then using that data.  It looks beautiful at first, before any comparisions are done from version to version, but as soon as the slider moves, the diff function checks the data literal for content differences, which includes tags and brackets.  You can see an example of this is your search for "Hanami+".  It does slow way down when cmparing versions (see note below).  I did think about potentially setting up a diff on the backend rather than the front, and then parsing the diff once again but I ran out of time and, seeing as though most of my data coming back was from the api, the formatting wouldn't be available anyway.
  * There are times when the slider freezes and I think it is because the two revisions have many differences as opposed to just a couple.  I tried to implement a "Comparing Content" messaged while the function was running, but I think the freezing of the screen wouldn't allow the message to come up.
  * If I managed to get the downloaded xml script version to work, I was thinking I could have a few pages' revisions stored in a database for quick access.  Then, if someone wanted to view a page that wasn't in the database, the query would be made and the user would be flashed a message to come back in a bit, in which case the info would be loaded.
  * I also wanted the photos and links to work however the api wouldn't return the absolute paths of the urls and images.
  * Another issue is that when querying the mediawiki api, it only gives you the last 50 revisions.  I think there might be a way to get the next 50 but I ran out of time to look into it.  Idealy, it would be great if when the slider got to the end, the next 50 revisions populated.
  * Another thing is that the slider works in both direction, but it always compares the current position to the position+1.  I would like to make the comparision work in reverse when sliding the slider to the left.  I was having issues with saving the current $scope.slider.value in a variable as that value is being watched and updates automatically.
  * I would have liked to get the slider set up in reverse, with most recent revision on the right, and early revisions on the left.  When I think of a timeline, I think of past on the left, future on the right.  For some reason I couldn't get the slider to do this.  I tried ordering the queries in the opposite order but for some reason it wasn't working.
  * I want to format the timestamps.
  * I would also like to add animation to the "Loading..." message.

