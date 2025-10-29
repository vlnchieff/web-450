/**
 * Author: Professor Krasso
 * Date: 8/14/24
 * File: index.js
 * Description: Apre sales report API for the sales reports
 */

'use strict';

const express = require('express');
const { mongo } = require('../../../utils/mongo');

const router = express.Router();

/**
 * @description
 *
 * GET /regions
 *
 * Fetches a list of distinct sales regions.
 *
 * Example:
 * fetch('/regions')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/regions', (req, res, next) => {
  try {
    mongo (async db => {
      const regions = await db.collection('sales').distinct('region');
      res.send(regions);
    }, next);
  } catch (err) {
    console.error('Error getting regions: ', err);
    next(err);
  }
});

/**
 * @description
 *
 * GET /regions/:region
 *
 * Fetches sales data for a specific region, grouped by salesperson.
 *
 * Example:
 * fetch('/regions/north')
 *  .then(response => response.json())
 *  .then(data => console.log(data));
 */
router.get('/regions/:region', (req, res, next) => {
  try {
    mongo (async db => {
      const salesReportByRegion = await db.collection('sales').aggregate([
        { $match: { region: req.params.region } },
        {
          $group: {
            _id: '$salesperson',
            totalSales: { $sum: '$amount'}
          }
        },
        {
          $project: {
            _id: 0,
            salesperson: '$_id',
            totalSales: 1
          }
        },
        {
          $sort: { salesperson: 1 }
        }
      ]).toArray();
      res.send(salesReportByRegion);
    }, next);
  } catch (err) {
    console.error('Error getting sales data for region: ', err);
    next(err);
  }
});



/** My Chit

LOCALHOST:3000/api/reports/sales/sales-by-month/april

LOCALHOST:3000/api/reports/sales/sales-by-month/foo

LOCALHOST:3000/api/reports/sales/sales-by-month?month=april

*/

router.get('/sales-by-month/:month', (req, res, next) => {
  try{
    const month = req.params.month;

    if (!month) {
      return res.status(400).send({ error: 'Month parameter is required' });
    }

    if (isNaN(parseInt(month))) {
      return res.status(400).send({ error: 'Month parameter must be a number' });
    }

    if (parseInt(month) < 1 || parseInt(month) > 12) {
      return res.status(400).send({ error: 'Month parameter must be between 1 and 12' });
    }
  } catch (err) {
    console.error('err', err);
    next(err);
  }

  // database query
  mongo (async db => {
    const salesByMonth = await db.collection('sales'). find({'month' : month}).toArray();

    const salesByMonth2 = await db.collection('sales'). aggregate([
      { $match: {
         $exp:{ $eq: [ { $month: "$date" }, parseInt(month) ] }
      }}
  )



module.exports = router;