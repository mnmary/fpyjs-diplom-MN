/**
 * Класс FileUploaderModal
 * Используется как всплывающее окно для загрузки изображений
 */
class FileUploaderModal extends BaseModal {
  constructor( element ) {
    super(element);

    this.uploadWindow = document.querySelector('.file-uploader-modal');
    this.content = this.uploadWindow.querySelector('.content');
    this.btnClose = this.uploadWindow.querySelector(".close.button");
    this.iconClose = this.uploadWindow.querySelector(".header i");
    
    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по крестику на всплывающем окне, закрывает его
   * 2. Клик по кнопке "Закрыть" на всплывающем окне, закрывает его
   * 3. Клик по кнопке "Отправить все файлы" на всплывающем окне, вызывает метод sendAllImages
   * 4. Клик по кнопке загрузке по контроллерам изображения: 
   * убирает ошибку, если клик был по полю вода
   * отправляет одно изображение, если клик был по кнопке отправки
   */
  registerEvents() {
    //--- buttons events ---// 
    this.iconClose.addEventListener('click', () => {
      this.close();
    });

    this.btnClose.addEventListener('click', () => {
      this.close();
    });

    //--- window events ---//
    this.uploadWindow.addEventListener('click', (event) => {
      //send all button
      if (event.target.classList.contains('send-all')) {
        this.sendAllImages();
      };
      
      if (event.target.tagName === 'INPUT') {
        event.target.parentElement.classList.remove('error');
      };

      //send one button
      if (event.target.tagName === 'I') {
        this.sendImage(event.target.closest('.image-preview-container'));//ищем родительский контейнер!!
      };
    });
  };//registerEvents

  /**
   * Отображает все полученные изображения в теле всплывающего окна
   */
  showImages(images) {
    const html = images.reverse().map(img => this.getImageHTML(img)).join('');
    this.content.innerHTML = html;
  };

  /**
   * Формирует HTML разметку с изображением, полем ввода для имени файла и кнопкной загрузки
   */
  getImageHTML(item) {
    return `
    <div class="image-preview-container">
        <img src= '${item}' />
        <div class="ui action input">
            <input type="text" placeholder="Путь к файлу">
            <button class="ui button"><i class="upload icon"></i></button>
        </div>
    </div>`;
  };

  /**
   * Отправляет все изображения в облако
   */
  sendAllImages() {
    const imageContainer = this.content.querySelectorAll('.image-preview-container');
      imageContainer.forEach(elm => this.sendImage(elm));
  };


  /**
   * Валидирует изображение и отправляет его на сервер
   */
  sendImage(imageContainer) {
    const input = imageContainer.querySelector('input');
    const source = imageContainer.querySelector("img").src;

    const imgName = input.value.trim();
    const url = Yandex.YANDEX_FIELD + "/" + imgName + ".png";
    
    if (!imgName) {
      input.parentElement.classList.add("error");
      return;
    }

    input.classList.add("disabled");
    Yandex.uploadFile(url, source, (response, error) => {
      if (!error) {
        if (this.content.children.length === 1) {
          this.close();
        }
        imageContainer.remove();
      }
    });
  };//sendImage

}//class