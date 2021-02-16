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
  const result = days / cycle;
  if (result >= 24) {
    return 24;
  } else if (result >= 12) {
    return 12;
  }
  if (result >= 6) {
    return 6;
  }
  return 3;
};

export default calculate;
