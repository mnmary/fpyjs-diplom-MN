/**
 * Класс Yandex
 * Используется для управления облаком.
 * Имеет свойство HOST
 * */


class Yandex {
  static HOST = 'https://cloud-api.yandex.net/v1/disk';
  static TOKEN_NAME = 'yandexToken';
  static YANDEX_FIELD = '/testJS';
  /**
   * Метод формирования и сохранения токена для Yandex API
   */
  static getToken() {
    let token = localStorage.getItem(Yandex.TOKEN_NAME);
    if (!token) {
      token = prompt("Введите токен для аутентификации на Яндекс Диск");
      if (token) {
        localStorage.setItem(Yandex.TOKEN_NAME, token);
      }
    }
    return token;
  };//getToken

  //очень много фоток в корне диска, работаем в отдельной папке!!!
  //создаем папку в любом случае!!!
  static createFolder(callback) {
    const token = Yandex.getToken();
   
    createRequest({
      method: "PUT",
      url: `${Yandex.HOST}/resources`,
      data: { path: Yandex.YANDEX_FIELD },
      headers: { Authorization: `OAuth ${token}` },
      callback: callback,
    });
  };//createFolder

  /**
   * Метод загрузки файла в облако
   */
  static uploadFile(path, url, callback){
    const token = Yandex.getToken();
    
    createRequest({
      method: "POST",
      url: `${Yandex.HOST}/resources/upload`,
      data: { path: path, url: url },
      headers: { Authorization: `OAuth ${token}` },
      callback: callback,
    });
  };//upload

  /**
   * Метод удаления файла из облака
   */
  static removeFile(path, callback){
    const token = Yandex.getToken();

    createRequest({
      method: "DELETE",
      url: `${Yandex.HOST}/resources`,
      data: { path: path },
      headers: { Authorization: `OAuth ${token}` },
      callback: callback,
    });
  };//remove

  /**
   * Метод получения всех загруженных файлов в облаке
   */
  static getUploadedFiles(callback){
    const token = Yandex.getToken();

    createRequest({
      method: "GET",
      url: `${Yandex.HOST}/resources`,
      data: { path: this.YANDEX_FIELD },
      headers: { Authorization: `OAuth ${token}` },
      callback: callback,
    });
  };//get files

  /**
   * Метод скачивания файлов
   */
  static downloadFileByUrl(url){
    const a = document.createElement('a');
    a.href = url;
    a.click();
  };//download

}
