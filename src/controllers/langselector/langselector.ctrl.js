import dom from '../../utils/dom'

require('./langselector.scss');

/**
 * Lang selector
 * a menu for select prefered language
 */
class LangSelector {

constructor () {
    this.setupTemplate()
    this.setChoices([
    { value: 'en', label: 'English' },
    { value: 'fa', label: 'فارسی' },
    { value: 'zh', label: '简体中文' },
    { value: 'ja', label: '日本語' },
    { value: 'ru', label: 'Русский' },
    { value: 'fr', label: 'Français' },
    { value: 'pt_br', label: 'Português Brasileiro' },
    ])
}

/**
 * Build template of the controller
 * @return {DOMElement}
 */
setupTemplate () {
    this.el = dom.create('div', 'lang-selector disabled')
    this.el.onclick = () => this.el.classList.toggle('disabled');
    return this.el
}

setChoices (choiceList) {
     let div = dom.create('div');
     choiceList.forEach((choice) => {
      let option = dom.create('a', {
        href: choice.value,
      }, choice.label);
        div.appendChild(option);
        div.appendChild(dom.create('br'));
    })
    this.el.appendChild(div);
}

}

export default LangSelector
