/**
 * Класс PreviewModal
 * Используется как обозреватель загруженный файлов в облако
 */
class PreviewModal extends BaseModal {
  constructor( element ) {
    super(element);
    
    this.modalPreviewer = document.querySelector('.uploaded-previewer-modal');
    this.content = this.modalPreviewer.querySelector(".content");
    this.closeButton = this.modalPreviewer.querySelector(".header i");

    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по контроллерам изображения: 
   * Отправляет запрос на удаление изображения, если клик был на кнопке delete
   * Скачивает изображение, если клик был на кнопке download
   */
  registerEvents() {
    this.closeButton.addEventListener('click', (e) => {
      this.close();
    });//close button

    //---- keys event ---//
    this.content.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete")) {
          e.target.querySelector("i").classList.add("icon", "spinner", "loading");
          e.target.classList.add("disabled");
          Yandex.removeFile(e.target.dataset.path, (response,  error) => {                
            if (!response) {
              e.target.closest(".image-preview-container").remove();
            }
          });
      }//delete
      if (e.target.classList.contains("download")) {
          Yandex.downloadFileByUrl(e.target.dataset.file);
      }//download
    });//addEventListener
   };//registerEvent


  /**
   * Отрисовывает изображения в блоке всплывающего окна
   */
  showImages(data) {
    const items = [...data._embedded.items].reverse();//!!! файлы именно здесь - мы работаем с папкой!!!
    const html = [];
    
    if (items.length > 0) {
      for (const image of items) {
        html.push(this.getImageInfo(image));
      };
    };
    this.modalPreviewer.querySelector('.content').innerHTML = html.join('');
  };//showImages

  /**
   * Форматирует дату в формате 2021-12-30T20:40:02+00:00(строка)
   * в формат «30 декабря 2021 г. в 23:40» (учитывая временной пояс)
   * */
  formatDate(date) {
    const formatDate = new Date(date);
    const months = [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря",
    ];

    const day = formatDate.getDate();
    const month = months[formatDate.getMonth()];
    const year = formatDate.getFullYear();
    const hours = String(formatDate.getHours()).padStart(2, "0");
    const minutes = String(formatDate.getMinutes()).padStart(2, "0");

    return `${day} ${month} ${year} г. в ${hours}:${minutes}`;
  };//formatDate

  /**
   * Возвращает разметку из изображения, таблицы с описанием данных изображения и кнопок контроллеров (удаления и скачивания)
   */
  getImageInfo(item) {
    return `
          <div class="image-preview-container">
            <img src='${item.sizes[0].url}' />
            <table class="ui celled table">
                <thead>
                  <tr><th>Имя</th><th>Создано</th><th>Размер</th></tr>
                </thead>
                <tbody>
                  <tr><td>${item.name}</td><td>${this.formatDate(item.created)}</td><td>${Math.round(item.size / 1024)}Кб</td></tr>
                </tbody>
            </table>
            <div class="buttons-wrapper">
              <button class="ui labeled icon red basic button delete" data-path="${item.path}">
                Удалить
                <i class="trash icon"></i>
              </button>
              <button class="ui labeled icon violet basic button download" data-file="${item.sizes[0].url}">
                Скачать
               <i class="download icon"></i>
              </button>
            </div>
         </div>
     `;
  };//getImagesInfo
}//class
