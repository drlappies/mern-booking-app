const { insertService, getServiceById, updateService, removeService, getAllServices, getServiceCounts } = require('../service/serviceService')

module.exports.getServices = async (req, res) => {
    try {
        const service = await getAllServices();
        return res.status(200).json({
            service: service
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err })
    }
}

module.exports.createService = async (req, res) => {
    try {
        const { id } = req.user
        const { name, pricing, capacity, remark, room } = req.body;
        if (!name || !pricing || !capacity || !remark || !room) {
            return res.status(400).json({
                error: '資料不足'
            })
        }

        if (pricing <= 0 || pricing >= 9999) {
            return res.status(400).json({
                error: '價錢不能等於或少於 0 或 9999'
            })
        }

        if (capacity <= 0 || capacity >= 100) {
            return res.status(400).json({
                error: '人數不能等於或少於 0 或 100'
            })
        }

        const serviceCounts = await getServiceCounts(room)
        if (serviceCounts >= 3) {
            return res.status(400).json({
                error: 'Exceeded Service Limit'
            })
        }

        const service = await insertService(id, name, room, pricing, capacity, remark)
        return res.status(200).json({
            success: `成功創建服務 ${service.name}`
        });
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err })
    }
}

module.exports.getService = async (req, res) => {
    try {
        const { id } = req.params;
        const service = getServiceById(id)
        return res.status(200).json(service);
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err })
    }
}

module.exports.editService = async (req, res) => {
    try {
        const { name, pricing, capacity, remark, isOnline } = req.body;
        const { id } = req.params;
        const service = await updateService(id, name, pricing, capacity, remark, isOnline)
        return res.status(200).json({
            success: `成功更新服務 ${service.name}`
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err })
    }
}

module.exports.deleteService = async (req, res) => {
    try {
        const { id } = req.params;
        const service = await removeService(id);
        return res.status(200).json({
            success: `成功刪除服務 ${service.name}`
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err })
    }
}