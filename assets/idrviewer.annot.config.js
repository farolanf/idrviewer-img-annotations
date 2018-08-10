IDRViewer.on('annotReady', function () {

  initStorage();

  function initStorage () {
    // TODO: implement your storage logic

    // following is sample storage using localStorage
    
    // inspect the storage on:
    // [Chrome devtools] - [Application tab] - [Storage] - [Local Storage]

    const STORE = 'idrviewerAnnotations';

    const storeJson = localStorage.getItem(STORE);
    const store = storeJson ? JSON.parse(storeJson) : {};

    function toArray () {
      return Object.keys(store).map(id => store[id]);
    }

    function save () {
      localStorage.setItem(STORE, JSON.stringify(store, null, 2));
    }

    // calc next id
    let id = Object.keys(store).length
      ? Object.keys(store).reduce(function (max, id) {
          return Math.max(max, id);
        }, 1) + 1
      : 1;

    IDRViewer.annotInit({
      storage: {
        create (annotation) {
          annotation.id = id++;
          store[annotation.id] = annotation;
          save();
          return annotation;
        },
        update (annotation) {
          store[annotation.id] = annotation;
          save();
          return annotation;
        },
        delete (annotation) {
          delete store[annotation.id];
          save();
          return annotation;
        },
        query (queryObj) {
          // return annotations filtered by queryObj.src
          const results = toArray().filter(function (annotation) {
            return annotation.image_selection.uri === queryObj.src ||
              annotation.image_selection.src === queryObj.src
          })
          return {
            results: results,
            meta: {
              total: results.length
            }
          }
        }
      }
    })
  }
});