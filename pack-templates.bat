@echo off
cd templates
zip -r templates.zip *
move templates.zip ../public/templates.zip
cd ..