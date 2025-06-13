export function groupExpensesByDate(expenses) {
  const grouped = {};

  expenses.forEach((expense) => {
    const date = new Date(expense.date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(expense);
  });

  return grouped;
}