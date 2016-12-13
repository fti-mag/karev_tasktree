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
                if($("#" + dir.id).attr('class').match("collapsable") || dir.address == "Root") {
                    var subdirsJSON = JSON.parse(data);
                    subdirsJSON.forEach(function (item, i, subdirJSON) {
                        item.loaded = false;
                        item.id = guid();
                        item.files = [];

                        dir.files.push(item);
                    })
                    notifyObjectAccepted(dir);
                } else{
                    dir.loaded = false;
                }
            },
            error: function () {
                dir.loaded = false;
                $("#" + dir.id + "ul").children().last().detach();
                $("#" + dir.id + "ul").append("<span>connection error</span>");
            }
        });
    }

    function notifyObjectAccepted(dir) {
        dir.files.sort(function (a, b) {
            if (a.dir && !b.dir) {
                return -1;
            }
            if (!a.dir && b.dir) {
                return 1;
            }
            return a.name.localeCompare(b.name)
        })
        
        var $element = createElementByObject(dir);

        $("#" + dir.id + "ul").children().last().detach();
        $("#" + dir.id).append($element);
        $("#" + dir.id).treeview({
            add: $element
        });

        dir.files.forEach(function (item, i, arr) {
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

    function onDirClick(dir) {
        updateDir(dir);
    }

    function createElementByObject(dir) {
        var element = "<ul>"
        dir.files.forEach(function(item, i, json) {
            var name = escapeHtml(item.name)
            if (item.name != ".." && item.name != "." && item.name != "....") {
                if (item.dir) {
                    element += "<li id=" + item.id + " class='closed'><span class='folder'>" + name + "</span>";
                    if (item.readable && item.nchilds > 2) {
                        element += "<ul id=" + item.id + "ul" + "></ul>";
                    }
                    element += "</li>";
                } else {
                    element += "<li><span " + "id=" + item.id + " class='file'>" + name + "</span></li>";
                }
            }
        });

        element += "</ul>";
        return element;
    }

    var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
    };

    function escapeHtml(string) {
        return String(string).replace(/[&<>"'\/]/g, function (s) {
            return entityMap[s];
        });
    }
}