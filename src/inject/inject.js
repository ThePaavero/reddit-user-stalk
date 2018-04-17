const RedditUserStalker = () => {

  const init = () => {
    console.log('RedditUserStalker is active.')
    attach()
    setInterval(attach, 2000)
  }

  const attach = () => {
    const authorLinkElements = Array.from(document.querySelectorAll('.author'))
    const styles = {
      color: 'brown',
      display: 'inline-block',
      marginLeft: '10px',
      fontSize: '10px !important',
      cursor: 'pointer',
    }
    const processedAttributeName = 'data-reddit-user-stalker-processed'
    authorLinkElements.forEach(el => {
      if (el.getAttribute(processedAttributeName)) {
        return
      }
      el.setAttribute(processedAttributeName, true)
      const username = el.innerText
      const icon = document.createElement('a')
      icon.innerText = '💩'
      for (let i in styles) {
        icon.style[i] = styles[i]
      }
      el.parentNode.appendChild(icon)
      icon.addEventListener('click', (e) => {
        e.preventDefault()
        stalk(username, e)
      })
    })
  }

  const stalk = (username, e) => {
    const rssUrl = 'https://www.reddit.com/user/' + username + '/.json'
    fetch(rssUrl)
    .then(response => {
      return response.json()
    })
    .then(data => {
      reactToStalkData(username, data.data, e)
    })
    .catch(console.error)
  }

  const showModal = (username, subs, x, y) => {
    console.log(x, y)
    window.alert('"' + username + '" is active in at least the following subs:\n\n' + subs.join('\n'))
  }

  const reactToStalkData = (username, data, e) => {
    const rows = data.children
    const subs = [...new Set(rows.map(row => row.data.subreddit))]
    // alert('"' + username + '" is active in at least the following subs:\n\n' + subs.join('\n'))
    showModal(username, subs, e.clientX, e.clientY)
  }

  return {
    init
  }
}

chrome.extension.sendMessage({}, () => {
  const readyStateCheckInterval = setInterval(() => {
    if (document.readyState === 'complete') {
      clearInterval(readyStateCheckInterval)
      RedditUserStalker().init()
    }
  }, 10)
})
