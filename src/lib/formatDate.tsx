type FormatType = "default" | "dateOnly" | "timeOnly" | "longDate" | "shortDate" | "custom";

const formatDate = (dateString: string | Date, formatType: FormatType = "default", locale: string = "en-GB", options: Intl.DateTimeFormatOptions = {}): string => {
  if (!dateString) return "";

  let date: Date;

  if (typeof dateString === "string") {
    const cleaned = dateString.replace(/(\.\d{3})\d+/, "$1");
    date = new Date(cleaned);
  } else {
    date = dateString;
  }

  if (isNaN(date.getTime())) return "";

  const formatOptions: Record<FormatType, Intl.DateTimeFormatOptions> = {
    default: {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    },
    dateOnly: {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    },
    timeOnly: {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    },
    longDate: {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
    shortDate: {
      day: "numeric",
      month: "short",
      year: "2-digit",
    },
    custom: options,
  };

  const selectedOptions = formatOptions[formatType] || formatOptions.default;

  const mergedOptions: Intl.DateTimeFormatOptions = {
    ...selectedOptions,
    ...options,
  };

  return new Intl.DateTimeFormat(locale, mergedOptions).format(date);
};

export default formatDate;
