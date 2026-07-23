// Mock backend — simulated network delay + validation, standing in for real API services.
const delay = (ms = 650) => new Promise((r) => setTimeout(r, ms));

export const PAYID_DIRECTORY = {
  '0412 345 678': 'Marcus Nguyen',
  'liam.carter@email.com': 'Liam Carter',
  '0498 112 233': 'Chloe Bennett',
};

export const DAILY_PAY_LIMIT = 5000;

export async function transferOwnAccounts({ accounts, fromId, toId, amount }) {
  await delay();
  if (fromId === toId) throw { code: 'same_account', message: 'Choose two different accounts to transfer between.' };
  if (!(amount > 0)) throw { code: 'invalid_amount', message: 'Enter an amount greater than $0.' };
  const from = accounts.find((a) => a.id === fromId);
  if (amount > from.balance) {
    throw { code: 'insufficient_funds', message: `Insufficient funds — your ${from.label} balance is $${from.balance.toFixed(2)}.` };
  }
  return { success: true };
}

export async function resolvePayId(payid) {
  await delay(500);
  const name = PAYID_DIRECTORY[payid.trim()];
  if (!name) throw { code: 'not_found', message: 'We couldn\u2019t find an account for that PayID. Check and try again.' };
  return { name };
}

export async function payViaPayId({ accounts, fromId, amount, sentToday = 0 }) {
  await delay();
  if (!(amount > 0)) throw { code: 'invalid_amount', message: 'Enter an amount greater than $0.' };
  const from = accounts.find((a) => a.id === fromId);
  if (amount > from.balance) {
    throw { code: 'insufficient_funds', message: `Insufficient funds — your ${from.label} balance is $${from.balance.toFixed(2)}.` };
  }
  if (sentToday + amount > DAILY_PAY_LIMIT) {
    throw { code: 'limit_exceeded', message: `This payment exceeds your daily transfer limit of $${DAILY_PAY_LIMIT.toLocaleString()}.` };
  }
  return { success: true };
}

export async function payViaBpay({ accounts, fromId, billerCode, ref, amount }) {
  await delay();
  if (!/^\d{6}$/.test(billerCode)) throw { code: 'invalid_biller', message: 'Enter a valid 6-digit BPAY biller code.' };
  if (!/^\d{6,12}$/.test(ref)) throw { code: 'invalid_ref', message: 'Reference number must be 6\u201312 digits.' };
  if (!(amount > 0)) throw { code: 'invalid_amount', message: 'Enter an amount greater than $0.' };
  const from = accounts.find((a) => a.id === fromId);
  if (amount > from.balance) {
    throw { code: 'insufficient_funds', message: `Insufficient funds — your ${from.label} balance is $${from.balance.toFixed(2)}.` };
  }
  return { success: true };
}

export async function requestConcierge({ category }) {
  await delay(600);
  return { success: true, ref: 'CN-' + Math.floor(100000 + Math.random() * 900000) };
}
