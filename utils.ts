export function formatMoney(number: number) {
  if (typeof number !== 'number') return;
  let money = number.toFixed(2);

  let parts = money.split('.');

  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return '$' + parts.join('.');
}
