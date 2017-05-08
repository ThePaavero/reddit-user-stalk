const RedditUserStalker = () => {

  const init = () => {
    console.log('RedditUserStalker is active.')
    attach()
  }

  const attach = () => {
    const authorLinkElements = Array.from(document.querySelectorAll('.author'))
    const styles = {
      color: 'brown',
      display: 'inline-block',
      padding: '3px 5px',
      backgroundColor: 'rgba(0,0,0,0.2)',
      marginLeft: '10px',
      fontSize: '10px !important',
      cursor: 'pointer',
    }
    authorLinkElements.forEach(el => {
      const username = el.innerText
      const icon = document.createElement('a')
      icon.innerText = 'STALK'
      for (let i in styles) {
        icon.style[i] = styles[i]
      }
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
        reactToStalkData(data.data)
      })
      .catch(console.error)
  }

  const reactToStalkData = (data) => {
    const rows = data.children
    const subreddits = [...new Set(rows.map(row => row.data.subreddit))]
    alert('This user is active in at least the following subs:\n\n' + subreddits.join('\n'))
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
