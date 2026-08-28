/**
 * Formats a Date object into a readable localized timestamp string.
 * Example output: "Aug 28, 11:15 AM"
 */
export function formatTaskDate(date: Date = new Date()): string {
  const formattedDate = date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const formattedTime = date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${formattedDate}, ${formattedTime}`;
}
