import { NextFunction, Request, Response } from "express";
import { Problem } from "../models/Problem";
import { isValidObjectId } from "mongoose";
import createHttpError from "http-errors";

export async function createProblem(req: Request, res: Response, next: NextFunction) {
  try {
    const newProblem = await Problem.create({
      ...req.body,
    });
    res.status(200).json(newProblem);
  } catch (error) {
    next(error)
  }
}

export async function deleteProblem(req: Request, res: Response, next: NextFunction) {
  const problemId = req.params.id
  try {
    if (!isValidObjectId(problemId)) {
      throw createHttpError(404, "Incorrect problem ID provided")
    }
    const problem = await Problem.findByIdAndDelete(problemId)
    if (!problem) {
      throw createHttpError(400, "problem not found")
    } else {
      res.status(200).send(`deleted ${problemId}`)
    }
  } catch (error) {
    next(error)
  }
}

export async function getAllProblems(req: Request, res: Response, next: NextFunction) {
  try {
    const allProblems = await Problem.find()
    res.status(200).json(allProblems)
  } catch (error) {
    next(error)
  }
}

export async function getProblemsByCreator(req: Request, res: Response, next: NextFunction) {
  const creator = req.params.creator
  try {
    const problems = await Problem.find({ creator: creator})
    res.status(200).json(problems)
  } catch (error) {
    next(error)
  }
}

export async function getProblemsByLevel(req: Request, res: Response, next: NextFunction) {
  const level = req.params.level
  try {
    const problems = await Problem.find({ level: level})
    res.status(200).json(problems)
  } catch (error) {
    next(error)
  }
}

export async function updateVariations(req: Request, res: Response, next: NextFunction) {
  const id = req.body.problemId
  const newVariations = req.body.variations
  if (!isValidObjectId(id)) {
    next(`Invalid ID: ${id}`)
  }
  try {
    const update = await Problem.findOneAndUpdate({
      _id: id
    }, {
      $set: {variations: newVariations}
    }, {
      new: true
    })
    if (update) {
      res.status(200).send("success")
    } else {
      res.status(200).send("not found")
    }
  } catch (error) {
    next(error)
  }
}