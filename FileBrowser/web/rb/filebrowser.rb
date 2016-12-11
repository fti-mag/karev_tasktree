#!/usr/bin/ruby -w

require 'cgi'
require 'json'
#require 'iconv'

cgi = CGI.new
address = cgi['address']

puts cgi.header  # content type 'text/html'

container = Array.new

if address == "Root"
  root = Hash.new
  root["dir"] = true
  root["readable"] = true
  root["name"] = "/"
  root["address"] = "/"

  container.push root
else
  arrayOfFileNames = Dir.entries(address)
  arrayOfFileNames.each() {|fileName|
  fileName = fileName.force_encoding('UTF-8')
  if address == "/"
    fileAddress = address + fileName
  else
    fileAddress = address + "/" + fileName
  end

  fileHash = Hash.new
  fileHash["dir"] = File.directory?(fileAddress)
  fileHash["readable"] = File.readable?(fileAddress)
  fileHash["name"] = fileName
  fileHash["address"] = fileAddress

  #puts fileName
  #puts fileHash.to_json

  container.push fileHash
  }
end

sleep(0.3)

puts container.to_json


=begin
if address == "j/"
  container = Array.new

  usrDir = Hash.new
  usrDir["dir"] = true
  usrDir["name"] = "usr/"
  usrDir["address"] = "/usr/"

  mntDir = Hash.new
  mntDir["dir"] = true
  mntDir["name"] = "mnt/"
  mntDir["address"] = "/mnt/"

  file1 = Hash.new
  file1["dir"] = false
  file1["name"] = "file1"
  file1["address"] = "/file1"

  container.push(usrDir)
  container.push(mntDir)
  container.push(file1)

  puts container.to_json
end
=end