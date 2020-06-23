@echo off
cd templates
zip -r templates.zip *
move templates.zip ../docs/templates.zip
cd ..