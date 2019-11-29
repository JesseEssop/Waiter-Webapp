module.exports = function (waiterFactory) {
    function checkDays(currentDay, days) {
        if (days) {
            for (const item of days) {
                if (item === currentDay) {
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