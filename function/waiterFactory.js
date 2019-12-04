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
        // console.log(loggedIn)
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

    async function shiftMapUpdater(id) {
        let waiterShifts = await pool.query('SELECT * FROM shifts WHERE waiter_id = $1',[id]);
        let list = [];
        for(const item of waiterShifts.rows){
            let weekday = await pool.query('SELECT days FROM weekdays WHERE id = $1',[item.day_id]);
            list.push(weekday.rows[0].days);
        }
        shiftsMap[newWaiter] = list;
    }

    async function workDays(day) {
        oneWaiter = await pool.query('SELECT id FROM waiters WHERE waitername = $1', [newWaiter]);

        var shiftCheck = await pool.query("SELECT * FROM shifts where waiter_id = $1", [oneWaiter.rows[0].id])

        if (shiftCheck.rowCount === 0) {
            await WaiterWorkShifts(day, oneWaiter);
        }
        else {
            await pool.query("DELETE FROM shifts WHERE waiter_id = $1", [oneWaiter.rows[0].id])
            await WaiterWorkShifts(day, oneWaiter);
        }

    }

    async function WaiterWorkShifts(day, oneWaiter) {

        for (var i = 0; i < day.length; i++) {
            if (day[i] === 'Monday') {
                await pool.query('insert into shifts (waiter_id, day_id) values ($1, $2)', [oneWaiter.rows[0].id, 1])
                checkWaiter = await pool.query('SELECT weekdays.days, waiters.waitername FROM shifts INNER JOIN weekdays ON weekdays.id = shifts.day_id INNER JOIN waiters ON waiters.id = shifts.waiter_id')

                if (monday >= 3) {
                    errorMsg = "Monday's shifts are full"
                }
            }
            if (day[i] === 'Tuesday') {
                await pool.query('insert into shifts (waiter_id, day_id) values ($1, $2)', [oneWaiter.rows[0].id, 2])
                checkWaiter = await pool.query('SELECT weekdays.days, waiters.waitername FROM shifts INNER JOIN weekdays ON weekdays.id = shifts.day_id INNER JOIN waiters ON waiters.id = shifts.waiter_id')

                if (tuesday >= 3) {
                    errorMsg = "Tuesday's shifts are full"
                }
            }
            if (day[i] === 'Wednesday') {
                await pool.query('insert into shifts (waiter_id, day_id) values ($1, $2)', [oneWaiter.rows[0].id, 3])
                checkWaiter = await pool.query('SELECT weekdays.days, waiters.waitername FROM shifts INNER JOIN weekdays ON weekdays.id = shifts.day_id INNER JOIN waiters ON waiters.id = shifts.waiter_id')

                if (wednesday >= 3) {
                    errorMsg = "Wednesday's shifts are full"
                }
            }

            if (day[i] === 'Thursday') {
                await pool.query('insert into shifts (waiter_id, day_id) values ($1, $2)', [oneWaiter.rows[0].id, 4])
                checkWaiter = await pool.query('SELECT weekdays.days, waiters.waitername FROM shifts INNER JOIN weekdays ON weekdays.id = shifts.day_id INNER JOIN waiters ON waiters.id = shifts.waiter_id')

                if (thursday >= 3) {
                    errorMsg = "Thursday's shifts are full"
                }
            }
            if (day[i] === 'Friday') {
                await pool.query('insert into shifts (waiter_id, day_id) values ($1, $2)', [oneWaiter.rows[0].id, 5])
                checkWaiter = await pool.query('SELECT weekdays.days, waiters.waitername FROM shifts INNER JOIN weekdays ON weekdays.id = shifts.day_id INNER JOIN waiters ON waiters.id = shifts.waiter_id')

                if (friday >= 3) {
                    errorMsg = "Friday's shifts are full"
                }
            }
            if (day[i] === 'Saturday') {
                await pool.query('insert into shifts (waiter_id, day_id) values ($1, $2)', [oneWaiter.rows[0].id, 6])
                checkWaiter = await pool.query('SELECT weekdays.days, waiters.waitername FROM shifts INNER JOIN weekdays ON weekdays.id = shifts.day_id INNER JOIN waiters ON waiters.id = shifts.waiter_id')

                if (saturday >= 3) {
                    errorMsg = "Saturday's shifts are full"
                }
            }
            if (day[i] === 'Sunday') {
                await pool.query('insert into shifts (waiter_id, day_id) values ($1, $2)', [oneWaiter.rows[0].id, 7])
                checkWaiter = await pool.query('SELECT weekdays.days, waiters.waitername FROM shifts INNER JOIN weekdays ON weekdays.id = shifts.day_id INNER JOIN waiters ON waiters.id = shifts.waiter_id')

                if (sunday >= 3) {
                    errorMsg = "Sunday's shifts are full"
                }
            }
        }

        let newShifts = await pool.query('SELECT * FROM shifts');
        const workDays = {
            'monday': 0,
            'tuesday': 0,
            'wednesday': 0,
            'thursday': 0,
            'friday': 0,
            'saturday': 0,
            'sunday': 0
        };
        for (const item of newShifts.rows) {
            switch (item.day_id) {
                case 1:
                    workDays.monday++;
                    break;
                case 2:
                    workDays.tuesday++;
                    break;
                case 3:
                    workDays.wednesday++;
                    break;
                case 4:
                    workDays.thursday++;
                    break;
                case 5:
                    workDays.friday++;
                    break;
                case 6:
                    workDays.saturday++;
                    break;
                case 7:
                    workDays.sunday++;
                    break;
            }
        }
        workWeek.push(workDays);
        await shiftMapUpdater(oneWaiter.rows[0].id);

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
        // console.log(list)
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

    function MsgError() {
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
        MsgError,

    }
}