const Waiters = require('./function/waiterFactory')

module.exports = function WaiterRoute(pool) {

    const waiting = Waiters(pool);

    var mon;
    var tues;
    var wed;
    var thurs;
    var fri;
    var sat;
    var sun;
    var workDays


    function indexRoute(req, res) {
        res.render('index')
    }

    async function loginRoute(req, res) {
        var user = req.body.username
        console.log(user)
        await waiting.waiterName(user)

        res.redirect('/home');
    }

    async function homeRoute(req, res) {
        res.render('action', {
            username: waiting.currentWaiter(),
            MON: mon,
            TUES: tues,
            WED: wed,
            THURS: thurs,
            FRI: fri,
            SAT: sat,
            SUN: sun
        })
    }

    async function workdaysRoute(req, res) {
        var week = req.body.weekdays

        if (week.length > 3 || week.length < 3) {
            req.flash('error', 'PLEASE SELECT 3 DAYS TO WORK.')
        }
        else {
            await waiting.workDays(week);
            workDays = waiting.Ontime()
            console.log(workDays)

            for (var w = 0; w < workDays.length; w++) {
                var allworkDays = workDays[w];
            }
            if (mon >= 3 || tues >= 3 || wed >= 3 || thurs >= 3 || fri >= 3 || sat >= 3 || sun >= 3) {
                req.flash('error', 'SHIFTS FOR SELECTED DAYS ARE FULL, PLEASE SELECT DIFFERENT DAYS')
            }
            else {

                mon = allworkDays.monday
                tues = allworkDays.tuesday
                wed = allworkDays.wednesday
                thurs = allworkDays.thursday
                fri = allworkDays.friday
                sat = allworkDays.saturday
                sun = allworkDays.sunday
            }
        }
        res.redirect('/home')
    }

    async function waiterLog(req, res) {
        res.render('days', {
            workerLog: await waiting.WaiterDays()
        });
    }


    return {
        indexRoute,
        loginRoute,
        homeRoute,
        workdaysRoute,
        waiterLog
    }
}