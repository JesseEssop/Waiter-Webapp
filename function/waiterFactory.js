module.exports = function waiterWork(pool) {

    var regex = /[0-9$@$!%*?&#^-_. +\[.*?\]]/;
    var newWaiter;
    var loggedIn = '';
    var allwaiters;
    var errorMsg;
    var workId;
    var checkWaiter;

    var workWeek = [];

    var monday = 0
    var tuesday = 0
    var wednesday = 0
    var thursday = 0
    var friday = 0
    var saturday = 0
    var sunday = 0


    async function waiterName(waiter) {

        if (testWaiter(waiter)) {
            loggedIn = waiter;

            await pool.query('insert into waiters (waitername) values ($1)', [newWaiter]);
            allwaiters = await pool.query('SELECT EXISTS(SELECT 1 FROM waiters WHERE waitername = $1)', [newWaiter]);
        }
    }

    function currentWaiter() {
        return loggedIn;
    }

    function testWaiter(input) {

        var wack = regex.test(input);

        if (wack !== true) {
            newWaiter = input.toLowerCase();
            newWaiter = newWaiter.charAt(0).toUpperCase() + newWaiter.slice(1);
        }
        return newWaiter
    }


    async function workDays(day) {

        for (var i = 0; i < day.length; i++) {

            if (day[i] === 'Monday') {
                monday += 1
            }
            if (day[i] === 'Tuesday') {
                tuesday += 1
            }
            if (day[i] === 'Wednesday') {
                wednesday += 1
            }
            if (day[i] === 'Thursday') {
                thursday += 1
            }
            if (day[i] === 'Friday') {
                friday += 1
            }
            if (day[i] === 'Saturday') {
                saturday += 1
            }
            if (day[i] === 'Sunday') {
                sunday += 1
            }
        }
        const workDays = {
            monday,
            tuesday,
            wednesday,
            thursday,
            friday,
            saturday,
            sunday
        };

        for (var w = 0; w < allwaiters.rows.length; w++) {
            var allWait = allwaiters.rows[w].exists
            console.log(allWait)
        }

        var getWaiter = await pool.query('SELECT MAX(id) FROM waiters')

        for (var z = 0; z < getWaiter.rows.length; z++) {
            workId = getWaiter.rows[z].max
        }

        if (allWait === true) {
            await pool.query('insert into weekdays (day, waiter_id) values ($1,$2)', [day.toString(), workId])
            checkWaiter = await pool.query('SELECT waiters.waitername, weekdays.day FROM waiters INNER JOIN weekdays ON waiters.id = weekdays.waiter_id WHERE waiters.id = $1', [workId])
        }
        workWeek.push(workDays);
    }

    function Ontime() {
        return workWeek
    }

    async function WaiterDays() {
        checkWaiter = await pool.query('SELECT waiters.waitername, weekdays.day FROM waiters INNER JOIN weekdays ON waiters.id = weekdays.waiter_id WHERE waiters.id = $1', [workId])
        return checkWaiter.rows
    }

    function waitingError() {
        return errorMsg
    }

    return {
        waiterName,
        testWaiter,
        currentWaiter,
        workDays,
        Ontime,
        waitingError,
        WaiterDays

    }
}