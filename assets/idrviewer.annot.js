(function ($) {

  // id for sample storage
  let _id = 1;

  function id () {
    return _id++;
  }
  
  const options = {
    storage: {
      create (annotation) {
        console.log('create', annotation);
        annotation.id = id();
        return annotation;
      },
      update (annotation) {
        console.log('update', annotation);
        return annotation;
      },
      delete (annotation) {
        console.log('delete', annotation);
        return annotation;
      },
      query (queryObj) {
        console.log('query', queryObj);
        return {
          results: [],
          meta: {
            total: 0
          }
        }
      }
    }
  }
  
  IDRViewer.annotInit = function (opts) {
    Object.assign(options, opts);
  }

  // fix overlay blocking pointer input
  document.querySelectorAll('[id^="pg"][id$="Overlay"]').forEach(function (el) {
    el.style.zIndex = 0;
  });
  
  $('.page img').each(function (i, img) {
    initImg(img);
  })

  IDRViewer.on('pageload', function (data) {
    initPage(data.page);
  });
  
  function initPage (page) {
    // fix overlay blocking pointer input
    document.querySelector('#pg' + page + 'Overlay').style.zIndex = 0;

    $('#page' + page + ' img').each(function (i, img) {
      initImg(img);
    });

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
          initImgSelect(img)
        });
      }
    });
  }

  function initImg (img) {
    const style = getComputedStyle(img);
    initImgContainer(img, style.left, style.top, 0, 0, true);
    initImgSelect(img);
  }

  function initImgContainer (img, x, y, w, h, replace) {
    img.style.position = 'unset';
    img.style.display = 'block';
    const imgContainer = document.createElement('div');
    imgContainer.style.position = 'absolute';
    imgContainer.style.left = x;
    imgContainer.style.top = y;
    w && (imgContainer.style.width = w);
    h && (imgContainer.style.height = h);
    replace && img.parentNode.insertBefore(imgContainer, img);
    imgContainer.appendChild(img);
    return imgContainer;
  }

  function annotStorage () {
    return Object.assign({}, options.storage, {
      configure (registry) {
        registry.registerUtility(this, 'storage');
      },
    });
  }

  function initImgSelect (el) {
    if (el.__annotatorApp) return;
    const app = el.__annotatorApp = new annotator.App();
    app.include(annotStorage)
      .include(annotator.ui.main, {
        element: el.parentElement
      }).include(annotatorImageSelect, {
        element: $(el)
      }).start()
      .then(function () {
        app.annotations.load({
          src: el.src
        });
      });
  }

  IDRViewer.fire('annotReady');
})(jQuery);