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

    var oneWaiter;

    var shiftsMap = {}

    var errorMsg;


    async function waiterName(waiter) {

        if (testWaiter(waiter)) {
            var allwaiters = await pool.query('SELECT * FROM waiters WHERE waitername = $1', [newWaiter])
            if (allwaiters.rows.length === 0) {
                await pool.query('insert into waiters (waitername) values ($1)', [newWaiter]);
            }
            loggedIn = newWaiter;
        }
    }

    function currentWaiter() {
        console.log(loggedIn)
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

    function shiftMapUpdater(day) {
        if (shiftsMap[newWaiter] === undefined) {
            shiftsMap[newWaiter] = [day];
        } else {
            let list = shiftsMap[newWaiter];
            list.push(day);
            shiftsMap[newWaiter] = list;

        }
    }

    async function workDays(day) {
        oneWaiter = await pool.query('SELECT id FROM waiters WHERE waitername = $1', [newWaiter]);

        for (var i = 0; i < day.length; i++) {
            if (day[i] === 'Monday') {
                await pool.query('insert into shifts (waiter_id, day_id) values ($1, $2)', [oneWaiter.rows[0].id, 1])
                checkWaiter = await pool.query('SELECT weekdays.days, waiters.waitername FROM shifts INNER JOIN weekdays ON weekdays.id = shifts.day_id INNER JOIN waiters ON waiters.id = shifts.waiter_id')
                
                if (monday >= 3) {
                    errorMsg = "Monday's shifts are full"
                } else {
                    monday += 1
                    shiftMapUpdater('Monday');
                }
            }
            if (day[i] === 'Tuesday') {
                await pool.query('insert into shifts (waiter_id, day_id) values ($1, $2)', [oneWaiter.rows[0].id, 2])
                checkWaiter = await pool.query('SELECT weekdays.days, waiters.waitername FROM shifts INNER JOIN weekdays ON weekdays.id = shifts.day_id INNER JOIN waiters ON waiters.id = shifts.waiter_id')
                
                if (tuesday >= 3) {
                    errorMsg = "Tuesday's shifts are full"
                } else {
                    tuesday += 1
                    shiftMapUpdater('Tuesday');
                }
            }
            if (day[i] === 'Wednesday') {
                await pool.query('insert into shifts (waiter_id, day_id) values ($1, $2)', [oneWaiter.rows[0].id, 3])
                checkWaiter = await pool.query('SELECT weekdays.days, waiters.waitername FROM shifts INNER JOIN weekdays ON weekdays.id = shifts.day_id INNER JOIN waiters ON waiters.id = shifts.waiter_id')
                
                if (wednesday >= 3) {
                    errorMsg = "Wednesday's shifts are full"
                } else {
                    wednesday += 1
                    shiftMapUpdater('Wednesday');
                }
            }
            if (day[i] === 'Thursday') {
                await pool.query('insert into shifts (waiter_id, day_id) values ($1, $2)', [oneWaiter.rows[0].id, 4])
                checkWaiter = await pool.query('SELECT weekdays.days, waiters.waitername FROM shifts INNER JOIN weekdays ON weekdays.id = shifts.day_id INNER JOIN waiters ON waiters.id = shifts.waiter_id')
                
                if (thursday >= 3) {
                    errorMsg = "Thursday's shifts are full"
                } else {
                    thursday += 1
                    shiftMapUpdater('Thursday');
                }
            }
            if (day[i] === 'Friday') {
                await pool.query('insert into shifts (waiter_id, day_id) values ($1, $2)', [oneWaiter.rows[0].id, 5])
                checkWaiter = await pool.query('SELECT weekdays.days, waiters.waitername FROM shifts INNER JOIN weekdays ON weekdays.id = shifts.day_id INNER JOIN waiters ON waiters.id = shifts.waiter_id')
                
                if (friday >= 3) {
                    errorMsg = "Friday's shifts are full"
                } else {
                    friday += 1
                    shiftMapUpdater('Friday');
                }
            }
            if (day[i] === 'Saturday') {
                await pool.query('insert into shifts (waiter_id, day_id) values ($1, $2)', [oneWaiter.rows[0].id, 6])
                checkWaiter = await pool.query('SELECT weekdays.days, waiters.waitername FROM shifts INNER JOIN weekdays ON weekdays.id = shifts.day_id INNER JOIN waiters ON waiters.id = shifts.waiter_id')
                
                if (saturday >= 3) {
                    errorMsg = "Saturday's shifts are full"
                } else {
                    saturday += 1
                    shiftMapUpdater('Saturday');
                }
            }
            if (day[i] === 'Sunday') {
                await pool.query('insert into shifts (waiter_id, day_id) values ($1, $2)', [oneWaiter.rows[0].id, 7])
                checkWaiter = await pool.query('SELECT weekdays.days, waiters.waitername FROM shifts INNER JOIN weekdays ON weekdays.id = shifts.day_id INNER JOIN waiters ON waiters.id = shifts.waiter_id')
                
                if (sunday >= 3) {
                    errorMsg = "Sunday's shifts are full"
                } else {
                    sunday += 1
                    shiftMapUpdater('Sunday');
                }
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
        checkWaiter = await pool.query('SELECT weekdays.days, waiters.waitername FROM shifts INNER JOIN weekdays ON weekdays.id = shifts.day_id INNER JOIN waiters ON waiters.id = shifts.waiter_id')

        return checkWaiter.rows
    }

    async function orderData() {
        let shifts = await WaiterDays();
        let orderedData = [];
        let res = await pool.query('SELECT * FROM weekdays');
        for (const day of res.rows) {
            let item = { id: day.id, day: day.days, waiters: [] };
            orderedData.push(item);
        }

        for (const shift of shifts) {
            for (const item of orderedData) {
                if (shift.days === item.day) {
                    item.waiters.push(shift.waitername);
                }
            }
        }

        return orderedData;
    }

    function LevelDay1() {
        if (monday >= 3) {
            return "danger"
        }
        else {
            return "safe"
        }
    }

    function LevelDay2() {
        if (tuesday >= 3) {
            return "danger"
        }
        else {
            return "safe"
        }
    }

    function LevelDay3() {
        if (wednesday >= 3) {
            return "danger"
        }
        else {
            return "safe"
        }
    }

    function LevelDay4() {
        if (thursday >= 3) {
            return "danger"
        }
        else {
            return "safe"
        }
    }

    function LevelDay5() {
        if (friday >= 3) {
            return "danger"
        }
        else {
            return "safe"
        }
    }

    function LevelDay6() {
        if (saturday >= 3) {
            return "danger"
        }
        else {
            return "safe"
        }
    }

    function LevelDay7() {
        if (sunday >= 3) {
            return "danger"
        }
        else {
            return "safe"
        }
    }

    function waiterInfo(username) {
        let list = shiftsMap[username];
        console.log(list)
        return list;
    };

    async function Alldays() {
        var everyday = await pool.query('SELECT * FROM weekdays')
        return everyday.rows
    }


    async function resetWaiters() {
        await pool.query('delete from shifts');
        shiftsMap = {};
    }

    function MsgError (){
        return errorMsg
    }

    return {
        orderData,
        waiterName,
        testWaiter,
        currentWaiter,
        workDays,
        Ontime,
        WaiterDays,
        LevelDay1,
        LevelDay2,
        LevelDay3,
        LevelDay4,
        LevelDay5,
        LevelDay6,
        LevelDay7,
        resetWaiters,
        waiterInfo,
        Alldays,
        MsgError
        
    }
}