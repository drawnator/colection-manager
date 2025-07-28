import { Router } from "express";
import  sequelize from "../config/database";
import { UserController } from "../controllers/userController";

const router = Router();

const userController = new UserController();

router.post("/", async (req, res) => {await userController.createUser(req,res);});

// app.get("/users", async (req, res) => {await userController.getAllUsers(req,res);});

router.get("/", async (req, res) => {await userController.getUser(req,res);});

router.patch("/", async (req, res) => {await userController.update(req,res);});

router.delete("/", async (req, res) => {await userController.deleteUser(req,res);});

export default router;
