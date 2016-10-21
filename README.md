#Nightwatch GUI
A simple, browser based, GUI (Graphical User Interface) for Nightwatch.js<http://nightwatchjs.org/>,  an easy to use Node.js based End-to-End (E2E) testing solution for browser based apps and websites.

#Usage
Run
````
npm install -g nightwatchGui
````
then move to the parent folder of the "features" folder and run
````
nightwatchGui
````

#How it works
It reads the nightwatch.config.js to get the enviroments defined, and it scrapes the "features" folder to get the features definitions. Then it displays both the environments and the features available on a web page where is possible to select the features to run by a combination of tags, folders and files. Finnaly it runs nightwatch with the selected options.

#To do
Add cli arguments to customize the folders names and config file location. 

