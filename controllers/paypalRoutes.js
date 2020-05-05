var braintree = require("braintree");

var gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: "hs4chb46ttmy89hp",
  publicKey: "pf9m3k86pndrxgr8",
  privateKey: "40a7e4ce4d5880449dd00ccb784c368c"
});

exports.getToken = (req, res)=> {
    gateway.clientToken.generate({}, function(err, response) {
        if(err){
            res.status(500).send(err)
        } else{
            res.send(response)
        }
      });
}

exports.processPayment = function(req, res)  {
    let nonceFromTheClient = req.body.paymentMethodNonce
    let amountFromTheClient = req.body.amount
    gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        options: {
          submitForSettlement: true
        }
      }, (err, result) => {
          if(err){
            res.status(500).json(err)
          } else{
              res.json(result)
          }
      });
}