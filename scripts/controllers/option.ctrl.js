/**
 * Option Controller
 * Component to build a one line selector
 * between different options
 * The class used for the parent element
 * is .selector, all childs are .selector-item
 */
class OptionCtrl {

  /**
   * Setup the template and different options
   * See `setChoices` method to understand the
   * format of the following parameters
   * @param {Array} choiceList List of key/values to display
   */
  constructor (choiceList, defaultChoice) {
    this.setupTemplate()
    this.setChoices(choiceList)
  }

  /**
   * Build template of the controller
   * @return {DOMElement}
   */
  setupTemplate () {
    this.el = document.createElement('div')
    this.el.setAttribute('class', 'selector')
    return this.el
  }

  /**
   * Set up the different available choices
   * Choice list format:
   * [
   *   { value: <int>, label: <string>, default: <boolean> },
   *   { value: 2, label: 'Easy'},
   *   { value: 3, label: 'Medium', default: true},
   *   { value: 4, label: 'Hard'},
   * ]
   * @param {Array} choiceList List of options to display
   */
  setChoices (choiceList) {
    let listener = this.selectListener.bind(this)
    choiceList.forEach((choice, index) => {
      let option = document.createElement('span')
      option.setAttribute('class', 'selector-item')
      option.setAttribute('rel', choice.value)
      option.textContent = choice.label
      option.addEventListener('click', listener)
      this.el.appendChild(option)

      if (choice.default)
        this.selectFromTag(option)
    })
  }

  /**
   * Listener for click on items
   * @param  {Event} event Event catched
   */
  selectListener (event) {
    console.log(event)
    this.selectFromTag(event.currentTarget)
  }

  /**
   * Update the selected value from the tag (:item)
   * provided in parameter. The call will apply the
   * class selected to the new tag (and remove it to
   * the previous one), then also update the selected
   * value of the instance.
   * @param  {DOMElement} tag Element tag selected
   */
  selectFromTag (tag) {
    if (this.selectedTag)
      this.selectedTag.classList.remove('selected')

    this.selectedTag = tag
    this.selectedTag.classList.add('selected')
    this.selectedValue = window.parseInt(tag.getAttribute('rel'), 10)
  }

  /**
   * Return the current choice selected
   * @return {*}
   */
  getValue () {
    return this.selectedValue
  }
}
