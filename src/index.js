// import { UICorePlugin, Events } from 'Clappr'

// export default class DetachPlugin extends UICorePlugin {
class DetachPlugin extends Clappr.UICorePlugin {
  get name() { return 'detach' }
  get mediaControl() { return this.core.mediaControl }
  get attributes() {
    return {
      'class': 'detach-button'
    }
  }

  bindEvents() {
    this.listenTo(this.mediaControl, Clappr.Events.MEDIACONTROL_RENDERED, this.insertButton)

    this.$el.on('click', ::this.toggleDetach)
  }

  playerWrapper() {
    return this.core.$el
  }

  toggleDetach() {
    this.draggable ? this.attach() : this.detach()
  }

  detach() {
    this.originalStyle = this.playerWrapper().attr('style')
    this.$('.detach-button').html('X attach X')
    this.resizeAndRepositionPlayer()
  }

  resizeAndRepositionPlayer() {
    this.addPlaceholder()
    this.hidePlayer()
    this.enablePlayerDrag()
    this.showMiniPlayer()
  }

  hidePlayer() {
    this.playerWrapper().css({
      opacity: 0
    })
  }

  showMiniPlayer() {
    let style = this.playerWrapper().attr('style')
    this.playerWrapper().css({
      transition: 'opacity 1s ease',
      transition: 'transform 0.5s ease-in-out',
      transform: 'translateY(-130px)',
      opacity: 1,
      height: '180px',
      width: '320px',
      left: '10px',
      bottom: '-100px',
      zIndex: '99999'
    })
  }

  enablePlayerDrag() {
    this.disablePauseClick()
    this.draggable = new Drag(this.playerWrapper()[0])
    this.draggable.init()
  }

  disablePlayerDrag() {
    this.enablePauseClick()
    this.draggable.destroy()
    this.draggable = null
  }

  enablePauseClick() {
    this.core.containers[0].getPlugin('click_to_pause').enable()
  }

  disablePauseClick() {
    this.core.containers[0].getPlugin('click_to_pause').disable()
  }

  attach() {
    this.disablePlayerDrag()
    this.removePlaceholder()

    this.playerWrapper().attr('style', this.originalStyle)
    this.$('.detach-button').html('\\/ detach \\/')
  }

  addPlaceholder() {
    let placeholder = document.createElement('div')
    placeholder.setAttribute('style', this.originalStyle)
    placeholder.setAttribute('class', 'video-placeholder')
    placeholder.style.backgroundColor = 'black'
    placeholder.style.display = 'flex'
    placeholder.style.justifyContent = 'center'
    placeholder.style.alignItems = 'center'

    const button = this.placeholderDetachButton()
    $(placeholder).append(button)
    $(button).on('click', ::this.toggleDetach)
    this.playerWrapper().parent().prepend(placeholder)
  }

  placeholderDetachButton() {
    let button = document.createElement('div')
    button.style.width = '20%'
    button.style.height = '20%'
    button.style.background = 'white'
    button.style.cursor = 'pointer'
    return button
  }

  removePlaceholder() {
    this.playerWrapper().siblings('.video-placeholder').remove()
  }

  insertButton() {
    this.mediaControl.$el.find('.media-control-right-panel').append(this.$el)
  }

  render() {
    this.$el.html('\\/ Detach \\/')
    this.$el.css({
      cursor: 'pointer',
      float: 'right',
      background: 'white',
      border: 0,
      height: '100%'
    })

    return this
  }
}
