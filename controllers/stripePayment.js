const stripe = require("stripe")("sk_test_9xgFReMjTV2l3AFjTnicfl3j00iPnMA2EF")//this is the secret key it should be in the env file
const uuid = require("uuid/v4")

exports.makepayment = (req,res)=>{
   
    const {token, products} = req.body
    //console.log("PRODUCTS", products)

    //make sure that the amount matches in both frontend and backend
    let amount = 0
    products.map(p=>{
        amount = amount + p.price;
    })

    //idempotencyKey and uuid is used to make sure that the customer is not charged double
    const idempotencyKey = uuid()


    //3 Things:- Create the customer, charge the customer, return the response back

    return stripe.customers.create({
        email: token.email,
        source: token.id
    }).then(customer => {
        console.log(token)

        console.log(token.email)
        stripe.charges.create({
            amount: amount*100,
            currency: "usd",
            customer: customer.id,
            receipt_email: token.email,
            description: "a test account",

            shipping: {
                name: token.card.name,
                address: {
                    line1: token.card.address_line1,
                    line2: token.card.address_line2,
                    city: token.card.address_city,
                    country: token.card.address_country,
                    postal_code: token.card.address_zip
                }
            }
        }, {idempotencyKey})
        .then(result => res.status(200).json(result))
        .catch(error => console.log(error))
    })
};