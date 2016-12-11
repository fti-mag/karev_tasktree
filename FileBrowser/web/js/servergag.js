/**
 * Created by karev on 12/8/16.
 */

function ServerGag() {
    var self = this;
    
    self.getJSONOfFilesFunc = getJSONOfFiles;
    
    function getJSONOfFiles(dirJSON) {
        if (dirJSON.address == "Root") {
            $.ajax({
                type: "POST",
                url: "/filebrowser.rb",
                data: {"address": dirJSON.address},
                success: function(data) {
                    alert(data);
                }
            });
            
        }
        if (dirJSON.address == "Root") {
            var root = new Object();
            root.id = guid();
            root.dir = true;
            root.loaded = false;
            root.name = "/";
            root.address = "/";
            root.files = [];

            dirJSON.files.push(root);
            
            return dirJSON;
        }
        if (dirJSON.address == "/") {
            var usrDir = new Object();
            usrDir.id = guid();
            usrDir.dir = true;
            usrDir.loaded = false;
            usrDir.name = "usr/";
            usrDir.address = "/usr/"
            usrDir.files = [];

            var mntDir = new Object();
            mntDir.id = guid();
            mntDir.dir = true;
            mntDir.loaded = false;
            mntDir.name = "mnt/";
            mntDir.address = "/mnt/";
            mntDir.files = [];

            var file1 = new Object();
            file1.id = guid();
            file1.dir = false;
            file1.name = "file1";
            file1.address = "/file1";
            
            dirJSON.files.push(usrDir);
            dirJSON.files.push(mntDir);
            dirJSON.files.push(file1);

            return dirJSON;
        }
        if (dirJSON.address == "/usr/") {
            var libDir = new Object();
            libDir.id = guid();
            libDir.dir = true;
            libDir.loaded = false;
            libDir.name = "lib/";
            libDir.address = "/usr/lib/"
            libDir.files = [];

            var file2 = new Object();
            file2.id = guid();
            file2.dir = false;
            file2.name = "file2";
            file2.address = "/usr/file1";

            dirJSON.files.push(libDir);
            dirJSON.files.push(file2);

            return dirJSON;
        }
    }
}