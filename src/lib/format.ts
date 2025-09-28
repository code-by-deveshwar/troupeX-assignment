export const relativeTime = (dateString?: string) => {
  if (!dateString) return "Just now";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "Just now";

  const diffMs = Date.now() - date.getTime();
  const minutes = Math.round(diffMs / (1000 * 60));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.round(days / 7);
  if (weeks < 5) return `${weeks}w ago`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.round(days / 365);
  return `${years}y ago`;
};

export const formatSalaryRange = (
  min?: number | null,
  max?: number | null,
  currencySymbol = "₹",
) => {
  if (min == null && max == null) return "";
  const locale = "en-IN";
  const format = (value: number) =>
    `${currencySymbol}${Math.round(value).toLocaleString(locale)}`;

  if (min != null && max != null) {
    return `${format(min)} – ${format(max)}`;
  }
  if (min != null) {
    return `${format(min)}+`;
  }
  return `Up to ${format(max as number)}`;
};
