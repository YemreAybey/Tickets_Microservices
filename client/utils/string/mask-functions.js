export const removeCurrencyMask = amount =>
  typeof amount === 'string' && amount
    ? parseFloat(amount.slice(1).replace(/([,])/g, ''))
    : amount;

export const addCurrencyMask = amount =>
  typeof amount === 'number' && amount
    ? new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 }).format(
        amount
      )
    : amount;
