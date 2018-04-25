const fetch = require('node-fetch');

const api = (data) => `https://api.github.com/${data}`;


function diff_hour(dt2, dt1)
 {

  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= (60 * 60);
  return Math.abs(Math.round(diff));

 }

    const handleCommits = (commits) => {
        const dates = {};
        commits.map( (item, index) => {
            const _date = item.commit.committer.date;
            const date = new Date(_date);
            const month = date.getMonth();
            const day = date.getDate();
            dates[`date-${month}-${day}`] = [];
        });
        commits.map( (item, index) => {
            const _date = item.commit.committer.date;
            const date = new Date(_date);
            const month = date.getMonth();
            const day = date.getDate();
            dates[`date-${month}-${day}`].push(date);
        });

        let daysCount = 0;
        let hoursCount = 0;

        Object.entries(dates).map(([key, value], index)=> {
            const first = value[0];
            const last = value[value.length - 1];
            hoursCount += diff_hour(last, first);
            daysCount += index;

            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };

            if(index===0) {
                console.log("Open:", first.toLocaleDateString('en', options));
                console.log('---');
            }

            /*
            if(index === Object.entries(dates).length - 1) {
                console.log("Closed:", last.toLocaleDateString('en', options));
                console.log('---');
            }
            */
        });
        const  firstCommitPeerDay = 0;
        console.log('Total Days:', daysCount  + ' days');
        console.log('Total Hours:', hoursCount + (daysCount * firstCommitPeerDay) + ' hours (approx)');
    };


    const id = process.argv[2];
    fetch(api(`repos/lbryio/lbry-app/pulls/${id}/commits`))
    	.then(res => {

            return res.json()
        })
    	.then(handleCommits);
