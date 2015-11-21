# restapp
Restful service using node gulp bower sass 

yoeman generator used

npm install body-parser --save
npm install express --save
npm install mongoose --save
npm install node-restful --save

node-compass requires the compass ruby gem in order to compile compass. This can easily be installed via Terminal.

$ gem update --system
$ gem install compass

npm install node-compass


Usage
var compass = require('node-compass');
app.configure(function() {
    app.use(compass());
});

Configuration Options

mode
default: compress
description: The output mode you wish to use. Can be expanded, nested, compressed or compact.

comments
default: false
description: Show line comments or not.

relative
default: true
description: Are assets relative.

css
default: stylesheets
description: The folder inside the project to output css into.

sass
default: stylesheets
description: The folder inside the project to find sass in.

project
default: public
description: The location where all your assets are store.

cache
default: true
description: enable/disable caching.

logging
default: false
description: Enable/disables logging to terminal when attempting to compile sass files.

config_file
default: false
description: Use this config option to point to a valid compass config.rb file, if you would prefer to use that for your config instead.

---------------------------------------------------------------------------------------------------------------------------------------------------------

GIT

In source folder run:
git init

To add your identity on git from a machine : 
git config --global user.email "xyz@xya.com"
git config --global user.name "X Y"

To add files to git repository:
git add .

Check status of files:
git status

To commit files in git repository:
git commit -m "comment goes here"

To check which commits are ready for push:
git log --oneline

----------------------------
BOWER 
-------------------------------

bower install <packagename> --save

bower uninstall <packagename> --save

To list all bower dependencies:
bower list

To list all paths of bower dependencies which are to be used in html:
bower list --paths

--------------------------------------------
Ruby & compass & suzy & 
--------------------------------------------

ruby -v

gem update --system

gem install compass

npm install -g gulp --save-dev

npm install node-sass --save-dev

create gulpfile.js in root directory of project

git push --set-upstream origin master
