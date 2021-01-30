#!/bin/bash

mkdir $1-dir
cp $1 $1.zip

unzip $1.zip -d $1-dir
code-exploration $1-dir
