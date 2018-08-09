(function ($) {

  IDRViewer.on('pageload', function (data) {
    initPage(data.page);
  });
  
  function initPage (page) {
    // fix overlay blocking pointer input
    document.querySelector('#pg' + page + 'Overlay').style.zIndex = 0;

    initImgSelect($('.page img').toArray())

    const pageEl = document.querySelector('#pg' + page);

    // imgareaselect won't work with svg image
    // create img element on top of it as a workaround
    document.querySelectorAll('#page' + page + ' object').forEach(function (obj) {
      obj.onload = function () {
        obj.contentDocument.querySelectorAll('image').forEach(function (image) {
          const img = document.createElement('img');
          img.src = page + '/' + image.getAttribute('xlink:href');
          img.style.position = 'absolute';
          img.style.width = image.width.baseVal.value + 'px';
          img.style.height = image.height.baseVal.value + 'px';
          
          const imgContainer = document.createElement('div');
          imgContainer.style.position = 'absolute';
          imgContainer.style.left = image.x.baseVal.value + 'px';
          imgContainer.style.top = image.y.baseVal.value + 'px';
          imgContainer.style.width = img.style.width;
          imgContainer.style.height = img.style.height;
          
          imgContainer.appendChild(img);
          pageEl.appendChild(imgContainer);
          initImgSelect([imgContainer])
        });
      }
    });
  }

  function initImgSelect (elements) {
    elements.forEach(initEl);

    function initEl (el) {
      if (el.__annotatorApp) return;
      const app = el.__annotatorApp = new annotator.App();
      app.include(annotator.storage.debug)
        .include(annotator.ui.main, {
          element: el
        }).include(annotatorImageSelect, {
          element: $(el)
        }).start();
    }
  }
})(jQuery);