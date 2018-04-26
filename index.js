const fetch = require('node-fetch')

const api = data => `https://api.github.com/${data}`

// Handler function for date difference
const diff = (dt2, dt1) => (dt2.getTime() - dt1.getTime()) / 1000

// Handler function for hours difference
const diff_hour = (dt2, dt1) => {
  const hours = diff(dt2, dt1) / (60 * 60)
  return Math.abs(Math.round(hours * 100) / 100)
}

// Handler function for minutes difference
const diff_minute = (dt2, dt1) => {
  const minutes = diff(dt2, dt1) / 60
  return Math.abs(Math.round(minutes))
}

const handleCommits = (commits, fixTime) => {
  // Store date of each commits
  const dates = {}

  // Split by days
  commits.map((item, index) => {
    const _date = item.commit.committer.date
    const date = new Date(_date)
    const month = date.getMonth()
    const day = date.getDate()
    dates[`date-${month}-${day}`] = []
  })

  // Assign by day
  commits.map((item, index) => {
    const _date = item.commit.committer.date
    const date = new Date(_date)
    const month = date.getMonth()
    const day = date.getDate()
    dates[`date-${month}-${day}`].push(date)
  })

  // Count vars
  let daysCount = 1
  let hoursCount = 0
  let minuteCount = 0

  Object.entries(dates).map(([key, value], index) => {
    const first = value[0]
    const last = value[value.length - 1]
    hoursCount += diff_hour(last, first)
    minuteCount += diff_minute(last, first)
    daysCount += index

    // Format date
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }

    // Show first commit date
    if (index === 0) {
      console.log('\n Open:', first.toLocaleDateString('en', options), '\n')
    }
  })

  // Add initial commit time (approximation)
  const firstCommitPeerDay = fixTime || 0

  // Get total hours + approximation
  const hoursTotal = hoursCount + daysCount * firstCommitPeerDay

  // Section title
  console.log(' Time tracker', '\n ------------')

  // Total days spend
  console.log(' Total Days:', daysCount + ' days')

  if (firstCommitPeerDay > 0) {
    // Approximation time spend
    console.log(' Total Hours:', hoursTotal + ' hours (approx)')
    console.log(
      ' Total Minutes:',
      minuteCount + daysCount * firstCommitPeerDay * 60 + ' minutes (approx)'
    )
  } else {
    // Time difference: ignores initial commit time
    console.log(' Total Hours:', hoursTotal + ' hours')
    console.log(' Total Minutes:', minuteCount + ' minutes')
  }

  // Section title
  console.log('\n Commit stats', '\n -------------')

  // Total commits
  console.log(' Total Commits:', commits.length + ' commits')

  const avgCommits = Math.round(hoursTotal / commits.length)

  // Average commits per hour
  console.log(' Commits per hour:', +(hoursTotal <= 1 ? commits.length : avgCommits) + ' (average)')

  console.log('\n')
}

function getStats(id, fixedTime) {
  // Github api (fetch commits)
  fetch(api(`repos/lbryio/lbry-app/pulls/${id}/commits`))
    .then(res => {
      return res.json()
    })
    .then(data => handleCommits(data, fixedTime))
}

// run
getStats(process.argv[2], process.argv[3])

module.export = getStats
