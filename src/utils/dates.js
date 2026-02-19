// Returns today's date as YYYY-MM-DD string
export function today() {
    return new Date().toISOString().split('T')[0];
  }
  
  // Returns the date N days ago as YYYY-MM-DD string
  export function daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().split('T')[0];
  }
  
  // Returns an array of the last N dates (oldest first) as YYYY-MM-DD strings
  export function lastNDays(n) {
    return Array.from({ length: n }, (_, i) => daysAgo(n - 1 - i));
  }
  
  // Given a number of weeks from today, returns a formatted date string like "12 Apr"
  export function dateAfterWeeks(weeks) {
    const d = new Date();
    d.setDate(d.getDate() + Math.round(weeks * 7));
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  }
  
  // Returns a friendly format for today like "Monday, 19 Feb"
  export function todayFormatted() {
    return new Date().toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
    });
  }
  
  // Shortens a YYYY-MM-DD string to MM-DD for chart labels
  export function shortDate(dateStr) {
    return dateStr.slice(5);
  }