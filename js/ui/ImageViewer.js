/**
 * Класс ImageViewer
 * Используется для взаимодействием блоком изображений
 * */
class ImageViewer {
  constructor(element) {
    this.element = element;

    this.btnSelectAll = this.element.querySelector(".select-all");
    this.btnShowFiles = this.element.querySelector(".show-uploaded-files");
    this.btnSend = this.element.querySelector(".send");

    this.imageBlock = this.element.querySelector(".images-list");

    this.prevImage = this.element.querySelector(".image");

    this.drawImages = this.drawImages.bind(this);//теряет контекст. принудительно передаем ему нужный контекст

    this._lastClickTime = 0;
    this._lastClickTarget = null;

    this.registerEvents();
  }

  /**
   * Добавляет следующие обработчики событий:
   * 1. Клик по изображению меняет класс активности у изображения
   * 2. Двойной клик по изображению отображает изображаения в блоке предпросмотра
   * 3. Клик по кнопке выделения всех изображений проверяет у всех ли изображений есть класс активности?
   * Добавляет или удаляет класс активности у всех изображений
   * 4. Клик по кнопке "Посмотреть загруженные файлы" открывает всплывающее окно просмотра загруженных файлов
   * 5. Клик по кнопке "Отправить на диск" открывает всплывающее окно для загрузки файлов
   */
  registerEvents() {
    this.btnSelectAll.addEventListener("click", (e) => {
      const isSelectAllInButton =
        this.btnSelectAll.textContent === "Выбрать всё";

      const images = this.element.querySelectorAll(".row .four img");
      if (!isSelectAllInButton) {
        images.forEach((item) => item.classList.remove("selected"));
      } else {
        images.forEach((item) => item.classList.add("selected"));
      }
      this.checkButtonText();
    });

    this.btnShowFiles.addEventListener("click", (e) => {
      const modalPreviewer = App.getModal("filePreviewer");
      modalPreviewer.innerHTML =
        '<i class="asterisk loading icon massive"></i>';

      modalPreviewer.open();

      //качаем с Яндекса
      Yandex.getUploadedFiles((data) => {
        modalPreviewer.showImages(data);
      });
    });

    this.btnSend.addEventListener("click", (e) => {
      let modalSend = App.getModal("fileUploader");
      if (!modalSend) {
        console.error(
          "Модальное окно fileUploader не найдено!",
        );
        return;
      }
      let imgSelectSend = Array.from(
        this.element.querySelectorAll(".selected"),
      );
      let imgSrc = imgSelectSend.map((el) => el.src);
      modalSend.showImages(imgSrc);
      modalSend.open();
    });

    this.imageBlock.addEventListener("click",(e) => {
        if (e.target.tagName !== "IMG") return;
        //двойной клик почему-то не срабатывал - используем следующий метод:
        const now = Date.now();
        const isDoubleClick = now - this._lastClickTime < 300 && e.target === this._lastClickTarget;

        this._lastClickTime = now;
        this._lastClickTarget = e.target;

        if (isDoubleClick) {
          // dblClick
          this._lastClickTime = 0;

          e.target.classList.remove("selected");
          this.checkButtonText();
          this.prevImage.setAttribute("src", e.target.src);
        } else {
          // click
          e.target.classList.toggle("selected");
          this.checkButtonText();
        }
      },false);
  }; //regusterEvents

  /**
   * Очищает отрисованные изображения
   */
  clear() {
    document.querySelector(".images-list .grid .row").innerHTML = "";
  }

  /**
   * Отрисовывает изображения.
   */
  async drawImages(images) {
    //проверим картинку на битость - через Image
    function urlIsAvailable(url) {
      return new Promise((resolve, reject) => {
        const img= new Image();
        img.src = url;

        img.onload = () => {
          resolve(img);
        }
        img.onerror = () => {
          reject(new Error('url not found: '+url));
        }
      })
    }//urlIsAvailable
    
    if (images.length > 0) {
      this.btnSelectAll.classList.remove("disabled");
    } else {
      this.btnSelectAll.classList.add("disabled");
    }

    for (const element of images) {
      //на входе - url!!
      try {
        await urlIsAvailable(element);//дождемся результата!!
        const image = document.createElement("div");
        image.innerHTML = `<img src = ${element} />`;
        image.classList.add(
          "four",
          "wide",
          "column",
          "ui",
          "medium",
          "image-wrapper",
         );
         document.querySelector(".images-list .grid .row").append(image);
        } catch (error) {
          console.log(error);
      }//try/catch
    }//for of images
  };//drawImages

  /**
   * Контроллирует кнопки выделения всех изображений и отправки изображений на диск
   */
  checkButtonText() {
    const allImages = Array.from(
      this.element.querySelectorAll(".row .four img"),
    );
    const isAllSelected = allImages.every((item) =>
      item.classList.contains("selected"),
    );
    const isAnySelected = allImages.some((item) =>
      item.classList.contains("selected"),
    );

    this.btnSelectAll.textContent = isAllSelected
      ? "Снять выделение"
      : "Выбрать всё";


    if (isAnySelected) {
      this.btnSend.classList.remove("disabled");
    } else {
      this.btnSend.classList.add("disabled");
    }
  }
};//checkButtonText
