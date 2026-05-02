function knapsack(tasks, maxHours) {
  // 🔒 Safety checks
  if (!Array.isArray(tasks)) {
    throw new Error("Tasks must be an array");
  }

  if (!maxHours || maxHours <= 0) {
    throw new Error("Invalid maxHours value");
  }

  const n = tasks.length;

  if (n === 0) {
    return {
      selectedTasks: [],
      totalImpact: 0,
      totalDuration: 0
    };
  }

  // 🧠 DP Table
  const dp = Array.from({ length: n + 1 }, () =>
    Array(maxHours + 1).fill(0)
  );

  // ⚙️ Build table
  for (let i = 1; i <= n; i++) {
    const { duration, impact } = tasks[i - 1];

    for (let w = 0; w <= maxHours; w++) {
      if (duration <= w) {
        dp[i][w] = Math.max(
          dp[i - 1][w],
          impact + dp[i - 1][w - duration]
        );
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  // 🔙 Backtrack to find selected tasks
  let w = maxHours;
  const selectedTasks = [];
  let totalDuration = 0;

  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      const task = tasks[i - 1];
      selectedTasks.push(task.taskId);
      totalDuration += task.duration;
      w -= task.duration;
    }
  }

  return {
    selectedTasks: selectedTasks.reverse(),
    totalImpact: dp[n][maxHours],
    totalDuration
  };
}

module.exports = knapsack;