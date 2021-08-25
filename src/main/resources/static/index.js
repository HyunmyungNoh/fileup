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

toggleBtn.addEventListener('click', (e) => {
  e.preventDefault()
  if (upload) {
    if (uploadIsRunning) {
      upload.abort()
      toggleBtn.textContent = 'resume upload'
      uploadIsRunning = false
    } else {
      upload.start()
      toggleBtn.textContent = 'pause upload'
      uploadIsRunning = true
    }
  } else {
      if (input.files.length > 0) {
          startUpload();
      } else {
          input.click();
      }
  }
});

input.addEventListener("change", startUpload);

function startUpload() {
    var file = input.files[0];
    // Only continue if a file has actually been selected.
    // IE will trigger a change event even if we reset the input element
    // using reset() and we do not want to blow up later.
    if (!file) {
      return;
    }
  
    // var endpoint = endpointInput.value;
    var endpoint = `http://localhost:8080/api/file/upload`;
    var chunkSize = 1024*1024*1;
    /* alert("Chunk size " + chunkSize);
    if (isNaN(chunkSize)) {
      chunkSize = Infinity;
    } */
  
    var options = {
      endpoint: endpoint,
      chunkSize: chunkSize,
      retryDelays: [0, 1000, 3000, 5000, 20000],
    //   parallelUploads: parallelUploads,
      metadata: {
        filename: file.name,
        filetype: file.filetype
        // internal_user_id: 123
      },
      onError: function(error) {
        console.log('Failed because: ' + error)
        // reject(error)
      },
      onSuccess: function() {
        console.log('Download from %s complete', upload.url)
        var anchor = document.createElement('a')
        anchor.textContent = `Download ${upload.file.name} (${upload.file.size} bytes)`
        anchor.href = upload.url
        anchor.className = 'btn btn-primary'
        uploadList.appendChild(anchor)

        reset()
        // resolve(upload.url)
      }
      /* onError: async (error) => {
        const toast = await this.toastCtrl.create({
          message: 'Upload failed: ' + error,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      },
      onSuccess: async () => {
        const toast = await this.toastCtrl.create({
          message: 'Upload successful',
          duration: 3000,
          position: 'top',
        });
        toast.present();
      } */
      /* onError : function (error) {
        if (error.originalRequest) {
          if (window.confirm("Failed because: " + error + "\nDo you want to retry?")) {
            upload.start();
            uploadIsRunning = true;
            return;
          }
        } else {
          window.alert("Failed because: " + error);
        }
  
        reset();
      },
      onProgress: function (bytesUploaded, bytesTotal) {
        var percentage = (bytesUploaded / bytesTotal * 100).toFixed(2);
        progressBar.style.width = percentage + "%";
        console.log(bytesUploaded, bytesTotal, percentage + "%");
      },
      onSuccess: function () {
        var anchor = document.createElement("a");
        anchor.textContent = "Download " + upload.file.name + " (" + upload.file.size + " bytes)";
        anchor.href = upload.url;
        anchor.className = "btn btn-success";
        uploadList.appendChild(anchor);
  
        reset();
      } */
    };
  
    // 업로드 부분
    upload = new tus.Upload(file, options);
    upload.start();
    uploadIsRunning = true;
    // upload.findPreviousUploads().then((previousUploads) => {
    //   askToResumeUpload(previousUploads, upload);
  
    //   upload.start();
    //   uploadIsRunning = true;
    // });
  
}

function reset () {
  input.value = ''
  toggleBtn.textContent = 'start upload'
  upload = null
  uploadIsRunning = false
}
 
