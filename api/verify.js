import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { key } = req.body;

  if (!key) {
    return res.json({ valid: false });
  }

  try {
    const { rows } = await pool.query(
      "SELECT * FROM keys WHERE key = $1",
      [key]
    );

    if (rows.length === 0) {
      return res.json({ valid: false });
    }

    return res.json({ valid: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ valid: false, error: "Server error" });
  }
}
