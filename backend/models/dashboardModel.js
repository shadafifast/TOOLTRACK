const pool = require('../config/database');

exports.getStats = async () => {
  const [[{ totalTools }]] = await pool.execute('SELECT COUNT(*) as totalTools FROM tools');
  const [[{ availableTools }]] = await pool.execute('SELECT COUNT(*) as availableTools FROM tools WHERE status = "available"');
  const [[{ borrowedTools }]] = await pool.execute('SELECT COUNT(*) as borrowedTools FROM tools WHERE status = "borrowed"');
  const [[{ overdueTools }]] = await pool.execute('SELECT COUNT(*) as overdueTools FROM tools WHERE status = "overdue"');
  const [[{ damagedTools }]] = await pool.execute('SELECT COUNT(*) as damagedTools FROM tools WHERE status = "damaged"');

  return { totalTools, availableTools, borrowedTools, overdueTools, damagedTools };
};

exports.getWeeklyChart = async () => {
  const query = `
    SELECT DATE(time) as date,
           SUM(CASE WHEN type = 'borrow' THEN 1 ELSE 0 END) as borrows,
           SUM(CASE WHEN type = 'return' THEN 1 ELSE 0 END) as returns
    FROM activities
    WHERE time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    GROUP BY DATE(time)
    ORDER BY date ASC
  `;
  const [rows] = await pool.execute(query);
  return rows;
};

exports.getStatusDistribution = async () => {
  const query = `
    SELECT status as name, COUNT(*) as value
    FROM tools
    GROUP BY status
  `;
  const [rows] = await pool.execute(query);
  return rows;
};

exports.getActivities = async (limit = 8) => {
  const query = `
    SELECT a.*, t.name as toolName, u.name as userName, u.avatar
    FROM activities a
    LEFT JOIN tools t ON a.tool_id = t.id
    LEFT JOIN users u ON a.user_id = u.id
    ORDER BY a.time DESC
    LIMIT ?
  `;
  const [rows] = await pool.execute(query, [Number(limit)]);
  return rows;
};
