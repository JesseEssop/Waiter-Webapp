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
        // console.log(user)
        if (user.length === 0) {
            req.flash('error1', 'PLEASE ENTER A NAME')
            res.redirect('/')
        } 
        else {
            await waiting.waiterName(user) 
            res.redirect('/waiters');
        }
    }

    async function homeRoute(req, res) {
        res.render('action', {
            username: waiting.currentWaiter(),
            days: waiting.waiterInfo(waiting.currentWaiter()),
            MON: mon,
            TUES: tues,
            WED: wed,
            THURS: thurs,
            FRI: fri,
            SAT: sat,
            SUN: sun,
            // levelMon: f,
            // levelTues: f,
            // levelWed: f,
            // levelThurs: f,
            // levelFri: f,
            // levelSat: f,
            // levelSun: f
            everyday: await waiting.Alldays()


        })
    }

    async function workdaysRoute(req, res) {
        var week = req.body.weekdays


        await waiting.workDays(week);
        workDays = waiting.Ontime()
        // console.log(workDays)

        for (var w = 0; w < workDays.length; w++) {
            var allworkDays = workDays[w];

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
        res.redirect('/waiters')
    }

    async function waiterLog(req, res) {
        // console.log(await waiting.orderData());
        res.render('days', {
            workerDays: await waiting.orderData()
        });
    }

    async function resetWaiter(req, res) {
        await waiting.resetWaiters()
        res.redirect('/waiters/:username')
    }


    return {
        indexRoute,
        loginRoute,
        homeRoute,
        workdaysRoute,
        waiterLog,
        resetWaiter
    }
}
