import SqlString from 'sqlstring';
import client from './../server.js';

async function shortenUrl(
  shortUrl: string = '',
  url: string = '',
  views: number = 0,
  createdAt: string = '',
  id: number = 0,
) {
  const query = SqlString.format(
    `INSERT INTO urls (short_url, url, views, created_at, user_id) VALUES (?, ?, ?, ?, ?)`,
    [shortUrl, url, views, createdAt, id],
  );
  return client.query(query);
}

async function openUrl(id: number = 0) {
  const query = SqlString.format(`UPDATE urls SET views = views + 1 WHERE id = ?`, [id]);
  return client.query(query);
}

async function deleteUrlQuery(id: number = 0) {
  const query = SqlString.format(`DELETE FROM urls WHERE id = ?`, [id]);
  return client.query(query);
}

async function insertDeletedUrl(url: string = '', views: number = 0, deletedAt: string = '', id: number = 0) {
  const query = SqlString.format(
    `INSERT INTO deleted_urls (url, total_views, deleted_at, user_id) VALUES (?, ?, ?, ?)`,
    [url, views, deletedAt, id],
  );
  return client.query(query);
}

export { shortenUrl, openUrl, deleteUrlQuery, insertDeletedUrl };
