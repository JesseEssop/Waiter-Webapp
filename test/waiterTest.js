const assert = require("assert");
const WaiterCheck = require("../function/waiterFactory.js");

const pg = require("pg");
const Pool = pg.Pool

const connectionString = process.env.DATABASE_URL || 'postgresql://codex:codex123@localhost:5432/mywaiters';

const pool = new Pool({
    connectionString
});

describe("Waiters-WebApp tests", function(){
    // beforeEach(async function () {
    //     let testInstance = WaiterCheck(pool);
    //     await testInstance.resetWaiters();
    //     await pool.query('insert into weekdays (days) values ($1)', ['Monday']);
    //     await pool.query('insert into weekdays (days) values ($1)', ['Tuesday']);
    //     await pool.query('insert into weekdays (days) values ($1)', ['Wednesday']);
    //     await pool.query('insert into weekdays (days) values ($1)', ['Thursday']);
    //     await pool.query('insert into weekdays (days) values ($1)', ['Friday']);
    //     await pool.query('insert into weekdays (days) values ($1)', ['Saturday']);
    //     await pool.query('insert into weekdays (days) values ($1)', ['Sunday']);
    // })

    // it('This test takes in name and uppercases the first letter and put the rest in lower case', async function () {
    //     let testInstance = WaiterCheck(pool);
    //     await testInstance.waiterName("steph");
    //     assert.equal(await testInstance.currentWaiter(),"Steph");

    // })

    // it('This test returns the days the waiter selected to work', async function () {
    //     let testInstance = WaiterCheck(pool);
    //     await testInstance.waiterName("steph");
    //     await testInstance.workDays(['Monday', 'Tuesday','Wednesday'])

    //     assert.deepEqual(testInstance.Ontime(), [{
    //         monday: 1,
    //         tuesday:1,
    //         wednesday:1,
    //         thursday:0,
    //         friday:0,
    //         saturday:0,
    //         sunday:0
    //     }])

    // })






})