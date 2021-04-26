// eslint-disable-next-line import/no-extraneous-dependencies
import type { Request, Response } from 'express';
import type { TableListItem } from './data.d';

// mock tableListDataSource
const genList = (current: number, pageSize: number) => {
  const tableListDataSource: TableListItem[] = [];

  for (let i = 0; i < pageSize; i += 1) {
    const index = (current - 1) * 10 + i;
    tableListDataSource.push({
      key: index,
      disabled: i % 6 === 0,
      href: 'https://ant.design',
      avatar: [
        'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
        'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
      ][i % 2],
      name: `TradeCode ${index}`,
      owner: '曲丽丽',
      desc: '这是一段描述',
      callNo: Math.floor(Math.random() * 1000),
      status: (Math.floor(Math.random() * 10) % 4).toString(),
      updatedAt: new Date(),
      createdAt: new Date(),
      progress: Math.ceil(Math.random() * 100),
    });
  }
  tableListDataSource.reverse();
  return tableListDataSource;
};

let tableListDataSource = genList(1, 100);

function getServices(req: Request, res: Response) {
  const dataSource = [
    {
      name: 'Dog washing',
      desc: 'Lorem Ipsum',
      duration: '30 min.',
      cost: '15 Eur.',
    },
    {
      name: 'Cat washing',
      desc: 'Lorem Ipsum',
      duration: '30 min.',
      cost: '15 Eur.',
    },
  ];
  const result = {
    data: dataSource,
    total: dataSource.length,
    success: true,
    pageSize: 1,
    current: parseInt('1', 10) || 1,
  };

  return res.json(result);
}

function getReservations(req: Request, res: Response) {
  const dataSource = [
    {
      date: '2021/05/04 12:00',
      user: 'Romantas Trumpa',
      service: 'Dog washing',
      email: 'romantas.trumpa@stud.vgtu.lt',
      mobile: '+37067341238',
    },
  ];
  const result = {
    data: dataSource,
    total: dataSource.length,
    success: true,
    pageSize: 1,
    current: parseInt('1', 10) || 1,
  };

  return res.json(result);
}

function getEmployees(req: Request, res: Response) {
  const dataSource = [
    {
      name: 'Greta Palubinskaite',
      experience: 'šunų kirpimas - 1 metai',
      services: ['dog washing', 'cat washing'],
      mobile: '+37067341238',
    },
  ];
  const result = {
    data: dataSource,
    total: dataSource.length,
    success: true,
    pageSize: 1,
    current: parseInt('1', 10) || 1,
  };

  return res.json(result);
}

function postRule(req: Request, res: Response, u: string, b: Request) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  const body = (b && b.body) || req.body;
  const { method, name, desc, key } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      tableListDataSource = tableListDataSource.filter((item) => key.indexOf(item.key) === -1);
      break;
    case 'post':
      (() => {
        const i = Math.ceil(Math.random() * 10000);
        const newRule = {
          key: tableListDataSource.length,
          href: 'https://ant.design',
          avatar: [
            'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
            'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
          ][i % 2],
          name,
          owner: '曲丽丽',
          desc,
          callNo: Math.floor(Math.random() * 1000),
          status: (Math.floor(Math.random() * 10) % 2).toString(),
          updatedAt: new Date(),
          createdAt: new Date(),
          progress: Math.ceil(Math.random() * 100),
        };
        tableListDataSource.unshift(newRule);
        return res.json(newRule);
      })();
      return;

    case 'update':
      (() => {
        let newRule = {};
        tableListDataSource = tableListDataSource.map((item) => {
          if (item.key === key) {
            newRule = { ...item, desc, name };
            return { ...item, desc, name };
          }
          return item;
        });
        return res.json(newRule);
      })();
      return;
    default:
      break;
  }

  const result = {
    list: tableListDataSource,
    pagination: {
      total: tableListDataSource.length,
    },
  };

  res.json(result);
}

export default {
  'GET /api/services': getServices,
  'GET /api/reservations': getReservations,
  'GET /api/employees': getEmployees,
  'POST /api/rule': postRule,
};
