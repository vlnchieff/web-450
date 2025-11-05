/**
 * Author: Professor Krasso
 * Date: 10/28/2025
 * File: index.js
 * Description: APRE sales report API for the sales reports
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
      console.log('Regions found: ', regions);
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

/**
 * @description
 *
 * GET /regions/:region/products/:product
 *
 * Fetches sales data for a specific region and product, grouped by salesperson.
 *
 */
router.get('/regions/:region/products/:product', (req, res, next) => {
  try {
    mongo (async db => {
      const salesByRegionAndProduct = await db.collection('sales').aggregate([
        {
          $match: {
            region: req.params.region,
            product: req.params.product
          }
        },
        {
          $group: {
            _id: '$salesperson',
            totalSales: { $sum: '$amount' },
            totalQuantity: { $sum: '$quantity' }
          }
        },
        {
          $project: {
            _id: 0,
            salesperson: '$_id',
            totalSales: 1,
            totalQuantity: 1
          }
        },
        {
          $sort: { salesperson: 1 }
        }
      ]).toArray();
      res.send(salesByRegionAndProduct);
    }, next);
  } catch (err) {
    console.error('Error getting sales data for region and product: ', err);
    next(err);
  }
});

/**
 * @description
 *
 * GET /products
 *
 * Fetches a list of distinct products.
 *
 */
router.get('/products', (req, res, next) => {
  try {
    mongo (async db => {
      const products = await db.collection('sales').distinct('product');
      res.send(products);
    }, next);
  } catch (err) {
    console.error('Error getting products: ', err);
    next(err);
  }
});

/**
 * @description
 *
 * GET /products/:product
 *
 * Fetches sales data for a specific product, grouped by region.
 *
 */
router.get('/products/:product', (req, res, next) => {
  try {
    mongo (async db => {
      const salesByProduct = await db.collection('sales').aggregate([
        { $match: { product: req.params.product } },
        {
          $group: {
            _id: '$region',
            totalSales: { $sum: '$amount' },
            totalQuantity: { $sum: '$quantity' }
          }
        },
        {
          $project: {
            _id: 0,
            region: '$_id',
            totalSales: 1,
            totalQuantity: 1
          }
        },
        {
          $sort: { region: 1 }
        }
      ]).toArray();
      res.send(salesByProduct);
    }, next);
  } catch (err) {
    console.error('Error getting sales data for product: ', err);
    next(err);
  }
});

/**
 * @description
 *
 * GET /sales-by-region-product
 *
 * Fetches sales data filtered by region and/or product using query parameters.
 * Provides flexible filtering and returns detailed sales records.
 *
 */
router.get('/sales-by-region-product', (req, res, next) => {
  try {
    const { region, product } = req.query;

    if (!region && !product) {
      return res.status(400).send({
        error: 'At least one query parameter (region or product) is required'
      });
    }

    mongo (async db => {
      const matchCriteria = {};
      if (region) matchCriteria.region = region;
      if (product) matchCriteria.product = product;

      const salesData = await db.collection('sales').aggregate([
        { $match: matchCriteria },
        {
          $group: {
            _id: {
              region: '$region',
              product: '$product',
              salesperson: '$salesperson'
            },
            totalSales: { $sum: '$amount' },
            totalQuantity: { $sum: '$quantity' },
            salesCount: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            region: '$_id.region',
            product: '$_id.product',
            salesperson: '$_id.salesperson',
            totalSales: 1,
            totalQuantity: 1,
            salesCount: 1
          }
        },
        {
          $sort: { region: 1, product: 1, salesperson: 1 }
        }
      ]).toArray();

      res.send(salesData);
    }, next);
  } catch (err) {
    console.error('Error getting sales data by region and product: ', err);
    next(err);
  }
});

/** My Chit

LOCALHOST:3000/api/reports/sales/sales-by-month/april

LOCALHOST:3000/api/reports/sales/sales-by-month/foo

LOCALHOST:3000/api/reports/sales/sales-by-month?month=april



router.get('/sales-by-month/:month', (req, res, next) => {
  try {
    const month = parseInt(req.params.month);

    if (isNaN(month)) {
      return res.status(400).send({ error: 'Month parameter must be a number' });
    }

    if (month < 1 || month > 12) {
      return res.status(400).send({ error: 'Month must be between 1 and 12' });
    }

    mongo(async db => {
      const salesByMonth = await db.collection('sales').aggregate([
        {
          $match: {
            $expr: { $eq: [{ $month: '$date' }, month] }
          }
        },
        {
          $group: {
            _id: '$salesperson',
            totalSales: { $sum: '$amount' }
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

      res.send(salesByMonth);
    }, next);
  } catch (err) {
    console.error('Error in sales-by-month:', err);
    next(err);
  }
});
*/


module.exports = router;