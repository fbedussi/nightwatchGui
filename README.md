#Nightwatch-cucumber GUI
A simple, browser based, GUI (Graphical User Interface) to run test cases written in [Gherkin](<https://github.com/cucumber/cucumber/wiki/Gherkin>) to be run with [Nightwatch.js](<http://nightwatchjs.org/>) thanks to [nightwatch-cucumber](<https://github.com/mucsi96/nightwatch-cucumber>).

##Usage
Clone the repo, enter the folder where you cloned it and run
````
npm install -g
````
Or just install the module from the npm registry:
````
npm install -g nightwatch-gui
````
then move to the main folder of your nightwatch-cucumber project and run:
````
nightwatchGui
````
The module assumes the standard nightwatch-cucumber foldering, where the main project folder contains both the ````nightwatch.conf.js```` file and the `features` folder containing the test cases written in Gherkin. If your setup is different, you can customise all the paths in the `config` key in the `package.json` file:
````
"config": {
    "featuresParentFolder": "", //default current folder
    "featuresFolderName": "", //features 'features'
    "nightwatchConfigJsFolder": "", //default current folder
    "excludeFolders": "['step_definitions']",
    "nightwatchExecutable": "" //default 'node_modules/.bin/nightwatch'
  }
````
or, if you don't want to mess up with the `package.json` file (for instance because you have installed the module globally), or if you want to manage these settings on a per project basis you can create the file `nightwatch-gui-config.json` with the same content of the `config` key seen above:
````
{
    "featuresParentFolder": "", //default current folder
    "featuresFolderName": "", //features 'features'
    "nightwatchConfigJsFolder": "", //default current folder
    "excludeFolders": "['step_definitions']",
    "nightwatchExecutable": "" //default 'node_modules/.bin/nightwatch'
}
````


##How it works
It reads the nightwatch.config.js to get the enviroments defined, and it scrapes the "features" folder to get the features definitions. Then it displays both the environments and the features available on a web page where is possible to select the features to run by a combination of tags, folders and files. Finnaly it runs nightwatch with the selected options.
![alt text](https://github.com/fbedussi/nightwatchGui/raw/master/screenshot.png)
