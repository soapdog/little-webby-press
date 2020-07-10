@echo off
mkdir %1-dir
copy %1 %1.zip

unzip %1.zip -d %1-dir
code-insiders %1-dir