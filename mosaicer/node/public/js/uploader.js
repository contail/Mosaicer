$(function() {

    $("#drop-area-div").on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
        })
        .on('dragover dragenter', function() {
            $("#drop-area-div").addClass('is-dragover');
        })
        .on('dragleave dragend drop', function() {
            $("#drop-area-div").removeClass('is-dragover');
        })
        .on('drop', function(e) {
            //  droppedFiles = e.originalEvent.dataTransfer.files;
        });




    $(document).on('dragenter', function() {
        $("#upload-label").removeClass('hidden')
    })




    $("#uploader").on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
        })
        .on('dragover dragenter', function() {
            $("#upload-label").removeClass('hidden')
            $("#uploader").addClass('is-dragover');
        })
        .on('dragleave dragend drop', function() {
            $("#uploader").removeClass('is-dragover');

        })
        .on('drop', function(e) {
            $("#upload-label").addClass('hidden')
                //  droppedFiles = e.originalEvent.dataTransfer.files;
        });

    var upload = $("#uploader").dmUploader({
        url: 'api/upload',
        method: 'POST',
        extraData: {
            folder: currentfolder
        },
        allowedTypes: 'image/*',
        onInit: function() {
            console.log('good')
        },
        onUploadSuccess: function(id, data) {
            done("upload")
            readFile(currentfolder)
        }
    });




})

function video_load(){
$("#video-upload").on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
    })
    .on('dragover dragenter', function() {
        $("#video-upload").addClass('is-dragover');
    })
    .on('dragleave dragend drop', function() {
        $("#video-upload").removeClass('is-dragover');
    })
    .on('drop', function(e) {
        //  droppedFiles = e.originalEvent.dataTransfer.files;
    });
var up;
var count=0;
var videoUpload = $("#video-upload").dmUploader({
    url: 'api/videoUpload',
    method: 'POST',
    extraData: {
        folder : 'video'
    },
    allowedTypes: 'video/*',
    onInit: function() {

    },
    onNewFile:function(id){
      up=wait("upload")
    },
    onUploadSuccess: function(id, data) {
      getMosaic()
      $("#main").addClass("animated fadeOutRight")
      $('#main').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',
      function(){
        if(count==0){
          $("#main").removeClass("animated fadeOutRight")
        $("#main").addClass("animated fadeInRight")
        up.remove()
        videoName=data
        getModel()
        count+=1
        }
      })
            //readFile(defaultId, currentfolder)
    },
    onUploadProgress: function(id, percent) {
        up.update({text : "Uploading to " +percent+" %"})
        // do something cool here!
    }
});

}
