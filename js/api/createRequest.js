/**
 * Основная функция для совершения запросов по Yandex API.
 * */
const createRequest = (options = {}) => {
  const callback = options.callback;
  let url = new URL(options.url);
  let params = "";
  if (options.data) {
    for (const [key, value] of Object.entries(options.data)) {
      url.searchParams.set(key, value);
    }
  }  

  const xhr = new XMLHttpRequest();
  xhr.open(options.method.toUpperCase(), url);

  xhr.responseType = "json";
  if (options.headers) {
    for (const [key, value] of Object.entries(options.headers)) {
      xhr.setRequestHeader(key, value);
    }
  }
  
  //console.log(url);

  xhr.send();

  //events
  xhr.onload = () => {
    //приняли ответ
    return callback(xhr.response, null);
  };
  xhr.onerror = (error) => {
    return callback(null, new Error(error));
  };
};

