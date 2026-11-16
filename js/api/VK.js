/**
 * Класс VK
 * Управляет изображениями из VK. С помощью VK API.
 * С помощью этого класса будет выполняться загрузка изображений из vk.
 * Имеет свойства ACCESS_TOKEN и lastCallback
 * */

class VK {
  static ACCESS_TOKEN ="";
  static lastCallback;
  static SCRIPT_ID = "getImage";

  /**
   * Получает изображения
   * */
  static get(id = "", callback) {
    VK.lastCallback = callback; //это наш калбэк для передачи в ВК запрос

    const script = document.createElement("script"); // 1. создаем скрипт
    script.id = VK.SCRIPT_ID;
    script.src =
      `https://api.vk.com/method/photos.get?` +
      `owner_id=${id}&` +
      `album_id=profile&` +
      `access_token=${VK.ACCESS_TOKEN}&` +
      `v=5.131&` +
      `callback=VK.processData`;

    document.body.appendChild(script); //размещаем в теле документа!!!
  } //get

  /**
   * Передаётся в запрос VK API для обработки ответа.
   * Является обработчиком ответа от сервера.
   */
  static processData(result) {
    function getBigSizeImageUrl(item) {
      //ищем самую большую фотку в списке (по ширине)
      let maxItem = item.reduce((prev, curr) => {
        const prevSize = prev.width;
        const currSize = curr.width;
        return prevSize > currSize ? prev : curr;
      });
      return maxItem.url;
    } //getBigSizeImageUrl

    const script = document.getElementById(VK.SCRIPT_ID);
    if (script) {
      script.remove();
    }

    let arrImages = [];

    if (result.response) {
      for (let i = 0; i < result.response.items.length; i++) {
        arrImages.push(getBigSizeImageUrl(result.response.items[i].sizes));
      }

      VK.lastCallback(arrImages);
    } else if (result.error) {
      alert(`Ошибка при чтении данных: ${result.error.error_msg}`);
    }
    VK.lastCallback = () => {};
  } //processResult
} //class VK
