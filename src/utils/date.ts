export const formatDate = (dateString: string): string => {
    if (!dateString) return "";
  
    const date = new Date(dateString);
  
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    const getOrdinal = (n: number): string => {
      if (n > 3 && n < 21) return `${n}th`;
      switch (n % 10) {
        case 1: return `${n}st`;
        case 2: return `${n}nd`;
        case 3: return `${n}rd`;
        default: return `${n}th`;
      }
    };
  
    const formatNumber = (num: number): string => String(num).padStart(2, "0");
  
    const day = getOrdinal(date.getDate());
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = formatNumber(date.getHours());
    const minutes = formatNumber(date.getMinutes());
  
    return `${month} ${day} ${year} at ${hours}:${minutes}`;
  };
  