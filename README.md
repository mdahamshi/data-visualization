# Quaka
<a href="https://goo.gl/x5MXeU">Quaka</a> is an Earhquakes Data visualization app.

![alt tag](https://github.com/mdahamshi/data-visualization/blob/master/screenshots/main.png)

**Course Instructor**
Dr. Peter Bak - IBM Haifa Research Lab <a href="http://researcher.ibm.com/person/il-peter.bak">*</a>

**Publication date:** 16/8/2017

**License**: <a href="https://en.wikipedia.org/wiki/MIT_License">MIT</a>

<h2>Project general description</h2>
We used <a href="https://d3js.org/">d3 (v3)</a> library to draw the data, <a href="http://leafletjs.com/">leaflet</a> 
for viewing the map. We also used the following plug-ins/libs to help us building the app:
<ul>
<li><b>Select area</b>: A leaflet plugin for selecting area on the map. <a href="https://github.com/heyman/leaflet-areaselect">*</a></li>
<li><b>d3 slider</b>: A d3 plugin for building sliders easily.<a href="https://github.com/MasterMaps/d3-slider">*</a></li>
<li><b>IntroJS</b>: A javascript library for displaying quick tour for first site visit.<a href="http://introjs.com/">*</a></li>
<li><b>USGS</b>: Used to get the data in <a href="http://geojson.org/">GeoJSON</a> format.<a href="https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php">*</a></li>
</ul>

<h2>Documentation</h2>
When you visit the app, you get the following page:<br/>
<p align="center">
<img src="https://github.com/mdahamshi/data-visualization/blob/master/screenshots/1.png"/>
</p>

After that, when the Data download finish successfully, you get the app's main page:<br/>
<p align="center">
<img src="https://github.com/mdahamshi/data-visualization/blob/master/screenshots/main2.png"/>
</p>

<h3>App Elements</h3>
<h4>Navigation bar:</h4>
<p align="center">
<img src="https://github.com/mdahamshi/data-visualization/blob/master/screenshots/3.png"/>
</p>

The navigation bar contain most of the app buttons and tools, it is always available for easy access.
<h4>Maps:</h4>
<p align="center">
<img src="https://github.com/mdahamshi/data-visualization/blob/master/screenshots/maps.png"/>
</p>

The Maps menue contain different map layers, the user can select the layer he prefer with a click. We think 
the most suitable map is the one we created, it is simple, clear, beatiful, we chose it to be the default map.

<h4>Tools:</h4>
<p align="center">
<img src="https://github.com/mdahamshi/data-visualization/blob/master/screenshots/tools.png"/>
</p>

The Tools menue contain different tools the user can use:
<ul>
  <li><b>Toggle Labels:</b> This tool is special for our simple map, it add a labels layer to our simple map.</li>
  <li><b>Toggle Layer:</b> This tool Show/Hide the hover Layer, this layer is useful to highlight current country
  borders, zooming when clicking a country.</li>
  <li><b>Toggle Felt Data:</b> This tool used to add/remove a green stroke for events that have been felt by at least one person.</li><br/>
  <p align="center">
<img src="https://github.com/mdahamshi/data-visualization/blob/master/screenshots/felt-data.png"/>
</p>
  
  <li><b>Toggle Theme:</b> This tool is special for our simple map, toggle between Light (default) and Dark Theme.</li><br/>
  <p align="center">
<img src="https://github.com/mdahamshi/data-visualization/blob/master/screenshots/dark-theme.png"/>
</p>
</ul>

<h4>Data:</h4>
  <p align="center">
<img src="https://github.com/mdahamshi/data-visualization/blob/master/screenshots/data.png"/>
</p>

The Data menue contain different data types:
<ul>
   <li><b>Last Day:</b> Default data type, display events during the past 24 hours.</li>
   <li><b>Past 7 Days:</b> Display events during the past 7 days.</li>
   <li><b>All Month:</b> Display events during the past 30 days.</li>
</ul>

<h4>Filter By:</h4>
<p align="center">
<img src="https://github.com/mdahamshi/data-visualization/blob/master/screenshots/filter.png"/>
</p>

The Filter By menue contain different data filters:
<ul>
   <li><b>Select Area:</b> A tool that give the user the ability to view only events from spesific area by selecting it.</li><br/>
   <p align="center">
<img src="https://github.com/mdahamshi/data-visualization/blob/master/screenshots/select.png"/>
</p>
   
   <li><b>Time:</b>A tool that give the user the ability to view only events at spesific time range.</li>
   <li><b>Magnitude:</b> A tool that give the user the ability to view only events that fall in spesific magnitude range.</li>
   <li><b>Depth:</b> A tool that give the user the ability to view only events that fall in spesific depth range.</li>
   <li><b>Felt:</b> A tool that give the user the ability to view only events that have been felt by at lease one person.</li>
   Significance
</ul>

<h4>Animate:</h4>
<p align="center">
<img src="https://github.com/mdahamshi/data-visualization/blob/master/screenshots/animate-btn.png"/>
</p>

This tool allow the user to view the date dynamically, ordered by the time the event occured, it is useful to see if there is
a patterent or some relation between event size, location ,etc.<br/>
<p align="center">
<img src="https://github.com/mdahamshi/data-visualization/blob/master/screenshots/animate-map.png"/>
</p>

It also give the user the ability to choose the time interval between each event view (in ms): <br/>
<p align="center">
<img src="https://github.com/mdahamshi/data-visualization/blob/master/screenshots/animate-bar.png"/>
</p>

Please notice that once an animate session started, it can only be stopped by refreshing the page, or clicking the "EARTHQUAKE DATA" at the top left corner.


<h4>Reset:</h4>
<p align="center">
<img src="https://github.com/mdahamshi/data-visualization/blob/master/screenshots/reset.png"/>
</p>

The reset button reset the map to it's original state, with the last choosen data type (past day, past 7 days..), it does so without 
re-downloading the data again.it is useful to restore the map at the end of applaying different filters.

<h4>Refresh:</h4>
<p align="center">
<img src="https://github.com/mdahamshi/data-visualization/blob/master/screenshots/refresh.png"/>
</p>

The refresh button is used to enable or disable the "auto refresh" feature, this feature update the data every 
5 minutes without user interaction. It is useful for keeping the data up to date with the <a href="https://www.usgs.gov/">USGS</a> website.

<h4>Download:</h4>
<p align="center">
<img src="https://github.com/mdahamshi/data-visualization/blob/master/screenshots/download.png"/>
</p>
The download button allow the user to update the data on-demand, It is useful when the user want to view the last data.

<h4>Help:</h4>
<p align="center">
<img src="https://github.com/mdahamshi/data-visualization/blob/master/screenshots/help.png"/>
</p>

The help button show a quick tour for the user, the same tour that displayed on the first time the user visit the site.

<h4>Full screen:</h4>
<p align="center">
<img src="https://github.com/mdahamshi/data-visualization/blob/master/screenshots/full.png"/>
</p>

The full screen button toggle between full/normal screen mode, It is useful to give the user all the available space
to view the data clearly.

<h4>Country name:</h4>
<p align="center">
<img src="https://github.com/mdahamshi/data-visualization/blob/master/screenshots/country-name.png"/>
</p>


This card show the user current hovered country name. It also tell the user to click a country to zoom to it.

<h4>Point Info:</h4>
<p align="center">
<img src="https://github.com/mdahamshi/data-visualization/blob/master/screenshots/quake-info.png"/>
</p>

This card show the user infromation about the current hovered point.

<h4>Legend:</h4>
<p align="center">
<img src="https://github.com/mdahamshi/data-visualization/blob/master/screenshots/4.png"/>
</p>

This card show the user the legend of the viewd attributes: Magnitude, Significance, Felt.


<h4>Controls:</h4>
<p align="center">
<img src="https://github.com/mdahamshi/data-visualization/blob/master/screenshots/5.png"/>
</p>


<ul>
   <li><b>The "+" button:</b> Zoom in button.</li>
   <li><b>The "-" button:</b> Zoom out button.</li>
   <li><b>The "R" button:</b> Reset Zoom to view all the world.</li>
   <li><b>The "L" button:</b> Show/hide the Legend card.</li>
</ul>

<h4>Summary Table:</h4>
<p align="center">
<img src="https://github.com/mdahamshi/data-visualization/blob/master/screenshots/summary-table.png"/>
</p>

The summary table show the user useful infromation about the current viewd data, number of events, minimum/maximum attributes range...

<h4>Filter Table:</h4>
<p align="center">
<img src="https://github.com/mdahamshi/data-visualization/blob/master/screenshots/filter-table.png"/>
</p>

The filter table help the user to keep track with what filters he applied to the data. It only shown when filters applied.



<p align="center">
<a  href="https://goo.gl/x5MXeU" target="_blank">
<img alt="visit the app" width="100" src="https://github.com/mdahamshi/data-visualization/blob/master/screenshots/go.png"/>
</a>
</p>

