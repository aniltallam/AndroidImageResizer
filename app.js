var sharp = require('sharp');
var fs = require('fs');
var path = require('path');
var config = require('./config.json');

var BASE_RESOLUTION_FULLSCREEN_WIDTH = config.BASE_RESOLUTION_FULLSCREEN_WIDTH;
var inputfolder = config.input_folder;
var outputfolder = config.output_folder;

fs.readdir(inputfolder, function (err, items) {
    // console.log(items);
    if (items.length > 0) {
        var scale_factor = 360 / BASE_RESOLUTION_FULLSCREEN_WIDTH;
        createDir(outputfolder);
        //createDir(outputfolder + path.sep + "drawable-mdpi");
        createDir(outputfolder + path.sep + "drawable-hdpi");
        createDir(outputfolder + path.sep + "drawable-xhdpi");
        createDir(outputfolder + path.sep + "drawable-xxhdpi");
        var options = {
            kernel: sharp.kernel.cubic,
            interpolator: sharp.interpolator.bicubic
        };
        var errHandler = function (err) {
            if (err != undefined)
                console.log(err);
        }
    }

    for (var i = 0; i < items.length; i++) {
        console.log("Resizing.. " + items[i]);

        (function (fname) {
            var img = sharp(inputfolder + path.sep + fname);
            img.metadata()
                .then(function (mdata) {
                    if (err != undefined)
                        console.log(err);
                    // img.resize(Math.round(mdata.width * scale_factor), null, options)
                    //     .toFile(outputfolder + path.sep + "drawable-mdpi" + path.sep + fname, errHandler);

                    img.resize(Math.round(mdata.width * scale_factor * 1.5), null, options)
                        .toFile(outputfolder + path.sep + "drawable-hdpi" + path.sep + fname, errHandler);

                    img.resize(Math.round(mdata.width * scale_factor * 2), null, options)
                        .toFile(outputfolder + path.sep + "drawable-xhdpi" + path.sep + fname, errHandler);

                    img.resize(Math.round(mdata.width * scale_factor * 3), null, options)
                        .toFile(outputfolder + path.sep + "drawable-xxhdpi" + path.sep + fname, errHandler);
                });
        })(items[i]);
    }

    console.log("Generated files at '"+outputfolder +"'\n-----------------------------------");
    //printdir(outputfolder);
});

function createDir(path) {
    try {
        fs.mkdirSync(path);
        console.log("created directory.. " + path);
    } catch (err) {
        if (err.code == 'EEXIST') {
            console.log("directory already exists.. " + path);
        } else {
            console.log(err);
        }
    }
}

function printdir(fpath) {
    //console.log("printdir directory.. " + fpath);
    fs.stat(fpath, function (err, stats) {
        if (err != undefined) {
            console.log(err);
            return
        }
        if (stats.isFile()) {
            console.log(fpath)
        } else {
            fs.readdir(fpath, function (err, files) {
                if (err != undefined) {
                    console.log(err);
                    return
                }
                files.forEach(function (file) {
                    cpath = fpath + path.sep + file;
                    printdir(cpath);
                }, this);
            })
        }
    })
}
