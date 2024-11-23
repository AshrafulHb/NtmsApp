export interface Report {
  tenantName?: string;
  flatCode?: string;
  billingPeriod?: string;
  billStartDate?: string;
  billEndDate?: string;
  electricMeterNo?: string;
  electricMeterCurrentReading?: string;
  electricMeterPreviousReading?: string;
  consumedElectricUnit?: string;
  electricityCharge?: string;
  demandCharge?: string;
  meterRent?: string;
  principalAmount?: string;
  vat?: string;
  electricityBill?: string;
  houseRent?: string;
  gasBill?: string;
  cleanerBill?: string;
}
