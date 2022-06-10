import SqlString from 'sqlstring';
import client from './../server.js';

async function userQuery(id: number = 0) {
  const userQuery = SqlString.format(
    `SELECT 
        users.id AS "id",
        users.name AS "name",
        COALESCE(SUM(urls.views), 0) AS "visitCount"
    FROM users
    LEFT JOIN urls ON urls.user_id = users.id
    WHERE users.id = ?
    GROUP BY users.id
    ORDER BY "visitCount" DESC`,
    [id],
  );
  return client.query(userQuery);
}

async function urlsQuery(id: number = 0) {
  const urlsQuery = SqlString.format(
    `SELECT 
        id,
        short_url AS "shortUrl",
        url,
        views AS "visitCount"
    FROM urls
    WHERE user_id = ?
    ORDER BY id ASC`,
    [id],
  );
  return client.query(urlsQuery);
}

async function rankingQuery() {
  const query = SqlString.format(
    `SELECT 
        users.id,
        users.name,
        COUNT(urls.id) AS "linksCount",
        COALESCE(SUM(urls.views), 0) AS "visitCount"
      FROM users 
      LEFT JOIN urls ON urls.user_id = users.id
      GROUP BY users.id
      ORDER BY "visitCount" DESC
      LIMIT 10`,
  );
  return client.query(query);
}

export { userQuery, urlsQuery, rankingQuery };
