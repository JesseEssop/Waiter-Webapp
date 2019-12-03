module.exports = function (waiterFactory) {
    function checkDays(currentDay, days) {
        // console.log(days, 'days')
        // console.log(currentDay, 'currentDay')
        if (days) {
            // console.log(currentDay)
            for (const item of days) {
                
                if (item === currentDay) {
                    // console.log(item)
                    return true;
                }
            }
            return false;
        }
        else {
            return false
        }
    }
    return {
        checkDays
    }
}