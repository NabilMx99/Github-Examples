const { Client } = require('pg');

async function main() {
  const pgclient = new Client({
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: 'postgres',
    password: 'postgres',
    database: 'postgres',
  });

  try {
    await pgclient.connect();

    await pgclient.query(`
      CREATE TABLE IF NOT EXISTS student (
        id SERIAL PRIMARY KEY,
        firstName VARCHAR(40) NOT NULL,
        lastName VARCHAR(40) NOT NULL,
        age INT,
        address VARCHAR(80),
        email VARCHAR(40)
      )
    `);

    const insertText = `
      INSERT INTO student(firstName, lastName, age, address, email)
      VALUES($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [
      'Mona the',
      'Octocat',
      9,
      '88 Colin P Kelly Jr St, San Francisco, CA 94107, United States',
      'octocat@github.com',
    ];

    const inserted = await pgclient.query(insertText, values);
    console.log('Inserted:', inserted.rows[0]);

    const result = await pgclient.query('SELECT * FROM student');
    console.log('All students:', result.rows);
  } catch (err) {
    console.error('Database script failed:', err);
    process.exitCode = 1;
  } finally {
    await pgclient.end();
  }
}

main();
