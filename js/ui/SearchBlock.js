/**
 * Класс SearchBlock
 * Используется для взаимодействием со строкой ввода и поиска изображений
 * */
class SearchBlock {
  constructor( element ) {
    this.element = element;

    this.registerEvents();
  }

  /**
   * Выполняет подписку на кнопки "Заменить" и "Добавить"
   * Клик по кнопкам выполняет запрос на получение изображений и отрисовывает их,
   * только клик по кнопке "Заменить" перед отрисовкой очищает все отрисованные ранее изображения
   */
  registerEvents() {
    this.element.addEventListener('click', (e) => {
      //check id
      const vkId = this.element.querySelector('input').value.trim();
      if (!vkId) return;

      if (e.target.classList.contains('replace')) {
        //replace
        App.imageViewer.clear();
        VK.get(vkId, App.imageViewer.drawImages);
      } else if (e.target.classList.contains('add')) {
        //add
        VK.get(vkId, App.imageViewer.drawImages);
      }
    });
  } //registerEvents

} //class