type FormatType = "default" | "dateOnly" | "timeOnly" | "longDate" | "shortDate" | "custom";

const formatDate = (dateString: string | Date, formatType: FormatType = "default", locale: string = "en-US", options: Intl.DateTimeFormatOptions = {}): string => {
  if (!dateString) {
    return "";
  }
  

  const date = typeof dateString === "string" ? new Date(dateString) : dateString;

  const formatOptions: Record<FormatType, Intl.DateTimeFormatOptions> = {
    default: {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    },
    dateOnly: {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    },
    timeOnly: {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    },
    longDate: {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
    shortDate: {
      year: "2-digit",
      month: "short",
      day: "numeric",
    },
    custom: options,
  };

  const selectedOptions = formatOptions[formatType] || formatOptions.default;

  const mergedOptions: Intl.DateTimeFormatOptions = {
    ...selectedOptions,
    ...options,
  };

  return date.toLocaleString(locale, mergedOptions);
};

export default formatDate;
