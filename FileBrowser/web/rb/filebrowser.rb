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
  root["nchilds"] = 3 #/ + . + ..

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
    isDir = File.directory?(fileAddress)
    isReadable = File.readable?(fileAddress)
    fileHash["dir"] = isDir
    fileHash["readable"] = isReadable
    fileHash["name"] = fileName
    fileHash["address"] = fileAddress
    if (isDir && isReadable)
      fileHash["nchilds"] = Dir.entries(fileAddress).length
    end

    container.push fileHash
  }
end

sleep(0.3)

puts container.to_json