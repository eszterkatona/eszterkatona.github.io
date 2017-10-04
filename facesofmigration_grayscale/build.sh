#!/bin/bash

#containerversion bananaversion 
#example ./build.sh 0.9.9

source project.properties


docker build --no-cache -t docker.precognox.com/labs/$PROJECTNAME:$1 .
docker push docker.precognox.com/labs/$PROJECTNAME:$1
