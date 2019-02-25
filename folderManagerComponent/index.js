const fs = require('fs');
const {shell, dialog, MenuItem, BrowserWindow} = require('electron').remote;
const path = require('path');
var WebFont = require('webfontloader');
let Mousetrap = require('mousetrap');


let fn = {
    init: function () {
        fn.bind();
        fn.readJson();
        $('.loader').hide();
        fn.checkFileAvail();
        fn.readColorJson();

        $('[data-submenu]').submenupicker();

        WebFont.load({
            google: {
                families: ['Josefin Serif', 'Droid Serif']
            }
        });

        $('[data-toggle="tooltip"]').tooltip();


    },
    bind: function () {

        $(document).on('click', '.new_folder_icon', function () {
            //OPEN MODEL WHEN CLICK .new_folder_icon DONE BY DEFAULT OF BOOTSTRAP

            setTimeout(function () {
                $('.header_input_folder_name').focus();
            }, 500);
        });

        $(document).on('click', '#btn_create_header', function () {

            var new_folder_name = $(this).parent().parent().find('.header_input_folder_name').val();
            var folPath;

            if ($.trim(new_folder_name) === '') {
                alert('Folder name cannot be empty..!');
            } else {

                fs.readFile(path.join(__dirname, 'index.json'), 'utf-8', function (err, data) {
                    if (err)
                        throw err;
                    var arrayOfObjects = JSON.parse(data);

                    arrayOfObjects.folders.push({

                        name: new_folder_name,
                        path: folPath // PATH CAN BE EMPTY IN THIS CASE
                    });

                    fn.saveJson(arrayOfObjects);
                    $('.header_input_folder_name').val('');//EMPTY THE TEXT FIELD VALUE
                    $('#exampleModal').modal('toggle'); //CLOSE THE MODE ONCE FOLDER CREATED

                });

            }


//            let content = 'test content';
//
//            dialog.showSaveDialog((folderName) => {
//
//                if (folderName === undefined) {
//                    console.log("not file there");
//                    return;
//                }
//                
//                fs.mkdir(folderName, function (err) {
//                    if (err) {
//
//                        alert('Folder not created');
//                        return;
//                    } else {
//                        alert('successfully created');
//                    }
//
//                });
//
//            });



        });

        $(document).on('keypress', '.header_input_folder_name', function (evt) {

            if (evt.keyCode === 13) {//ENTER KEY

                var new_folder_name = $(this).val();
                var folPath;

                if ($.trim(new_folder_name) === '') {
                    alert('Folder name cannot be empty..!');

                } else {

                    fs.readFile(path.join(__dirname, 'index.json'), 'utf-8', function (err, data) {
                        if (err)
                            throw err;
                        var arrayOfObjects = JSON.parse(data);

                        arrayOfObjects.folders.push({

                            name: new_folder_name,
                            path: folPath // PATH CAN BE EMPTY IN THIS CASE
                        });

                        fn.saveJson(arrayOfObjects);
                        $('.header_input_folder_name').val('');//EMPTY THE TEXT FIELD VALUE
                        $('#exampleModal').modal('toggle'); //CLOSE THE MODE ONCE FOLDER CREATED
                    });
                }
            }
        });

        $(document).on('dragover', '.dropzone', function () {
            $(this).css("border", "2px dashed #929090");
            $(this).find('.drop_title').css("color", "#929090");
        });

        $(document).on('dragleave', '.dropzone', function () {
            $(this).css("border", "2px dashed #CCC");
            $(this).find('.drop_title').css("color", "#CCC");
        });

        $(document).on('drop', '.dropzone', function () {
            $(this).css("border", "2px dashed #CCC");
            $(this).find('.drop_title').css("color", "#CCC");
        });

        $(document).on('dragover', '.my-title-header', function () {
            $(this).next().attr('class', 'collapse collapsed my_collapse_body show');
        });

        $(document).on('dragleave', '.file_input', function (e) {
            $(this).parent().parent().parent().attr('class', 'collapse collapsed my_collapse_body');
        });

        $(document).on('dragover', '.file_dropzone', function () {
            $(this).css("border", "1px dashed #868686");
            $(this).find('.file_drop_para').css("color", "#1d1d1d");
        });

        $(document).on('dragleave', '.file_dropzone', function () {
            $(this).css("border", "1px dashed #CCC");
            $(this).find('.file_drop_para').css("color", "#cccccc");

        });

        $(document).on('drop', '.file_dropzone', function () {
            $(this).css("border", "1px dashed #CCC");
            $(this).find('.file_drop_para').css("color", "#cccccc");

        });

        $(document).on('change', '.folder_input', function (e) {

            let multipleFolders = [];
            for (var i = 0; i < this.files.length; i++) {
                multipleFolders.push({
                    name: this.files[i].name.replace(/\..+$/, ''), //SEND ONLY FILE NAME WITHOUT EXTENTION
                    path: this.files[i].path
                });
            }

//            console.log(multipleFolders);

            fs.readFile(path.join(__dirname, 'index.json'), 'utf-8', function (err, data) {
                if (err)
                    throw err;
                var arrayOfObjects = JSON.parse(data);

                for (var n = 0; n < multipleFolders.length; n++) {

                    arrayOfObjects.folders.push({

                        name: multipleFolders[n].name,
                        path: multipleFolders[n].path
                    });
                }
                fn.saveJson(arrayOfObjects);
            });
//            fn.readJson();
        })

        $(document).on('click', '.close_icon', function () {
            fn.deleteJson($(this).data('close'));
        });

        $(document).on('change', '.file_input', function (event) {

            //GET FILE DROPPED FOLDER ID
            var fol_id_div = $(this).parent().closest('.my-card');
            var split_id = fol_id_div[0].id.split('_');
            let file_droped_folder_id = split_id[2];

            let multipleFiles = [];
            for (var c = 0; c < this.files.length; c++) {

                multipleFiles.push({
                    fileName: this.files[c].name,
                    filePath: this.files[c].path,
                    fileType: this.files[c].path.replace(/^.*\./, '')
                });

            }

            fs.readFile(path.join(__dirname, 'index.json'), 'utf-8', function (err, data) {
                if (err)
                    throw err;

                var arrayOfObjects = JSON.parse(data);
                let mainFolderIndex = arrayOfObjects.folders[file_droped_folder_id]; //file for which folder - get using javascript drop evnt

                if (typeof mainFolderIndex['files'] === 'undefined')//CHECK - IF files[] object already exist or not in json file , If Not exist execute below line to create files[] object
                    mainFolderIndex['files'] = []; // Create file object if not exist in json file

                for (var i = 0; i < multipleFiles.length; i++) {

                    mainFolderIndex['files'].push({
                        fileName: multipleFiles[i].fileName,
                        filePath: multipleFiles[i].filePath,
                        fileType: multipleFiles[i].fileType

                    });
                }

                fn.saveJson(arrayOfObjects);
            });

        });

        $(document).on('click', '.file_close_icn', function (event) {

            var folder_id = $(this).data('folder-id');
            var file_id = $(this).data('file-id');

            fn.deleteJsonFile(folder_id, file_id);

        });

        $(document).on('click', '.folder_open_icon', function () {

            var open_folder = $(this).data('fol-path');
            fn.openFolder(open_folder);

        });

        $(document).on('click', '.file_name_para', function () {


            var open_file = $(this).attr('title');
            fn.openFile(open_file);

        });

        $(document).on('click', '.file_edit_icn', function () {



            var folder_id = $(this).data('folder-id');
            var file_id = $(this).data('file-id');
            var clicked_edit_icon_dom = $(this); //SEND THIS SPECIFIC OBJECT TO renameFile() function

            fn.renameFile(folder_id, file_id, clicked_edit_icon_dom);

        });

        $(document).on('click', '.color-code', function () {
            var hard_code_json_index = $(this).data('json-index');
            var color_name = $(this).attr('id');
            var color_value = $(this).data('color-val');

            fn.changeJsonColor(color_name, color_value, hard_code_json_index);
        });



    },
    createFolder: function (increment, folderName, folderPath) {
        var folder_creation = '<div class="card my-card" id="folder_id_' + increment + '">' + //Creating dynamically increment the collapse
                //                            '<div class="card-header my-title-header" data-target="#col_'+increment+'" data-toggle="collapse" aria-expanded="true" aria-controls="collapseOne" id="mouseDrop_'+increment+'">'+
                '<div class="card-header my-title-header" id="mouseDrop_' + increment + '" >' +
                '<div class="row my_title_columns">' +
                '<div class="col-md-6 col-sm-6 col-6">' +
                //                                        '<span class="btn my-card-head-title-btn folder_name_span">'+
                '<span class="btn my-card-head-title-btn folder_name_span" data-toggle="collapse" data-target="#col_' + increment + '" aria-expanded="true" aria-controls="collapseOne">' +
                '</span>' +
                '</div>' +
                '<div class="col-md-6 col-sm-6 col-6 folder-options-div">' +
//                '<div class="settings-div folder-options">' +
//                '<i class="fas fa-cog fa-xs settings_icon" id="settings_opt_id_' + increment + '"></i>' +
//                '</div>' +
                '<div class="plus-div folder-options" title="Open Folder">' +
//                '<i class="fas fa-plus fa-xs plus_icon" id="plus_opt_id_' + increment + '"></i>' +
                '<i class="far fa-folder-open fa-xs folder_open_icon" id="open_folder_opt_id_' + increment + '" data-fol-path="' + folderPath + '"></i>' +
                '</div>' +
//                '<div class="move-div folder-options">' +
//                '<i class="fas fa-expand-arrows-alt fa-xs move_icon" id="move_opt_id_' + increment + '"></i>' +
//                '</div>' +
                '<div class="close-div folder-options" title="Delete">' +
                '<i class="fas fa-times close_icon" data-close="' + increment + '" id="close_opt_id_' + increment + '"></i>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="collapse collapsed my_collapse_body" id="col_' + increment + '" aria-labelledby="headingOne" data-parent="#accordion"  >' + //ondragleave="dragLeave('+increment+')"    
                '<div class="card-body">' +
                //file_list
                '<div class="file_list" id="file_list_' + increment + '" data-listId="' + increment + '">' +
                //                                        '<div class="my_file" id="my_file_">'+
                //file name div + paragraph is here
                //                                        '</div>'+
                '</div>' +
                //file_list end

                //file dropzone
                '<div class="file_dropzone" id="file_dropzone">' +
                '<p class="file_drop_para" id="file_drop_para">Drop File Here</p>' +
                '<input class="file_input" placeholder="placejfnkkl" id="file_input_' + increment + '" type="file" name="file[]"  multiple="multiple">' +
                '</div>' +
                // file dropzone end

                '</div>' +
                '</div>' +
                '</div>';

        $('#folders_list').append(folder_creation); // Append the dynamic collapse into folder list div

//        var folder_name = '<p class="folder_name_para" id="folder_title_id_' + increment + '" title="' + folderPath + '"> ' + folderName + ' </p>'; // get only the folder name from full folder path (this ==)
        var folder_name = '<input class="folder_name_para" id="folder_title_id_' + increment + '" title="' + folderPath + '" value="' + folderName + '" readonly/>'; // get only the folder name from full folder path (this ==)
        $('.folder_name_span').last().append(folder_name); // set the folder name the require place (class == folder_name_para)

    },
    deleteFolder: function (id) {},
    readJson: function () {
        
//        var dataFolderArray = fs.readFileSync('index.json', 'utf-8');
        var dataFolderArray = fs.readFileSync(path.join(__dirname, 'index.json') , 'utf-8');
        
        let folderArray = dataFolderArray ? JSON.parse(dataFolderArray) : [];

        //READING FOLDER AND IT'S FILE START
        $('#folders_list').empty();
        folderArray.folders.forEach(function (v, folder_id) {
            fn.createFolder(folder_id, v.name, v.path);

            if (typeof v['files'] !== 'undefined') { //READ ONLY, IF EXIST files[{}] ARRAY
                v['files'].forEach(function (v, file_id) {
                    fn.createFile(v.fileName, v.filePath, v.fileType, folder_id, file_id);
                });
            }


        });//READING FOLDER AND IT'S FILE END
        fn.checkFileAvail();
    },
    saveJson: function (arrayOfObjects) {
        $('.loader').show();
//                fs.readFileSync(path.join(__dirname, 'index.json') , 'utf-8');
        fs.writeFile( path.join(__dirname, 'index.json') , JSON.stringify(arrayOfObjects), 'utf-8',
                function (err) {
                    if (err)
                        throw err;
                });

        setTimeout(function () {
            fn.readJson();
            $('.loader').hide();
        }, 1000);
    },
    deleteJson: function (id) {
        let readFile = fs.readFileSync(path.join(__dirname, 'index.json') , 'utf-8');

        var jsonArray = JSON.parse(readFile);
        var jsonArrayObjects = jsonArray.folders;
        jsonArrayObjects.splice(id, 1);
        fn.saveJson(jsonArray);

    }, //DELETE FOLDER WITH IT'S FILES
    deleteJsonFile: function (folder_id, file_id) {
        let readFile = fs.readFileSync(path.join(__dirname, 'index.json') , 'utf-8');

        var jsonArray = JSON.parse(readFile);
        var jsonFileArrayObjects = jsonArray.folders[folder_id].files;
        jsonFileArrayObjects.splice(file_id, 1);
        fn.saveJson(jsonArray);
    },
    createFile: function (fileName, filePath, fileType, folder_id, file_id) {

//        console.log('file id ' + file_id);

        var file_input_path = '<div class="my_file" id="my_file_' + file_id + '" data-file-folder-id="' + folder_id + '" data-file-id="' + file_id + '">' +
                '<div class="row">' +
                '<div class="col-md-8 col-sm-8 col-8">' +
                //                        '<p class="file_name_para" id="file_name_">' + $(this).val() + '</p>' +
//                '<p class="file_name_para" id="file_name_' + file_id + '" title="' + filePath + '" data-file-type="'+fileType+'">' + fileName + '</p>' + //.replace(/.*[\/\\]/, '')
                '<input type="text" class="file_name_para" id="file_name_' + file_id + '" title="' + filePath + '" data-file-type="' + fileType + '" data-input-folder-id="' + folder_id + '" value="' + fileName + '" readonly/>' +
                '</div>' +
                '<div class="col-md-4 col-sm-4 col-4 file_options_div">' +
//                '<div class="file-move-div file-options">' +
//                '<i class="fas fa-expand-arrows-alt fa-xs file_move_icn" id="file_move_id_' + file_id + '" data-file-id="' + file_id + '" data-folder-id="' + folder_id + '"></i>' +
//                '</div>' +
                '<div class="file-edit-div file-options" title="Rename File">' +
                '<i class="fas fa-pencil-alt fa-xs file_edit_icn" id="file_edit_id_' + file_id + '" data-file-id="' + file_id + '" data-folder-id="' + folder_id + '"></i>' +
                '</div>' +
//                '<div class="file-type-div file-options">' +
//                '<i class="far fa-file-alt fa-xs file_type_icn" id="file_type_id_' + file_id + '" data-file-id="' + file_id + '" data-folder-id="' + folder_id + '"></i>' +
//                '</div>' +
                '<div class="file-close-div file-options" title="Delete File">' +
                '<i class="fas fa-times fa-xs file_close_icn" id="file_close_id_' + file_id + '" data-file-id="' + file_id + '" data-folder-id="' + folder_id + '"></i>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        $(document).find('#file_list_' + folder_id).append(file_input_path);
    },
    checkFileAvail: function () {

        var dataFolderArray = fs.readFileSync(path.join(__dirname, 'index.json') , 'utf-8');
        let folderArray = dataFolderArray ? JSON.parse(dataFolderArray) : [];

        //READING FOLDER AND READING FILE - START
        folderArray.folders.forEach(function (v, folder_id) {
            if (typeof v['files'] !== 'undefined') { //READ ONLY, IF EXIST files[{}] ARRAY
                v['files'].forEach(function (v, file_id) {
                    fs.readFile(v.filePath, function (missing, data) {
                        if (missing) {
                            var missedFile = $('#folder_id_' + folder_id).find('#file_name_' + file_id);
                            missedFile.css('color', 'rgba(197,110,110,0.88)');
                            missedFile[0].disabled = "disabled";
                        }
                    });
                });
            }
        });//READING FOLDER AND READING FILE - END
    },
    renameFile: function (folder_id, file_id, clicked_edit_icon_dom) {

        var editInput = $('#folder_id_' + folder_id).find('#file_name_' + file_id);//MAIN FILE INPUT DOM
        editInput.click(false); // CANNOT OPEN THE FILE IF CLICKED RENAME ICON

        if (editInput[0].disabled === true) { //IN THIS TIME ALL UNLINK FILE INPUT FIELDS MADE AS disable FROM checkFileAvail() FUNCTION
            alert('Unlink path - cannot edit');
            return false;
        }

        //clicked_edit_icon_dom === CLICKED EDIT ICON OBJECT  // REDUCE EDIT ICON COLOR // TOGGLE USE FOR HIDE ICON AND SHOW IT IN CALLBACK FUNCTION
        $(clicked_edit_icon_dom).toggle('fast', function () {
            $(this).show();
            $(this).css('color', 'rgba(0,0,0,0.31)');
        });

//          console.log(editInput.val().replace(/.*(?=\.)/, '')); -> index
//          console.log(editInput.data('file-type')); -> html
        if (editInput.val().match(/.*(?=\.)/) === null) {
            fn.readJson();

        } else {

            var file_name_reg = editInput.val().match(/.*(?=\.)/); //GET ONLY WORD SECTION BEFORE FINAL DOT(.) -> index.gh.html => index.gh -> https://regex101.com/r/rI4pQ1/1
            var file_name_no_extention = file_name_reg[0];


            editInput.val(file_name_no_extention);
            //CSS FOR FRONT END INPUT - START
            editInput.prop('readonly', '');
            editInput.css('cursor', 'text');
            editInput.css('outline', 'none');
            editInput.focus();
            editInput.select();
            //CSS FOR FRONT END INPUT - END

            let readFile = fs.readFileSync(path.join(__dirname, 'index.json') , 'utf-8');

            var jsonArray = JSON.parse(readFile);
            var fileToBeRename = jsonArray.folders[folder_id].files[file_id];
            var pathRemoveFileName = path.dirname(fileToBeRename.filePath);

            $(editInput).bind("keypress", function (evt) {

                if (evt.keyCode === 13) { // ENTER KEY

                    if ($.trim(editInput.val()) === '') {
                        alert('File name cannot be empty..!');
                    } else {
                        var renamedFileName = editInput.val() + '.' + fileToBeRename.fileType; //NEW FILE NAME --> get fileType to here, Because editInput.val() == to only file name without extentention
                        var newFilePath = pathRemoveFileName + '\\' + renamedFileName; //NEW FILE PATH
                        var newFileType = fileToBeRename.fileType;

                        fs.rename(fileToBeRename.filePath, newFilePath, function (err, data) {
                            if (err)
                                throw err;
                            //DEFINITON FOR SPLICE - IN SPECIFIED FILE INDEX, REMOVE THAT INDEX FULL OBJECT AND REPLACE this -> {fileName, filePath, fileType} OBJECT INTO THAT PLACE FOR SAME INDEX
                            jsonArray.folders[folder_id].files.splice(file_id, 1, {fileName: renamedFileName, filePath: newFilePath, fileType: newFileType});
                            fn.saveJson(jsonArray);
                        });
                    }

                }
            });


        }

    },
    openFolder: function (open_folder) {
        //  from - .folder_open_icon
        if (open_folder === 'undefined') {
            alert('Do not have an actual path for this folder');
        } else {
            shell.openItem(open_folder);
        }
    },
    openFile: function (open_file) {
        //from .file_name_para
        shell.openItem(open_file);
    },
    readColorJson: function () {
        var dataColorsRead = fs.readFileSync(path.join(__dirname, 'colors.json') , 'utf-8');
        let dataColorsArray = JSON.parse(dataColorsRead);

        dataColorsArray.colors.forEach(function (v, index_id) {
            if (v.status === "active") {
                fn.setColorToApp(v.name, v.value, v.status, index_id);
            }
        });
    },
    setColorToApp: function (name, value, status, index_id) {
        $("body").css("background-color", value);
        $("#browser_header").css("background-color", value);
    },
    changeJsonColor: function (color_name, color_value, hard_code_json_index) {
        let readColorJsonFile = fs.readFileSync(path.join(__dirname, 'colors.json') , 'utf-8');
        var jsonColorArray = JSON.parse(readColorJsonFile);

        jsonColorArray.colors.forEach(function (v, index_id) {
            if (v.status === 'active') {
                jsonColorArray.colors.splice(index_id, 1, {name: v.name, value: v.value, status: ""}); //REMOVE PATICULAR INDEX OBJECT AND REPLACE NEW VALUES - WITH CHANGING status INTO EMPTY
                jsonColorArray.colors.splice(hard_code_json_index, 1, {name: color_name, value: color_value, status: "active"}); //REMOVE PARTICULAR INDEX OBJECT AND REPLACE NEW VALUES - WITH CHANGING status INTO active
            }
        });

        fn.saveColorJson(jsonColorArray);

    },
    saveColorJson: function (jsonColorArray) {
        $('.loader').show();
        fs.writeFile(path.join(__dirname, 'colors.json'), JSON.stringify(jsonColorArray), 'utf-8',
                function (err) {
                    if (err)
                        throw err;
                }
        );

        setTimeout(function () {
            fn.readColorJson();
            $('.loader').hide();
        }, 1000);

    }
}

$(document).ready(function () {

    fn.init();
})