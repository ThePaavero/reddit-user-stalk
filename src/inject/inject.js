const RedditUserStalker = () => {

  const init = () => {
    console.log('RedditUserStalker is active.')
    attach()
  }

  const attach = () => {
    const authorLinkElements = Array.from(document.querySelectorAll('.author'))
    authorLinkElements.forEach(el => {
      const username = el.innerText
      const icon = document.createElement('a')
      icon.innerText = 'STALK'
      icon.style.color = 'orangered'
      icon.style.display = 'inline-block'
      icon.style.padding = '3px 5px'
      icon.style.backgroundColor = 'black'
      icon.style.opacity = '0.2'
      el.parentNode.appendChild(icon)
      icon.addEventListener('click', (e) => {
        e.preventDefault()
        stalk(username)
      })
    })
  }

  const stalk = (username) => {
    const rssUrl = 'https://www.reddit.com/user/' + username + '/.json'
    fetch(rssUrl)
      .then(response => {
        return response.json()
      })
      .then(data => {
        console.log('DATA:', data)
      })
      .catch(console.error)
  }

  return {
    init
  }
}

chrome.extension.sendMessage({}, function (response) {
  const readyStateCheckInterval = setInterval(function () {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval)
      RedditUserStalker().init()
    }
  }, 10)
})
