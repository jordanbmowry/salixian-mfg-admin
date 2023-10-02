import { format } from 'date-fns';

export function formatMoney(number: number) {
  if (typeof number !== 'number') return;
  let money = number.toFixed(2);

  let parts = money.split('.');

  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return '$' + parts.join('.');
}

export function formatPhoneNumber(phoneNumber: string) {
  // Remove all non-numeric characters from the phone number.
  let cleaned = ('' + phoneNumber).replace(/\D/g, '');

  // Check the length of the cleaned phone number.
  let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }

  return null;
}

export function formatDate(dateString: string) {
  return format(new Date(dateString), 'MMMM d, yyyy');
}
