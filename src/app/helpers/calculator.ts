const calculate = (productPrice, data, params) => {
  const count = repaymentCount(
    data.repayment_duration_id.value,
    data.repayment_cycle_id.value
  );

  const marketPrice = productPrice * params.margin + productPrice;
  const downPay = (data.payment_type_id.percent / 100) * marketPrice;
  const residual = marketPrice - downPay;
  const tempInstallment = residual / count;
  const tempInterest = residual * (params.interest / 100);
  const totalTempInterest = tempInstallment * count + tempInterest * count;

  const total = (downPay + totalTempInterest) * (1 + params.tax / 100);
  const actualDownpayment = Math.floor(((data.payment_type_id.percent / 100) * total) / 100) * 100;
  const actualRepayment = +(total - actualDownpayment).toFixed(1);

  return { total, actualDownpayment, actualRepayment };
};


const repaymentCount = (days, cycle) => {
  let count = 6;
  if (days == 360) {
    count = 24;
  } else if (days == 180) {
    count = 12;
  }
  return count;
};


const cashLoan = (productPrice, data, params) => {
  const actualDownpayment = (data.payment_type_id.percent / 100) * productPrice;
  const principal = (productPrice - actualDownpayment) / 12;
  const interest = (params.interest / 100) * (productPrice - actualDownpayment);
  const actualRepayment = (principal + interest) * 12;
  const total = actualDownpayment + actualRepayment;
  return { total, actualDownpayment, actualRepayment };
}

export { calculate, cashLoan };
