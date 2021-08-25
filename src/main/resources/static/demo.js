"use strict";

var upload          = null;
var uploadIsRunning = false;
var toggleBtn       = document.querySelector('#toggle-btn');
var input           = document.querySelector("input[type=file]");
// var input           = $("input[type=file]");
var progress        = document.querySelector('.progress')
var progressBar     = progress.querySelector('.bar')
var uploadList      = document.querySelector('#upload-list')

// tus가 지원이 안 될 경우에는 hidden 클래스 취소
if (!tus.isSupported) {
  alertBox.classList.remove('hidden')
}

// toggleBtn이 없으면 에러
if (!toggleBtn) {
  throw new Error('Toggle button not found on this page. Aborting upload-demo. ')
}

input.addEventListener("change", function (e) {
    const files = e.target.files;

    function tusUpload(files) {
        [].map.call(files, (file, index) => {
            var upload = new tus.Upload(file, {
                endpoint: 'http://localhost:8080/api/file/upload',
                retryDelays: [0, 3000, 5000, 10000, 20000],
                metadata: {
                    filename: file.name,
                    filetype: file.type
                },
                chunkSize: 8 * 1024 * 1024, // 8MB
                onError: function (error) {
                    console.log("Failed because: " + error)
                },
                onProgress: function (bytesUploaded, bytesTotal) {
                    var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2)
                    console.log(bytesUploaded, bytesTotal, percentage + "%")
                },
                onSuccess: function () {
                    console.log("Download %s from %s", upload.file.name, upload.url)
                }
            })
            console.log(file.name)
            upload.findPreviousUploads().then(function (previousUploads) {
                if (previousUploads.length) {
                    upload.resumeFromPreviousUpload(previousUploads[0])
                }

                // Start the upload
                upload.start();
                return console.log('start');
            })
        })
    }

    tusUpload(files);
})

function reset () {
  input.value = ''
  toggleBtn.textContent = 'start upload'
  upload = null
  uploadIsRunning = false
}
 
