export const formatValSymbol = (val, sym) => {
  if (val === undefined || val === null) return 'N/A';
  const displayVnd = sym.toUpperCase().endsWith('.VN');
  if (displayVnd) {
    return Math.round(val).toLocaleString('vi-VN') + ' VNĐ';
  }
  return val.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  });
};

export const formatVal = (val, isVndAsset = false, roundInt = false) => {
  if (val === undefined || val === null) return 'N/A';
  if (isVndAsset) {
    return Math.round(val).toLocaleString('vi-VN') + ' VNĐ';
  }
  return val.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: roundInt ? 0 : 2,
    maximumFractionDigits: roundInt ? 0 : 2
  });
};

export const formatVolumeHelper = (vol, isVnd) => {
  if (vol === undefined || vol === null) return 'N/A';
  if (typeof vol === 'string') return vol;
  if (isNaN(vol)) return 'N/A';
  
  if (isVnd) {
    if (vol >= 1_000_000_000) return (vol / 1_000_000_000).toFixed(2) + ' B (CP)';
    if (vol >= 1_000_000) return (vol / 1_000_000).toFixed(2) + ' M (CP)';
    if (vol >= 1_000) return (vol / 1_000).toFixed(2) + ' K (CP)';
    return vol.toLocaleString('vi-VN') + ' CP';
  } else {
    if (vol >= 1_000_000_000) return (vol / 1_000_000_000).toFixed(2) + ' B';
    if (vol >= 1_000_000) return (vol / 1_000_000).toFixed(2) + ' M';
    if (vol >= 1_000) return (vol / 1_000).toFixed(2) + ' K';
    return vol.toLocaleString('en-US');
  }
};
