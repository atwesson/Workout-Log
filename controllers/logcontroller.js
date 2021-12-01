const Express = require("express");
const router = Express.Router()
const { LogModel } = require("../models");
const Log = require("../models/log");

router.get("/", async (req, res) => {
    try {
        const allLogs = await LogModel.findAll()

        res.status(200).json(allLogs)
    } catch (err) {
        res.status(500).json({
            error: err,
        })
    }
});

router.post("/", async (req, res) => {
    const {
        description,
        definition,
        result,
        owner_id,
    } = req.body

    try {
        const Log = await LogModel.create({
            description,
            definition,
            result,
            owner_id,
        })
        res.status(201).json({
            message: "Log created.",
            Log,
        })
    } catch (err) {
        res.status(500).json({
            message: `Failed to create log: ${err}`
        })
    }
})

router.get("/:id", async (req, res) => {
    try {
        const locatedLog = await LogModel.findOne({
            where: {
                id: req.params.id,
            },
        })
        res.status(200).json({
            message: "Log retrieved",
            locatedLog,
        })
    } catch (err) {
        res.status(500).json({
            message: `Failed to retrieve log: ${err}`
        })
    }
})

router.delete("/:id", async (req, res) => {
    try {
        await LogModel.destroy({
            where: {
                id: req.params.id,
            },
        }).then((result => {
            if (result) {
                res.status(200).json({
                    message: "Log deleted",
                    deletedLog: result
                })
            }else{
                res.status(400).json({
                    message: "Log id no longer exists"
                })
            }
        }))

    } catch (err) {
        res.status(500).json({
            message: `Failed to delete log: ${err}`
        })
    }
})

router.put("/:id", async (req, res) => {
    const {
        description,
        definition,
        result,
        owner_id,
    } = req.body
    try {
        LogModel.update({ description, definition, result, owner_id }, { where: { id: req.params.id }, returning: true })
        res.status(200).json({
            message: "Log changed"
        })
    } catch (err) {
        res.status(500).json({
            message: `Failed to retrieve log: ${err}`
        })
    }
})

module.exports = router