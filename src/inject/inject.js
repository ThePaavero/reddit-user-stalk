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

  const removeModals = () => {
    document.querySelector('.redditUserStalker-modal-wrapper').remove()
  }

  const showModal = (username, subs, x, y) => {

    const subList = subs.map(s => {
      return `
        <li>
          <a href="https://www.reddit.com/r/${s}" target="_blank">
            ${s}
          </a>
        </li>
      `
    }).join('')

    let markup = `
      <button>×</button>
      <h2>${username}</h2>
      <h3>Active in at least the following subs:</h3>
      <ul>
        ${subList}
      </ul>
    `
    const modalWrapper = document.createElement('div')
    modalWrapper.className = 'redditUserStalker-modal-wrapper'
    modalWrapper.innerHTML = markup
    modalWrapper.style.left = x + 'px'
    modalWrapper.style.top = y + 'px'
    document.body.appendChild(modalWrapper)
    const closeButton = modalWrapper.querySelector('button')
    closeButton.addEventListener('click', e => {
      removeModals()
    })
  }

  const reactToStalkData = (username, data, e) => {
    const rows = data.children
    const subs = [...new Set(rows.map(row => row.data.subreddit))]
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
