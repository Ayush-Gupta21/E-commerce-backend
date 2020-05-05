const {Order, productCart} = require("../models/order");

exports.getOrderById = (req, res, next, id)=>{
    Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order)=>{
        if(err){
            return res.status(400).json({
                error: "order not found"
            })
        }
        req.order = order;
        next();
    })
}

exports.createOrder = (req, res)=>{
    req.body.order.user = req.profile;
    const order = new Order(req.body.order);
    order.save((err, order)=>{
        if(err){
            return res.status(400).json({
                error: "Order can't be created"
            })
        }
        res.json(order)
    })

}

exports.getAllOrders = (req, res)=>{
    Order.find()
    .populate("user", "name _id")
    .exec((err, order)=>{
        if(err){
            return res.status(400).json({
                error: "Orders not found"
            })
        }
        res.json(order)
    })
}

exports.getOrderStatus = (req, res)=>{
    res.json(Order.schema.path("status").enumValues)
}

exports.updateStatus = (req, res)=>{
    Order.update(
        {_id: req.body.orderId},
        {$set: {status: req.body.status}},
        (err, order)=>{
            if(err){
                return res.status(400).json({
                    error: "Cannot update order status"
                })
            }
            res.json(order);
        }
    )
}