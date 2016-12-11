$(document).ready(function() {
    $("#browser").treeview( {
        toggle: function() {
            console.log("%s was toggled.", $(this).find(">span").text());
        }
    });

    var fileBrowser = new FileBrowser();
    fileBrowser.initFunc();
});

function FileBrowser() {
    var self = this;
    self.server = new ServerGag();
    self.initFunc = init;
    
    
    function init() {
        var elementId = "browser";
        var rootJSON = new Object();
        rootJSON.id = elementId;
        rootJSON.dir = true;
        rootJSON.loaded = false;
        rootJSON.name = "Root";
        rootJSON.address = "Root";
        rootJSON.files = [];

        updateDir(rootJSON);
    }

    function updateDir(dir) {
        $.ajax({
            type: "POST",
            url: "/filebrowser/web/rb/filebrowser.rb",
            callbackParameter: 'callback',
            data: {"address": dir.address},
            timeout: 10000,
            success: function(data) {
                var subdirsJSON = JSON.parse(data);
                subdirsJSON.forEach(function (item, i, subdirJSON) {
                    item.loaded = false;
                    item.id = guid();
                    item.files = [];

                    dir.files.push(item);
                })
                notifyJSONAccepted(dir);
            },
            error: function () {
                dir.loaded = false;
                $("#" + dir.id + "ul").children().last().detach();
                $("#" + dir.id + "ul").append("<span>connection error</span>");
            }
        });
    }

    function notifyJSONAccepted(dirJSON) {
        dirJSON.files.sort(function (a, b) {
            if (a.dir && !b.dir) {
                return -1;
            }
            if (!a.dir && b.dir) {
                return 1;
            }
            return a.name.localeCompare(b.name)
        })
        
        var $element = createElementByJson(dirJSON);

        $("#" + dirJSON.id + "ul").children().last().detach();
        $("#" + dirJSON.id).append($element);
        $("#" + dirJSON.id).treeview({
            add: $element
        });

        dirJSON.files.forEach(function (item, i, arr) {
            $("#" + item.id).click(function (e) {
                e.stopPropagation();
                if($("#" + item.id).attr('class').match("collapsable")) {
                    if (!item.loaded && item.readable) {
                        $("#" + item.id + "ul").children().first().detach();
                        $("#" + item.id + "ul").append("<span>loading...</span>");

                        item.loaded = true;
                        onDirClick(item);
                    }
                }
            })
        });
    }

    function onDirClick(dirJSON) {
        updateDir(dirJSON);
    }

    function createElementByJson(dirJSON) {
        var element = "<ul>"
        dirJSON.files.forEach(function(item, i, json) {
            if (item.name != ".." && item.name != "." && item.name != "....") {
                if (item.dir) {
                    element += "<li id=" + item.id + " class='closed'><span class='folder'>" + item.name + "</span>";
                    if (item.readable) {
                        element += "<ul id=" + item.id + "ul" + "></ul>";
                    }
                    element += "</li>";
                } else {
                    element += "<li><span " + "id=" + item.id + " class='file'>" + item.name + "</span></li>";
                }
            }
        });

        element += "</ul>";
        return element;
    }
}