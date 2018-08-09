(function ($) {

  IDRViewer.on('pageload', function (data) {
    initPage(data.page);
  });
  
  function initPage (page) {
    // fix overlay blocking pointer input
    document.querySelector('#pg' + page + 'Overlay').style.zIndex = 0;

    // $('#page' + page + ' img').each(function (i, img) {
    //   console.log(img)
    //   const style = getComputedStyle(img);
    //   const imgContainer = initImgContainer(img, style.left, style.top, style.width, style.height, true);
    //   initImgSelect([imgContainer]);
    // });

    const pageEl = document.querySelector('#pg' + page);

    // imgareaselect won't work with svg image
    // create img element on top of it as a workaround
    document.querySelectorAll('#page' + page + ' object').forEach(function (obj) {
      obj.onload = function () {
        obj.contentDocument.querySelectorAll('image').forEach(function (image) {
          const img = document.createElement('img');
          img.src = page + '/' + image.getAttribute('xlink:href');
          img.width = image.width.baseVal.value;
          img.height = image.height.baseVal.value;

          const x = image.x.baseVal.value + 'px';
          const y = image.y.baseVal.value + 'px';
          const w = image.width.baseVal.value + 'px';
          const h = image.height.baseVal.value + 'px';

          const imgContainer = initImgContainer(img, x, y, w, h);
          
          pageEl.appendChild(imgContainer);
          initImgSelect([imgContainer])
        });
      }
    });

    function initImgContainer (img, x, y, w, h, replace) {
      const imgContainer = document.createElement('div');
      imgContainer.style.position = 'absolute';
      imgContainer.style.left = x;
      imgContainer.style.top = y;
      imgContainer.style.width = w;
      imgContainer.style.height = h;
      replace && img.parentNode.insertBefore(imgContainer, img);
      imgContainer.appendChild(img);
      return imgContainer;
    }
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