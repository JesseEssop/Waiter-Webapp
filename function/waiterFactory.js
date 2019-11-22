module.exports = function waiterWork(pool) {

    var regex = /[0-9$@$!%*?&#^-_. +\[.*?\]]/;
    var newWaiter;
    var loggedIn = '';

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
            // allwaiters = await pool.query('SELECT * FROM waiters WHERE waitername = $1')

            await pool.query('insert into waiters (waitername) values ($1)', [newWaiter]);
            loggedIn = newWaiter;

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
                await pool.query('insert into waiters (waitername, day_id) values ($1, $2)', [newWaiter, 1])
                checkWaiter = await pool.query('SELECT weekdays.days, waiters.waitername FROM weekdays INNER JOIN waiters ON weekdays.id = waiters.day_id WHERE weekdays.id = 1')
                monday += 1
            }
            if (day[i] === 'Tuesday') {
                await pool.query('insert into waiters (waitername, day_id) values ($1, $2)', [newWaiter, 2])
                checkWaiter = await pool.query('SELECT weekdays.days, waiters.waitername FROM weekdays INNER JOIN waiters ON weekdays.id = waiters.day_id WHERE weekdays.id = 2')
                tuesday += 1
            }
            if (day[i] === 'Wednesday') {
                await pool.query('insert into waiters (waitername, day_id) values ($1, $2)', [newWaiter, 3])
                checkWaiter = await pool.query('SELECT weekdays.days, waiters.waitername FROM weekdays INNER JOIN waiters ON weekdays.id = waiters.day_id WHERE weekdays.id = 3')
                wednesday += 1
            }
            if (day[i] === 'Thursday') {
                await pool.query('insert into waiters (waitername, day_id) values ($1, $2)', [newWaiter, 4])
                checkWaiter = await pool.query('SELECT weekdays.days, waiters.waitername FROM weekdays INNER JOIN waiters ON weekdays.id = waiters.day_id WHERE weekdays.id = 4')
                thursday += 1
            }
            if (day[i] === 'Friday') {
                await pool.query('insert into waiters (waitername, day_id) values ($1, $2)', [newWaiter, 5])
                checkWaiter = await pool.query('SELECT weekdays.days, waiters.waitername FROM weekdays INNER JOIN waiters ON weekdays.id = waiters.day_id WHERE weekdays.id = 5')
                friday += 1
            }
            if (day[i] === 'Saturday') {
                await pool.query('insert into waiters (waitername, day_id) values ($1, $2)', [newWaiter, 6])
                checkWaiter = await pool.query('SELECT weekdays.days, waiters.waitername FROM weekdays INNER JOIN waiters ON weekdays.id = waiters.day_id WHERE weekdays.id = 6')
                saturday += 1
            }
            if (day[i] === 'Sunday') {
                await pool.query('insert into waiters (waitername, day_id) values ($1, $2)', [newWaiter, 7])
                checkWaiter = await pool.query('SELECT weekdays.days, waiters.waitername FROM weekdays INNER JOIN waiters ON weekdays.id = waiters.day_id WHERE weekdays.id = 7')
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
        workWeek.push(workDays);
    }

    function Ontime() {
        return workWeek
    }

    async function WaiterDays() {
        checkWaiter = await pool.query('SELECT weekdays.days, waiters.waitername FROM weekdays INNER JOIN waiters ON weekdays.id = waiters.day_id WHERE weekdays.id = waiters.day_id')
        // console.log(checkWaiter.rows)
        return checkWaiter.rows
    }

    async function orderData() {
        let orderedData = [];
        let res = await pool.query('SELECT * FROM weekdays');
        for (const day of res.rows) {
           let item = { id: day.id, day: day.days, waiters: [] };
            orderedData.push(item);
        }
        let waiters = await pool.query('SELECT * FROM waiters');
        for (const waiter of waiters.rows) {
            for (const item of orderedData) {
                if (waiter.day_id === item.id) {
                    item.waiters.push(waiter.waitername);
                } 
            }
        }
        return orderedData;
    }

    async function LevelDay (){
        let orderedData = await orderData();
        // console.log(orderedData[0].waiters)
        if(orderedData[0].waiters >= 3 ||orderedData[1].waiters >= 3||orderedData[2].waiters >= 3 ||orderedData[3].waiters >= 3||orderedData[4].waiters >= 3||orderedData[5].waiters >= 3||orderedData[6].waiters >= 3){
            return "danger"
        }
    }

    return {
        orderData,
        waiterName,
        testWaiter,
        currentWaiter,
        workDays,
        Ontime,
        WaiterDays,
        LevelDay

    }
}