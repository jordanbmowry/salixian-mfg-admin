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

export function orderStatusClass(status: string) {
  switch (status) {
    case 'pending':
      return 'bg-yellow-300 text-yellow-800 px-2 py-1 rounded';
    case 'in progress':
      return 'bg-blue-300 text-blue-800 px-2 py-1 rounded';
    case 'complete':
      return 'bg-green-300 text-green-800 px-2 py-1 rounded';
    case 'canceled':
      return 'bg-red-300 text-red-800 px-2 py-1 rounded';
    default:
      return '';
  }
}

export function paymentStatusClass(status: string) {
  switch (status) {
    case 'not paid':
      return 'bg-red-200 text-red-800 px-2 py-1 rounded';
    case 'partially paid':
      return 'bg-yellow-200 text-yellow-800 px-2 py-1 rounded';
    case 'fully paid':
      return 'bg-green-200 text-green-800 px-2 py-1 rounded';
    default:
      return '';
  }
}

export function stripDashesFromPhoneNumber(phoneNumber: string = '') {
  console.log(phoneNumber);
  return phoneNumber.replace(/-/g, '');
}
