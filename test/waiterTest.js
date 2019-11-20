const assert = require("assert");
const RegCheck = require("../function/waiterFactory.js");

const pg = require("pg");
const Pool = pg.Pool

const connectionString = process.env.DATABASE_URL || 'postgresql://codex:codex123@localhost:5432/mywaiters';

const pool = new Pool({
    connectionString
});