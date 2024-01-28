const { insertFailOrder, getAllFailOrders, getFailOrderByOrderId, updateFailOrder, deleteFailOrder } = require('../models/orderFail');
// Controller to handle the creation of a new fail order
const createFailOrder = async (req, res) => {
    try {
        const { user_id, order_id, payment_id, code, reason, description, source, step } = req.body;
        const failOrderData = {
            user_id,
            order_id,
            payment_id,
            code,
            reason,
            description,
            source,
            step,
        };

        const newFailOrder = await insertFailOrder(failOrderData);
        if (newFailOrder) {
            res.status(201).json({ status: 201, message: 'Fail Order created successfully', data: newFailOrder });
        }else{
            res.status(500).json({ status: 500, error: 'Error While Inserting Data'});
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, error: 'Internal Server Error' });
    }
};

// Controller to get all fail orders
const getAllFailOrder = async (req, res) => {
    try {
        const failOrders = await getAllFailOrders();
        if(failOrders){
            res.status(200).json({ status: 200, message: 'Successfully retrieved fail orders', data: failOrders });
        }else{
            res.status(500).json({ status: 500, error: 'Error while fetch'  });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, error: 'Internal Server Error' });
    }
};

// Controller to get fail order by order ID
const getFailOrderByOrderID = async (req, res) => {
    try {
        const { orderId } = req.params;
        const failOrder = await getFailOrderByOrderId(orderId);

        if (!failOrder) {
            res.status(404).json({ status: 404, error: 'Fail Order not found' });
            return;
        }

        res.status(200).json({ status: 200, message: 'Successfully retrieved fail order', data: failOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, error: 'Internal Server Error' });
    }
};

// Controller to update fail order
const updateFailOrderController = async (req, res) => {
    try {
        const { failOrderId } = req.params;
        const updateData = req.body;

        const updatedFailOrder = await updateFailOrder(failOrderId, updateData);

        if (!updatedFailOrder) {
            res.status(404).json({ status: 404, error: 'Fail Order not found' });
            return;
        }

        res.status(200).json({ status: 200, message: 'Fail Order updated successfully', data: updatedFailOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, error: 'Internal Server Error' });
    }
};

// Controller to delete fail order
const deleteFailOrderController = async (req, res) => {
    try {
        const { failOrderId } = req.params;

        const deletedFailOrder = await deleteFailOrder(failOrderId);

        if (!deletedFailOrder) {
            res.status(404).json({ status: 404, error: 'Fail Order not found' });
            return;
        }

        res.status(200).json({ status: 200, message: 'Fail Order deleted successfully', data: deletedFailOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, error: 'Internal Server Error' });
    }
};

module.exports = {
    createFailOrder,
    getAllFailOrder,
    getFailOrderByOrderID,
    updateFailOrderController,
    deleteFailOrderController,
};
