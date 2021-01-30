#!/bin/bash

JAVA_BIN=./jdk/jdk-16+10/Contents/Home/bin/java

$JAVA_BIN  -jar ./tools/epubcheck-4.2.3/epubcheck.jar $1

