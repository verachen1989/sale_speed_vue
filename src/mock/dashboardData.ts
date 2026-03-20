import type { Period, IndicatorType, PropertyType, ProjectRecord, TrendPoint } from '@/types'

const projectsByPeriodAndType: Record<PropertyType, Record<Period, ProjectRecord[]>> = {
  住宅: {
    当日: [
      { id: '1', name: '南京风起潮鸣', landDate: '2025-01-01', agreementUnits: 36, agreementAmount: 7020, contractUnits: 38, contractAmount: 7410, cashPayment: 3910, loanPayment: 2730, totalPayment: 6640, city: '南京', status: '当年首开', landYear: '2025年' },
      { id: '2', name: '深圳颐和花园', landDate: '2024-06-15', agreementUnits: 34, agreementAmount: 6800, contractUnits: 35, contractAmount: 7000, cashPayment: 3820, loanPayment: 2660, totalPayment: 6480, city: '深圳', status: '续销', landYear: '2024年' },
      { id: '3', name: '义乌芝麻开门', landDate: '2023-08-20', agreementUnits: 32, agreementAmount: 5920, contractUnits: 34, contractAmount: 6290, cashPayment: 3310, loanPayment: 2310, totalPayment: 5620, city: '杭州', status: '尾盘', landYear: '2023年' },
      { id: '4', name: '苏州格致国际', landDate: '2025-02-10', agreementUnits: 34, agreementAmount: 7140, contractUnits: 36, contractAmount: 7560, cashPayment: 4010, loanPayment: 2810, totalPayment: 6820, city: '苏州', status: '当年首开', landYear: '2025年' },
      { id: '5', name: '长沙悦誉家', landDate: '2024-09-05', agreementUnits: 32, agreementAmount: 6080, contractUnits: 33, contractAmount: 6270, cashPayment: 3420, loanPayment: 2390, totalPayment: 5810, city: '长沙', status: '续销', landYear: '2024年' },
    ],
    当月: [
      { id: '1', name: '南京风起潮鸣', landDate: '2025-01-01', agreementUnits: 980, agreementAmount: 196000, contractUnits: 1030, contractAmount: 206000, cashPayment: 110000, loanPayment: 76000, totalPayment: 186000, city: '南京', status: '当年首开', landYear: '2025年' },
      { id: '2', name: '深圳颐和花园', landDate: '2024-06-15', agreementUnits: 920, agreementAmount: 184000, contractUnits: 950, contractAmount: 190000, cashPayment: 104000, loanPayment: 72000, totalPayment: 176000, city: '深圳', status: '续销', landYear: '2024年' },
      { id: '3', name: '义乌芝麻开门', landDate: '2023-08-20', agreementUnits: 860, agreementAmount: 163400, contractUnits: 910, contractAmount: 172900, cashPayment: 92000, loanPayment: 64000, totalPayment: 156000, city: '杭州', status: '尾盘', landYear: '2023年' },
      { id: '4', name: '苏州格致国际', landDate: '2025-02-10', agreementUnits: 1100, agreementAmount: 231000, contractUnits: 1160, contractAmount: 243600, cashPayment: 131000, loanPayment: 91000, totalPayment: 222000, city: '苏州', status: '当年首开', landYear: '2025年' },
      { id: '5', name: '长沙悦誉家', landDate: '2024-09-05', agreementUnits: 1000, agreementAmount: 220000, contractUnits: 1050, contractAmount: 231000, cashPayment: 121000, loanPayment: 84000, totalPayment: 205000, city: '长沙', status: '续销', landYear: '2024年' },
    ],
    当年: [
      { id: '1', name: '南京风起潮鸣', landDate: '2025-01-01', agreementUnits: 5600, agreementAmount: 1120000, contractUnits: 5880, contractAmount: 1176000, cashPayment: 630000, loanPayment: 438000, totalPayment: 1068000, city: '南京', status: '当年首开', landYear: '2025年' },
      { id: '2', name: '深圳颐和花园', landDate: '2024-06-15', agreementUnits: 5100, agreementAmount: 1020000, contractUnits: 5360, contractAmount: 1072000, cashPayment: 574000, loanPayment: 399000, totalPayment: 973000, city: '深圳', status: '续销', landYear: '2024年' },
      { id: '3', name: '义乌芝麻开门', landDate: '2023-08-20', agreementUnits: 4900, agreementAmount: 931000, contractUnits: 5140, contractAmount: 976600, cashPayment: 523000, loanPayment: 364000, totalPayment: 887000, city: '杭州', status: '尾盘', landYear: '2023年' },
      { id: '4', name: '苏州格致国际', landDate: '2025-02-10', agreementUnits: 6600, agreementAmount: 1386000, contractUnits: 6930, contractAmount: 1455300, cashPayment: 782000, loanPayment: 544000, totalPayment: 1326000, city: '苏州', status: '当年首开', landYear: '2025年' },
      { id: '5', name: '长沙悦誉家', landDate: '2024-09-05', agreementUnits: 6400, agreementAmount: 1344000, contractUnits: 6720, contractAmount: 1411200, cashPayment: 758000, loanPayment: 527000, totalPayment: 1285000, city: '长沙', status: '续销', landYear: '2024年' },
    ],
  },
  商办: {
    当日: [
      { id: '11', name: '北京CBD商务中心', landDate: '2024-06-01', agreementUnits: 15, agreementAmount: 4500, contractUnits: 16, contractAmount: 4800, cashPayment: 2400, loanPayment: 1600, totalPayment: 4000, city: '北京', status: '当年首开', landYear: '2024年' },
    ],
    当月: [
      { id: '11', name: '北京CBD商务中心', landDate: '2024-06-01', agreementUnits: 420, agreementAmount: 126000, contractUnits: 450, contractAmount: 135000, cashPayment: 72000, loanPayment: 48000, totalPayment: 120000, city: '北京', status: '当年首开', landYear: '2024年' },
    ],
    当年: [
      { id: '11', name: '北京CBD商务中心', landDate: '2024-06-01', agreementUnits: 2400, agreementAmount: 720000, contractUnits: 2520, contractAmount: 756000, cashPayment: 403200, loanPayment: 268800, totalPayment: 672000, city: '北京', status: '当年首开', landYear: '2024年' },
    ],
  },
  车储: {
    当日: [
      { id: '21', name: '杭州西湖车位', landDate: '2024-03-01', agreementUnits: 25, agreementAmount: 1250, contractUnits: 28, contractAmount: 1400, cashPayment: 980, loanPayment: 280, totalPayment: 1260, city: '杭州', status: '当年首开', landYear: '2024年' },
    ],
    当月: [
      { id: '21', name: '杭州西湖车位', landDate: '2024-03-01', agreementUnits: 680, agreementAmount: 34000, contractUnits: 720, contractAmount: 36000, cashPayment: 25200, loanPayment: 7200, totalPayment: 32400, city: '杭州', status: '当年首开', landYear: '2024年' },
    ],
    当年: [
      { id: '21', name: '杭州西湖车位', landDate: '2024-03-01', agreementUnits: 3900, agreementAmount: 195000, contractUnits: 4140, contractAmount: 207000, cashPayment: 144900, loanPayment: 41400, totalPayment: 186300, city: '杭州', status: '当年首开', landYear: '2024年' },
    ],
  },
}

const unitTrendByIndicator: Record<IndicatorType, Record<Period, TrendPoint[]>> = {
  协议: {
    当日: [
      { date: '3/10', actual: 142, target: 158 },
      { date: '3/11', actual: 128, target: 146 },
      { date: '3/12', actual: 155, target: 162 },
      { date: '3/13', actual: 171, target: 168 },
      { date: '3/14', actual: 163, target: 170 },
      { date: '3/15', actual: 194, target: 182 },
      { date: '3/16', actual: 168, target: 176 },
    ],
    当月: [
      { date: '2/09', actual: 700, target: 820 },
      { date: '2/16', actual: 820, target: 900 },
      { date: '2/23', actual: 930, target: 980 },
      { date: '3/02', actual: 1060, target: 1120 },
      { date: '3/09', actual: 970, target: 1040 },
      { date: '3/16', actual: 1080, target: 1150 },
    ],
    当年: [
      { date: '10月', actual: 3800, target: 4100 },
      { date: '11月', actual: 7900, target: 8500 },
      { date: '12月', actual: 12450, target: 13300 },
      { date: '1月', actual: 17300, target: 18400 },
      { date: '2月', actual: 22920, target: 24100 },
      { date: '3月', actual: 28600, target: 29800 },
    ],
  },
  合同: {
    当日: [
      { date: '3/10', actual: 148, target: 164 },
      { date: '3/11', actual: 132, target: 150 },
      { date: '3/12', actual: 162, target: 170 },
      { date: '3/13', actual: 176, target: 174 },
      { date: '3/14', actual: 169, target: 178 },
      { date: '3/15', actual: 201, target: 188 },
      { date: '3/16', actual: 176, target: 182 },
    ],
    当月: [
      { date: '2/09', actual: 730, target: 850 },
      { date: '2/16', actual: 860, target: 940 },
      { date: '2/23', actual: 980, target: 1030 },
      { date: '3/02', actual: 1110, target: 1180 },
      { date: '3/09', actual: 1020, target: 1080 },
      { date: '3/16', actual: 1140, target: 1210 },
    ],
    当年: [
      { date: '10月', actual: 4010, target: 4320 },
      { date: '11月', actual: 8290, target: 8920 },
      { date: '12月', actual: 12980, target: 13880 },
      { date: '1月', actual: 18020, target: 19120 },
      { date: '2月', actual: 24060, target: 25280 },
      { date: '3月', actual: 30030, target: 31350 },
    ],
  },
}

export function getProjects(period: Period, propertyType: PropertyType = '住宅'): ProjectRecord[] {
  return projectsByPeriodAndType[propertyType][period] || []
}

export function getTrendData(period: Period, indicatorType: IndicatorType): TrendPoint[] {
  return unitTrendByIndicator[indicatorType][period] || []
}

export function getProjectDetail(projectId: string, period: Period, propertyType: PropertyType = '住宅') {
  const projects = getProjects(period, propertyType)
  return projects.find(p => p.id === projectId)
}
