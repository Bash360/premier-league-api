import joi from '@hapi/joi';
import validate from './validate';
import express from 'express';
const fixtureSchema = {
  homeTeamName: joi
    .string()
    .trim()
    .lowercase()
    .required(),
  awayTeamName: joi
    .string()
    .trim()
    .lowercase()
    .required(),
  referee: joi
    .string()
    .trim()
    .lowercase()
    .required(),
  matchDate: joi
    .string()
    .trim()
    .lowercase()
    .required(),
};
const updateSchema = {
  goalsHomeTeam: joi.number(),
  goalsAwayTeam: joi.number(),
};
const searchSchema = {
  name: joi
    .string()
    .lowercase()
    .trim()
    .required(),
};
function validateFixture(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  const errors = validate(req.body, fixtureSchema);
  if (errors) {
    return res.status(400).json({ errors });
  }
  return next();
}
function validateUpdate(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  if (!Object.keys(req.body).length) {
    return res.status(400).json('must update one field at least');
  }
  const errors = validate(req.body, updateSchema);
  if (errors) {
    return res.status(400).json({ errors });
  }
  return next();
}
function validateSearch(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  const error = validate(req.query, searchSchema);
  if (error) return res.status(400).json({ error });
  return next();
}

export { validateFixture, validateUpdate, validateSearch };
