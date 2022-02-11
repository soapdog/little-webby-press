#!lua

local json = require ("dkjson") -- dkjson module
local F = require("F") -- f-strings module

require("pl") -- penlight module

local argparse = require "argparse"

local parser = argparse("deploy.lua", "Little Webby Press deploy script.")
parser:argument("notes", "Release notes.", "")
parser:flag("-d --dry-run", "dry run.")

local args = parser:parse()

function deploy()
  os.execute "node ./increment-version.js"

  local pkg = json.decode(file.read("./package.json"))
  local version = "v" .. pkg.version

  os.execute "npm run build"
  os.execute "git add -A"
  os.execute(F'git commit -am "deploying {version}"')
  os.execute(F"git tag {version}")
  os.execute "git push --tags"

  if arg.notes == "" then
    os.execute(F"gh release create {version} --generate-notes")
  else
    os.execute(F"gh release create {version} --notes {notes}")
  end

  print(F"Deployed {version}")
end

function dryrun()
  print "node ./increment-version.js"

  local pkg = json.decode(file.read("./package.json"))
  local version = "v" .. pkg.version

  print "npm run build"
  print "git add -A"
  print(F'git commit -am "deploying {version}"')
  print(F"git tag {version}")
  print "git push --tags"

  if not arg.notes == "" then
    print(F"gh release create {version} --generate-notes")
  else
    print(F"gh release create {version} --notes {notes}")
  end

  print(F"Dry run for {version}")
end

if dryrun then
  dryrun()
else
  deploy()
end
